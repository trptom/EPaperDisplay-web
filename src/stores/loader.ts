import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useLoaderStore = defineStore('loader', () => {
  const loadingLevel = ref(0)
  const loading = computed(() => loadingLevel.value > 0)
  const message = ref<string | null>(null)

  function show(msg?: string | null) {
    message.value = msg ?? null
    loadingLevel.value++
  }

  function hide() {
    loadingLevel.value--
    message.value = null
  }

  return { loading, message, show, hide }
})
