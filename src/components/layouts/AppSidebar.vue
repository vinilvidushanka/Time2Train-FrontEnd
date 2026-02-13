<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
defineEmits(['logout'])
</script>

<template>
  <aside 
    class="fixed inset-y-0 left-0 z-50 w-[280px] flex flex-col transition-all duration-300 transform lg:translate-x-0 -translate-x-full"
    style="background-color: var(--sidebar-bg); border-right: 1px solid var(--sidebar-border);"
  >
    <div class="p-6 border-b border-blue-100/50 dark:border-white/5">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-blue-700/20">🚉</div>
        <div class="text-left">
          <h2 class="font-black tracking-tighter uppercase italic text-lg" style="color: var(--logo-text);">
            TIME2TRAIN<span class="text-blue-600">.</span>
          </h2>
          <span class="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded-md font-black uppercase tracking-widest">
            {{ authStore.userRole?.replace('_', ' ') || 'Admin' }}
          </span>
        </div>
      </div>
    </div>

    <nav class="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
      <p class="px-4 text-[10px] font-black text-blue-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 mt-4 text-left">Main Menu</p>
      
      <RouterLink 
        v-for="link in [
          { to: '/super-admin', label: 'Dashboard', icon: '📊' },
          { to: '/super-admin/stations', label: 'Stations', icon: '🚉' },
          { to: '/super-admin/trains', label: 'Trains', icon: '🚆' },
          { to: '/super-admin/routes', label: 'Routes', icon: '🛤️' },
          { to: '/super-admin/journeys', label: 'Journeys', icon: '⏱️' }
        ]" 
        :key="link.to"
        :to="link.to" 
        class="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden"
        :class="[
          /* Light Mode: Text Dark Blue, Hover: Dark Blue Background */
          'text-slate-600 dark:text-slate-400',
          'hover:bg-blue-900 dark:hover:bg-blue-600', 
          'hover:text-white dark:hover:text-white',
          'hover:shadow-lg hover:shadow-blue-900/20'
        ]"
      >
        <span class="text-lg group-hover:scale-110 transition-transform duration-300 z-10">{{ link.icon }}</span>
        <span class="font-bold text-sm tracking-tight z-10">{{ link.label }}</span>
        
        <div class="absolute inset-0 bg-blue-900 dark:bg-blue-600 opacity-0 group-[.router-link-active]:opacity-100 transition-opacity"></div>
      </RouterLink>
    </nav>

    <div class="p-5 bg-white/40 dark:bg-black/20 border-t border-blue-100 dark:border-white/5 space-y-4 text-left backdrop-blur-sm">
      <div class="flex items-center gap-3 px-2">
        <div class="w-11 h-11 rounded-2xl bg-blue-900 text-white flex items-center justify-center text-lg font-black shadow-md border-2 border-white dark:border-slate-800">
          {{ authStore.userEmail?.charAt(0).toUpperCase() || 'A' }}
        </div>
        
        <div class="flex flex-col">
          <span class="text-sm font-black text-slate-900 dark:text-white truncate w-32 tracking-tight">
            Admin Panel
          </span>
          <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 uppercase tracking-wider">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Online
          </span>
        </div>
      </div>

      <button 
        @click="$emit('logout')" 
        class="w-full py-3.5 rounded-2xl bg-red-50 dark:bg-red-500/5 hover:bg-red-600 text-red-600 hover:text-white border border-red-100 dark:border-red-500/10 font-black text-[10px] transition-all uppercase tracking-[0.15em] active:scale-95 shadow-sm hover:shadow-red-600/20"
      >
        Logout System
      </button>
    </div>
  </aside>
</template>