<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DisplayService, { type Display } from '@/services/DisplayService'
import router from '@/router'

const displays = ref<Display[]>([])
const loading = ref(false)
const error = ref(false)

async function loadDisplays() {
  loading.value = true
  error.value = false
  try {
    const data = await DisplayService.all()
    displays.value = data ?? []
  } catch (e: unknown) {
    console.error(e)
    error.value = true
  } finally {
    loading.value = false
  }
}

async function addDisplay() {
  const display = await DisplayService.create()

  if (display === null) {
    // TODO Show bootstrap toast message on error.
  } else {
    displays.value.push(display)
  }
}

function onRowClicked(display: Display) {
  router.push({ name: 'display', params: { id: String(display.id) } }).catch((e) => {
    console.error('Failed to navigate to display detail view:', e)
  })
}

onMounted(() => {
  loadDisplays()
})
</script>

<template>
  <div class="container mt-5 pt-5">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h1 class="mb-0">Displays</h1>
        <small class="text-muted">List and manage your displays</small>
      </div>
      <div>
        <button class="btn btn-outline-secondary me-2" @click="addDisplay" :disabled="loading">
          <i class="bi bi-arrow-clockwise"></i>
          Add
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div
        class="spinner-border text-primary"
        role="status"
        aria-hidden="true"
        style="width: 3rem; height: 3rem"
      ></div>
      <div class="mt-3 text-muted">Loading displays…</div>
    </div>

    <div v-else>
      <div v-if="error" class="alert alert-danger">{{ error }}</div>

      <div v-if="displays.length === 0" class="alert alert-info">No displays found.</div>

      <div v-else class="table-responsive">
        <table class="table table-striped table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Model</th>
              <th>Size</th>
              <th>IP Filter</th>
              <th>Token</th>
              <th>Displayed</th>
            </tr>
          </thead>
          <transition-group name="list" tag="tbody">
            <tr v-for="d in displays" :key="d.id" @click="onRowClicked(d)" style="cursor: pointer">
              <td class="text-break">
                <small>{{ d.id }}</small>
              </td>
              <td>{{ d.name }}</td>
              <td>{{ d.model }}</td>
              <td>{{ d.width }} × {{ d.height }}</td>
              <td>
                <span class="badge" :class="d.ip_filter ? 'bg-success' : 'bg-secondary'">
                  {{ d.ip_filter ? 'Enabled' : 'Disabled' }}
                </span>
              </td>
              <td>
                <small class="text-break" :title="d.token">{{ d.token.substring(0, 25) }}...</small>
              </td>
              <td>
                <small class="text-muted">{{ d.displayed }}</small>
              </td>
            </tr>
          </transition-group>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 960px;
}

/* simple enter/leave animation for table rows */
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
.list-enter-active,
.list-leave-active {
  transition: all 220ms ease;
}

/* improve spinner visibility */
.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>
