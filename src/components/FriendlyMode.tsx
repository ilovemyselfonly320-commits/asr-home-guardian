import { useState } from "react";
import { Heart, ArrowLeft, Send, Plus, Share, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
interface FriendlyModeProps {
  onBack: () => void;
}
interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}
interface Task {
  id: string;
  text: string;
  completed: boolean;
  category: 'wellness' | 'daily' | 'health';
}
export const FriendlyMode = ({
  onBack
}: FriendlyModeProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: '1',
    text: "Hello friend! 😊 I'm so happy to spend time with you today. How are you feeling?",
    isUser: false,
    timestamp: new Date()
  }]);
  const [inputText, setInputText] = useState("");
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([{
    id: '1',
    text: 'Drink 8 glasses of water',
    completed: false,
    category: 'health'
  }, {
    id: '2',
    text: 'Take a 10-minute walk',
    completed: true,
    category: 'wellness'
  }, {
    id: '3',
    text: 'Practice gratitude',
    completed: false,
    category: 'wellness'
  }]);
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

    // Simulate AI response with friendly personality
    setTimeout(() => {
      const responses = ["That sounds wonderful! I'm here to support you every step of the way. 💪", "You're doing amazing! Remember, small steps lead to big changes. 🌟", "I love your positive energy! How can I help you achieve your goals today? ✨", "That's so thoughtful of you to share that with me. I'm always here to listen! 💕"];
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);

      // Text-to-speech with friendly voice
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(aiResponse.text);
        utterance.pitch = 1.2;
        utterance.rate = 0.9;
        speechSynthesis.speak(utterance);
      }
    }, 1500);
  };
  const addTask = () => {
    if (!newTask.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      text: newTask,
      completed: false,
      category: 'daily'
    };
    setTasks(prev => [...prev, task]);
    setNewTask("");
  };
  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => task.id === taskId ? {
      ...task,
      completed: !task.completed
    } : task));
  };
  const shareHealthTip = () => {
    const tips = ["💧 Stay hydrated! Your body needs water to function at its best.", "🌱 Try adding some leafy greens to your meals today - your body will thank you!", "😊 Take 5 deep breaths right now. Feel how that centers you?", "🚶‍♀️ A short walk can boost your mood and energy instantly!", "😴 Quality sleep is your superpower - aim for 7-8 hours tonight!"];
    const tip = tips[Math.floor(Math.random() * tips.length)];
    const tipMessage: ChatMessage = {
      id: Date.now().toString(),
      text: tip,
      isUser: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, tipMessage]);
  };
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  return <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Menu
        </Button>
        
        <div className="text-sm text-primary font-mono">10:35</div>
      </div>

      {/* Robot Status */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
          <Heart className="w-8 h-8 text-pink-400" />
        </div>
        <h1 className="text-2xl font-bold">Your Friendly Companion</h1>
        <p className="text-muted-foreground">I'll be more expressive when connected!</p>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 mb-6 max-w-md mx-auto">
        <Button variant="outline" onClick={shareHealthTip} className="flex-1">
          <Share className="w-4 h-4 mr-2" />
          Share Health Tip
        </Button>
        <Button variant="outline" className="flex-1">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Friendly Chat */}
      <Card className="mode-card mb-6 max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            Friendly Chat
            <Badge variant="outline" className="text-xs">
              Companion Mode
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 overflow-y-auto mb-4 space-y-3">
            {messages.map(message => <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-lg ${message.isUser ? 'bg-primary text-primary-foreground' : 'bg-card border'}`}>
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                  </p>
                </div>
              </div>)}
          </div>

          <div className="flex gap-2">
            <Input placeholder="Share what's on your mind..." value={inputText} onChange={e => setInputText(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} className="flex-1" />
            <Button onClick={handleSendMessage} size="sm">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Daily Tasks & Wellness */}
      <Card className="mode-card max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            Daily Tasks & Wellness
            <Badge variant="secondary" className="text-xs">
              {completedTasks}/{totalTasks} completed
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4">
            {tasks.map(task => <div key={task.id} className={`flex items-center gap-3 p-2 rounded-lg border ${task.completed ? 'bg-success/10 border-success/20' : 'bg-card'}`}>
                <Button variant="ghost" size="sm" onClick={() => toggleTask(task.id)} className="w-6 h-6 p-0">
                  {task.completed ? <Check className="w-4 h-4 text-success" /> : <div className="w-4 h-4 border border-muted-foreground rounded" />}
                </Button>
                <span className={`text-sm flex-1 ${task.completed ? 'line-through opacity-60' : ''}`}>
                  {task.text}
                </span>
                <Badge variant="outline" className="text-xs">
                  {task.category}
                </Badge>
              </div>)}
          </div>

          <div className="flex gap-2">
            <Input placeholder="Add a new task..." value={newTask} onChange={e => setNewTask(e.target.value)} onKeyPress={e => e.key === 'Enter' && addTask()} className="flex-1" />
            <Button onClick={addTask} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>;
};