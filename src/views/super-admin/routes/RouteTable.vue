<script setup lang="ts">
// Dummy data ඔක්කොම අයින් කළා. 
// දැන් data එන්නේ Layout එකෙන් Props හරහා.
defineProps<{
  routes: any[]
}>();

defineEmits(['view', 'edit', 'delete']);
</script>

<template>
  <div class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm">
    <div class="overflow-x-auto text-left">
      <table class="w-full">
        <thead class="bg-slate-50 dark:bg-white/[0.02] text-slate-500 dark:text-slate-400 text-xs uppercase font-black tracking-widest">
          <tr>
            <th class="px-6 py-4">ID</th>
            <th class="px-6 py-4">Connection Path</th>
            <th class="px-6 py-4">Distance Details</th>
            <th class="px-6 py-4">Line Status</th>
            <th class="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-100 dark:divide-white/5">
          <tr v-if="routes.length === 0">
            <td colspan="5" class="px-6 py-12 text-center">
              <div class="flex flex-col items-center gap-2">
                <span class="text-2xl opacity-20">🛤️</span>
                <p class="text-slate-400 italic text-sm font-medium">No routes found in the database.</p>
              </div>
            </td>
          </tr>

          <tr v-else v-for="route in routes" :key="route.id" class="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
            <td class="px-6 py-5">
              <span class="font-mono text-xs text-slate-400 font-bold">#{{ route.id }}</span>
            </td>

            <td class="px-6 py-5">
                <div class="flex items-center gap-3">
                    <div class="flex flex-col">
                    <div class="flex items-center gap-2">
                        <span class="font-bold text-slate-900 dark:text-white text-sm tracking-tight">
                        {{ route.from_station?.station_name || 'N/A' }}
                        </span>
                        
                        <span class="text-slate-300 dark:text-white/20">→</span>
                        
                        <span class="font-bold text-slate-900 dark:text-white text-sm tracking-tight">
                        {{ route.to_station?.station_name || 'N/A' }}
                        </span>
                    </div>
                    <span class="text-[10px] text-slate-400 font-medium uppercase italic">Inter-city Connection</span>
                    </div>
                </div>
            </td>

            <td class="px-6 py-5">
              <div class="flex flex-col gap-1">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-black text-indigo-600 dark:text-indigo-400">{{ route.distance_km }}</span>
                  <span class="text-[10px] font-bold text-slate-400 uppercase">KM</span>
                </div>
                <div class="w-20 h-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                   <div class="h-full bg-indigo-500 rounded-full" :style="{ width: (Number(route.distance_km) / 5) + '%' }"></div>
                </div>
              </div>
            </td>

            <td class="px-6 py-5">
              <span class="text-[10px] px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg font-black uppercase tracking-wider">
                Active Track
              </span>
            </td>

            <td class="px-6 py-5 text-right">
              <div class="flex items-center justify-end gap-2">
                <button @click="$emit('view', route)" class="p-2.5 bg-slate-50 dark:bg-white/5 hover:bg-emerald-600 hover:text-white rounded-xl text-slate-400 transition-all active:scale-90 shadow-sm">
                  <span class="text-xs">👁️</span>
                </button>
                <button @click="$emit('edit', route)" class="p-2.5 bg-slate-50 dark:bg-white/5 hover:bg-blue-600 hover:text-white rounded-xl text-slate-400 transition-all active:scale-90 shadow-sm">
                  <span class="text-xs">✏️</span>
                </button>
                <button @click="$emit('delete', route.id)" class="p-2.5 bg-slate-50 dark:bg-white/5 hover:bg-red-600 hover:text-white rounded-xl text-slate-400 transition-all active:scale-90 shadow-sm">
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