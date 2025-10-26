<script setup lang="ts">
import { useLoaderStore } from '@/stores/loader'
import { storeToRefs } from 'pinia'

const loader = useLoaderStore()
const { loading, message } = storeToRefs(loader)
</script>

<template>
  <div
    v-if="loading"
    class="fullscreen-loader"
    role="status"
    aria-live="polite"
    aria-label="Loading"
  >
    <div class="loader-content">
      <div class="spinner-border text-primary" role="status" aria-hidden="true">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div v-if="message" class="loader-message">{{ message }}</div>
    </div>
  </div>
</template>

<style scoped>
.fullscreen-loader {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  z-index: 2000; /* above nav and content */
}
.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
}
.loader-message {
  color: #fff;
  font-size: 0.95rem;
  text-align: center;
  max-width: 80vw;
}
</style>
