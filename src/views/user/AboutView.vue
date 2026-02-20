<script setup lang="ts">
const stats = [
  { label: 'Active Trains', value: '150+', icon: '🚂' },
  { label: 'Daily Commuters', value: '10,000+', icon: '👥' },
  { label: 'Live Stations', value: '80+', icon: '📍' },
  { label: 'Accuracy Rate', value: '99.9%', icon: '🎯' }
]

const features = [
  { 
    title: 'Real-time GPS Tracking', 
    desc: 'අතිනවීන GPS තාක්ෂණය භාවිතයෙන් දුම්රිය පවතින ස්ථානය සජීවීව නිරීක්ෂණය කිරීමේ හැකියාව.',
    icon: '🛰️',
    gradient: 'from-blue-600 to-cyan-400'
  },
  { 
    title: 'Smart Scheduling', 
    desc: 'ප්‍රමුඛ දුම්රිය මාර්ග සියල්ලම ආවරණය වන පරිදි යාවත්කාලීන කළ දුම්රිය කාලසටහන්.',
    icon: '📅',
    gradient: 'from-indigo-600 to-purple-400'
  },
  { 
    title: 'Instant Alerts', 
    desc: 'දුම්රිය ප්‍රමාදයන් හෝ අවලංගු කිරීම් පිළිබඳව ක්ෂණිකව ඔබව දැනුවත් කිරීමේ පද්ධතිය.',
    icon: '🔔',
    gradient: 'from-rose-600 to-orange-400'
  }
]
</script>

<template>
  <div class="space-y-32 py-16 px-6 md:px-0 max-w-7xl mx-auto overflow-hidden bg-transparent">
    
    <section class="relative overflow-hidden rounded-[3rem] bg-slate-950 text-white p-8 lg:p-24 shadow-2xl border border-white/10 group">
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full group-hover:bg-blue-500/30 transition-all duration-1000"></div>
      
      <div class="relative z-20 max-w-3xl space-y-10">
        <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-xl">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span class="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]">Next-Gen Transit System</span>
        </div>

        <h1 class="text-5xl lg:text-8xl font-black tracking-tighter leading-[0.9] italic !text-white">
          Future of <br/>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-500 animate-gradient-x">
            Sri Lankan Railways.
          </span>
        </h1>

        <p class="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-xl group-hover:text-slate-200 transition-colors">
          Time2Train යනු හුදෙක් App එකක් නොව, ශ්‍රී ලාංකීය දුම්රිය මගීන්ගේ කාලය කළමනාකරණය කරන ඩිජිටල් සහයකයායි. 
        </p>

        <div class="flex flex-wrap items-center gap-6">
          <button class="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-600/30 transition-all hover:-translate-y-1 active:scale-95">
            Get Started Now
          </button>
          <button class="group/btn flex items-center gap-3 text-white/70 hover:text-white font-bold text-xs uppercase tracking-widest transition-all">
            Explore Core Tech <span class="group-hover/btn:translate-x-2 transition-transform">→</span>
          </button>
        </div>
      </div>
      
      <div class="absolute top-0 right-0 w-full lg:w-[100%] h-full z-10 pointer-events-none overflow-hidden">
        <div class="relative h-full w-full">
          <img 
            src="/src/assets/LK7A4500E0-01-E-1280-720.jpg" 
            class="h-full w-full object-cover grayscale opacity-25 group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-[2000ms] scale-110 group-hover:scale-100"
            style="mask-image: linear-gradient(to left, black 30%, transparent 90%); -webkit-mask-image: linear-gradient(to left, black 30%, transparent 90%);"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
        </div>
      </div>
    </section>

    <section class="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 border-none bg-transparent">
      <div v-for="stat in stats" :key="stat.label" 
        class="relative bg-[var(--color-surface)] p-10 rounded-[2.5rem] border border-[var(--color-border)] text-center transition-all hover:-translate-y-4 hover:shadow-2xl hover:shadow-blue-500/10 group overflow-hidden shadow-sm">
        <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-500">{{ stat.icon }}</div>
        <div class="text-4xl font-black tracking-tighter text-[var(--color-text-main)] mb-1">{{ stat.value }}</div>
        <div class="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] group-hover:text-blue-500 transition-colors">{{ stat.label }}</div>
      </div>
    </section>

    <section class="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center border-none bg-transparent">
      <div class="space-y-12">
        <div class="space-y-4">
          <h2 class="text-5xl font-black tracking-tight text-[var(--color-text-main)] leading-none">
            ඇයි අපව <br/><span class="text-blue-600 italic">විශේෂ වන්නේ?</span>
          </h2>
          <div class="h-2 w-24 bg-blue-600 rounded-full"></div>
        </div>
        
        <div class="space-y-8">
          <div v-for="feat in features" :key="feat.title" class="flex gap-8 group p-6 rounded-[2rem] hover:bg-blue-500/5 transition-all">
            <div :class="['flex-shrink-0 h-16 w-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-3xl shadow-lg group-hover:rotate-6 transition-all', feat.gradient]">
              {{ feat.icon }}
            </div>
            <div class="space-y-1">
              <h4 class="font-black text-xl text-[var(--color-text-main)] group-hover:text-blue-600 transition-colors">{{ feat.title }}</h4>
              <p class="text-[var(--color-text-muted)] leading-relaxed font-medium">{{ feat.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="relative group">
        <div class="absolute -inset-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[5rem] blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
        <div class="relative rounded-[3.5rem] overflow-hidden shadow-2xl border-8 border-[var(--color-surface)] aspect-[4/5] bg-[var(--color-surface)]">
           <img src="/src/assets/8c.jpg" class="h-full w-full object-cover transition-transform duration-[3s] group-hover:scale-110" />
           <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
           <div class="absolute bottom-8 left-8 right-8 p-8 bg-white/10 glass-effect border border-white/20 rounded-[2rem] transform translate-y-4 group-hover:translate-y-0 transition-transform">
              <p class="text-white font-black text-center italic text-sm tracking-tight leading-relaxed drop-shadow-lg">
                "The most accurate transit data intelligence network in Sri Lanka."
              </p>
           </div>
        </div>
      </div>
    </section>

    <section class="relative bg-blue-600 rounded-[4rem] p-12 lg:p-20 text-center text-white shadow-2xl shadow-blue-600/40 overflow-hidden">
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
      <div class="relative z-10 space-y-8">
        <h3 class="text-4xl md:text-6xl font-black tracking-tighter !text-white">ඔබට සහායක් අවශ්‍යද?</h3>
        <p class="text-blue-50 text-lg md:text-xl max-w-2xl mx-auto font-medium opacity-90 italic">
          අපගේ පද්ධතිය පිළිබඳව ඕනෑම ගැටලුවක් සඳහා පැය 24 පුරාම ක්‍රියාත්මක පාරිභෝගික සේවාව හා සම්බන්ධ වන්න.
        </p>
        <button class="px-14 py-6 bg-slate-950 text-white rounded-[2rem] font-black text-xs tracking-[0.3em] shadow-2xl hover:bg-white hover:text-blue-600 hover:-translate-y-2 active:scale-95 transition-all">
          CONTACT SUPPORT TEAM
        </button>
      </div>
    </section>

  </div>
</template>

<style scoped>
@keyframes gradient-x {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.animate-gradient-x {
  background-size: 200% auto;
  animation: gradient-x 5s ease infinite;
}

.glass-effect {
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  backdrop-filter: blur(20px) saturate(180%);
}
</style>