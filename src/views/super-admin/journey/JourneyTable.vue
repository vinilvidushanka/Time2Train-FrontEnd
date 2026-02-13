<script setup lang="ts">
// Parent එකෙන් එන Journeys ටික මෙතනට ලැබෙනවා
defineProps<{
  journeys: any[]
}>();

defineEmits(['edit', 'delete', 'view']);
</script>

<template>
  <div class="bg-surface border border-main rounded-[2rem] overflow-hidden card-shadow">
    <div class="overflow-x-auto text-left">
      <table class="w-full">
        <thead class="bg-slate-50/50 dark:bg-white/[0.02] text-muted text-[10px] uppercase font-black tracking-[0.2em] border-b border-main">
          <tr>
            <th class="px-8 py-5">Train Details</th>
            <th class="px-8 py-5">Assigned Route</th>
            <th class="px-8 py-5">Direction</th>
            <th class="px-8 py-5">Est. Duration</th>
            <th class="px-8 py-5 text-right">Actions</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-main">
          <tr v-if="journeys.length === 0">
            <td colspan="5" class="px-6 py-20 text-center opacity-40">
              <span class="text-4xl">🗓️</span>
              <p class="text-main font-bold italic mt-2">No journeys scheduled yet.</p>
            </td>
          </tr>

          <tr v-else v-for="journey in journeys" :key="journey.id" class="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors group">
            <td class="px-8 py-6">
              <div class="flex flex-col">
                <span class="font-black text-main text-base tracking-tighter">{{ journey.train?.train_name }}</span>
                <span class="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">#{{ journey.train_number }}</span>
              </div>
            </td>

            <td class="px-8 py-6">
              <div class="flex items-center gap-2">
                <span class="text-sm font-bold text-main">{{ journey.route?.from_station?.station_name }}</span>
                <span class="text-muted opacity-30">→</span>
                <span class="text-sm font-bold text-main">{{ journey.route?.to_station?.station_name }}</span>
              </div>
            </td>

            <td class="px-8 py-6">
              <div :class="journey.direction === 'Up' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : 'bg-orange-500/10 text-orange-600 border-orange-500/20'" 
                   class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border font-black text-[10px] uppercase tracking-wider">
                <span v-if="journey.direction === 'Up'">▲</span>
                <span v-else>▼</span>
                {{ journey.direction }}
              </div>
            </td>

            <td class="px-8 py-6">
              <div class="flex items-center gap-2">
                <span class="text-base font-black text-main">{{ journey.journey_duration || '--' }}</span>
                <span class="text-[9px] font-black text-muted uppercase">Min</span>
              </div>
            </td>

            <td class="px-8 py-6 text-right">
              <div class="flex items-center justify-end gap-3">
                <button @click="$emit('view', journey)" class="p-2.5 bg-slate-50 dark:bg-white/5 hover:bg-emerald-600 hover:text-white rounded-xl text-slate-400 transition-all active:scale-90 shadow-sm">
                  <span class="text-xs">👁️</span>
                </button>
                <button @click="$emit('edit', journey)" class="p-3 bg-input hover:bg-indigo-600 hover:text-white rounded-2xl text-muted transition-all border border-main">
                  <span class="text-xs">✏️</span>
                </button>
                <button @click="$emit('delete', journey.id)" class="p-3 bg-input hover:bg-red-600 hover:text-white rounded-2xl text-muted transition-all border border-main">
                  <span class="text-xs">🗑️</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>