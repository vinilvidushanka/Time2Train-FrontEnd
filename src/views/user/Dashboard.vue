<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import AppNavbar from '@/components/layouts/AppNavbar.vue'

const authStore = useAuthStore()
const router = useRouter()

const actions = [
  { icon: '📅', title: 'Schedules', desc: 'Real-time train timetables and frequencies.', count: '24 Trips', accent: 'blue' },
  { icon: '📡', title: 'Live Tracking', desc: 'Monitor current train positions via GPS.', count: 'Live', accent: 'purple' },
  { icon: '🎫', title: 'Ticketing', desc: 'Price information and seat reservations.', count: 'Booking', accent: 'amber' },
  { icon: '🔔', title: 'Alerts', desc: 'Instant delay and cancellation notices.', count: '5 New', accent: 'red' }
]

// පාලනය සඳහා refs (අවශ්‍ය නම් පමණක්)
const fromStation = ref('')
const toStation = ref('')
</script>

<template>
  <div class="min-h-screen font-['Plus_Jakarta_Sans',sans-serif] bg-[var(--color-bg)] text-[var(--color-text-main)] transition-colors duration-500">
    

    <main class="max-w-7xl mx-auto px-6 py-12">
      
      <header class="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-1">
          <div class="flex items-center gap-2 mb-2">
            <span class="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Authorized Access Only</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-black tracking-tight text-[var(--color-text-main)]">
            Welcome, <span class="text-blue-600">{{ authStore.user?.name?.split(' ')[0] || 'User' }}</span>
          </h1>
          <p class="text-[var(--color-text-muted)] font-medium text-lg">Manage your daily transit and real-time updates.</p>
        </div>
      </header>

      <section class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        <div class="lg:col-span-8 bg-[var(--color-surface)] rounded-[2.5rem] border border-[var(--color-border)] shadow-xl p-8 md:p-12 transition-all hover:shadow-2xl">
          <div class="flex items-center gap-4 mb-10">
            <div class="h-12 w-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-xl">🚂</div>
            <h3 class="text-2xl font-black text-[var(--color-text-main)]">Plan Your Journey</h3>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div class="space-y-3">
              <label class="text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)] ml-1">Departure From</label>
              <div class="relative group">
                <span class="absolute left-5 top-1/2 -translate-y-1/2 opacity-50 group-focus-within:opacity-100 transition-opacity">📍</span>
                <input 
                  type="text" 
                  v-model="fromStation"
                  placeholder="Origin Station" 
                  class="w-full pl-14 pr-6 py-5 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-sm text-[var(--color-text-main)]" 
                />
              </div>
            </div>

            <div class="space-y-3">
              <label class="text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)] ml-1">Arriving At</label>
              <div class="relative group">
                <span class="absolute left-5 top-1/2 -translate-y-1/2 opacity-50 group-focus-within:opacity-100 transition-opacity">🏁</span>
                <input 
                  type="text" 
                  v-model="toStation"
                  placeholder="Destination Station" 
                  class="w-full pl-14 pr-6 py-5 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-sm text-[var(--color-text-main)]" 
                />
              </div>
            </div>
          </div>

          <button class="group w-full py-5 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black text-sm tracking-widest hover:shadow-xl hover:shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
            INITIATE SYSTEM SEARCH
            <span class="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        <div class="lg:col-span-4 relative rounded-[2.5rem] overflow-hidden group border border-[var(--color-border)] shadow-xl">
  <img src="/src/assets/8c.jpg" class="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
  
  <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80"></div>
  
  <div class="absolute bottom-10 left-10 right-10 z-10">
    <span class="inline-block px-3 py-1 rounded-md bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-widest mb-4 border border-white/20" style="color: white !important;">
      SL Railways Update
    </span>
    
    <h4 class="text-2xl font-black leading-tight drop-shadow-lg" style="color: white !important;">
      Navigating the <br/> Nine Arch Bridge.
    </h4>
  </div>
</div>
      </section>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="item in actions" :key="item.title" 
          class="bg-[var(--color-surface)] p-8 rounded-[2.5rem] border border-[var(--color-border)] hover:border-blue-500/50 transition-all group cursor-pointer shadow-sm hover:shadow-2xl hover:-translate-y-2">
          
          <div class="flex justify-between items-start mb-8">
            <div class="h-14 w-14 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              {{ item.icon }}
            </div>
            <span class="text-[10px] font-black px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full tracking-tighter">
              {{ item.count }}
            </span>
          </div>
          
          <h4 class="font-black text-lg mb-2 text-[var(--color-text-main)]">{{ item.title }}</h4>
          <p class="text-xs font-semibold text-[var(--color-text-muted)] leading-relaxed mb-6">{{ item.desc }}</p>
          
          <div class="flex items-center gap-2 text-[10px] font-black text-blue-600 group-hover:gap-4 transition-all uppercase tracking-[0.2em]">
            Access Module <span>→</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Smooth transition for theme switching */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Custom shadow for Light mode cards */
.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
}

.absolute h4 {
  color: white !important;
}
</style>