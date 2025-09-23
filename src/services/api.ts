// API service for ESP32 home automation backend
const API_BASE_URL = 'https://your-server.com/api'; // Replace with your actual server URL

export interface DeviceStatus {
  value: string;
  timestamp: string;
}

export interface DeviceData {
  Door: DeviceStatus;
  Light: DeviceStatus;
  Fan: DeviceStatus;
  [key: string]: DeviceStatus;
}

export interface ApiResponse {
  status: 'success' | 'error';
  message: string;
}

// Get device status from backend
export const getDeviceStatus = async (deviceId: string = 'E1'): Promise<DeviceData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/get_status.php?device_id=${deviceId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching device status:', error);
    // Return mock data for development/testing
    return {
      Door: { value: 'CLOSED', timestamp: new Date().toISOString() },
      Light: { value: 'OFF', timestamp: new Date().toISOString() },
      Fan: { value: 'OFF', timestamp: new Date().toISOString() }
    };
  }
};

// Send command to device
export const sendCommand = async (deviceId: string, command: string): Promise<ApiResponse> => {
  try {
    const formData = new FormData();
    formData.append('device_id', deviceId);
    formData.append('command', command);
    
    const response = await fetch(`${API_BASE_URL}/send_command.php`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error sending command:', error);
    return { status: 'error', message: 'Failed to send command' };
  }
};

// Update device status (used by ESP32 to report status)
export const updateDeviceStatus = async (
  deviceId: string, 
  sensorName: string, 
  value: string
): Promise<ApiResponse> => {
  try {
    const formData = new FormData();
    formData.append('device_id', deviceId);
    formData.append('sensor_name', sensorName);
    formData.append('value', value);
    
    const response = await fetch(`${API_BASE_URL}/update_status.php`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating device status:', error);
    return { status: 'error', message: 'Failed to update status' };
  }
};

// Get pending commands for device (used by ESP32)
export const getCommands = async (deviceId: string = 'E1'): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/get_command.php?device_id=${deviceId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const commands = await response.json();
    return Array.isArray(commands) ? commands : [];
  } catch (error) {
    console.error('Error fetching commands:', error);
    return [];
  }
};

// Test API connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/test.php?action=test`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    return result.status === 'success';
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
};