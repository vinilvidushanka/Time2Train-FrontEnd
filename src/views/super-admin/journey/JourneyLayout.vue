<template>
  <div class="space-y-8 p-6 animate-in fade-in duration-700">
    <div class="flex justify-between items-end text-left">
      <div class="space-y-3">
        <div class="flex items-center gap-4 text-left">
          <div class="w-3 h-10 bg-indigo-600 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.5)]"></div>
          <h1 class="text-4xl md:text-5xl font-black text-main tracking-tighter uppercase italic leading-none">
            Journey <span class="text-indigo-600">Scheduler</span>
          </h1>
        </div>
        <p class="text-muted text-sm font-medium italic mt-2">Assign trains to routes and manage schedules.</p>
      </div>
      
      <button 
        @click="openAddModal" 
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center gap-2 uppercase tracking-widest"
      >
        <span>+ New Journey</span>
      </button>
    </div>

    <div class="space-y-6">
      <router-view 
        :journeys="journeys" 
        @edit="handleEdit" 
        @delete="handleDelete" 
        @view="handleView"
        class="animate-in slide-in-from-bottom-5 duration-700"
      ></router-view>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-surface w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-main card-shadow overflow-visible">
        <div class="p-8">
          <div class="flex justify-between items-start mb-8 text-left">
            <div>
              <h3 class="text-2xl font-black text-main uppercase tracking-tighter">
                {{ isEditMode ? 'Update Journey' : 'Schedule Journey' }}
              </h3>
              <p class="text-muted text-sm font-medium">Link a train to a specific route.</p>
            </div>
            <button @click="closeModal" class="text-slate-400 hover:text-main">✕</button>
          </div>

          <form @submit.prevent="handleSubmit" class="flex flex-col text-left overflow-hidden">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2 relative group">
                <label class="text-[10px] font-black uppercase text-muted ml-1 tracking-widest">Assign Train</label>
                
                <div class="relative">
                    <select 
                    v-model="form.train_id" 
                    class="w-full bg-input border border-transparent hover:border-indigo-500/30 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold text-main appearance-none transition-all cursor-pointer text-sm shadow-sm"
                    required
                    >
                    <option :value="null" disabled class="text-muted">Select Train</option>
                    <option 
                        v-for="train in trains" 
                        :key="train.id" 
                        :value="train.id"
                        class="bg-surface text-main py-4"
                    >
                        {{ train.train_name }} ({{ train.train_number }})
                    </option>
                    </select>

                    <div class="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-muted group-hover:text-indigo-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" />
                    </svg>
                    </div>
                </div>
            </div>

            <div class="space-y-2 relative group">
                <label class="text-[10px] font-black uppercase text-muted ml-1 tracking-widest">Select Route</label>
                
                <div class="relative">
                    <select 
                    v-model="form.route_id" 
                    class="w-full bg-input border border-transparent hover:border-indigo-500/30 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold text-main appearance-none transition-all cursor-pointer text-sm shadow-sm"
                    required
                    >
                    <option :value="null" disabled>Select Route</option>
                    <option 
                        v-for="route in (routes as any[])" 
                        :key="route.id" 
                        :value="route.id"
                        class="bg-surface text-main py-4"
                    >
                        {{ route.from_station?.station_name }} ➔ {{ route.to_station?.station_name }} ({{ route.distance_km }} km)
                    </option>
                    </select>

                    <div class="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-muted group-hover:text-indigo-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" />
                    </svg>
                    </div>
                </div>
            </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase text-muted ml-1">Reference Number</label>
                    <input 
                        v-model="form.train_number" 
                        type="text" 
                        placeholder="Select a train first..." 
                        class="w-full bg-input border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-main opacity-80" 
                        required 
                    />
                </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase text-muted ml-1">Direction</label>
                <div class="flex bg-input p-1.5 rounded-2xl border border-main">
                  <button type="button" @click="form.direction = 'Up'" :class="form.direction === 'Up' ? 'bg-indigo-600 text-white shadow-md' : 'text-muted'" class="flex-1 py-2 rounded-xl text-xs font-black uppercase transition-all">Up</button>
                  <button type="button" @click="form.direction = 'Down'" :class="form.direction === 'Down' ? 'bg-indigo-600 text-white shadow-md' : 'text-muted'" class="flex-1 py-2 rounded-xl text-xs font-black uppercase transition-all">Down</button>
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase text-muted ml-1">Duration (Minutes)</label>
              <input v-model="form.journey_duration" type="number" placeholder="Duration in minutes" class="w-full bg-input border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-main" />
            </div>

            <div class="space-y-4 border-t border-main pt-6">
                <div class="flex justify-between items-center px-1">
                    <h4 class="text-xs font-black uppercase text-indigo-600 tracking-widest italic">Station Schedules</h4>
                    <button 
                    type="button" 
                    @click="addScheduleRow" 
                    class="text-[10px] font-black bg-indigo-500/10 text-indigo-600 px-3 py-1 rounded-lg hover:bg-indigo-600 hover:text-white transition-all uppercase"
                    >
                    + Add Stop Row
                    </button>
                </div>

                <div class="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                    <div 
                    v-for="(schedule, index) in form.schedules" 
                    :key="index" 
                    class="grid grid-cols-12 gap-3 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 items-end relative group animate-in slide-in-from-right-2"
                    >
                <div class="col-span-4 space-y-1">
                    <label class="text-[9px] font-black text-muted uppercase ml-1">Station</label>
                        <select 
  v-model="schedule.station_id" 
  class="w-full bg-input border-none rounded-xl px-3 py-2 text-xs font-bold text-main focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
  required
