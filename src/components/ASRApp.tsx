import { useState, useEffect } from "react";
import { RobotFace } from "./RobotFace";
import { ModeSelection } from "./ModeSelection";
import { SecurityMode } from "./SecurityMode";
import { StudyMode } from "./StudyMode";
import { FriendlyMode } from "./FriendlyMode";

type AppState = 'robot-face' | 'mode-selection' | 'security' | 'study' | 'friendly';

export const ASRApp = () => {
  const [currentState, setCurrentState] = useState<AppState>('robot-face');
  const [isListening, setIsListening] = useState(false);
  const [idleTimer, setIdleTimer] = useState<NodeJS.Timeout | null>(null);

  // Voice recognition setup (mock implementation)
  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    
    // Mock voice commands
    if (!isListening) {
      // Simulate voice recognition after 2 seconds
      setTimeout(() => {
        const commands = ['security mode', 'study mode', 'friendly mode'];
        const randomCommand = commands[Math.floor(Math.random() * commands.length)];
        handleVoiceCommand(randomCommand);
        setIsListening(false);
      }, 2000);
    }
  };

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('security')) {
      setCurrentState('security');
    } else if (lowerCommand.includes('study')) {
      setCurrentState('study');
    } else if (lowerCommand.includes('friendly')) {
      setCurrentState('friendly');
    } else if (lowerCommand.includes('menu') || lowerCommand.includes('modes')) {
      setCurrentState('mode-selection');
    } else if (lowerCommand.includes('home') || lowerCommand.includes('face')) {
      setCurrentState('robot-face');
    }
  };

  // Auto-transition from robot face to mode selection after 10 seconds
  useEffect(() => {
    if (currentState === 'robot-face') {
      const timer = setTimeout(() => {
        setCurrentState('mode-selection');
      }, 10000);
      
      setIdleTimer(timer);
      
      return () => {
        if (timer) clearTimeout(timer);
      };
    } else {
      if (idleTimer) {
        clearTimeout(idleTimer);
        setIdleTimer(null);
      }
    }
  }, [currentState]);

  // Auto-return to robot face from mode selection after 20 seconds of inactivity
  useEffect(() => {
    if (currentState === 'mode-selection') {
      const timer = setTimeout(() => {
        setCurrentState('robot-face');
      }, 20000);
      
      return () => clearTimeout(timer);
    }
  }, [currentState]);

  // Background service simulation (Wi-Fi detection)
  useEffect(() => {
    // Simulate checking for robot connection every 5 seconds
    const interval = setInterval(() => {
      // Mock ESP32 robot check at 192.168.1.50
      const isRobotOnline = Math.random() > 0.7; // 30% chance robot is online
      
      if (isRobotOnline && 'Notification' in window) {
        // Show notification (if permissions granted)
        if (Notification.permission === 'granted') {
          new Notification('🤖 Robot Ready!', {
            body: 'Tap to control your AI Security Robot',
            icon: '/favicon.ico'
          });
        }
      }
    }, 5000);

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => clearInterval(interval);
  }, []);

  const renderCurrentView = () => {
    switch (currentState) {
      case 'robot-face':
        return (
          <RobotFace
            isListening={isListening}
            onVoiceToggle={handleVoiceToggle}
            message="Looking for something?"
          />
        );
      
      case 'mode-selection':
        return (
          <ModeSelection
            onModeSelect={(mode) => setCurrentState(mode)}
            onBackToFace={() => setCurrentState('robot-face')}
          />
        );
      
      case 'security':
        return (
          <SecurityMode
            onBack={() => setCurrentState('mode-selection')}
          />
        );
      
      case 'study':
        return (
          <StudyMode
            onBack={() => setCurrentState('mode-selection')}
          />
        );
      
      case 'friendly':
        return (
          <FriendlyMode
            onBack={() => setCurrentState('mode-selection')}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {renderCurrentView()}
    </div>
  );
};