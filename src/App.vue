<script setup lang="ts">
import { RouterView } from 'vue-router'
import MenuBar from './components/MenuBar.vue'
</script>

<template>
  <MenuBar />

  <div class="router">
    <RouterView />
  </div>
</template>

<style scoped>
.router {
  margin-top: var(--navbar-height);
}
</style>
