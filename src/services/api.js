import axios from 'axios';

import AsyncStorage from '@react-native-community/async-storage';

const api = axios.create({
  baseURL: 'http://www.radop.ml:3333/',
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('@RaDopApp:token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  } catch (err) {
    console.tron.log(err);
    throw err;
  }
});

export default api;