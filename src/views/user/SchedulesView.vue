<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref({ from: '', to: '' })
const isLoading = ref(false)

// Mock Data (පසුව API එක සම්බන්ධ කළ හැක)
const trainResults = [
  { id: 1, name: 'Udarata Menike', from: 'Colombo Fort', to: 'Badulla', time: '05:55 AM', type: 'Express', status: 'On Time' },
  { id: 2, name: 'Podi Menike', from: 'Colombo Fort', to: 'Badulla', time: '08:30 AM', type: 'Express', status: 'Delayed 10m' },
  { id: 3, name: 'Night Mail', from: 'Colombo Fort', to: 'Badulla', time: '20:00 PM', type: 'Night Mail', status: 'On Time' },
]

const handleSearch = () => {
  isLoading.value = true
  // Mock loading delay
  setTimeout(() => { isLoading.value = false }, 1000)
}
</script>

<template>
  <div class="space-y-8 pb-12">
    <header>
      <h1 class="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Train <span class="text-blue-600">Schedules</span></h1>
      <p class="text-slate-500 dark:text-slate-400 font-medium">දිවයින පුරා දිවෙන සියලුම දුම්රිය වේලාවන් මෙතැනින් පරීක්ෂා කරන්න.</p>
    </header>

    <section class="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col md:flex-row gap-4 items-end">
      <div class="flex-1 w-full space-y-2">
        <label class="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Origin</label>
        <input v-model="searchQuery.from" type="text" placeholder="From where?" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm transition-all" />
      </div>
      <div class="flex-1 w-full space-y-2">
        <label class="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Destination</label>
        <input v-model="searchQuery.to" type="text" placeholder="To where?" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm transition-all" />
      </div>
      <button @click="handleSearch" class="w-full md:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-500/20">
        SEARCH
      </button>
    </section>

    <section v-if="!isLoading" class="overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <th class="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Train Name</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Route</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Departure</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
              <th class="px-8 py-5"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-for="train in trainResults" :key="train.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
              <td class="px-8 py-6">
                <div class="font-black text-slate-900 dark:text-white">{{ train.name }}</div>
                <div class="text-[10px] font-bold text-blue-600 uppercase">{{ train.type }}</div>
              </td>
              <td class="px-8 py-6">
                <div class="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                  {{ train.from }} <span class="text-blue-500">→</span> {{ train.to }}
                </div>
              </td>
              <td class="px-8 py-6 font-black text-slate-900 dark:text-white">{{ train.time }}</td>
              <td class="px-8 py-6">
                <span :class="train.status === 'On Time' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'" 
                  class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                  {{ train.status }}
                </span>
              </td>
              <td class="px-8 py-6 text-right">
                <button class="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-600 group-hover:text-white transition-all text-xs font-black">DETAILS</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-else class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-24 w-full bg-slate-200 dark:bg-slate-800 animate-pulse rounded-[1.5rem]"></div>
    </div>
  </div>
</template>