import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.d160815acb624854b06214f4b295032c',
  appName: 'AI Security Robot (ASR)',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: 'https://d160815a-cb62-4854-b062-14f4b295032c.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
  },
};

export default config;