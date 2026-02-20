<template>
  <div 
    class="space-y-8 pb-12 max-w-6xl mx-auto px-4 relative min-h-screen transition-all duration-500"
    :class="{ 'filter blur-xl scale-[0.98] pointer-events-none overflow-hidden': isTimelineOpen }"
  >
    <header class="pt-12 text-left">
      <div class="flex items-center gap-3 mb-4">
        <div class="inline-block px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20">
          <span class="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em]">Official Schedules</span>
        </div>
        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{{ currentDay }} • {{ currentDate }}</span>
      </div>
      <h1 class="text-5xl md:text-6xl font-black tracking-tighter text-white leading-none mb-4 uppercase italic">
        Train <span class="text-blue-600 not-italic">Schedules</span>
      </h1>
      <p class="text-slate-400 font-medium italic border-l-2 border-blue-600 pl-4">දිවයින පුරා දිවෙන සියලුම දුම්රිය වේලාවන් සහ සජීවී ප්‍රමාදයන් මෙතැනින් පරීක්ෂා කරන්න.</p>
    </header>

    <section class="bg-[#0f172a]/60 backdrop-blur-xl p-8 rounded-[3rem] border border-white/5 shadow-2xl flex flex-col md:flex-row gap-6 items-end relative z-50">
      <div class="flex-1 w-full space-y-3 relative">
        <label class="text-[11px] font-black uppercase text-slate-500 ml-2 tracking-widest">Departure Station</label>
        <div class="relative group">
          <input 
            v-model="searchQuery.fromText" 
            @focus="showFromDropdown = true; showToDropdown = false"
            @input="showFromDropdown = true"
            type="text" 
            placeholder="Search origin..." 
            class="w-full px-6 py-5 bg-slate-950/50 border border-slate-800 rounded-3xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-white transition-all shadow-inner placeholder:text-slate-700" 
          />
          <Transition name="dropdown">
  <div v-if="showFromDropdown" class="absolute left-0 right-0 top-full mt-3 max-h-72 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-2xl z-[100] p-3 custom-scrollbar backdrop-blur-2xl transition-colors duration-500">
    <div v-if="filteredFromStations.length > 0">
      <div 
        v-for="station in filteredFromStations" :key="station.id"
        @mousedown.prevent="selectStation('from', station)"
        class="px-5 py-4 hover:bg-blue-600 rounded-2xl cursor-pointer group flex items-center justify-between mb-1 transition-all"
      >
        <div class="flex flex-col">
          <span class="font-bold text-slate-900 dark:text-slate-200 group-hover:text-white transition-colors">
            {{ station.station_name }}
          </span>
          <span class="text-[10px] text-slate-500 dark:text-slate-400 uppercase group-hover:text-blue-100 transition-colors">
            {{ station.station_code }}
          </span>
        </div>
        <span class="text-xs text-slate-400 dark:text-slate-600 group-hover:text-white/50">Station</span>
      </div>
    </div>
    <div v-else class="p-8 text-center text-slate-500 italic text-sm">No results found</div>
  </div>
</Transition>
        </div>
      </div>

      <div class="flex-1 w-full space-y-3 relative">
        <label class="text-[11px] font-black uppercase text-slate-500 ml-2 tracking-widest">Arrival Station</label>
        <div class="relative group">
          <input 
            v-model="searchQuery.toText" 
            @focus="showToDropdown = true; showFromDropdown = false"
            @input="showToDropdown = true"
            type="text" 
            placeholder="Search destination..." 
            class="w-full px-6 py-5 bg-slate-950/50 border border-slate-800 rounded-3xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-white transition-all shadow-inner placeholder:text-slate-700" 
          />
          <Transition name="dropdown">
  <div v-if="showToDropdown" class="absolute left-0 right-0 top-full mt-3 max-h-72 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-2xl z-[100] p-3 custom-scrollbar backdrop-blur-2xl transition-colors duration-500">
    <div v-if="filteredToStations.length > 0">
      <div 
        v-for="station in filteredToStations" :key="station.id"
        @mousedown.prevent="selectStation('to', station)"
        class="px-5 py-4 hover:bg-blue-600 rounded-2xl cursor-pointer group flex items-center justify-between mb-1 transition-all"
      >
        <div class="flex flex-col">
          <span class="font-bold text-slate-900 dark:text-slate-200 group-hover:text-white transition-colors">
            {{ station.station_name }}
          </span>
          <span class="text-[10px] text-slate-500 dark:text-slate-400 uppercase group-hover:text-blue-100 transition-colors">
            {{ station.station_code }}
          </span>
        </div>
        <span class="text-xs text-slate-400 dark:text-slate-600 group-hover:text-white/50">Station</span>
      </div>
    </div>
    <div v-else class="p-8 text-center text-slate-500 italic text-sm">No results found</div>
  </div>
