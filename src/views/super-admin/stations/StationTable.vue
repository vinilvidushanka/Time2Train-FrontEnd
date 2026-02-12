<template>
  <div class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm">
    <div class="overflow-x-auto text-left">
      <table class="w-full">
        <thead class="bg-slate-50 dark:bg-white/[0.02] text-slate-500 dark:text-slate-400 text-xs uppercase font-black tracking-widest">
          <tr>
            <th class="px-6 py-4">Station Details</th>
            <th class="px-6 py-4">District & Line</th>
            <th class="px-6 py-4">Facilities</th>
            <th class="px-6 py-4">Contact</th>
            <th class="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-white/5">
          <tr v-for="station in stations" :key="station.id" class="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
            <td class="px-6 py-5">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center font-black shadow-sm">
                  {{ station.station_code }}
                </div>
                <div class="flex flex-col">
                  <span class="font-bold text-slate-900 dark:text-white text-sm tracking-tight">{{ station.station_name }}</span>
                  <span class="text-[10px] text-slate-400 font-medium uppercase italic">Railway Hub</span>
                </div>
              </div>
            </td>

            <td class="px-6 py-5">
              <div class="flex flex-col gap-1">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{{ station.district || 'N/A' }}</span>
                </div>
                <span class="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-white/5 text-slate-500 rounded-md w-fit">
                  {{ station.line || 'Unknown Line' }}
                </span>
              </div>
            </td>

            <td class="px-6 py-5">
              <div class="flex items-center gap-2">
                <div v-if="station.has_parking" title="Parking" class="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xs">P</div>
                <div v-if="station.has_canteen" title="Canteen" class="w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-orange-600 flex items-center justify-center text-xs">☕</div>
                <div v-if="station.has_restroom" title="Restroom" class="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center text-xs">🚻</div>
                <div v-if="station.has_ticketing_machine" title="Ticket Machine" class="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-600 flex items-center justify-center text-xs">🎟️</div>
                <span v-if="!station.has_parking && !station.has_canteen && !station.has_restroom" class="text-xs text-slate-400 italic">No facilities</span>
              </div>
            </td>

            <td class="px-6 py-5">
              <span class="text-sm font-medium text-slate-600 dark:text-slate-400">
                {{ station.contact_number || '---' }}
              </span>
            </td>

            <td class="px-6 py-5 text-right">
              <div class="flex items-center justify-end gap-2">
                <button 
                  @click="$emit('view', station)"
                  title="View Details"
                  class="p-2.5 bg-slate-50 dark:bg-white/5 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 rounded-xl text-slate-400 transition-all active:scale-90 shadow-sm"
                >
                  <span class="text-xs">👁️</span>
                </button>

                <button 
                  @click="$emit('edit', station)"
                  title="Edit Station"
                  class="p-2.5 bg-slate-50 dark:bg-white/5 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 rounded-xl text-slate-400 transition-all active:scale-90 shadow-sm"
                >
                  <span class="text-xs">✏️</span>
                </button>

                <button 
                  @click="$emit('delete', station.id)"
                  title="Delete Station"
                  class="p-2.5 bg-slate-50 dark:bg-white/5 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 rounded-xl text-slate-400 transition-all active:scale-90 shadow-sm"
                >
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

<script setup lang="ts">
interface Station {
  id: number;
  station_name: string;
  station_code: string;
  district: string | null;
  line: string | null;
  contact_number: string | null;
  has_parking: boolean;
  has_restroom: boolean;
  has_canteen: boolean;
  has_waiting_room: boolean;
  has_ticketing_machine: boolean;
}

defineProps<{
  stations: Station[]
}>()

// Parent component එකට දැනුම් දෙන්න events define කරමු
defineEmits(['view', 'edit', 'delete'])
</script>