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
    <div class="p-6 border-b border-slate-100 dark:border-white/5">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-xl shadow-lg">🚉</div>
        <div class="text-left">
          <h2 class="font-bold tracking-tight uppercase italic" style="color: var(--logo-text);">
            TIME2TRAIN<span class="text-blue-500">.</span>
          </h2>
          <span class="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-black uppercase">
            {{ authStore.userRole?.replace('_', ' ') || 'Admin' }}
          </span>
        </div>
      </div>
    </div>

    <nav class="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
      <p class="px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 mt-2 text-left">Main Menu</p>
      
      <RouterLink 
        v-for="link in [
          { to: '/super-admin', label: 'Dashboard', icon: '📊' },
          { to: '/super-admin/stations', label: 'Stations', icon: '🚉' }, // මම මෙතන path එක update කළා
          { to: '/super-admin/trains', label: 'Trains', icon: '🚆' }
        ]" 
        :key="link.to"
        :to="link.to" 
        class="flex items-center gap-3 px-4 py-3.5 text-slate-700 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-2xl transition-all group"
      >
        <span class="text-lg group-hover:scale-125 transition-transform">{{ link.icon }}</span>
        <span class="font-bold text-sm tracking-tight">{{ link.label }}</span>
      </RouterLink>
    </nav>

    <div class="p-4 bg-blue-50/50 dark:bg-black/20 border-t border-blue-100 dark:border-white/5 space-y-4 text-left">
      <div class="flex items-center gap-3 px-2">
        <div class="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-blue-200 dark:border-white/10 flex items-center justify-center text-blue-600 font-black shadow-sm">
          {{ authStore.userEmail?.charAt(0).toUpperCase() || 'A' }}
        </div>
        
        <div class="flex flex-col">
          <span class="text-sm font-black text-slate-900 dark:text-white truncate w-32 tracking-tight">
            Admin Panel
          </span>
          <span class="text-[10px] text-emerald-600 dark:text-emerald-500 font-bold flex items-center gap-1.5 uppercase tracking-wider">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online
          </span>
        </div>
      </div>

      <button 
        @click="$emit('logout')" 
        class="w-full py-3 rounded-2xl bg-red-50 dark:bg-red-500/5 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 dark:border-red-500/10 font-black text-[10px] transition-all uppercase tracking-widest active:scale-95"
      >
        Logout System
      </button>
    </div>
  </aside>
</template>