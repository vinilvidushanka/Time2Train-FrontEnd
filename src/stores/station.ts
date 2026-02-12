import { defineStore } from 'pinia'
import axios from 'axios'

const getToken = () => localStorage.getItem('access_token') || localStorage.getItem('token');

export const useStationStore = defineStore('station', {
  state: () => ({
    stations: [] as any[],
    pagination: null as any,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchStations(page: number = 1) {
      this.loading = true
      try {
        const response = await axios.get(`/stations?page=${page}`, {
          headers: { 'Authorization': `Bearer ${getToken()}` }
        })
        if (response.data.success) {
          this.stations = response.data.data.data
          this.pagination = response.data.data
        }
      } catch (err) {
        this.error = 'දත්ත ලබා ගැනීමට නොහැකි විය.'
      } finally {
        this.loading = false
      }
    },

    async addStation(data: any) {
      const response = await axios.post('/stations', [data], {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      })
      await this.fetchStations(1)
      return response.data
    },

    async updateStation(id: number, data: any) {
    try {
        // PUT වෙනුවට POST පාවිච්චි කරලා, ඇතුළෙන් _method එක PUT විදිහට යවනවා
        const payload = {
        ...data,
        _method: 'PUT' 
        };

        const response = await axios.post(`/stations/${id}`, payload, {
        headers: { 
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
        }
        });

        await this.fetchStations(this.pagination?.current_page || 1);
        return response.data;
    } catch (err) {
        throw err;
    }
    },

    async deleteStation(id: number) {
      const response = await axios.delete(`/stations/${id}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      })
      await this.fetchStations(this.pagination?.current_page || 1)
      return response.data
    }
  }
})