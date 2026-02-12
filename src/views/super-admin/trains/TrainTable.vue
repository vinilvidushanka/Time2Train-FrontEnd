<template>
  <div class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm">
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead class="bg-slate-50 dark:bg-white/[0.02] text-slate-500 dark:text-slate-400 text-xs uppercase font-black tracking-widest border-b border-slate-100 dark:border-white/5">
          <tr>
            <th class="px-6 py-5">Train Details</th>
            <th class="px-6 py-5">Type & Class</th>
            <th class="px-6 py-5">Direction</th>
            <th class="px-6 py-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-white/5">
          <tr v-for="train in trains" :key="train.id" class="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-all group">
            <td class="px-6 py-5">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-black text-sm border border-blue-600/20 shadow-inner">
                  {{ train.train_number }}
                </div>
                <div class="flex flex-col">
                  <span class="font-bold text-slate-900 dark:text-white text-base tracking-tight">{{ train.train_name }}</span>
                  <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider opacity-60">Locomotive Unit</span>
                </div>
              </div>
            </td>
            <td class="px-6 py-5">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter bg-blue-600/10 text-blue-600 border border-blue-600/20">
                {{ train.train_type }}
              </span>
            </td>
            <td class="px-6 py-5">
              <div class="flex flex-col gap-0.5">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{{ train.direction }}</span>
                <span class="text-[9px] text-slate-400 uppercase font-black opacity-50">Operational Route</span>
              </div>
            </td>
            <td class="px-6 py-5">
              <div class="flex items-center justify-end gap-3">
                <button 
                  @click="$emit('view', train)" 
                  title="View Fleet Details"
                  class="p-2.5 bg-slate-100 dark:bg-white/5 hover:bg-emerald-600 hover:text-white rounded-xl text-slate-500 transition-all duration-300 shadow-sm"
                >
                  👁️
                </button>

                <button 
                  @click="$emit('edit', train)" 
                  title="Edit Unit"
                  class="p-2.5 bg-slate-100 dark:bg-white/5 hover:bg-blue-600 hover:text-white rounded-xl text-slate-500 transition-all duration-300 shadow-sm"
                >
                  ✏️
                </button>

                <button 
                  @click="$emit('delete', train.id)" 
                  title="Decommission Unit"
                  class="p-2.5 bg-slate-100 dark:bg-white/5 hover:bg-red-600 hover:text-white rounded-xl text-slate-500 transition-all duration-300 shadow-sm"
                >
                  🗑️
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
interface Train {
  id?: number; 
  train_number: string;
  train_name: string;
  train_type: string;
  direction: string;
}

const props = defineProps<{
  trains: Train[]
}>();

defineEmits(['view', 'edit', 'delete']);
</script>