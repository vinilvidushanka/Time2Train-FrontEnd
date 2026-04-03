<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useJourneyStore } from '@/stores/journey';
import { useTrainStore } from '@/stores/train';
import { useStationStore } from '@/stores/station';
import axios from 'axios';

const journeyStore = useJourneyStore();
const trainStore = useTrainStore();
const stationStore = useStationStore();

const isSubmitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

// Form State
const form = reactive({
  train_id: null as number | null,
  journey_id: null as number | null,
  current_station_id: null as number | null,
  actual_departure: '',
  status_date: new Date().toISOString().substr(0, 10)
});

// Data Fetching - Auth Token එක අවශ්‍ය බව මතක තබා ගන්න
onMounted(async () => {
  try {
    await Promise.all([
      journeyStore.fetchJourneys(),
      trainStore.fetchAllTrains(), 
      stationStore.fetchAllStations()
    ]);
  } catch (error) {
    console.error("Initial data fetch failed", error);
  }
});

const trains = computed(() => trainStore.trains);
const allStations = computed(() => stationStore.allStationsForDropdown);

/**
 * FIXED: Active Journeys Filter
 * Backend එකෙන් එන දත්ත Structure එකට අනුව filter එක මෙසේ විය යුතුය.
 */
const activeJourneys = computed(() => {
  if (!form.train_id || !journeyStore.journeys) return [];
  
  return journeyStore.journeys.filter(j => {
    // Laravel එකෙන් train_id හෝ train object එකේ id එක තිබේදැයි බලයි
    const jTrainId = j.train_id ?? j.train?.id;
    return Number(jTrainId) === Number(form.train_id);
  });
});

// Train වෙනස් කරන විට journey එක reset කරයි
watch(() => form.train_id, () => {
  form.journey_id = null;
  errorMessage.value = '';
  successMessage.value = '';
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
    // 1. URL එක නිවැරදි කරන ලදී: 'train-status/update' (ඔබේ php route එකට අනුව)
    // 2. Token එක ලබා ගන්න (උදා: localStorage හෝ authStore එකෙන්)
    const token = localStorage.getItem('auth_token'); 

    const response = await axios.post('train-status/update', form, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (response.data) {
      successMessage.value = "Train status updated successfully! 🚀";
      form.actual_departure = ''; // Time එක reset කරයි
    }
  } catch (error: any) {
    // 404 හෝ 401 වැරදි පරීක්ෂා කරයි
    if (error.response?.status === 404) {
      errorMessage.value = "API route not found. Check if '/api/v1/' is correct in BaseURL.";
    } else {
      errorMessage.value = error.response?.data?.message || 'Update failed. Please try again.';
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-6 space-y-10 text-left animate-in fade-in duration-500">
    <div class="bg-surface rounded-[2.5rem] border border-main p-8 shadow-2xl relative overflow-hidden">
      
      <h2 class="text-3xl font-black text-main mb-8 tracking-tighter uppercase italic">
        Real-time <span class="text-emerald-600">Sync</span>
      </h2>

      <div v-if="successMessage" class="mb-6 p-4 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-2xl font-bold">
        ✅ {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="mb-6 p-4 bg-rose-500/10 text-rose-600 border border-rose-500/20 rounded-2xl font-bold">
        ❌ {{ errorMessage }}
      </div>

      <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div class="space-y-2 md:col-span-2">
          <label class="text-[10px] font-black uppercase text-muted tracking-widest ml-1">Reporting Date</label>
          <input v-model="form.status_date" type="date" class="w-full bg-input border border-transparent focus:border-emerald-500/50 rounded-2xl px-5 py-4 font-bold text-main outline-none transition-all" />
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase text-muted tracking-widest ml-1">Select Train</label>
          <select v-model="form.train_id" class="w-full bg-input border border-transparent rounded-2xl px-5 py-4 font-bold text-main outline-none cursor-pointer appearance-none">
            <option :value="null" disabled>Choose Train...</option>
            <option v-for="t in trains" :key="t.id" :value="t.id">{{ t.train_name }} ({{ t.train_number }})</option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase text-muted tracking-widest ml-1">Active Journey</label>
          <select v-model="form.journey_id" :disabled="!form.train_id" class="w-full bg-input border border-transparent rounded-2xl px-5 py-4 font-bold text-main outline-none disabled:opacity-50 appearance-none">
            <option :value="null" disabled>Select Journey</option>
            <option v-for="j in activeJourneys" :key="j.id" :value="j.id">
              #{{ j.id }} | {{ j.route?.from_station?.station_code ?? 'ST' }} ➔ {{ j.route?.to_station?.station_code ?? 'ST' }}
            </option>
          </select>
          <p v-if="form.train_id && activeJourneys.length === 0" class="text-rose-500 text-[10px] font-bold mt-1 uppercase">No journeys found for this train.</p>
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase text-muted tracking-widest ml-1">Current Station</label>
          <select v-model="form.current_station_id" class="w-full bg-input border border-transparent rounded-2xl px-5 py-4 font-bold text-main outline-none appearance-none">
            <option :value="null" disabled>Select Station</option>
            <option v-for="s in allStations" :key="s.id" :value="s.id">{{ s.station_name }}</option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase text-muted tracking-widest ml-1">Actual Departure</label>
          <input v-model="form.actual_departure" type="time" step="1" class="w-full bg-input border border-transparent rounded-2xl px-5 py-4 font-bold text-main outline-none" required />
        </div>

        <div class="md:col-span-2 pt-4">
          <button :disabled="isSubmitting" type="submit" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-2xl uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
            <span v-if="!isSubmitting">Update Status 🚀</span>
            <span v-else class="animate-pulse flex items-center gap-2">Syncing Data...</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.bg-surface { backdrop-filter: blur(16px); background-color: rgba(15, 23, 42, 0.9); }
.bg-input { background-color: rgba(255, 255, 255, 0.05); }
select option { background-color: #0f172a; color: white; }
</style>