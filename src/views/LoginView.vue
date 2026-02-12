
<template>
  <div class="login-container">
    <div class="bg-glow blob-1"></div>
    <div class="bg-glow blob-2"></div>

    <div class="login-glass-card">
      <div class="login-header">
        <div class="logo-box">
           <span class="train-emoji">🚉</span>
        </div>
        <h1>TIME2TRAIN<span>.</span></h1>
        <p class="subtitle">Management Console Access</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
          <label for="email">Email Address</label>
          <div class="input-wrapper">
            <span class="input-icon">✉️</span>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              placeholder="name@company.com" 
              required 
            />
          </div>
        </div>

        <div class="input-group">
          <label for="password">Password</label>
          <div class="input-wrapper">
            <span class="input-icon">🔒</span>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              placeholder="••••••••" 
              required 
            />
          </div>
        </div>

        <div v-if="errorMessage" class="error-msg">
          <span class="error-icon">⚠️</span> {{ errorMessage }}
        </div>

        <button type="submit" class="login-btn" :disabled="isLoading">
          <div v-if="isLoading" class="loader"></div>
          <span v-else>SIGN IN TO PANEL</span>
        </button>
      </form>

      <div class="login-footer">
        <p>System Issue? <a href="#">Contact Super Admin</a></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios' // Axios අනිවාර්යයෙන් Import කරන්න

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await axios.post('/auth/login', {
      email: email.value,
      password: password.value
    });

    const { role, user, token } = response.data;

    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // localStorage එකට token එක store කරන එක authStore එක ඇතුලෙම වෙනවා (setAuthData හරහා)
    }

    // 1. කලින්ම Store එක Update කරන්න
    authStore.setAuthData(user, token, role);

    // 2. Role එක පරීක්ෂා කර අදාළ පිටුවට යවන්න
    console.log("User Role:", role); // මේක console එකේ චෙක් කරන්න

    if (role === 'super_admin' || role === 'admin') {
        // වැදගත්: මෙතන '/admin/dashboard' වගේ වෙනත් path එකක් දෙන්න. 
        // '/' දුන්නොත් ඔයාගේ App.vue logic එක නිසා Navbar එක පෙන්වන්නේ නැති වෙයි.
        router.push('super-admin'); // Admin ට
    } else {
        router.push('/user-dashboard'); // සාමාන්‍ය user ට
    }

  } catch (error: any) {
    if (error.response && error.response.data) {
        errorMessage.value = error.response.data.message || 'Unauthorized access.';
    } else {
        errorMessage.value = 'Cannot connect to server. Check your backend.';
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* ඔබේ පරණ Style එකම මෙතනට එනවා - කිසිදු වෙනසක් අවශ්‍ය නැත */
.login-container {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0b0f1a;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

.bg-glow {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  filter: blur(120px);
  z-index: 0;
  opacity: 0.4;
}

.blob-1 {
  background: #2563eb;
  top: -100px;
  left: -100px;
  animation: float 10s infinite alternate;
}

.blob-2 {
  background: #1e3a8a;
  bottom: -100px;
  right: -100px;
  animation: float 15s infinite alternate-reverse;
}

@keyframes float {
  from { transform: translate(0, 0); }
  to { transform: translate(50px, 50px); }
}

.login-glass-card {
  position: relative;
  z-index: 10;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 50px 40px;
  border-radius: 32px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5);
  text-align: center;
}

.logo-box {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 20px;
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.4);
}

.train-emoji { animation: wiggle 3s infinite; display: inline-block; }

@keyframes wiggle {
  0%, 100% { transform: rotate(0); }
  25% { transform: rotate(-10deg); }
  75% { transform: rotate(10deg); }
}

h1 {
  color: #fff;
  font-size: 1.8rem;
  font-weight: 900;
  letter-spacing: -0.5px;
  margin-bottom: 5px;
}

h1 span { color: #3b82f6; }

.subtitle {
  color: #94a3b8;
  font-size: 0.95rem;
  margin-bottom: 35px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 22px;
  text-align: left;
}

.input-group label {
  display: block;
  color: #cbd5e1;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 8px;
  margin-left: 4px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  font-size: 1.1rem;
  opacity: 0.6;
}

.input-group input {
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 14px 16px 14px 48px;
  border-radius: 14px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-group input:focus {
  outline: none;
  background: rgba(0, 0, 0, 0.3);
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
  transform: translateY(-2px);
}

.error-msg {
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
  padding: 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  border-left: 4px solid #ef4444;
}

.login-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 16px;
  border-radius: 14px;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  letter-spacing: 0.5px;
}

.login-btn:hover:not(:disabled) {
  background: #3b82f6;
  box-shadow: 0 15px 30px rgba(37, 99, 235, 0.3);
  transform: translateY(-3px);
}

.loader {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  margin: 0 auto;
}

@keyframes spin { to { transform: rotate(360deg); } }

.login-footer {
  margin-top: 35px;
  padding-top: 25px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.login-footer p { color: #64748b; font-size: 0.85rem; }
.login-footer a { color: #3b82f6; text-decoration: none; font-weight: 700; }
</style>