import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.honeychain.farmer',
  appName: 'Beevil Knievel Farmer',
  webDir: 'public',
  server: {
    androidScheme: 'https',
    allowNavigation: ['*'],
  },
};

export default config;
