import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

import Constants from 'expo-constants';

let BASE_URL = 'http://localhost:5000';
const debuggerHost = Constants.expoConfig?.hostUri;

if (debuggerHost) {
  const hostIp = debuggerHost.split(':')[0];
  BASE_URL = `http://${hostIp}:5000`;
} else if (Platform.OS === 'android') {
  BASE_URL = 'http://10.0.2.2:5000';
}

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('traveloop_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
export { BASE_URL };
