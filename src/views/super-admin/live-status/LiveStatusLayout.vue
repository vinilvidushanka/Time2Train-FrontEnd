<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useJourneyStore } from '@/stores/journey';
import { useTrainStore } from '@/stores/train';
import { useStationStore } from '@/stores/station';
import axios from 'axios';

const journeyStore = useJourneyStore();
const trainStore = useTrainStore();
const stationStore = useStationStore();

// UI States
const isSubmitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

// Form State
const form = reactive({
  train_id: null as number | null,
  journey_id: null as number | null,
  current_station_id: null as number | null,
  actual_departure: '',
});

// Data Fetching
onMounted(async () => {
  await Promise.all([
    journeyStore.fetchJourneys(),
    trainStore.fetchAllTrains(), 
    stationStore.fetchAllStations()
  ]);
});

// Computeds for Dropdowns
const trains = computed(() => trainStore.trains);
const allStations = computed(() => stationStore.allStationsForDropdown);
const activeJourneys = ref<any[]>([]);

// Filter journeys based on selected train
watch(() => form.train_id, (newTrainId) => {
  if (newTrainId) {
    errorMessage.value = '';
    activeJourneys.value = journeyStore.journeys.filter(j => j.train_id === newTrainId);
  } else {
    activeJourneys.value = [];
    form.journey_id = null;
  }
});

const handleSubmit = async () => {
  if (!form.train_id || !form.journey_id || !form.current_station_id || !form.actual_departure) {
    errorMessage.value = "Please fill all required fields.";
    return;
  }

  isSubmitting.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    const response = await axios.post('/api/live-status/update', form);
    
    if (response.data.success) {
      successMessage.value = 'Live status updated successfully!';
      form.actual_departure = ''; 
    } else {
      errorMessage.value = response.data.message || 'Failed to update status.';
    }
  } catch (error: any) {
    console.error("Submission error:", error);
    if (error.response && error.response.data) {
        errorMessage.value = error.response.data.message || 'An error occurred.';
    } else {
        errorMessage.value = 'Failed to connect to the server.';
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="space-y-8 p-6 animate-in fade-in duration-700">
    <div class="flex justify-between items-end text-left">
      <div class="space-y-3">
        <div class="flex items-center gap-4 text-left">
          <div class="w-3 h-10 bg-emerald-600 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)]"></div>
          <h1 class="text-4xl md:text-5xl font-black text-main tracking-tighter uppercase italic leading-none">
            Live Status <span class="text-emerald-600">Updater</span>
          </h1>
        </div>
        <p class="text-muted text-sm font-medium italic mt-2">Update real-time departure and calculate delays.</p>
      </div>
    </div>

    <div class="max-w-3xl mx-auto bg-surface rounded-[2.5rem] shadow-2xl border border-main card-shadow overflow-visible">
      <div class="p-8">
        
        <div class="flex justify-between items-start mb-10 text-left pb-6 border-b border-main">
          <div>
            <h3 class="text-2xl font-black text-main uppercase tracking-tighter flex items-center gap-3">
              <span class="text-xl">📡</span> Send Real-time Update
            </h3>
            <p class="text-muted text-sm font-medium mt-1">Select the train and station to report current departure.</p>
          </div>
          <div v-if="isSubmitting" class="text-emerald-500 font-bold text-xs animate-pulse">Syncing...</div>
        </div>

        <div v-if="successMessage" class="mb-6 p-4 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-sm font-bold text-left animate-in fade-in">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="mb-6 p-4 rounded-xl bg-rose-500/10 text-rose-600 border border-rose-500/20 text-sm font-bold text-left animate-in fade-in">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleSubmit" class="flex flex-col text-left space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            <div class="space-y-2 relative group col-span-2">
              <label class="text-[10px] font-black uppercase text-muted ml-1 tracking-widest">Select Train</label>
              <div class="relative">
                <select v-model="form.train_id" class="w-full bg-input border border-transparent hover:border-emerald-500/30 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-emerald-500/10 outline-none font-bold text-main appearance-none transition-all cursor-pointer text-sm shadow-sm">
                  <option :value="null" disabled>Choose a train...</option>
                  <option v-for="train in trains" :key="train.id" :value="train.id">{{ train.train_name }} ({{ train.train_number }})</option>
                </select>
                <div class="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-muted group-hover:text-emerald-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div class="space-y-2 relative group">
              <label class="text-[10px] font-black uppercase text-muted ml-1 tracking-widest">Active Journey</label>
              <div class="relative">
                <select v-model="form.journey_id" :disabled="!form.train_id" class="w-full bg-input border border-transparent hover:border-emerald-500/30 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-emerald-500/10 outline-none font-bold text-main appearance-none transition-all cursor-pointer text-sm shadow-sm disabled:opacity-60">
                  <option :value="null" disabled>Select Journey</option>
                  <option v-for="journey in activeJourneys" :key="journey.id" :value="journey.id">
                    #{{ journey.train_number }} ({{ journey.route?.from_station?.station_code }} ➔ {{ journey.route?.to_station?.station_code }})
                  </option>
                </select>
                <div class="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-muted group-hover:text-emerald-500">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            <div class="space-y-2 relative group">
              <label class="text-[10px] font-black uppercase text-muted ml-1 tracking-widest">Reporting Station</label>
              <div class="relative">
                <select v-model="form.current_station_id" class="w-full bg-input border border-transparent hover:border-emerald-500/30 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-emerald-500/10 outline-none font-bold text-main appearance-none transition-all cursor-pointer text-sm shadow-sm">
                  <option :value="null" disabled>Select Station</option>
                  <option v-for="station in allStations" :key="station.id" :value="station.id">{{ station.station_name }}</option>
                </select>
                <div class="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-muted group-hover:text-emerald-500">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            <div class="space-y-2 col-span-2 border-t border-main pt-6">
              <label class="text-[10px] font-black uppercase text-muted ml-1 tracking-widest">Actual Departure Time</label>
              <input v-model="form.actual_departure" type="time" step="1" class="w-full bg-input border border-transparent hover:border-emerald-500/30 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-emerald-500/10 outline-none font-bold text-main text-sm" required />
            </div>
          </div>

          <button :disabled="isSubmitting" type="submit" class="w-full bg-emerald-600 text-white px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.15em] shadow-xl hover:bg-emerald-700 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-3">
            <span v-if="!isSubmitting">Update Real-Time Status 📡</span>
            <span v-else class="animate-pulse">Syncing to Server...</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-surface { backdrop-filter: blur(16px); }
</style>