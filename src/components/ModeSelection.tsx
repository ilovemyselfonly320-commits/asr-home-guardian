import { Shield, BookOpen, Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ModeSelectionProps {
  onModeSelect: (mode: 'security' | 'study' | 'friendly') => void;
  onBackToFace: () => void;
}

export const ModeSelection = ({ onModeSelect, onBackToFace }: ModeSelectionProps) => {
  const modes = [
    {
      id: 'security' as const,
      icon: Shield,
      title: 'Security Mode',
      description: 'House automation and security monitoring',
      color: 'text-primary',
    },
    {
      id: 'study' as const,
      icon: BookOpen,
      title: 'Study Mode',
      description: 'AI-powered learning and study assistance',
      color: 'text-accent',
    },
    {
      id: 'friendly' as const,
      icon: Heart,
      title: 'Friendly Mode',
      description: 'Your companion for daily tasks and wellness',
      color: 'text-pink-400',
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Status Bar */}
      <div className="flex items-center justify-between mb-8 pt-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-success/20">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs text-success">Wi-Fi</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted">
            <div className="w-2 h-2 rounded-full bg-muted-foreground" />
            <span className="text-xs text-muted-foreground">Robot Offline</span>
          </div>
        </div>
        <div className="text-sm text-primary font-mono">10:35</div>
      </div>

      {/* Animated Eyes at Top */}
      <div className="flex justify-center gap-4 mb-8">
        <div className="w-12 h-12 bg-primary rounded-full robot-eye robot-eyes" />
        <div className="w-12 h-12 bg-primary rounded-full robot-eye robot-eyes" />
      </div>

      {/* Mode Cards */}
      <div className="max-w-md mx-auto space-y-4">
        {modes.map((mode) => {
          const IconComponent = mode.icon;
          return (
            <Card
              key={mode.id}
              className="mode-card cursor-pointer"
              onClick={() => onModeSelect(mode.id)}
            >
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center border border-border">
                    <IconComponent className={`w-8 h-8 ${mode.color}`} />
                  </div>
                </div>
                <CardTitle className="text-xl">{mode.title}</CardTitle>
                <CardDescription className="text-sm">
                  {mode.description}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}

        {/* Back to Robot Face Button */}
        <Button
          variant="outline"
          className="w-full mt-8"
          onClick={onBackToFace}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Robot Face
        </Button>

        {/* Voice Command Hint */}
        <div className="text-center mt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50">
            <div className="w-4 h-4 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-muted-foreground">
              Say "security mode", "study mode", etc.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};