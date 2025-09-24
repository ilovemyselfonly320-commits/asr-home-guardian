import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Clock, Shield, Home, DoorOpen, Eye, Zap, Wifi, WifiOff, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { getDeviceStatus, sendCommand, testConnection, DeviceData } from "@/services/api";

interface SecurityModeProps {
  onBack: () => void;
}

export const SecurityMode: React.FC<SecurityModeProps> = ({ onBack }) => {
  const [selectedTab, setSelectedTab] = useState<'automation' | 'security'>('automation');
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [deviceData, setDeviceData] = useState<DeviceData | null>(null);
  
  const [automationDevices, setAutomationDevices] = useState({
    bedroom: { light: false, fan: false, ac: false },
    hall: { light: false, fan: false, tv: false },
    kitchen: { light: false, exhaust: false },
    outdoor: { light: false, motor: false, gate: false }
  });

  const [securitySettings, setSecuritySettings] = useState({
    nightMode: false,
    fullSecurity: false,
    doorSensor: true,
    windowSensor: true,
    motionSensor: false
  });

  // Check API connection and load device status
  useEffect(() => {
    const initializeConnection = async () => {
      setLoading(true);
      const isConnected = await testConnection();
      setConnected(isConnected);
      
      if (isConnected) {
        const status = await getDeviceStatus('E1');
        setDeviceData(status);
        toast.success("Connected to ESP32 Home System");
      } else {
        toast.error("Cannot connect to ESP32 system - using offline mode");
      }
      setLoading(false);
    };

    initializeConnection();
  }, []);

  // Refresh device status periodically
  useEffect(() => {
    if (!connected) return;
    
    const interval = setInterval(async () => {
      const status = await getDeviceStatus('E1');
      setDeviceData(status);
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [connected]);

  const handleDeviceCommand = async (command: string, deviceName: string) => {
    if (!connected) {
      toast.error("Not connected to ESP32 system");
      return;
    }

    setLoading(true);
    const result = await sendCommand('E1', command);
    
    if (result.status === 'success') {
      toast.success(`${deviceName} command sent successfully`);
      // Refresh status after command
      setTimeout(async () => {
        const status = await getDeviceStatus('E1');
        setDeviceData(status);
      }, 1000);
    } else {
      toast.error(`Failed to control ${deviceName}: ${result.message}`);
    }
    setLoading(false);
  };

  const toggleDevice = (room: string, device: string) => {
    // Relay 1 - Hall Light
    if (room === 'hall' && device === 'light' && connected) {
      const currentState = deviceData?.Light?.value === 'ON';
      const command = currentState ? 'RELAY1_OFF' : 'RELAY1_ON';
      handleDeviceCommand(command, 'Hall Light (Relay 1)');
      return;
    }
    
    // Relay 2 - Bedroom Light  
    if (room === 'bedroom' && device === 'light' && connected) {
      const currentState = automationDevices.bedroom.light;
      const command = currentState ? 'RELAY2_OFF' : 'RELAY2_ON';
      handleDeviceCommand(command, 'Bedroom Light (Relay 2)');
      setAutomationDevices(prev => ({
        ...prev,
        bedroom: { ...prev.bedroom, light: !currentState }
      }));
      return;
    }
    
    if (room === 'hall' && device === 'fan' && connected) {
      const currentState = deviceData?.Fan?.value === 'ON';
      const command = currentState ? 'FAN_OFF' : 'FAN_ON';
      handleDeviceCommand(command, 'Fan');
      return;
    }

    // For other devices, use local state (mock)
    setAutomationDevices(prev => ({
      ...prev,
      [room]: {
        ...prev[room],
        [device]: !prev[room][device]
      }
    }));
  };

  const toggleSecurity = (setting: string) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {connected ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm ${connected ? 'text-green-500' : 'text-red-500'}`}>
              {connected ? 'ESP32 Connected' : 'Offline Mode'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">Security Mode</h1>
        <p className="text-muted-foreground">Monitor and control your smart home</p>
      </div>

      {/* Tab Selector */}
      <div className="flex mb-6 bg-muted rounded-lg p-1 max-w-md mx-auto">
        <button
          onClick={() => setSelectedTab('automation')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            selectedTab === 'automation'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          House Automation
        </button>
        <button
          onClick={() => setSelectedTab('security')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            selectedTab === 'security'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          House Security
        </button>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto">
        {selectedTab === 'automation' && (
          <div className="grid gap-4">
            {/* Hall - Relay 1 Control */}
            <Card className="p-4 border-2 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="capitalize flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Hall (Relay 1 - ESP32 Device E1)
                  {connected && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">LIVE</span>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>Light (Relay 1)</span>
                    {deviceData?.Light && (
                      <span className="text-xs text-muted-foreground">
                        ({deviceData.Light.value})
                      </span>
                    )}
                  </div>
                  <Switch
                    checked={connected ? deviceData?.Light?.value === 'ON' : automationDevices.hall.light}
                    onCheckedChange={() => toggleDevice('hall', 'light')}
                    disabled={loading}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>Fan</span>
                    {deviceData?.Fan && (
                      <span className="text-xs text-muted-foreground">
                        ({deviceData.Fan.value})
                      </span>
                    )}
                  </div>
                  <Switch
                    checked={connected ? deviceData?.Fan?.value === 'ON' : automationDevices.hall.fan}
                    onCheckedChange={() => toggleDevice('hall', 'fan')}
                    disabled={loading}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>TV (Local Control)</span>
                  <Switch
                    checked={automationDevices.hall.tv}
                    onCheckedChange={() => toggleDevice('hall', 'tv')}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Bedroom - Relay 2 Control */}
            <Card className="p-4 border-2 border-secondary/20">
              <CardHeader className="pb-3">
                <CardTitle className="capitalize flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Bedroom (Relay 2 - ESP32 Device E1)
                  {connected && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">LIVE</span>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>Light (Relay 2)</span>
                  </div>
                  <Switch
                    checked={automationDevices.bedroom.light}
                    onCheckedChange={() => toggleDevice('bedroom', 'light')}
                    disabled={loading}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Fan (Local Control)</span>
                  <Switch
                    checked={automationDevices.bedroom.fan}
                    onCheckedChange={() => toggleDevice('bedroom', 'fan')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>AC (Local Control)</span>
                  <Switch
                    checked={automationDevices.bedroom.ac}
                    onCheckedChange={() => toggleDevice('bedroom', 'ac')}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Live Door Status */}
            {deviceData?.Door && (
              <Card className={`p-4 border-2 ${deviceData.Door.value === 'OPEN' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <DoorOpen className="h-5 w-5" />
                    Live Door Status (ESP32)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Main Door</span>
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                      deviceData.Door.value === 'OPEN' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'
                    }`}>
                      {deviceData.Door.value}
                      {deviceData.Door.value === 'OPEN' && (
                        <AlertTriangle className="h-4 w-4 inline ml-1" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Last update: {new Date(deviceData.Door.timestamp).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Other Rooms (Local Control) */}
            {Object.entries(automationDevices).filter(([room]) => room !== 'hall' && room !== 'bedroom').map(([room, devices]) => (
              <Card key={room} className="p-4">
                <CardHeader className="pb-3">
                  <CardTitle className="capitalize flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    {room}
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">LOCAL</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(devices).map(([device, isOn]) => (
                    <div key={device} className="flex items-center justify-between">
                      <span className="capitalize">{device}</span>
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
          <div className="grid gap-4">
            {/* Real Door Sensor Status */}
            {deviceData?.Door && (
              <Card className={`p-4 border-2 ${deviceData.Door.value === 'OPEN' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <DoorOpen className="h-5 w-5" />
                    Live Door Status (ESP32)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Main Door</span>
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                      deviceData.Door.value === 'OPEN' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'
                    }`}>
                      {deviceData.Door.value}
                      {deviceData.Door.value === 'OPEN' && (
                        <AlertTriangle className="h-4 w-4 inline ml-1" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Last update: {new Date(deviceData.Door.timestamp).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Security Modes */}
            <Card className="p-4">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Modes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Night Mode</span>
                    <p className="text-sm text-muted-foreground">Alert if door opens at night</p>
                  </div>
                  <Switch
                    checked={securitySettings.nightMode}
                    onCheckedChange={() => toggleSecurity('nightMode')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Full Security</span>
                    <p className="text-sm text-muted-foreground">Complete home monitoring</p>
                  </div>
                  <Switch
                    checked={securitySettings.fullSecurity}
                    onCheckedChange={() => toggleSecurity('fullSecurity')}
                  />
                </div>
                {securitySettings.nightMode && deviceData?.Door?.value === 'OPEN' && (
                  <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">SECURITY ALERT!</span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">
                      Door opened during night mode at {new Date(deviceData.Door.timestamp).toLocaleString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sensor Status */}
            <Card className="p-4">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Sensor Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Door Sensor (ESP32)</span>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    connected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {connected ? 'ACTIVE' : 'OFFLINE'}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Window Sensor</span>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    securitySettings.windowSensor ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {securitySettings.windowSensor ? 'ACTIVE' : 'INACTIVE'}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Motion Sensor</span>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    securitySettings.motionSensor ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {securitySettings.motionSensor ? 'ACTIVE' : 'INACTIVE'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
