import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const email = ref('')
  const name = ref('')
  const isLoggedIn = ref(false)

  function logIn(userEmail: string, userName: string) {
    email.value = userEmail
    name.value = userName
    isLoggedIn.value = true
  }

  function logOut() {
    email.value = ''
    name.value = ''
    isLoggedIn.value = false
  }

  return { email, name, isLoggedIn, logIn, logOut }
})
