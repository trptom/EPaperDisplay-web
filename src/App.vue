<script setup lang="ts">
import { RouterView } from 'vue-router'
import MenuBar from './components/MenuBar.vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'

const userStore = useUserStore()
const { initialized: userInitialized } = storeToRefs(userStore)

const initialized = computed(() => userInitialized.value)

onMounted(() => {
  userStore.init()
})
</script>

<template>
  <template v-if="initialized">
    <MenuBar />

    <div class="router">
      <RouterView />
    </div>
  </template>
  <template v-else>
    <div class="d-flex justify-content-center align-items-center" style="height: 100vh">
      <div class="spinner-border" role="status" aria-label="Loading">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </template>
</template>

<style scoped>
.router {
  margin-top: var(--navbar-height);
}
</style>
