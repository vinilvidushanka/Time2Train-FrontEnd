import { defineStore } from 'pinia'
import axios from 'axios'

interface Route {
  id: number;
  from_station_id: number;
  to_station_id: number;
  from_station_name?: string; // Backend එකෙන් eager load කරනවා නම්
  to_station_name?: string;   // Backend එකෙන් eager load කරනවා නම්
  distance_km: number | string;
}

export const useRouteStore = defineStore('route', {
  state: () => ({
    routes: [] as Route[],
    loading: false,
  }),

  actions: {
    async fetchRoutes() {
  this.loading = true
  try {
    const { data } = await axios.get('/routes')
    // මෙතනදී data.data පාවිච්චි කරන්න (Backend response එක { success: true, data: [] } නිසා)
    this.routes = data.data 
  } catch (error) {
    console.error('Error fetching routes:', error)
  } finally {
    this.loading = false
  }
},

    async addRoute(formData: Omit<Route, 'id'>) {
      try {
        const { data } = await axios.post('/routes', formData)
        this.routes.push(data)
      } catch (error) {
        throw error
      }
    },

    async updateRoute(id: number, updateData: Partial<Route>) {
      try {
        const { data } = await axios.put(`/routes/${id}`, updateData)
        const index = this.routes.findIndex(r => r.id === id)
        if (index !== -1) this.routes[index] = data
      } catch (error) {
        throw error
      }
    },

    async deleteRoute(id: number) {
      try {
        await axios.delete(`/routes/${id}`)
        this.routes = this.routes.filter(r => r.id !== id)
      } catch (error) {
        throw error
      }
    }
  }
})