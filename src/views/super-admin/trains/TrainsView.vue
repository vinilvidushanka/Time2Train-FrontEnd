<template>
  <div class="min-h-screen p-4 md:p-12 transition-all duration-500">
    <div class="max-w-[1500px] mx-auto space-y-10">
      
      <header class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-custom-border pb-10">
        <div class="space-y-3">
          <div class="flex items-center gap-4 text-left">
            <div class="w-3 h-10 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)]"></div>
            <h1 class="text-4xl md:text-5xl font-black text-custom-main tracking-tighter uppercase italic leading-none">
              Locomotive <span class="text-blue-600">Fleet</span>
            </h1>
          </div>
          <p class="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em] ml-7 opacity-60 italic text-left">
            Rolling Stock Inventory & Fleet Deployment
          </p>
        </div>

        <div class="flex gap-4 w-full md:w-auto">
          <button @click="trainStore.fetchTrains(1)" class="p-4 bg-custom-card border border-custom-border rounded-2xl text-custom-main shadow-sm hover:rotate-180 transition-all duration-500">
            <span :class="{'animate-spin inline-block': trainStore.loading}">🔄</span>
          </button>
          <button @click="openFormModal()" class="flex-1 md:flex-none bg-slate-900 dark:bg-blue-600 text-white px-10 py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all">
            + Deploy New Train
          </button>
        </div>
      </header>

      <main v-if="!trainStore.loading">
    <div v-if="trainStore.trains.length > 0">
        <TrainTable 
            :trains="trainStore.trains" 
            @view="handleView" 
            @edit="openFormModal" 
            @delete="handleDelete" 
        />
        
        <div class="mt-8 flex justify-between items-center px-4">
             <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Page {{ trainStore.pagination?.current_page }} of {{ trainStore.pagination?.last_page }}
             </p>
             <div class="flex gap-2">
                 <button 
                    :disabled="trainStore.pagination?.current_page === 1"
                    @click="trainStore.fetchTrains(trainStore.pagination!.current_page - 1)"
                    class="px-6 py-2 bg-custom-card border border-custom-border rounded-xl font-bold text-[10px] uppercase disabled:opacity-30">
                    Previous
                 </button>
                 <button 
                    :disabled="trainStore.pagination?.current_page === trainStore.pagination?.last_page"
                    @click="trainStore.fetchTrains(trainStore.pagination!.current_page + 1)"
                    class="px-6 py-2 bg-custom-card border border-custom-border rounded-xl font-bold text-[10px] uppercase disabled:opacity-30">
                    Next
                 </button>
             </div>
        </div>
    </div>
    
    <div v-else class="py-32 text-center border-2 border-dashed border-custom-border rounded-[3rem]">
        <div class="text-6xl mb-6 opacity-20 filter grayscale">🚂</div>
        <h3 class="text-slate-300 font-black uppercase text-sm tracking-[0.4em]">Fleet Archive Empty</h3>
        <p class="text-slate-500 text-[10px] mt-2 font-bold uppercase tracking-widest">No rolling stock records found in the current sector.</p>
    </div>
</main>

<div v-else class="text-center py-32 flex flex-col items-center justify-center">
    <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
    <p class="text-slate-400 font-black uppercase text-xs tracking-[0.3em] animate-pulse">
        Synchronizing fleet database...
    </p>
