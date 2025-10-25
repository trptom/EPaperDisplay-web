import { ref } from 'vue'
import { defineStore } from 'pinia'
import AuthService from '@/services/AuthService'

export const useUserStore = defineStore('user', () => {
  const initialized = ref(false)
  const email = ref('')
  const name = ref('')
  const isLoggedIn = ref(false)

  async function init() {
    if (initialized.value) return

    await refresh()

    initialized.value = true
  }

  async function refresh() {
    const user = await AuthService.getUser()
    if (user) {
      email.value = user.email
      name.value = user.name
      isLoggedIn.value = true
    } else {
      email.value = ''
      name.value = ''
      isLoggedIn.value = false
    }
  }

  async function logIn(userEmail: string, userName: string) {
    // TODO call AuthService.

    email.value = userEmail
    name.value = userName
    isLoggedIn.value = true
  }

  async function logOut() {
    const result = await AuthService.logOut()

    if (result == null) {
      // We don't know status, so check if we are logged in.
      refresh()
    } else {
      email.value = ''
      name.value = ''
      isLoggedIn.value = false
    }
  }

  return { initialized, email, name, isLoggedIn, init, refresh, logIn, logOut }
})
