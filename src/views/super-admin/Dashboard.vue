<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
</script>

<template>
  <div class="space-y-8 text-left animate-in fade-in duration-700">
    <div class="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm transition-all">
      <h1 class="text-3xl font-black text-blue-600 dark:text-blue-500 mb-2 leading-tight">Super Admin Dashboard</h1>
      <p class="text-slate-600 dark:text-slate-400 font-medium text-lg">
        Welcome back, <strong class="text-slate-900 dark:text-white">{{ authStore.user?.name || 'Admin' }}</strong>!
      </p>
      <div class="inline-flex items-center gap-2 mt-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-500/20">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> System Online
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="stat in [
        { label: 'Total Trains', val: '24', icon: '🚆' },
        { label: 'Active Schedules', val: '112', icon: '📅' },
        { label: 'System Health', val: 'Good', icon: '🛡️' }
      ]" :key="stat.label" 
      class="bg-white dark:bg-white/5 p-8 rounded-3xl border border-slate-200 dark:border-white/5 text-center transition-all group hover:border-blue-500/50">
        <div class="text-3xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{{ stat.icon }}</div>
        <h3 class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{{ stat.label }}</h3>
        <p class="text-3xl font-black text-slate-900 dark:text-white mt-2">{{ stat.val }}</p>
      </div>
    </div>
  </div>
</template>