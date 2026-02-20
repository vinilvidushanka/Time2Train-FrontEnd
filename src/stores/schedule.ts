import { defineStore } from 'pinia'
import axios from 'axios'

export const useScheduleStore = defineStore('schedule', {
  state: () => ({
    searchResults: [] as any[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async searchSchedules(fromId: number, toId: number) {
        this.loading = true;
        this.error = null;
        try {
            const response = await axios.get('/search-trains', {
            params: { 
                // Backend එකේ validation එකට ගැලපෙන විදිහට keys වෙනස් කළා
                from_station_id: fromId, 
                to_station_id: toId 
            }
            });

            if (response.data.success) {
            this.searchResults = response.data.data;
            }
        } catch (err: any) {
            this.error = err.response?.data?.message || "සෙවීමේදී දෝෂයක් සිදු විය.";
            console.error("Search error details:", err.response?.data);
        } finally {
            this.loading = false;
        }
        }
  }
})