</div>

    </div>

    <Transition name="modal">
      <div v-if="isViewModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md" @click="isViewModalOpen = false"></div>
        <div class="bg-custom-card w-full max-w-lg rounded-[3rem] shadow-2xl p-10 relative z-10 border border-custom-border text-left">
          <div class="flex flex-col items-center text-center mb-10">
            <div class="w-24 h-24 rounded-[2.5rem] bg-blue-600 text-white flex items-center justify-center text-4xl shadow-2xl mb-6 transform -rotate-6">🚂</div>
            <h3 class="text-4xl font-black text-custom-main uppercase tracking-tighter italic leading-none">{{ selectedTrain?.train_name }}</h3>
            <p class="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] mt-2 italic">Unit #{{ selectedTrain?.train_number }}</p>
          </div>
          <div class="grid grid-cols-2 gap-4 mb-10">
            <div class="p-5 bg-custom-input rounded-3xl border border-custom-border">
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Fleet Type</p>
              <p class="font-bold text-custom-main">{{ selectedTrain?.train_type }}</p>
            </div>
            <div class="p-5 bg-custom-input rounded-3xl border border-custom-border">
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Direction</p>
              <p class="font-bold text-custom-main">{{ selectedTrain?.direction }}</p>
            </div>
          </div>
          <button @click="isViewModalOpen = false" class="w-full py-5 bg-custom-main text-custom-card rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-[0.98] transition-all">Close</button>
        </div>
      </div>
    </Transition>

    <Transition name="modal">
      <div v-if="isFormModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md" @click="isFormModalOpen = false"></div>
        <div class="bg-custom-card w-full max-w-xl rounded-[3rem] shadow-2xl p-10 relative z-10 border border-custom-border">
          <h2 class="text-2xl font-black text-custom-main uppercase italic mb-8">
            {{ form.id ? 'Modify Unit' : 'Deploy New Train' }}
          </h2>
          
          <form @submit.prevent="handleSubmit" class="space-y-5 text-left">
            <div class="grid grid-cols-2 gap-5">
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase text-slate-400 ml-2">Train Number</label>
                <input v-model="form.train_number" type="text" placeholder="e.g. 1001" class="w-full p-4 bg-custom-input border border-custom-border rounded-2xl text-custom-main outline-none focus:border-blue-600 transition-all" required>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase text-slate-400 ml-2">Train Name</label>
                <input v-model="form.train_name" type="text" placeholder="e.g. Udarata Menike" class="w-full p-4 bg-custom-input border border-custom-border rounded-2xl text-custom-main outline-none focus:border-blue-600 transition-all" required>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase text-slate-400 ml-2">Train Type</label>
              <select v-model="form.train_type" class="w-full p-4 bg-custom-input border border-custom-border rounded-2xl text-custom-main outline-none focus:border-blue-600 transition-all appearance-none" required>
                <option value="Express">Express</option>
                <option value="Intercity Express">Intercity Express</option>
                <option value="Night Mail">Night Mail</option>
                <option value="Slow Train">Slow Train</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase text-slate-400 ml-2">Direction</label>
              <input v-model="form.direction" type="text" placeholder="e.g. Colombo - Badulla" class="w-full p-4 bg-custom-input border border-custom-border rounded-2xl text-custom-main outline-none focus:border-blue-600 transition-all" required>
            </div>

            <div class="flex gap-4 pt-4">
              <button type="button" @click="isFormModalOpen = false" class="flex-1 py-4 bg-slate-100 dark:bg-white/5 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest">Cancel</button>
              <button type="submit" :disabled="trainStore.loading" class="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
                {{ trainStore.loading ? 'Processing...' : (form.id ? 'Save Changes' : 'Confirm Deployment') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import TrainTable from '@/views/super-admin/trains/TrainTable.vue'
import { useTrainStore } from '@/stores/train'

const trainStore = useTrainStore()

// Modals State
const isViewModalOpen = ref(false)
const isFormModalOpen = ref(false)
const selectedTrain = ref<any>(null)

// Form State
const form = reactive({
  id: null as number | null,
  train_number: '',
  train_name: '',
  train_type: 'Express',
  direction: ''
})

// Functions
const handleView = (train: any) => {
  selectedTrain.value = train
  isViewModalOpen.value = true
}

const openFormModal = (train: any = null) => {
  if (train) {
    // Edit Mode
    form.id = train.id
    form.train_number = train.train_number
    form.train_name = train.train_name
    form.train_type = train.train_type
    form.direction = train.direction
  } else {
    // Add Mode
    form.id = null
    form.train_number = ''
    form.train_name = ''
    form.train_type = 'Express'
    form.direction = ''
  }
  isFormModalOpen.value = true
}

const handleSubmit = async () => {
  try {
    if (form.id) {
      await trainStore.updateTrain(form.id, { ...form } as any)
    } else {
      // id එක අයින් කරලා අලුත් train එකක් විදිහට යවමු
      const payload = {
        train_number: form.train_number,
        train_name: form.train_name,
        train_type: form.train_type,
        direction: form.direction
      }
      await trainStore.addTrain(payload as any)
    }
    
    isFormModalOpen.value = false
    
    // ⭐ අලුත් data table එකට එන්න නම් ආයෙත් fetch කරන්න
    await trainStore.fetchTrains(trainStore.pagination?.current_page || 1)
    
  } catch (error) {
    console.error('Submit Error:', error)
    alert('ගනුදෙනුව අසාර්ථකයි! කරුණාකර නැවත උත්සාහ කරන්න.')
  }
}

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to decommission this unit?')) {
    try {
      await trainStore.deleteTrain(id)
    } catch (err) {
      alert('Delete failed!')
    }
  }
}

onMounted(() => {
  trainStore.fetchTrains(1)
})
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.9) translateY(40px); }
</style>