</Transition>
        </div>
      </div>

      <button 
        @click="handleSearch" 
        class="w-full md:w-auto px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-3xl font-black text-sm tracking-[0.2em] transition-all active:scale-95 shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] uppercase"
      >
        Search Trains
      </button>
    </section>

    <div class="mt-12 space-y-6">
      <div v-if="isLoading" class="flex flex-col items-center py-24 gap-6">
        <div class="relative w-20 h-20">
          <div class="absolute inset-0 border-4 border-blue-600/20 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p class="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px]">Updating Live Schedules</p>
      </div>

      <div v-else-if="hasSearched && searchResults.length === 0" class="text-center py-32 bg-slate-900/40 rounded-[3rem] border border-dashed border-slate-800">
        <div class="text-6xl mb-6">🛤️</div>
        <h3 class="text-white text-2xl font-black uppercase">No Direct Routes</h3>
        <p class="text-slate-500 mt-2 max-w-xs mx-auto text-sm">සමාවන්න, ඔබ තෝරාගත් ස්ථාන අතර සෘජු ගමන් වාර සොයාගත නොහැකි විය.</p>
      </div>

      <div v-else class="grid grid-cols-1 gap-6">
        <div 
          v-for="journey in searchResults" 
          :key="journey.id"
          class="group bg-slate-900/40 border border-white/5 rounded-[3rem] p-8 hover:bg-slate-900/60 transition-all duration-500 shadow-xl hover:border-blue-500/30"
        >
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div class="flex items-center gap-6">
              <div class="w-20 h-20 bg-slate-800/50 rounded-[2rem] flex items-center justify-center text-3xl shadow-inner border border-white/5">🚂</div>
              <div>
                <div class="flex items-center gap-3 mb-2">
                  <span class="px-3 py-1 bg-blue-600 text-[10px] font-black text-white rounded-lg uppercase tracking-widest">
                    {{ journey.train?.train_no }}
                  </span>
                  <span class="text-xs font-bold text-blue-400 uppercase tracking-widest">{{ journey.train?.train_type }}</span>
                </div>
                <h3 class="text-2xl font-black text-white uppercase tracking-tight">{{ journey.train?.name }}</h3>
                
                <div v-if="journey.live_status && journey.live_status.delay_minutes > 0" class="mt-2 flex items-center gap-3">
                  <div class="flex items-center gap-2 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <span class="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                    <span class="text-red-500 text-[9px] font-black uppercase">+{{ journey.live_status.delay_minutes }}m Delayed</span>
                  </div>
                  <p class="text-slate-500 text-[9px] font-black uppercase tracking-tighter italic">
                    Passed: {{ journey.live_status.current_station?.station_name }}
                  </p>
                </div>
                <p v-else class="text-emerald-500 text-[10px] font-black uppercase mt-2 flex items-center gap-2">
                  <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  Status: Operating On Time
                </p>
              </div>
            </div>

            <div class="flex-1 flex items-center justify-between max-w-lg mx-auto w-full relative group/route">
              <div class="text-center">
                <p class="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-[0.2em]">Departure</p>
                <h4 class="text-3xl font-black text-white font-mono">
                  {{ getStationTime(journey, searchQuery.fromId, 'departure_time') }}
                </h4>
                <p class="text-xs font-bold text-slate-400 mt-1 uppercase">{{ searchQuery.fromText }}</p>
              </div>

              <div class="flex-1 px-8 relative">
                <div class="h-[2px] bg-slate-800 w-full relative">
                  <div class="absolute inset-0 bg-blue-500 scale-x-0 group-hover/route:scale-x-100 transition-transform duration-700 origin-left"></div>
                  <div class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full shadow-[0_0_20px_#2563eb]"></div>
                </div>
              </div>

              <div class="text-center">
                <p class="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-[0.2em]">Arrival</p>
                <h4 class="text-3xl font-black text-white font-mono">
                  {{ getStationTime(journey, searchQuery.toId, 'arrival_time') }}
                </h4>
                <p class="text-xs font-bold text-slate-400 mt-1 uppercase">{{ searchQuery.toText }}</p>
              </div>
            </div>

            <button 
              @click="viewTimeline(journey)"
              class="bg-white text-black hover:bg-blue-600 hover:text-white px-10 py-5 rounded-3xl font-black text-[11px] uppercase transition-all shadow-2xl active:scale-95 whitespace-nowrap tracking-widest"
            >
              Track Journey
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showFromDropdown || showToDropdown" @click="showFromDropdown = false; showToDropdown = false" class="fixed inset-0 z-40 bg-transparent"></div>
  </div>

  <Transition name="modal">
    <div v-if="isTimelineOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8">
      <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl" @click="closeTimeline"></div>

      <div class="relative bg-slate-900 w-full max-w-2xl rounded-[3rem] border border-white/10 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[85vh]">
        
        <div v-if="selectedJourney" class="p-8 md:p-10 border-b border-white/5 bg-white/[0.02] flex justify-between items-start">
  <div class="space-y-2">
    <div class="flex items-center gap-3">
      <span class="px-3 py-1 bg-blue-600/10 text-blue-500 text-[10px] font-black tracking-widest rounded-full border border-blue-500/20 uppercase">
        Real-time Status
      </span>
      <span class="text-slate-500 text-xs font-bold">
        #{{ selectedJourney?.train?.train_number || selectedJourney?.train?.train_no }}
      </span>
    </div>

    <h2 class="text-3xl font-black text-white uppercase italic tracking-tighter">
      {{ selectedJourney?.train?.train_name || selectedJourney?.train?.name }}
    </h2>

    <p class="text-blue-400 text-[10px] font-bold uppercase tracking-widest">
      {{ selectedJourney?.train?.train_type }}
    </p>
  </div>

  <button @click="closeTimeline" class="p-4 bg-white/5 hover:bg-red-500/20 rounded-full transition-all border border-white/5 group">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-500 group-hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
</div>

        <div class="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 space-y-2">
          <div 
            v-for="(stop, index) in selectedJourney?.schedules" 
            :key="stop.id"
            class="relative flex gap-6 group"
          >
            <div class="w-32 pt-1 text-right shrink-0">
              <div class="flex flex-col mb-1">
                <span class="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Schedule</span>
                <span class="text-[11px] font-mono text-white/40 leading-tight" v-if="stop.arrival_time">Arr: {{ stop.arrival_time }}</span>
                <span class="text-[11px] font-mono text-white/40 leading-tight" v-if="stop.departure_time">Dep: {{ stop.departure_time }}</span>
              </div>
            </div>

            <div class="relative flex flex-col items-center">
              <div 
                class="w-4 h-4 rounded-full border-2 z-10 transition-all duration-500"
                :class="[
                  stop.station_id === searchQuery.fromId || stop.station_id === searchQuery.toId 
                    ? 'bg-blue-600 border-white ring-4 ring-blue-600/20 scale-125' 
                    : 'bg-slate-900 border-slate-700'
                ]"
              ></div>
              <div 
                v-if="index !== selectedJourney.schedules.length - 1"
                class="w-[2px] flex-1 bg-gradient-to-b from-slate-700 to-slate-800/20 my-2"
              ></div>
            </div>

            <div class="flex-1 pb-10">
              <div 
                class="p-5 rounded-[2rem] border transition-all duration-300 flex justify-between items-center"
                :class="[
                  stop.station_id === searchQuery.fromId || stop.station_id === searchQuery.toId 
                    ? 'bg-blue-600/10 border-blue-500/30 ring-1 ring-blue-500/20' 
                    : 'bg-slate-800/30 border-white/5'
                ]"
              >
                <div>
                  <h4 class="font-black text-slate-100 text-sm uppercase tracking-wide">{{ stop.station?.station_name }}</h4>
                  <div class="flex gap-2 mt-1">
                    <span v-if="stop.station_id === searchQuery.fromId" class="px-2 py-0.5 bg-blue-600 text-[8px] font-black text-white rounded">BOARDING</span>
                    <span v-if="stop.station_id === searchQuery.toId" class="px-2 py-0.5 bg-emerald-600 text-[8px] font-black text-white rounded">DESTINATION</span>
                  </div>
                </div>

                <div class="text-right">
                  <template v-if="selectedJourney.live_status && selectedJourney.live_status.delay_minutes > 0">
                    <span class="text-[9px] text-red-500 font-black uppercase tracking-tighter block">Expected</span>
                    <div class="flex flex-col">
                        <span v-if="stop.arrival_time" class="text-xs font-black text-red-400 font-mono">
                            {{ calculateEstimatedTime(stop.arrival_time, selectedJourney.live_status.delay_minutes) }}
                        </span>
                        <span v-if="stop.departure_time" class="text-xs font-black text-red-400 font-mono">
                            {{ calculateEstimatedTime(stop.departure_time, selectedJourney.live_status.delay_minutes) }}
                        </span>
                    </div>
                  </template>
                  <template v-else>
                    <span class="text-[9px] text-emerald-500 font-black uppercase tracking-tighter block">Status</span>
                    <span class="text-[10px] font-bold text-emerald-500/70 uppercase">On Time</span>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="p-8 bg-slate-950/50 border-t border-white/5 flex flex-col gap-4">
          <div class="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-4 flex items-center gap-4">
            <div class="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-500 shrink-0">ℹ️</div>
            <p class="text-[10px] font-bold text-slate-400 leading-relaxed uppercase">ප්‍රමාද කාලය අනුව අපේක්ෂිත වේලාවන් (Expected Time) දකුණු පසින් පෙන්වා ඇත.</p>
          </div>
          <button @click="closeTimeline" class="w-full py-4 bg-white text-black hover:bg-blue-600 hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl active:scale-95">
            Dismiss Tracking
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive, watch } from 'vue'
import { useStationStore } from '@/stores/station'
import { useScheduleStore } from '@/stores/schedule'

