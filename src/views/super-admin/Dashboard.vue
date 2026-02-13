<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
</script>

<template>
  <div class="space-y-8 text-left animate-in fade-in slide-in-from-bottom-5 duration-700">
    
    <div class="bg-surface p-10 rounded-[2.5rem] border border-main card-shadow transition-all relative overflow-hidden">
      <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16"></div>
      
      <div class="relative z-10">
        <h1 class="text-3xl font-black text-accent mb-2 leading-tight tracking-tight">
          Super Admin Dashboard
        </h1>
        <p class="text-muted font-medium text-lg">
          Welcome back, <strong class="text-main">{{ authStore.user?.name || 'Admin' }}</strong>!
        </p>
        
        <div class="inline-flex items-center gap-2 mt-5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> System Online
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="stat in [
        { label: 'Total Trains', val: '24', icon: '🚆', shadow: 'hover:shadow-blue-500/10' },
        { label: 'Active Schedules', val: '112', icon: '📅', shadow: 'hover:shadow-indigo-500/10' },
        { label: 'System Health', val: 'Good', icon: '🛡️', shadow: 'hover:shadow-emerald-500/10' }
      ]" :key="stat.label" 
      class="bg-surface p-8 rounded-[2rem] border border-main text-center transition-all group card-shadow"
      :class="stat.shadow">
        
        <div class="w-16 h-16 mx-auto mb-4 bg-dash-stat rounded-2xl flex items-center justify-center text-3xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
          {{ stat.icon }}
        </div>
        
        <h3 class="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-1">{{ stat.label }}</h3>
        <p class="text-4xl font-black text-main tracking-tighter">{{ stat.val }}</p>
        
        <div class="w-8 h-1 bg-accent/20 mx-auto mt-4 rounded-full group-hover:w-16 transition-all duration-500"></div>
      </div>
    </div>
  </div>
</template>