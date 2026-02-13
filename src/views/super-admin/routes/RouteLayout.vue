<template>
  <div class="space-y-8 p-6 animate-in fade-in duration-700">
    <div class="flex justify-between items-end text-left">
      <div class="space-y-3">
        <div class="flex items-center gap-4 text-left">
          <div class="w-3 h-10 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)]"></div>
          <h1 class="text-4xl md:text-5xl font-black text-main tracking-tighter uppercase italic leading-none">
            Route <span class="text-blue-600">Management</span>
          </h1>
        </div>
        <p class="text-muted text-sm font-medium italic mt-2">Manage train routes, connections and distances.</p>
      </div>
      
      <button 
        @click="openAddModal" 
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center gap-2 uppercase tracking-widest"
      >
        <span>+ Add New Route</span>
      </button>
    </div>

    <div class="space-y-6">
      <router-view 
        :routes="routes" 
        @view="handleView" 
        @edit="handleEdit" 
        @delete="handleDelete" 
        class="animate-in slide-in-from-bottom-5 duration-700"
        ></router-view>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-surface w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-visible border border-main card-shadow">
        <div class="p-8">
          
          <div class="flex justify-between items-start mb-8 text-left">
            <div>
              <h3 class="text-2xl font-black text-main uppercase tracking-tighter">
                {{ isEditMode ? 'Update Route' : 'Add New Route' }}
              </h3>
              <p class="text-muted text-sm font-medium">Define the connection between hubs.</p>
            </div>
            <button @click="closeModal" class="text-slate-400 hover:text-main transition-colors">✕</button>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-6 text-left">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div class="relative station-select-container">
                <label class="text-[10px] font-black uppercase text-muted ml-1">From Station</label>
                <div class="relative mt-1">
                  <input 
                    type="text" 
                    v-model="searchFrom"
                    @focus="showFromDropdown = true"
                    @input="showFromDropdown = true"
                    placeholder="Search start station..."
                    class="w-full bg-input border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-main transition-all"
                  />
                  
                  <div v-if="showFromDropdown" class="absolute left-0 right-0 z-[100] mt-2 bg-surface border border-main rounded-2xl shadow-2xl max-h-60 overflow-y-auto custom-scrollbar">
                    <div v-if="filteredFromStations.length > 0">
                      <div 
                        v-for="station in filteredFromStations" :key="station.id"
                        @mousedown.prevent="selectStation('from', station)"
                        class="px-5 py-3.5 hover:bg-blue-600 hover:text-white cursor-pointer group flex flex-col transition-colors border-b border-main last:border-none"
                      >
                        <span class="font-bold text-sm group-hover:text-white text-main">{{ station.station_name }}</span>
                        <span class="text-[10px] text-muted uppercase tracking-widest group-hover:text-blue-100">{{ station.station_code }}</span>
                      </div>
                    </div>
                    <div v-else class="px-5 py-6 text-center text-muted text-xs italic">No stations found</div>
                  </div>
                </div>
              </div>

              <div class="relative station-select-container">
                <label class="text-[10px] font-black uppercase text-muted ml-1">To Station</label>
                <div class="relative mt-1">
                  <input 
                    type="text" 
                    v-model="searchTo"
                    @focus="showToDropdown = true"
                    @input="showToDropdown = true"
                    placeholder="Search destination..."
                    class="w-full bg-input border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-main transition-all"
                  />
                  
                  <div v-if="showToDropdown" class="absolute left-0 right-0 z-[100] mt-2 bg-surface border border-main rounded-2xl shadow-2xl max-h-60 overflow-y-auto custom-scrollbar">
                    <div v-if="filteredToStations.length > 0">
                      <div 
                        v-for="station in filteredToStations" :key="station.id"
                        @mousedown.prevent="selectStation('to', station)"
                        class="px-5 py-3.5 hover:bg-blue-600 hover:text-white cursor-pointer group flex flex-col transition-colors border-b border-main last:border-none"
                      >
                        <span class="font-bold text-sm group-hover:text-white text-main">{{ station.station_name }}</span>
                        <span class="text-[10px] text-muted uppercase tracking-widest group-hover:text-blue-100">{{ station.station_code }}</span>
                      </div>
                    </div>
                    <div v-else class="px-5 py-6 text-center text-muted text-xs italic">No stations found</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase text-muted ml-1">Distance (KM)</label>
              <input 
                v-model="form.distance_km" 
                type="number" 
                step="0.01" 
                placeholder="0.00" 
                required
                class="w-full bg-input border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-main transition-all"
              />
            </div>

            <div class="flex gap-4 pt-6">
              <button 
                @click="closeModal" 
                type="button" 
                class="flex-1 px-6 py-4 rounded-2xl font-black text-xs uppercase text-muted hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button 
                :disabled="isSubmitting" 
                type="submit" 
                class="flex-[2] bg-blue-600 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase shadow-xl hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-95"
              >
                {{ isSubmitting ? 'Processing...' : (isEditMode ? 'Update Route' : 'Confirm & Save') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-if="isViewModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
        <div class="bg-surface w-full max-w-xl rounded-[2.5rem] shadow-2xl p-10 text-left relative border border-main card-shadow animate-in zoom-in-95 duration-300">
            
            <button @click="isViewModalOpen = false" class="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-input rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-all text-muted">✕</button>
            
            <div class="mb-10">
            <h3 class="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-2">Route Details</h3>
            <h2 class="text-3xl font-black text-main uppercase tracking-tighter leading-tight">Connection Hub</h2>
            </div>

            <div class="relative flex flex-col gap-12 mb-10">
            <div class="absolute left-7 top-10 bottom-10 w-1 bg-gradient-to-b from-blue-600 via-indigo-500 to-emerald-500 rounded-full opacity-30 dark:opacity-50"></div>

            <div class="flex items-start gap-6 relative">
                <div class="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-black shadow-lg shadow-blue-600/30 shrink-0 z-10">
                {{ selectedRoute?.from_station_code || 'ST' }}
                </div>
                <div class="pt-1">
                <p class="text-[10px] font-black text-muted uppercase tracking-widest">Starting Point</p>
                <h4 class="text-xl font-bold text-main">{{ selectedRoute?.from_station_name }}</h4>
                </div>
            </div>

            <div class="ml-4 px-4 py-2 bg-input border border-main rounded-xl inline-flex items-center gap-2 self-start z-10">
                <span class="text-lg">📍</span>
                <span class="text-sm font-black text-main tracking-tighter">{{ selectedRoute?.distance_km }} KM Distance</span>
            </div>

            <div class="flex items-start gap-6 relative">
                <div class="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-xl font-black shadow-lg shadow-emerald-500/30 shrink-0 z-10">
                {{ selectedRoute?.to_station_code || 'ED' }}
                </div>
                <div class="pt-1">
                <p class="text-[10px] font-black text-muted uppercase tracking-widest">Destination</p>
                <h4 class="text-xl font-bold text-main">{{ selectedRoute?.to_station_name }}</h4>
                </div>
            </div>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-10">
            <div class="bg-input p-4 rounded-2xl border border-main">
                <p class="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Status</p>
                <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span class="font-bold text-main text-sm">Operational</span>
                </div>
            </div>
            <div class="bg-input p-4 rounded-2xl border border-main">
                <p class="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Route ID</p>
                <p class="font-bold text-main text-sm">#R-{{ selectedRoute?.id.toString().padStart(4, '0') }}</p>
            </div>
            </div>

            <button @click="isViewModalOpen = false" class="w-full py-4 bg-main text-surface rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:opacity-90 transition-all shadow-xl">
            Close Overview
            </button>
        </div>
        </div>
  </div>
</template>

<script setup lang="ts">
// (Logic එක ඔයා කලින් පාවිච්චි කරපු එකමයි මචං, මම මෙතන styles ටික විතරයි optimize කළේ)
import { ref, onMounted, computed, reactive, onBeforeUnmount } from 'vue';
import { useRouteStore } from '@/stores/route';
import { useStationStore } from '@/stores/station';

const routeStore = useRouteStore();
const stationStore = useStationStore();

const isModalOpen = ref(false);
const isEditMode = ref(false);
const isSubmitting = ref(false);
const currentId = ref<number | null>(null);

const searchFrom = ref('');
const searchTo = ref('');
const showFromDropdown = ref(false);
const showToDropdown = ref(false);

const isViewModalOpen = ref(false);
const selectedRoute = ref<any>(null);

const handleView = (route: any) => {
  // මෙතනදී Route එකේ Station names සහ Codes ටිකත් pass වෙනවා කියලා සහතික කරගන්න
  selectedRoute.value = route;
  isViewModalOpen.value = true;
};

const form = reactive({
  from_station_id: null as number | null,
  to_station_id: null as number | null,
  distance_km: '' as string | number
});

const handleGlobalClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest('.station-select-container')) {
    showFromDropdown.value = false;
    showToDropdown.value = false;
  }
};

