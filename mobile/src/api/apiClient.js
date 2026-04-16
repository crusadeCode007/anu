import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// UPDATE THIS IP FOR LOCAL EXPO TESTING:
const DEV_URL = 'http://10.137.250.59:5000/api'; 
const PROD_URL = 'https://your-render-url.onrender.com/api'; // Replace with Render URL

const isProd = false;

const apiClient = axios.create({
    baseURL: isProd ? PROD_URL : DEV_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add the JWT token to requests
apiClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getImageUrl = (path) => {
    if (!path) return null;
    const base = isProd ? PROD_URL.replace('/api', '') : DEV_URL.replace('/api', '');
    return `${base}${path}`;
};

export default apiClient;
