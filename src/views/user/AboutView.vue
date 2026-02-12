<script setup lang="ts">
import { onMounted } from 'vue'

const stats = [
  { label: 'Active Trains', value: '150+', icon: '🚂', color: 'blue' },
  { label: 'Daily Commuters', value: '10,000+', icon: '👥', color: 'indigo' },
  { label: 'Live Stations', value: '80+', icon: '📍', color: 'sky' },
  { label: 'Accuracy Rate', value: '99.9%', icon: '🎯', color: 'emerald' }
]

const features = [
  { 
    title: 'Real-time GPS Tracking', 
    desc: 'අතිනවීන GPS තාක්ෂණය භාවිතයෙන් දුම්රිය පවතින ස්ථානය සජීවීව නිරීක්ෂණය කිරීමේ හැකියාව.',
    icon: '🛰️',
    gradient: 'from-blue-500 to-cyan-400'
  },
  { 
    title: 'Smart Scheduling', 
    desc: 'ප්‍රමුඛ දුම්රිය මාර්ග සියල්ලම ආවරණය වන පරිදි යාවත්කාලීන කළ දුම්රිය කාලසටහන්.',
    icon: '📅',
    gradient: 'from-indigo-500 to-purple-400'
  },
  { 
    title: 'Instant Alerts', 
    desc: 'දුම්රිය ප්‍රමාදයන් හෝ අවලංගු කිරීම් පිළිබඳව ක්ෂණිකව ඔබව දැනුවත් කිරීමේ පද්ධතිය.',
    icon: '🔔',
    gradient: 'from-rose-500 to-orange-400'
  }
]
</script>

<template>
  <div class="space-y-24 py-12 px-4 md:px-0 max-w-7xl mx-auto overflow-hidden">
    
    <section class="relative overflow-hidden rounded-[3.5rem] bg-[#0f172a] text-white p-10 lg:p-24 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] group border border-white/5">
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full group-hover:bg-blue-500/30 transition-all duration-1000"></div>
      
      <div class="relative z-30 max-w-3xl space-y-8">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md">
          <span class="flex h-2 w-2 rounded-full bg-blue-400 animate-ping"></span>
          <span class="text-blue-400 text-[10px] font-black uppercase tracking-[0.25em]">Defining the Future</span>
        </div>

        <h1 class="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.85] text-white italic">
          Next-Gen <br/>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-600 animate-gradient">
            Transit Intelligence.
          </span>
        </h1>

        <p class="text-xl text-slate-400 font-medium leading-relaxed max-w-xl group-hover:text-slate-300 transition-colors">
          Time2Train යනු හුදෙක් App එකක් නොව, ශ්‍රී ලාංකීය දුම්රිය මගීන්ගේ කාලය කළමනාකරණය කරන ඩිජිටල් සහයකයායි. 
        </p>

        <div class="flex items-center gap-6 pt-4">
          <button class="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-600/20 transition-all active:scale-95">
            Get Started
          </button>
          <div class="group/btn flex items-center gap-3 text-white/70 hover:text-white font-bold text-xs uppercase tracking-widest cursor-pointer transition-all">
            Core Technology <span class="group-hover/btn:translate-x-2 transition-transform">→</span>
          </div>
        </div>
      </div>
      
      <div class="absolute top-0 right-0 w-full lg:w-[100%] h-full z-10 select-none">
        <div class="relative h-full w-full">
          <img 
            src="/src/assets/LK7A4500E0-01-E-1280-720.jpg" 
            class="h-full w-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-60 group-hover:scale-105 transition-all duration-[2000ms]"
            style="mask-image: linear-gradient(to left, black 50%, transparent); -webkit-mask-image: linear-gradient(to left, black 50%, transparent);"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/40 to-transparent"></div>
        </div>
      </div>
    </section>

    <section class="grid grid-cols-2 lg:grid-cols-4 gap-8">
      <div v-for="stat in stats" :key="stat.label" 
        class="relative bg-white dark:bg-white/5 p-10 rounded-[2.5rem] border border-slate-100 dark:border-white/5 text-center transition-all hover:-translate-y-3 hover:shadow-2xl hover:shadow-blue-500/10 group overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <div class="text-4xl mb-6 transform group-hover:scale-125 transition-transform duration-500">{{ stat.icon }}</div>
        <div class="text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-2">{{ stat.value }}</div>
        <div class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-blue-500 transition-colors">{{ stat.label }}</div>
      </div>
    </section>

    <section class="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
      <div class="space-y-12">
        <div class="space-y-4">
          <h2 class="text-5xl font-black tracking-tight leading-none text-slate-900 dark:text-white">
            ඇයි අපව <br/><span class="text-blue-600 italic">විශේෂ වන්නේ?</span>
          </h2>
          <div class="h-2 w-20 bg-blue-600 rounded-full"></div>
        </div>
        
        <div class="space-y-10">
          <div v-for="feat in features" :key="feat.title" class="flex gap-8 group">
            <div :class="['flex-shrink-0 h-16 w-16 rounded-3xl bg-gradient-to-br flex items-center justify-center text-3xl shadow-xl transition-all group-hover:rotate-6', feat.gradient]">
              {{ feat.icon }}
            </div>
            <div class="space-y-2">
              <h4 class="font-black text-xl text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors">{{ feat.title }}</h4>
              <p class="text-md text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{{ feat.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="relative group">
        <div class="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[4rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
        <div class="relative rounded-[3.5rem] overflow-hidden shadow-full aspect-[4/5] border-[12px] border-white dark:border-slate-800">
           <img src="/src/assets/8c.jpg" class="h-full w-full object-cover transition-all duration-700 group-hover:scale-110" />
           <div class="absolute inset-0 bg-blue-900/20 mix-blend-overlay group-hover:bg-transparent transition-all"></div>
           
           <div class="absolute bottom-8 left-8 right-8 p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl">
              <p class="text-white font-bold text-center italic">"The most accurate transit data in Sri Lanka."</p>
           </div>
        </div>
      </div>
    </section>

    <section class="relative bg-gradient-to-r from-blue-700 to-blue-500 rounded-[3.5rem] p-16 text-center text-white shadow-2xl overflow-hidden group">
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
      
      <div class="relative z-10 space-y-8">
        <h3 class="text-4xl md:text-5xl font-black tracking-tight">ඔබට සහායක් අවශ්‍යද?</h3>
        <p class="text-blue-50 text-lg mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
          අපගේ පද්ධතිය පිළිබඳව ඕනෑම ගැටලුවක් සඳහා පැය 24 පුරාම ක්‍රියාත්මක පාරිභෝගික සේවාව හා සම්බන්ධ වන්න.
        </p>
        <button class="px-12 py-5 bg-white text-blue-600 rounded-[2rem] font-black text-sm tracking-[0.2em] shadow-xl hover:bg-slate-900 hover:text-white hover:scale-105 active:scale-95 transition-all">
          CONTACT SUPPORT TEAM
        </button>
      </div>
    </section>

  </div>
</template>

<style scoped>
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient {
  background-size: 200% auto;
  animation: gradient 4s linear infinite;
}

/* Custom shadow for premium feel */
.shadow-full {
  box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.25);
}
</style>