onMounted(() => {
  window.addEventListener('click', handleGlobalClick);
  routeStore.fetchRoutes();
  stationStore.fetchAllStations();
});

onBeforeUnmount(() => {
  window.removeEventListener('click', handleGlobalClick);
});

const routes = computed(() => routeStore.routes);
const allStations = computed(() => stationStore.allStationsForDropdown || []);

const filteredFromStations = computed(() => {
  const query = searchFrom.value.toLowerCase().trim();
  if (!query) return allStations.value;
  return allStations.value.filter(s => 
    s.station_name?.toLowerCase().includes(query) || 
    s.station_code?.toLowerCase().includes(query)
  );
});

const filteredToStations = computed(() => {
  const query = searchTo.value.toLowerCase().trim();
  const list = allStations.value.filter(s => s.id !== form.from_station_id);
  if (!query) return list;
  return list.filter(s => 
    s.station_name?.toLowerCase().includes(query) || 
    s.station_code?.toLowerCase().includes(query)
  );
});

const selectStation = (type: 'from' | 'to', station: any) => {
  if (type === 'from') {
    form.from_station_id = station.id;
    searchFrom.value = station.station_name;
    showFromDropdown.value = false;
  } else {
    form.to_station_id = station.id;
    searchTo.value = station.station_name;
    showToDropdown.value = false;
  }
};

