import { Platform } from 'react-native';

/**
 * For Android Emulator, the local machine is accessible at 10.0.2.2.
 * For iOS Simulator or physical devices on the same network, use the machine's local IP.
 * Defaulting to localhost for web/iOS simulator.
 */
const BASE_URL = 'https://taste-of-moldova.onrender.com';

export const API_CONFIG = {
  BASE_URL: BASE_URL,
  ENDPOINTS: {
    WINERIES: `${BASE_URL}/api/wineries`,
    EVENTS: `${BASE_URL}/api/events`,
    HEALTH: `${BASE_URL}/api/health`,
  },
};
