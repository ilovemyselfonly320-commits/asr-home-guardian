import { useState } from "react";
import { Home, Shield, Settings, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface SecurityModeProps {
  onBack: () => void;
}

export const SecurityMode = ({ onBack }: SecurityModeProps) => {
  const [selectedTab, setSelectedTab] = useState<'automation' | 'security'>('automation');
  const [automationDevices, setAutomationDevices] = useState({
    bedroom: { lights: false, fan: false, ac: false },
    hall: { lights: true, fan: false, tv: false },
    kitchen: { lights: false, exhaust: false },
    outdoor: { lights: true, motor: false, gate: false }
  });

  const [securitySettings, setSecuritySettings] = useState({
    nightMode: false,
    fullSecurity: false,
    doorSensor: true,
    windowSensors: true,
    motionDetector: false
  });

  const toggleDevice = (room: string, device: string) => {
    setAutomationDevices(prev => {
      const roomDevices = prev[room as keyof typeof prev];
      return {
        ...prev,
        [room]: {
          ...roomDevices,
          [device]: !roomDevices[device as keyof typeof roomDevices]
        }
      };
    });
  };

  const toggleSecurity = (setting: string) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
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
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Security Mode</h1>
        <p className="text-muted-foreground">Protect and automate your home</p>
      </div>

      {/* Tab Selection */}
      <div className="flex gap-4 mb-6 max-w-md mx-auto">
        <Card
          className={`flex-1 cursor-pointer transition-all ${
            selectedTab === 'automation' ? 'border-primary bg-primary/10' : 'mode-card'
          }`}
          onClick={() => setSelectedTab('automation')}
        >
          <CardHeader className="text-center py-4">
            <Home className="w-6 h-6 mx-auto mb-2 text-primary" />
            <CardTitle className="text-sm">House Automation</CardTitle>
            <CardDescription className="text-xs">
              Control lights, fans, and appliances in each room
            </CardDescription>
            <Badge variant="secondary" className="text-xs">
              ESP32 Connected
            </Badge>
          </CardHeader>
        </Card>

        <Card
          className={`flex-1 cursor-pointer transition-all ${
            selectedTab === 'security' ? 'border-primary bg-primary/10' : 'mode-card'
          }`}
          onClick={() => setSelectedTab('security')}
        >
          <CardHeader className="text-center py-4">
            <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
            <CardTitle className="text-sm">House Security</CardTitle>
            <CardDescription className="text-xs">
              Monitor and secure your home with sensors
            </CardDescription>
            <Badge variant="destructive" className="text-xs">
              Disarmed
            </Badge>
          </CardHeader>
        </Card>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto">
        {selectedTab === 'automation' && (
          <div className="space-y-4">
            {Object.entries(automationDevices).map(([room, devices]) => (
              <Card key={room} className="mode-card">
                <CardHeader>
                  <CardTitle className="text-lg capitalize">{room}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(devices).map(([device, isOn]) => (
                    <div key={device} className="flex items-center justify-between">
                      <span className="capitalize text-sm">{device}</span>
                      <Switch
                        checked={isOn}
                        onCheckedChange={() => toggleDevice(room, device)}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedTab === 'security' && (
          <div className="space-y-4">
            <Card className="mode-card">
              <CardHeader>
                <CardTitle className="text-lg">Security Modes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">Night Security Mode</span>
                    <p className="text-xs text-muted-foreground">
                      Alert when someone enters at night
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.nightMode}
                    onCheckedChange={() => toggleSecurity('nightMode')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">Full Security Mode</span>
                    <p className="text-xs text-muted-foreground">
                      Complete home monitoring when away
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.fullSecurity}
                    onCheckedChange={() => toggleSecurity('fullSecurity')}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="mode-card">
              <CardHeader>
                <CardTitle className="text-lg">Sensors Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Door Sensor</span>
                  <Badge variant={securitySettings.doorSensor ? 'default' : 'secondary'}>
                    {securitySettings.doorSensor ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Window Sensors</span>
                  <Badge variant={securitySettings.windowSensors ? 'default' : 'secondary'}>
                    {securitySettings.windowSensors ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Motion Detector</span>
                  <Badge variant={securitySettings.motionDetector ? 'default' : 'secondary'}>
                    {securitySettings.motionDetector ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};