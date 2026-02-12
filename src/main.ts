import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'

import App from './App.vue'
import router from './router'

// 1. Axios Global Configuration
axios.defaults.baseURL = 'http://127.0.0.1:8000/api/v1'; 
axios.defaults.withCredentials = true;

// 2. Headers සැකසීම
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// ⭐ මේ කොටස අනිවාර්යයෙන්ම එකතු කරන්න (Request Interceptor)
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    // වැරදිලා හරි 'token' හෝ 'user' කියන වචන value එකේ තිබ්බොත් ඒවා අයින් කරනවා
    // (උඹේ කලින් dump එකේ තිබ්බ අවුල නිසා මේක වැදගත්)
    const cleanToken = token.replace(/token|user/g, '').trim();
    config.headers.Authorization = `Bearer ${cleanToken}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')