<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Example: read `id` from the route params using useRoute()
const route = useRoute()
const router = useRouter()

const id = computed(() => route.params.id as string | undefined)

function goBack() {
  router.back()
}
</script>

<template>
  <div class="container mt-5 pt-5">
    <h1>Display</h1>
    <p>
      Route param id: <strong>{{ id }}</strong>
    </p>
    <p>
      Example usage in script: const id = computed(() =&gt; useRoute().params.id as string |
      undefined)
    </p>
    <button class="btn btn-secondary" @click="goBack">Back</button>
  </div>
</template>

<style scoped>
.container {
  max-width: 960px;
}
</style>
