<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppSidebar from "../layouts/AppSidebar.vue";
import AppNavbar from "../layouts/AppNavbar.vue";

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const isDark = ref(false)

// Login පිටුවේදැයි බැලීමට (meta භාවිතා කිරීම වඩාත් සුදුසුයි නමුත් දැනට පවතින logic එක optimize කළා)
const isLoginPage = computed(() => route.path === '/login' || route.name === 'login')

// Admin සහ Sidebar පෙන්වන Logic එක
const showSidebar = computed(() => {
  const isAdmin = ['super_admin', 'data_admin'].includes(authStore.userRole)
  return isAdmin && !isLoginPage.value
})

// Theme පාලනය
const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark-mode', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark-mode')
  }
})

const handleLogout = () => {
  authStore.$reset()
  router.push('/login')
}
</script>

<template>
  <div 
    class="flex min-h-screen w-full transition-colors duration-500 overflow-hidden"
    :class="isDark ? 'bg-[#0f172a]' : 'bg-[#f4f7f6]'"
  >
    
    <AppSidebar 
      v-if="showSidebar" 
      class="fixed inset-y-0 left-0 z-50 w-[280px] hidden lg:block"
      @logout="handleLogout" 
    />
    
    <div 
      class="flex flex-col flex-1 min-w-0 relative h-screen"
      :class="{ 'lg:ml-[280px]': showSidebar }"
    >
      
      <AppNavbar 
        v-if="!isLoginPage"
        :isAdmin="showSidebar" 
        :isDark="isDark" 
        @toggleTheme="toggleTheme" 
        @logout="handleLogout" 
      />
      
      <main 
        class="flex-1 overflow-y-auto transition-all duration-300 scrollbar-thin"
        :class="[
          isLoginPage ? 'p-0 flex items-center justify-center' : 'pt-24 pb-8 px-6 lg:px-10',
        ]"
      >
        <div 
          class="w-full mx-auto"
          :class="{ 'max-w-7xl': !isLoginPage }"
        >
          <RouterView v-slot="{ Component }">
            <transition 
              name="page-fade" 
              mode="out-in"
            >
              <component :is="Component" />
            </transition>
          </RouterView>
        </div>
      </main>

    </div>
  </div>
</template>

<style>
/* Page Transitions: මේවා Tailwind වලින් පමණක් කිරීම අපහසු බැවින් ගෝලීයව (Global) එක් කළ හැක */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Custom Scrollbar (Optional) */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 10px;
}
</style>