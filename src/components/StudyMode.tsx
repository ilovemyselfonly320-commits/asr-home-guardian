import { useState, useEffect } from "react";
import { BookOpen, ArrowLeft, Send, Play, Pause, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface StudyModeProps {
  onBack: () => void;
}

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const StudyMode = ({ onBack }: StudyModeProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello! I'm your AI study assistant. Ask me anything you'd like to learn about!",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isStudying, setIsStudying] = useState(false);
  const [studyTime, setStudyTime] = useState(0);
  const [breakTime, setBreakTime] = useState(0);
  const [isBreak, setIsBreak] = useState(false);

  // Study timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStudying) {
      interval = setInterval(() => {
        if (isBreak) {
          setBreakTime(prev => {
            if (prev >= 300) { // 5 minute break
              setIsBreak(false);
              return 0;
            }
            return prev + 1;
          });
        } else {
          setStudyTime(prev => {
            if (prev >= 1500) { // 25 minute study session
              setIsBreak(true);
              return 0;
            }
            return prev + 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStudying, isBreak]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: `That's a great question! Let me help you understand that concept. Here's what I know about "${inputText}": This is a simulated response. In a real implementation, this would connect to the OpenAI API using your provided key.`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      
      // Text-to-speech simulation
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(aiResponse.text);
        speechSynthesis.speak(utterance);
      }
    }, 1500);
  };

  const toggleStudySession = () => {
    setIsStudying(!isStudying);
    if (!isStudying) {
      setStudyTime(0);
      setBreakTime(0);
      setIsBreak(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Menu
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full robot-eye robot-eyes" />
          <div className="w-8 h-8 bg-primary rounded-full robot-eye robot-eyes" />
        </div>
        <div className="text-sm text-primary font-mono">10:35</div>
      </div>

      {/* Mode Title */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-2xl font-bold">Study Session</h1>
      </div>

      {/* Study Timer */}
      <Card className="mode-card mb-6 max-w-md mx-auto">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant={isStudying ? "destructive" : "default"}
              size="lg"
              onClick={toggleStudySession}
              className="w-32"
            >
              {isStudying ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Stop Session
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Session
                </>
              )}
            </Button>
          </div>
          {isStudying && (
            <div className="mt-4">
              <div className="text-3xl font-mono text-primary">
                {isBreak ? formatTime(300 - breakTime) : formatTime(1500 - studyTime)}
              </div>
              <Badge variant={isBreak ? "secondary" : "default"} className="mt-2">
                {isBreak ? "Break Time" : "Study Time"}
              </Badge>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            <Clock className="w-4 h-4 mr-2" />
            Break Reminder
          </Button>
        </CardContent>
      </Card>

      {/* AI Study Assistant */}
      <Card className="mode-card max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            AI Study Assistant
            <Badge variant="outline" className="text-xs">
              GPT
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Chat Messages */}
          <div className="h-64 overflow-y-auto mb-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Ask me anything about your studies..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="sm">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};