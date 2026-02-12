import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true }
    },
    
    // --- Public/User Pages ---
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/user/AboutView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/schedules',
      name: 'schedules',
      component: () => import('../views/user/SchedulesView.vue'),
      meta: { requiresAuth: true }
    },

    // --- Role Based Dashboards ---
    {
      path: '/super-admin',
      name: 'super-admin-dashboard',
      component: () => import('../views/super-admin/Dashboard.vue'),
      meta: { role: 'super_admin', requiresAuth: true }
    },
    {
      path: '/data-entry',
      name: 'data-entry-dashboard',
      component: () => import('../views/data-entry/Dashboard.vue'),
      meta: { role: 'data_admin', requiresAuth: true }
    },
    {
      path: '/user-dashboard',
      name: 'user-dashboard',
      component: () => import('../views/user/Dashboard.vue'),
      meta: { role: 'user', requiresAuth: true }
    },

    // --- Super Admin - Infrastructure Management ---
    {
      path: '/super-admin/stations',
      name: 'super-admin-stations',
      component: () => import('../views/super-admin/stations/StationLayout.vue'),
      meta: { role: 'super_admin', requiresAuth: true }
    },
    {
      path: '/super-admin/trains',
      name: 'super-admin-trains',
      component: () => import('../views/super-admin/trains/TrainsView.vue'),
      meta: { role: 'super_admin', requiresAuth: true }
    }
  ],
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // භූමිකාව අනුව යොමු කළ යුතු ප්‍රධාන පිටු
  const roleRoutes: Record<string, string> = {
    super_admin: 'super-admin-dashboard',
    data_admin: 'data-entry-dashboard',
    user: 'user-dashboard'
  }

  // 1. Login වෙලා ඉන්න කෙනෙක් ආයේ login page එකට යන එක වැළැක්වීම
  if (to.name === 'login' && authStore.isLoggedIn) {
    const target = roleRoutes[authStore.userRole] || 'user-dashboard'
    return next({ name: target })
  }

  // 2. Login නොවී Auth අවශ්‍ය පිටු වලට යාම වැළැක්වීම
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return next({ name: 'login' })
  }

  // 3. Role Checking
  if (to.meta.role && to.meta.role !== authStore.userRole) {
    const correctDashboard = roleRoutes[authStore.userRole] || 'user-dashboard'
    
    // දැනටමත් ඉන්නේ නිවැරදි Dashboard එකේ නම් redirect කරන්න එපා
    if (to.name === correctDashboard) {
      return next()
    }
    return next({ name: correctDashboard })
  }

  next()
})

export default router