const openAddModal = () => {
  isEditMode.value = false;
  resetForm();
  isModalOpen.value = true;
};

const handleEdit = (route: any) => {
  isEditMode.value = true;
  currentId.value = route.id;
  form.from_station_id = route.from_station_id;
  form.to_station_id = route.to_station_id;
  form.distance_km = route.distance_km;

  const fromS = allStations.value.find(s => s.id === route.from_station_id);
  const toS = allStations.value.find(s => s.id === route.to_station_id);
  searchFrom.value = fromS?.station_name || '';
  searchTo.value = toS?.station_name || '';
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  resetForm();
};

const resetForm = () => {
  form.from_station_id = null;
  form.to_station_id = null;
  form.distance_km = '';
  searchFrom.value = '';
  searchTo.value = '';
  showFromDropdown.value = false;
  showToDropdown.value = false;
};

const handleSubmit = async () => {
  if (!form.from_station_id || !form.to_station_id) return alert("Select stations!");
  isSubmitting.value = true;
  try {
    const payload = {
      from_station_id: form.from_station_id,
      to_station_id: form.to_station_id,
      distance_km: Number(form.distance_km)
    };
    isEditMode.value ? await routeStore.updateRoute(currentId.value!, payload) : await routeStore.addRoute(payload);
    closeModal();
  } catch (e) {
    console.error(e);
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = async (id: number) => {
  if (confirm('Delete?')) await routeStore.deleteRoute(id);
};

</script>

<style scoped>
/* Scrollbar Customization */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { 
  background: var(--color-border); 
  border-radius: 10px; 
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #3b82f6;
}

/* Modal overflow fix for dropdowns */
.bg-surface {
  overflow: visible !important;
}
</style>