import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // LocalStorage එකේ දත්ත තියෙනවා නම් ඒවා මුලින්ම load කරගන්නවා
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    userRole: localStorage.getItem('userRole') || '',
    userEmail: localStorage.getItem('userEmail') || '',
    token: localStorage.getItem('token') || '',
    isAuthenticated: !!localStorage.getItem('token'), 
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.userRole === 'admin' || state.userRole === 'super_admin',
  },

  actions: {
    // Backend එකෙන් ලැබෙන දත්ත මෙතනට pass කරන්න
    setAuthData(user: any, token: string, role: string) {
      this.user = user
      this.userRole = role
      this.userEmail = user.email
      this.token = token
      this.isAuthenticated = true

      // Browser එක වැහුවත් දත්ත මැකෙන්නේ නැති වෙන්න localStorage දානවා
      localStorage.setItem('token', token)
      localStorage.setItem('userRole', role)
      localStorage.setItem('userEmail', user.email)
      localStorage.setItem('user', JSON.stringify(user))
    },

    logout() {
      // ඔක්කොම reset කරනවා
      this.user = null
      this.userRole = ''
      this.userEmail = ''
      this.token = ''
      this.isAuthenticated = false

      // Storage එක සුද්ද කරනවා
      localStorage.clear()
    }
  }
})