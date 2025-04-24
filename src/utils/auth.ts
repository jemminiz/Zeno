// utils/auth.ts
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const isAuthenticated = ref(localStorage.getItem('zeno-auth') === 'true')

export function useAuth() {
  const router = useRouter()

  function login(username: string, password: string) {
    if (!username || !password) return false
    // Add real validation here if needed

    isAuthenticated.value = true
    localStorage.setItem('zeno-auth', 'true')
    return true
  }

  function logout() {
    isAuthenticated.value = false
    localStorage.removeItem('zeno-auth')
    router.push('/login')
  }

  function checkAuth() {
    return isAuthenticated.value
  }

  return {
    login,
    logout,
    checkAuth,
    isAuthenticated,
  }
}
