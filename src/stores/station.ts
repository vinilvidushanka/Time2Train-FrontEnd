import { defineStore } from 'pinia'
import axios from 'axios'

const getToken = () => localStorage.getItem('access_token') || localStorage.getItem('token');

export const useStationStore = defineStore('station', {
  state: () => ({
    stations: [] as any[],
    pagination: null as any,
    loading: false,
    error: null as string | null,
    allStationsForDropdown: [] as any[],
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

    async fetchAllStations() {
      try {
        const response = await axios.get('/stations?all=true', {
          headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        
        if (response.data.success) {
          const resData = response.data.data;

          // මෙතනදී අපි check කරනවා එන දත්ත කෙලින්ම Array එකක්ද කියලා.
          // 1. Array එකක් නම් (all=true නිසා) -> කෙලින්ම assign කරනවා.
          // 2. Paginated object එකක් නම් -> resData.data ඇතුළේ ඇති Array එක ගන්නවා.
          if (Array.isArray(resData)) {
            this.allStationsForDropdown = resData;
          } else if (resData && Array.isArray(resData.data)) {
            this.allStationsForDropdown = resData.data;
          } else {
            this.allStationsForDropdown = [];
          }
        }
      } catch (err) {
        this.allStationsForDropdown = [];
        console.error('Fetch all stations error:', err);
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