<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const updates = ref<any[]>([]);
const isLoading = ref(true);

const fetchHistory = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('/api/live-status/history');
    updates.value = response.data;
  } catch (err) {
    console.error("Failed to fetch data");
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchHistory);
</script>

<template>
  <div class="p-6">
    <div class="bg-surface rounded-[2.5rem] border border-main shadow-2xl overflow-hidden">
      <div class="p-8 border-b border-main flex justify-between items-center bg-main/5">
        <div>
          <h3 class="text-2xl font-black text-main uppercase tracking-tighter italic">Live Updates <span class="text-emerald-600">Feed</span></h3>
          <p class="text-muted text-xs font-bold uppercase tracking-widest mt-1">Today's real-time movements</p>
        </div>
        <button @click="fetchHistory" class="bg-surface border border-main p-3 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm">
          🔄 Refresh
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="text-[10px] font-black uppercase text-muted tracking-[0.2em] border-b border-main/50">
              <th class="px-8 py-5">Train Details</th>
              <th class="px-8 py-5">Reporting Station</th>
              <th class="px-8 py-5 text-center">Actual Time</th>
              <th class="px-8 py-5 text-center">Delay</th>
              <th class="px-8 py-5 text-right">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-main/5">
            <tr v-for="u in updates" :key="u.id" class="group hover:bg-emerald-500/5 transition-all">
              <td class="px-8 py-6">
                <div class="font-black text-main text-sm">{{ u.train?.train_name }}</div>
                <div class="text-[10px] text-muted font-bold">Journey #{{ u.journey_id }}</div>
              </td>
              <td class="px-8 py-6 font-bold text-muted italic">{{ u.station?.station_name }}</td>
              <td class="px-8 py-6 text-center font-mono font-black text-emerald-600 tracking-tighter">{{ u.actual_departure }}</td>
              <td class="px-8 py-6 text-center">
                <span :class="u.delay_minutes > 0 ? 'text-rose-500' : 'text-emerald-500'" class="font-black text-sm">
                  {{ u.delay_minutes }}m
                </span>
              </td>
              <td class="px-8 py-6 text-right">
                <span :class="u.delay_minutes > 0 ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'" class="px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest">
                  {{ u.status_message }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="isLoading" class="p-20 text-center animate-pulse font-black text-muted uppercase tracking-widest">
        Fetching Latest Data...
      </div>
      <div v-else-if="updates.length === 0" class="p-20 text-center italic text-muted font-bold">
        No updates recorded for today.
      </div>
    </div>
  </div>
</template>