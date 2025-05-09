import { createRouter, createWebHistory } from 'vue-router'
import SplashScreen from '@/components/SplashScreen.vue'
import LoginScreen from '@/components/LoginScreen.vue'
import Dashboard from '@/pages/Dashboard.vue'
import Categories from '@/pages/Categories.vue'
import { useAuth } from '@/utils/auth'
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: localStorage.getItem('zeno-auth') === 'true',
  }),
  actions: {
    login(username: string, password: string) {
      if (username === 'admin' && password === 'password') {
        this.isAuthenticated = true;
        localStorage.setItem('zeno-auth', 'true');
        return true;
      }
      return false;
    },
    logout() {
      this.isAuthenticated = false;
      localStorage.removeItem('zeno-auth');
    },
  },
});

const routes = [
  { path: '/', component: SplashScreen },
  { path: '/login', component: LoginScreen },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/manage-categories', component: Categories, meta: { requiresAuth: true }},
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const { checkAuth } = useAuth()
  if (to.meta.requiresAuth && !checkAuth()) {
    next('/login')
  } else {
    next()
  }
})

export default router