const stationStore = useStationStore()
const scheduleStore = useScheduleStore()

const hasSearched = ref(false)
const showFromDropdown = ref(false)
const showToDropdown = ref(false)
const isTimelineOpen = ref(false)
const selectedJourney = ref<any>(null)

const searchQuery = reactive({
  fromText: '',
  fromId: null as number | null,
  toText: '',
  toId: null as number | null
})

// Lifecycle
onMounted(async () => {
  await stationStore.fetchAllStations()
})

// Date Helpers
const currentDate = computed(() => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }))
const currentDay = computed(() => new Date().toLocaleDateString('en-GB', { weekday: 'long' }))

// Computed Data
const searchResults = computed(() => scheduleStore.searchResults)
const isLoading = computed(() => scheduleStore.loading)
const allStations = computed(() => stationStore.allStationsForDropdown || [])

const filteredFromStations = computed(() => {
  const query = searchQuery.fromText.toLowerCase().trim()
  if (!query) return allStations.value.slice(0, 10)
  return allStations.value.filter((s: any) => 
    s.station_name?.toLowerCase().includes(query) || 
    s.station_code?.toLowerCase().includes(query)
  )
})

const filteredToStations = computed(() => {
  const query = searchQuery.toText.toLowerCase().trim()
  const baseList = allStations.value.filter((s: any) => s.id !== searchQuery.fromId)
  if (!query) return baseList.slice(0, 10)
  return baseList.filter((s: any) => 
    s.station_name?.toLowerCase().includes(query) || 
    s.station_code?.toLowerCase().includes(query)
  )
})

