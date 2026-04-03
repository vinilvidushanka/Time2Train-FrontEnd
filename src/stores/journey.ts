import { defineStore } from 'pinia';
import axios from 'axios';

// Journey දත්ත වල හැඩය (Interface)
interface Journey {
  id: number;
  train_id: number;
  route_id: number;
  train_number: string;
  direction: 'Up' | 'Down';
  journey_duration: number | null;
  // Relationships
  train?: any;
  route?: any;
}

export const useJourneyStore = defineStore('journey', {
  state: () => ({
    journeys: [] as Journey[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    // 1. සියලුම Journeys ලබා ගැනීම
    async fetchJourneys() {
  this.loading = true;
  try {
    const token = localStorage.getItem('auth_token');
    const response = await axios.get('journeys', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    this.journeys = response.data.data || response.data;
    console.log("Journeys Loaded:", this.journeys);
  } catch (err: any) {
    this.error = 'Failed to load journeys';
    console.error("Store Error:", err.response?.data || err.message);
  } finally {
    this.loading = false;
  }
},

    async addJourney(payload: Omit<Journey, 'id'>) {
      try {
        const response = await axios.post('/journeys', payload);
        this.journeys.push(response.data);
        return response.data;
      } catch (err: any) {
        throw err.response?.data || 'Error creating journey';
      }
    },

    // 3. Journey එකක් Update කිරීම
    async updateJourney(id: number, payload: Partial<Journey>) {
      try {
        const response = await axios.put(`/journeys/${id}`, payload);
        const index = this.journeys.findIndex(j => j.id === id);
        if (index !== -1) {
          this.journeys[index] = response.data;
        }
      } catch (err: any) {
        throw err.response?.data || 'Error updating journey';
      }
    },

    // 4. Journey එකක් Delete කිරීම
    async deleteJourney(id: number) {
      try {
        await axios.delete(`/journeys/${id}`);
        this.journeys = this.journeys.filter(j => j.id !== id);
      } catch (err: any) {
        throw err.response?.data || 'Error deleting journey';
      }
    }
  },

  getters: {
    // Journey ගණන බලාගන්න
    totalJourneys: (state) => state.journeys.length,
    
    // Direction එක අනුව filter කිරීමට (අවශ්‍ය නම්)
    upDirectionJourneys: (state) => state.journeys.filter(j => j.direction === 'Up'),
    downDirectionJourneys: (state) => state.journeys.filter(j => j.direction === 'Down'),
  }
});