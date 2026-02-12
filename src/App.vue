<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppSidebar from '@/components/layouts/AppSidebar.vue'
import AppNavbar from '@/components/layouts/AppNavbar.vue'

const authStore = useAuthStore()
const route = useRoute()
const isDark = ref(true)

const isAdmin = computed(() => ['super_admin', 'data_admin'].includes(authStore.userRole))
const isUser = computed(() => authStore.userRole === 'user')
const isLoginPage = computed(() => route.path === '/' || route.path === '/login')

const showAdminSidebar = computed(() => !isLoginPage.value && authStore.isLoggedIn && isAdmin.value)
const showUserNavbar = computed(() => !isLoginPage.value && authStore.isLoggedIn && isUser.value)

const toggleTheme = () => {
  isDark.value = !isDark.value
  updateDOMTheme()
}

const updateDOMTheme = () => {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

onMounted(() => {
  const saved = localStorage.getItem('theme') || 'dark'
  isDark.value = saved === 'dark'
  updateDOMTheme()
})

const handleLogout = () => {
  authStore.logout()
  window.location.href = '/'
}
</script>

<template>
  <div :class="{ 'dark': isDark }" class="min-h-screen font-sans antialiased">
    
    <div class="flex flex-col lg:flex-row min-h-screen transition-colors duration-300">
      
      <AppNavbar 
        v-if="showUserNavbar" 
        :isAdmin="false" 
        :isDark="isDark"
        @toggleTheme="toggleTheme"
        @logout="handleLogout"
      />

      <AppSidebar v-if="showAdminSidebar" @logout="handleLogout" />

      <div 
        class="flex flex-col flex-1 min-w-0 h-screen overflow-y-auto overflow-x-hidden scroll-smooth"
        :class="{ 'lg:ml-[280px]': showAdminSidebar }"
      >
        <header 
          v-if="showAdminSidebar" 
          class="sticky top-0 z-40 flex items-center justify-between h-20 px-6 bg-white/70 dark:bg-[#0b0f1a]/70 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 lg:px-10 shrink-0"
        >
          <div class="flex flex-col text-left">
            <h1 class="text-lg font-bold text-slate-900 dark:text-white lg:text-2xl">
              Welcome back, <span class="text-blue-600">{{ authStore.userRole?.replace('_', ' ') }}</span>
            </h1>
            <p class="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">Thursday, 12 Feb 2026</p>
          </div>

          <button @click="toggleTheme" class="px-4 py-2 border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 text-slate-900 dark:text-white text-sm font-bold flex items-center gap-2 transition-transform active:scale-95">
            <span>{{ isDark ? '☀️ Light' : '🌙 Dark' }}</span>
          </button>
        </header>

        <main 
          class="flex-1 w-full"
          :class="[
            showAdminSidebar ? 'p-6 lg:p-10' : 'p-0',
            showUserNavbar ? 'pt-24' : ''
          ]"
        >
          <div :class="{ 'max-w-7xl mx-auto': showAdminSidebar }">
            <RouterView />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>