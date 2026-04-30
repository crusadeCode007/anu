import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const API_PORT = 5000;
const FALLBACK_HOST = '172.28.9.55';

const getExpoHost = () => {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoClient?.hostUri ||
    Constants.manifest?.debuggerHost;

  return hostUri?.split(':')[0];
};

const getBaseURL = () => {
  if (Platform.OS === 'web') {
    return `http://localhost:${API_PORT}/api`;
  }

  const host = getExpoHost() || FALLBACK_HOST;
  return `http://${host}:${API_PORT}/api`;
};

const apiClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000
});

apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;
