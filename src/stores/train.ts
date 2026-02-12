import { defineStore } from 'pinia'
import axios from 'axios'

// 1. Interfaces
interface Train {
  id?: number
  train_number: string
  train_name: string
  train_type: string
  direction: string
  created_at?: string
  updated_at?: string
}

interface Pagination {
  current_page: number
  last_page: number
  total: number
  per_page: number
}

// 2. Store Definition
export const useTrainStore = defineStore('train', {
  state: () => ({
    trains: [] as Train[],
    pagination: null as Pagination | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    allTrains: (state) => state.trains,
    isLoading: (state) => state.loading,
  },

  actions: {
    async fetchTrains(page: number = 1) {
    this.loading = true;
    this.error = null;
    try {
        const response = await axios.get(`/trains?page=${page}`);
        
        // උඹේ Console එකේ පෙන්නන විදිහට response.data කියන්නේම Pagination object එක
        const resData = response.data; 

        if (resData && resData.data) {
            // කෙලින්ම resData.data තමයි Array එක
            this.trains = resData.data; 

            this.pagination = {
                current_page: resData.current_page,
                last_page: resData.last_page,
                total: resData.total,
                per_page: resData.per_page
            };
        } else {
            this.trains = [];
        }
    } catch (err: any) {
        this.error = 'Fleet synchronization failed';
        console.error("Fetch Error:", err);
    } finally {
        this.loading = false;
    }
},

    // දත්ත එකතු කිරීම (Add)
    async addTrain(trainData: Train) {
      this.loading = true
      try {
        const rawToken = localStorage.getItem('token');
        const cleanToken = rawToken ? rawToken.replace(/token|user/g, '').trim() : '';

        const response = await axios.post('/trains', trainData, {
          headers: { Authorization: `Bearer ${cleanToken}` }
        });

        const newTrain = response.data.data || response.data.train || response.data;
        
        if (newTrain && newTrain.id) {
          this.trains.unshift(newTrain);
        }
        
        return response.data;
      } catch (err: any) {
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // දත්ත යාවත්කාලීන කිරීම (Update)
    async updateTrain(id: number, trainData: Train) {
      this.loading = true
      try {
        const response = await axios.put(`/trains/${id}`, trainData)
        const updatedTrain = response.data.data || response.data.train || response.data
        
        const index = this.trains.findIndex(t => t.id === id)
        if (index !== -1 && updatedTrain) {
          this.trains[index] = updatedTrain
        }
        return response.data
      } catch (err: any) {
        throw err
      } finally {
        this.loading = false
      }
    },

    // දත්ත මැකීම (Delete)
    async deleteTrain(id: number) {
      try {
        await axios.delete(`/trains/${id}`)
        this.trains = this.trains.filter(t => t.id !== id)
      } catch (err: any) {
        throw err
      }
    }
  }
})