// Helpers
const getStationTime = (journey: any, stationId: number | null, type: string) => {
  const schedule = journey.schedules.find((s: any) => s.station_id === stationId)
  return schedule ? schedule[type] : '--:--'
}

const calculateEstimatedTime = (baseTime: string, delayMinutes: number) => {
  if (!baseTime || baseTime === '--:--') return '--:--';
  const [hours, minutes] = baseTime.split(':').map(Number);
  const date = new Date();
  date.setHours(hours ?? 0); 
  date.setMinutes((minutes ?? 0) + (delayMinutes || 0));
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
}

const selectStation = (type: 'from' | 'to', station: any) => {
  if (type === 'from') {
    searchQuery.fromText = station.station_name
    searchQuery.fromId = station.id
    showFromDropdown.value = false
  } else {
    searchQuery.toText = station.station_name
    searchQuery.toId = station.id
    showToDropdown.value = false
  }
}

const handleSearch = async () => {
  if (!searchQuery.fromId || !searchQuery.toId) return
  hasSearched.value = true
  await scheduleStore.searchSchedules(searchQuery.fromId, searchQuery.toId)
}

const viewTimeline = (journey: any) => {
  selectedJourney.value = journey
  isTimelineOpen.value = true
}

const closeTimeline = () => {
  isTimelineOpen.value = false
}

watch(isTimelineOpen, (val) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = val ? 'hidden' : 'auto'
  }
})
</script>
