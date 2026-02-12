<template>
  <div class="space-y-8 p-6">
    <div class="flex justify-between items-end text-left">
      <div>
        <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic leading-none">Railway Stations</h2>
        <p class="text-slate-500 text-sm font-medium italic mt-2">Control center for network hubs</p>
      </div>
      <div class="flex gap-3">
        <button @click="stationStore.fetchStations(1)" class="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl hover:bg-slate-200 transition-all active:scale-90">
          <span :class="{'animate-spin inline-block': loading}">🔄</span>
        </button>
        <button @click="openAddModal" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center gap-2 uppercase tracking-widest">
          <span>+ Add New Station</span>
        </button>
      </div>
    </div>

    <div class="space-y-6">
      <StationTable :stations="stations" @view="handleView" @edit="handleEdit" @delete="handleDelete" />
      
      <div v-if="pagination && pagination.last_page > 1" class="flex items-center justify-between bg-white dark:bg-white/5 p-4 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
        <span class="text-xs font-bold text-slate-500 uppercase">Page {{ pagination.current_page }} of {{ pagination.last_page }}</span>
        <div class="flex gap-2">
          <button @click="changePage(pagination.current_page - 1)" :disabled="pagination.current_page === 1" class="px-5 py-2.5 bg-slate-100 dark:bg-white/5 rounded-xl disabled:opacity-30 text-xs font-black uppercase tracking-widest">Prev</button>
          <button @click="changePage(pagination.current_page + 1)" :disabled="pagination.current_page === pagination.last_page" class="px-5 py-2.5 bg-blue-600 text-white rounded-xl disabled:opacity-30 text-xs font-black uppercase tracking-widest">Next</button>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10">
        <div class="p-8">
          <div class="flex justify-between items-start mb-8 text-left">
            <div>
              <h3 class="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{{ isEditMode ? 'Update Station' : 'Add New Hub' }}</h3>
              <p class="text-slate-500 text-sm font-medium">Please enter station details accurately.</p>
            </div>
            <button @click="isModalOpen = false" class="text-slate-400 hover:text-slate-600">✕</button>
          </div>

          <form @submit.prevent="handleSubmit" class="grid grid-cols-2 gap-6 text-left">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase text-slate-400 ml-1">Station Name</label>
              <input v-model="form.station_name" required type="text" placeholder="Colombo Fort" class="w-full bg-slate-50 dark:bg-white/5 border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800 dark:text-white">
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase text-slate-400 ml-1">Station Code</label>
              <input v-model="form.station_code" required type="text" placeholder="FOT" class="w-full bg-slate-50 dark:bg-white/5 border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800 dark:text-white uppercase">
            </div>
            <div class="space-y-2 text-left">
              <label class="text-[10px] font-black uppercase text-slate-400 ml-1">District</label>
              <input v-model="form.district" type="text" class="w-full bg-slate-50 dark:bg-white/5 border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800 dark:text-white">
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase text-slate-400 ml-1">Line</label>
              <input v-model="form.line" type="text" class="w-full bg-slate-50 dark:bg-white/5 border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800 dark:text-white">
            </div>

            <div class="col-span-2 py-4">
              <p class="text-[10px] font-black uppercase text-slate-400 mb-4 ml-1">Facilities</p>
              <div class="flex flex-wrap gap-3">
                <label v-for="(label, key) in facilityOptions" :key="key" 
                  class="flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer border border-transparent transition-all"
                  :class="form[key] ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-500/30 text-blue-600' : 'bg-slate-50 dark:bg-white/5 text-slate-500'">
                  <input type="checkbox" v-model="form[key]" class="hidden">
                  <span class="text-xs font-bold">{{ label }}</span>
                </label>
              </div>
            </div>

            <div class="col-span-2 flex gap-3 pt-4">
              <button @click="isModalOpen = false" type="button" class="flex-1 px-6 py-4 rounded-2xl font-black text-xs uppercase text-slate-500 hover:bg-slate-100 transition-all">Cancel</button>
              <button :disabled="isSubmitting" type="submit" class="flex-[2] bg-blue-600 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase shadow-xl hover:bg-blue-700 disabled:opacity-50 transition-all">
                {{ isSubmitting ? 'Processing...' : (isEditMode ? 'Update Station' : 'Confirm & Save') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-if="isViewModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
        <div class="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] shadow-2xl p-10 text-left relative">
            <button @click="isViewModalOpen = false" class="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-white/5 rounded-full hover:bg-slate-200 transition-all">✕</button>
            
            <div class="flex items-center gap-5 mb-8">
                <div class="w-20 h-20 rounded-3xl bg-blue-600 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-blue-600/30">
                    {{ selectedStation?.station_code }}
                </div>
                <div>
                    <h3 class="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
                        {{ selectedStation?.station_name }}
                    </h3>
                    <p class="text-blue-600 font-bold text-sm mt-1 uppercase italic">
                        {{ selectedStation?.line }} Line
                    </p>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-10">
                <div class="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">District</p>
                    <p class="font-bold text-slate-800 dark:text-slate-200">{{ selectedStation?.district }}</p>
                </div>
                <div class="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contact</p>
                    <p class="font-bold text-slate-800 dark:text-slate-200">{{ selectedStation?.contact_number || 'Not Available' }}</p>
                </div>
            </div>

            <div class="mb-10">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Available Facilities</p>
                <div class="flex flex-wrap gap-2">
                    <span v-for="(label, key) in facilityOptions" :key="key" 
                        v-show="selectedStation && selectedStation[key]"
                        class="px-3 py-1.5 bg-green-50 dark:bg-green-500/10 text-green-600 text-[10px] font-bold rounded-lg border border-green-200 dark:border-green-500/20">
                        {{ label }}
                    </span>
                </div>
            </div>

            <button @click="isViewModalOpen = false" class="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase text-xs tracking-widest hover:opacity-90 transition-all">
                Close View
            </button>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, reactive } from 'vue'
import { useStationStore } from '@/stores/station'
import StationTable from './StationTable.vue'

const stationStore = useStationStore()
const isModalOpen = ref(false)
const isViewModalOpen = ref(false)
const isEditMode = ref(false)
const isSubmitting = ref(false)
const currentId = ref<number | null>(null)
const selectedStation = ref<any>(null)

const facilityOptions = {
  has_parking: '🅿️ Parking',
  has_restroom: '🚻 Restroom',
  has_canteen: '☕ Canteen',
  has_waiting_room: '🛋️ Waiting',
  has_ticketing_machine: '🎟️ Tickets'
}

const form = reactive<any>({
  station_name: '', station_code: '', district: '', line: '', contact_number: '',
  has_parking: false, has_restroom: false, has_canteen: false, has_waiting_room: false, has_ticketing_machine: false
})

const openAddModal = () => {
  isEditMode.value = false; currentId.value = null; resetForm(); isModalOpen.value = true;
}

const handleEdit = (station: any) => {
  isEditMode.value = true;
  currentId.value = station.id;
  // දත්ත පිරවීමේදී අනිවාර්යයෙන්ම Boolean අගයන් ලබා දෙන්න (Database එකෙන් 0/1 එන්න පුළුවන් නිසා)
  Object.assign(form, {
    station_name: station.station_name,
    station_code: station.station_code,
    district: station.district,
    line: station.line,
    contact_number: station.contact_number,
    has_parking: !!Number(station.has_parking),
    has_restroom: !!Number(station.has_restroom),
    has_canteen: !!Number(station.has_canteen),
    has_waiting_room: !!Number(station.has_waiting_room),
    has_ticketing_machine: !!Number(station.has_ticketing_machine)
  });
  isModalOpen.value = true;
}

const resetForm = () => {
  Object.assign(form, { station_name: '', station_code: '', district: '', line: '', contact_number: '', has_parking: false, has_restroom: false, has_canteen: false, has_waiting_room: false, has_ticketing_machine: false });
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    // යවන්න ඕන දත්ත ටික විතරක් වෙන් කරලා ගමු
    const submitData = {
      station_name: form.station_name,
      station_code: form.station_code,
      district: form.district,
      line: form.line,
      contact_number: form.contact_number,
      has_parking: form.has_parking ? 1 : 0,
      has_restroom: form.has_restroom ? 1 : 0,
      has_canteen: form.has_canteen ? 1 : 0,
      has_waiting_room: form.has_waiting_room ? 1 : 0,
      has_ticketing_machine: form.has_ticketing_machine ? 1 : 0,
    };

    if (isEditMode.value && currentId.value) {
      await stationStore.updateStation(currentId.value, submitData);
    } else {
      // Add කරද්දීත් submitData එකම පාවිච්චි කරන්න
      await stationStore.addStation(submitData);
    }

    isModalOpen.value = false;
    resetForm();
    alert("සාර්ථකව සුරැකුණා!");
  } catch (err: any) {
    // ඇත්තම error එක console එකේ Network tab එකේ 'Response' එකේ බලන්න
    console.error("API Error Detail:", err);
    alert("ක්‍රියාවලිය අසාර්ථකයි. කරුණාකර නැවත උත්සාහ කරන්න.");
  } finally {
    isSubmitting.value = false;
  }
}

// ... අනෙක් function කලින් ලෙසම ...
const handleDelete = async (id: number) => {
  if (confirm('මෙම Station එක ඉවත් කිරීමට ඔබට සහතිකද?')) {
    try { await stationStore.deleteStation(id); } catch (e) { alert('ඉවත් කිරීම අසාර්ථකයි.'); }
  }
}
const handleView = (station: any) => { selectedStation.value = station; isViewModalOpen.value = true; }
const stations = computed(() => stationStore.stations)
const loading = computed(() => stationStore.loading)
const pagination = computed(() => stationStore.pagination)
onMounted(() => stationStore.fetchStations(1))
const changePage = (p: number) => stationStore.fetchStations(p)
</script>