>
  <option :value="null" disabled class="bg-white dark:bg-slate-800 text-muted">
    Select Station
  </option>

  <option 
    v-for="station in allStations" 
    :key="station.id" 
    :value="station.id"
    class="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 py-2"
  >
    {{ station.station_name }}
  </option>
</select>
                </div>

                <div class="col-span-3 space-y-1">
                    <label class="text-[9px] font-black text-muted uppercase ml-1">Arrival</label>
                    <input 
                    v-model="schedule.arrival_time" 
                    type="time" 
                    step="1"
                    class="w-full bg-input border-none rounded-xl px-3 py-2 text-xs font-bold text-main focus:ring-2 focus:ring-indigo-500 outline-none" 
                    />
                </div>

                <div class="col-span-3 space-y-1">
                    <label class="text-[9px] font-black text-muted uppercase ml-1">Departure</label>
                    <input 
                    v-model="schedule.departure_time" 
                    type="time" 
                    step="1"
                    class="w-full bg-input border-none rounded-xl px-3 py-2 text-xs font-bold text-main focus:ring-2 focus:ring-indigo-500 outline-none" 
                    />
                </div>

                <div class="col-span-2 flex items-center justify-between pl-2">
                    <div class="text-[10px] font-black text-indigo-500/50 bg-indigo-500/5 w-6 h-6 rounded-full flex items-center justify-center">
                    {{ index + 1 }}
                    </div>
                    <button 
                    type="button" 
                    @click="removeScheduleRow(index)" 
                    class="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    </button>
                </div>
                </div>

                <div v-if="form.schedules.length === 0" class="py-8 text-center border-2 border-dashed border-slate-100 dark:border-white/5 rounded-[2rem]">
                <p class="text-xs font-medium text-muted italic">No stops added yet. Click "+ Add Stop Row" to begin.</p>
                </div>
            </div>
            </div>

            <div class="flex gap-4 pt-6">
              <button @click="closeModal" type="button" class="flex-1 px-6 py-4 rounded-2xl font-black text-xs uppercase text-muted hover:bg-slate-100 dark:hover:bg-white/5 transition-all">Cancel</button>
              <button :disabled="isSubmitting" type="submit" class="flex-[2] bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase shadow-xl hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95">
                {{ isSubmitting ? 'Saving...' : (isEditMode ? 'Update Schedule' : 'Confirm Journey') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-if="isViewModalOpen && selectedJourney" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all">
  <div class="bg-surface w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-main card-shadow overflow-hidden animate-in zoom-in-95 duration-300">
    
    <div class="p-8 pb-4 flex justify-between items-start">
      <div>
        <span class="px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-2 inline-block">
          Journey Schedule Details
        </span>
        <h3 class="text-3xl font-black text-main uppercase tracking-tighter italic">
          {{ selectedJourney.train?.train_name }} <span class="text-indigo-600">#{{ selectedJourney.train_number }}</span>
        </h3>
      </div>
      <button @click="closeViewModal" class="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors text-slate-400">✕</button>
    </div>

    <div class="p-8 pt-0 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
      
      <div class="grid grid-cols-2 gap-4">
        <div class="p-5 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5 text-left">
          <p class="text-[9px] font-black text-muted uppercase tracking-widest mb-1">Route & Distance</p>
          <p class="text-lg font-black text-main leading-tight">{{ selectedJourney.route?.from_station?.station_name }} ➔ {{ selectedJourney.route?.to_station?.station_name }}</p>
          <p class="text-xs font-bold text-indigo-500 mt-1">{{ selectedJourney.route?.distance_km }} KM TOTAL</p>
        </div>
        
        <div class="p-5 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5 text-left">
          <p class="text-[9px] font-black text-muted uppercase tracking-widest mb-1">Direction & Duration</p>
          <div class="flex items-center gap-2">
            <span :class="selectedJourney.direction === 'Up' ? 'text-blue-500' : 'text-orange-500'" class="text-lg font-black uppercase">
              {{ selectedJourney.direction }} {{ selectedJourney.direction === 'Up' ? '▲' : '▼' }}
            </span>
          </div>
          <p class="text-xs font-bold text-indigo-500 mt-1">{{ selectedJourney.journey_duration }} MINS TOTAL</p>
        </div>
      </div>

      <div class="space-y-4">
        <h4 class="text-xs font-black uppercase text-muted tracking-widest ml-1">Full Stop Schedule</h4>
        
        <div class="bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-slate-100 dark:border-white/5 overflow-hidden">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-indigo-600/5 text-[10px] font-black uppercase text-indigo-600 tracking-widest">
                <th class="px-6 py-4">#</th>
                <th class="px-6 py-4">Station</th>
                <th class="px-6 py-4">Arrival</th>
                <th class="px-6 py-4">Departure</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-white/5">
              <tr v-for="(stop, index) in selectedJourney.schedules" :key="index" class="hover:bg-indigo-500/5 transition-colors group">
                <td class="px-6 py-4">
                  <span class="text-[10px] font-black text-muted group-hover:text-indigo-500">{{ +index + 1 }}</span>
                </td>
                <td class="px-6 py-4">
                  <p class="text-sm font-bold text-main">{{ stop.station?.station_name || 'Station ' + stop.station_id }}</p>
                </td>
                <td class="px-6 py-4">
                  <span class="text-xs font-bold p-1.5 bg-green-500/10 text-green-600 rounded-lg">{{ stop.arrival_time }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-xs font-bold p-1.5 bg-blue-500/10 text-blue-600 rounded-lg">{{ stop.departure_time }}</span>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div v-if="!selectedJourney.schedules || selectedJourney.schedules.length === 0" class="p-10 text-center">
            <p class="text-xs font-bold text-muted italic">No stop schedules available for this journey.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="px-8 py-6 bg-slate-50 dark:bg-white/[0.02] border-t border-main flex justify-end">
      <button @click="closeViewModal" class="px-8 py-3 bg-main text-surface rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all">
        Close Details
      </button>
    </div>
  </div>
</div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted,watch } from 'vue';
import { useJourneyStore } from '@/stores/journey';
import { useTrainStore } from '@/stores/train';
import { useRouteStore } from '@/stores/route';
import { useStationStore } from '@/stores/station';

const journeyStore = useJourneyStore();
const trainStore = useTrainStore();
const routeStore = useRouteStore();
const stationStore = useStationStore();

// UI States
const isModalOpen = ref(false);
const isEditMode = ref(false);
const isSubmitting = ref(false);
const currentId = ref<number | null>(null);

// Form State with correct types to avoid TS errors
const form = reactive({
  train_id: null as number | null,
  route_id: null as number | null,
  train_number: '',
  direction: 'Up' as 'Up' | 'Down',
  journey_duration: null as number | null,
  schedules: [] as Array<{
    station_id: number | null;
    arrival_time: string;
    departure_time: string;
    stop_order: number;
  }>
});

const addScheduleRow = () => {
  form.schedules.push({
    station_id: null,
    arrival_time: '',
    departure_time: '',
    stop_order: form.schedules.length + 1
  });
};

const removeScheduleRow = (index: number) => {
  form.schedules.splice(index, 1);
  // Order එක refresh කිරීම
  form.schedules.forEach((s, i) => s.stop_order = i + 1);
};

const resetForm = () => {
  form.train_id = null;
  form.route_id = null;
  form.train_number = '';
  form.direction = 'Up';
  form.journey_duration = null;
  form.schedules = []; // අනිවාර්යයෙන්ම හිස් කරන්න
};

// Initial Data Fetching
onMounted(async () => {
  // සේරම දත්ත එකවර load කරගමු
  await Promise.all([
    journeyStore.fetchJourneys(),
    trainStore.fetchAllTrains(), // මෙතන fetchTrains() වෙනුවට fetchAllTrains() ගන්න
    routeStore.fetchRoutes(),
    stationStore.fetchAllStations()
  ]);
});

// Data from Stores
const journeys = computed(() => journeyStore.journeys);
const trains = computed(() => trainStore.trains);
const routes = computed(() => routeStore.routes);
const allStations = computed(() => stationStore.allStationsForDropdown);

const isViewModalOpen = ref(false);
const selectedJourney = ref<any>(null);

// View Modal එක open කරන function එක
const handleView = (journey: any) => {
  selectedJourney.value = journey;
  isViewModalOpen.value = true;
};

const closeViewModal = () => {
  isViewModalOpen.value = false;
  selectedJourney.value = null;
};

// Modal Management
const openAddModal = () => {
  isEditMode.value = false;
  resetForm();
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  resetForm();
};

const handleEdit = (journey: any) => {
  isEditMode.value = true;
  currentId.value = journey.id;
  Object.assign(form, {
    train_id: journey.train_id,
    route_id: journey.route_id,
    train_number: journey.train_number,
    direction: journey.direction,
    journey_duration: journey.journey_duration,
    // පරණ schedules තිබේ නම් ඒවා load කරමු
    schedules: journey.schedules ? journey.schedules.map((s: any) => ({
      station_id: s.station_id,
      arrival_time: s.arrival_time,
      departure_time: s.departure_time,
      stop_order: s.stop_order
    })) : []
  });
  isModalOpen.value = true;
};

const handleSubmit = async () => {
  if (!form.train_id || !form.route_id) {
    alert("Please select both a Train and a Route.");
    return;
  }

  isSubmitting.value = true;
  try {
    // Backend එකට ඕන JSON format එකට payload එක හදමු
    const payload = {
      train_id: form.train_id,
      route_id: form.route_id,
      train_number: form.train_number,
      direction: form.direction,
      journey_duration: form.journey_duration,
      schedules: form.schedules
    };

    if (isEditMode.value && currentId.value) {
      await journeyStore.updateJourney(currentId.value, payload as any);
    } else {
      await journeyStore.addJourney(payload as any);
    }
    closeModal();
  } catch (error) {
    console.error("Submission error:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this scheduled journey?')) {
    await journeyStore.deleteJourney(id);
  }
};

watch(() => form.train_id, (newId) => {
  if (newId) {
    const selectedTrain = trains.value.find(t => t.id === newId);
    if (selectedTrain) {
      form.train_number = selectedTrain.train_number;
    }
  } else {
    form.train_number = ''; // Train එක අයින් කරොත් number එකත් අයින් කරන්න
  }
});
</script>