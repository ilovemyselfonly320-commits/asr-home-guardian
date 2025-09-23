import { useState, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RobotFaceProps {
  isListening?: boolean;
  onVoiceToggle?: () => void;
  showVoiceButton?: boolean;
  message?: string;
}

export const RobotFace = ({ 
  isListening = false, 
  onVoiceToggle, 
  showVoiceButton = true,
  message = "Looking for something?"
}: RobotFaceProps) => {
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const moveEyes = () => {
      // Random eye movement every 2-4 seconds
      const interval = setInterval(() => {
        setEyePosition({
          x: (Math.random() - 0.5) * 6,
          y: (Math.random() - 0.5) * 4
        });
      }, Math.random() * 2000 + 2000);

      return () => clearInterval(interval);
    };

    const cleanup = moveEyes();
    return cleanup;
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      {/* Status Indicators */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/20">
          <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
          <span className="text-xs text-destructive-foreground">No Wi-Fi</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted">
          <div className="w-2 h-2 rounded-full bg-muted-foreground" />
          <span className="text-xs text-muted-foreground">Robot Offline</span>
        </div>
        <div className="text-sm text-primary font-mono">10:35</div>
      </div>

      {/* Robot Face */}
      <div className="relative">
        {/* Face Container */}
        <div className="w-48 h-32 bg-card rounded-[3rem] border border-border p-8 relative overflow-hidden animate-float">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-robot-gradient opacity-20 rounded-[3rem]" />
          
          {/* Eyes */}
          <div className="flex justify-center gap-8 relative z-10">
            <div 
              className="relative w-16 h-16 rounded-full overflow-hidden"
              style={{ transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)` }}
            >
              <div className="robot-eye w-full h-full rounded-full robot-eyes transition-transform duration-500" />
              {/* Eye shine */}
              <div className="absolute top-2 left-2 w-4 h-4 bg-white/30 rounded-full" />
            </div>
            <div 
              className="relative w-16 h-16 rounded-full overflow-hidden"
              style={{ transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)` }}
            >
              <div className="robot-eye w-full h-full rounded-full robot-eyes transition-transform duration-500" />
              {/* Eye shine */}
              <div className="absolute top-2 left-2 w-4 h-4 bg-white/30 rounded-full" />
            </div>
          </div>
        </div>

        {/* Glow Effect */}
        <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl opacity-50" />
      </div>

      {/* Message */}
      <div className="mt-8 text-center">
        <p className="text-robot-glow text-lg">{message}</p>
      </div>

      {/* Voice Button */}
      {showVoiceButton && (
        <div className="mt-8 flex flex-col items-center">
          <Button
            variant="ghost"
            size="lg"
            className={`voice-button w-16 h-16 rounded-full border-2 border-primary/50 ${
              isListening ? "active" : ""
            }`}
            onClick={onVoiceToggle}
          >
            {isListening ? (
              <MicOff className="w-6 h-6 text-primary-foreground" />
            ) : (
              <Mic className="w-6 h-6 text-primary-foreground" />
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Say "go to security", "study mode", etc.
          </p>
        </div>
      )}
    </div>
  );
};