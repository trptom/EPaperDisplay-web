<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DashboardService from '../services/DashboardService'
import type { Dashboard } from '../services/DashboardService'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const dashboard = ref<Dashboard | null>(null)
const loading = ref(true)
const error = ref(false)

async function load() {
  loading.value = true
  error.value = false
  try {
    const data = await DashboardService.public()
    dashboard.value = data
  } catch (e) {
    console.error(e)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="card d-flex justify-content-between align-items-center mb-3">
    <div>
      <h1 class="mb-0">{{ t('publicDashboard.header') }}</h1>
      <small class="text-muted">{{ t('publicDashboard.subheader') }}</small>
    </div>
  </div>

  <div v-if="loading" class="alert alert-secondary">{{ t('publicDashboard.loading') }}</div>
  <div v-else-if="error || dashboard == null" class="alert alert-danger">
    {{ t('publicDashboard.error') }}
  </div>
  <div v-if="!dashboard" class="alert alert-info">{{ t('publicDashboard.empty') }}</div>

  <div v-else class="table-responsive">
    <table class="table table-striped table-hover align-middle">
      <transition-group name="list" tag="tbody">
        <tr key="usersCount">
          <td class="text-break">{{ t('publicDashboard.usersCount') }}</td>
          <td>{{ dashboard.usersCount ?? '-' }}</td>
        </tr>
        <tr key="displaysCount">
          <td class="text-break">{{ t('publicDashboard.displaysCount') }}</td>
          <td>{{ dashboard.displaysCount ?? '-' }}</td>
        </tr>
        <tr key="modulesCount">
          <td class="text-break">{{ t('publicDashboard.modulesCount') }}</td>
          <td>{{ dashboard.modulesCount ?? '-' }}</td>
        </tr>
        <tr key="totalDisplayed">
          <td class="text-break">{{ t('publicDashboard.totalDisplayed') }}</td>
          <td>{{ dashboard.totalDisplayed ?? '-' }}</td>
        </tr>
      </transition-group>
    </table>
  </div>
</template>

<style scoped></style>
