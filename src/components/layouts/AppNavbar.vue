<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  isAdmin: boolean,
  isDark: boolean
}>()

defineEmits(['toggleTheme', 'logout'])
</script>

<template>
  <header class="floating-header">
    <div class="nav-pill" :class="{ 'light-mode': !isDark }">
      <div class="nav-section left">
        <div class="brand-wrapper">
          <div class="logo-box">🚉</div>
          <span class="brand-title">TIME2TRAIN<span>.</span></span>
        </div>
      </div>

      <div class="nav-section center">
        <nav v-if="!isAdmin" class="nav-links">
          <RouterLink to="/" class="pill-link">Home</RouterLink>
          <RouterLink to="/about" class="pill-link">About</RouterLink>
          <RouterLink to="/schedules" class="pill-link">Schedules</RouterLink>
          <RouterLink to="/contact" class="pill-link">Contact</RouterLink>
        </nav>
        <div v-else class="admin-indicator">
          <span class="dot"></span>
          MANAGEMENT CONSOLE
        </div>
      </div>

      <div class="nav-section right">
        <div class="nav-actions">
          <button 
            @click="$emit('toggleTheme')" 
            class="action-icon-btn" 
            :aria-label="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          >
            <span v-if="isDark">☀️</span>
            <span v-else>🌙</span>
          </button>
          
          <div class="v-divider"></div>

          <button @click="$emit('logout')" class="btn-primary-sm">
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* PROFESSIONAL UI ARCHITECTURE 
  Using fixed positions and flex constraints for stability.
*/
.floating-header {
  position: fixed;
  top: 24px;
  left: 0;
  right: 0;
  padding: 0 40px;
  z-index: 1000;
  display: flex;
  justify-content: center;
  pointer-events: none; /* Allows interaction only with the pill */
}

.nav-pill {
  pointer-events: auto;
  background: rgba(136, 136, 136, 0.75);
  backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 6px 10px 6px 20px;
  border-radius: 100px;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1100px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Light Mode Overrides */
.nav-pill.light-mode {
  background: #bcd4f1;
  border-color: rgba(0, 0, 0, 0.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.nav-section { flex: 1; display: flex; align-items: center; }
.nav-section.center { justify-content: center; }
.nav-section.right { justify-content: flex-end; }

/* --- Brand Identity --- */
.brand-wrapper { display: flex; align-items: center; gap: 12px; }

.logo-box {
  background: #2563eb;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.brand-title {
  font-weight: 800;
  font-size: 1.1rem;
  letter-spacing: -0.5px;
  color: #ffffff;
}
.light-mode .brand-title { color: #0f172a; }
.brand-title span { color: #2563eb; }

/* --- Nav Links --- */
.nav-links { display: flex; gap: 28px; }

.pill-link {
  color: #ffffff;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: 0.3s;
  padding: 4px 0;
}

.pill-link:hover, .pill-link.router-link-active { color: #006eff; }
.light-mode .pill-link { color: #000000; }
.light-mode .pill-link:hover, .light-mode .pill-link.router-link-active { color: #2563eb; }

/* --- Action Group (The Single Line Fix) --- */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: nowrap; /* Ensures buttons never wrap to second line */
}

/* Vertical Divider for clean separation */
.v-divider {
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
}
.light-mode .v-divider { background: rgba(0, 0, 0, 0.05); }

.action-icon-btn {
  background: transparent;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: 0.2s;
  color: inherit;
}
.action-icon-btn:hover { background: rgba(255, 255, 255, 0.05); }
.light-mode .action-icon-btn:hover { background: rgba(0, 0, 0, 0.03); }

.btn-primary-sm {
  background: #2563eb;
  color: #ffffff;
  border: none;
  padding: 8px 18px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.75rem;
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  white-space: nowrap; /* Prevents text within button from wrapping */
}

.btn-primary-sm:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

/* Admin Styling */
.admin-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(37, 99, 235, 0.1);
  padding: 6px 14px;
  border-radius: 50px;
  font-size: 0.7rem;
  font-weight: 800;
  color: #60a5fa;
  letter-spacing: 1px;
}
.light-mode .admin-indicator { background: #eff6ff; color: #2563eb; }

.dot {
  width: 6px;
  height: 6px;
  background: #2563eb;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
}

@media (max-width: 850px) {
  .nav-links { display: none; }
  .floating-header { padding: 0 15px; }
}
</style>