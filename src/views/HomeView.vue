<script setup lang="ts">
import PrivateDashboardComponent from '@/components/PrivateDashboardComponent.vue'
import PublicDashboardComponent from '../components/PublicDashboardComponent.vue'
import { useUserStore } from '@/stores/user'

const user = useUserStore()
</script>

<template>
  <div class="container mt-5 pt-5">
    <PublicDashboardComponent />

    <PrivateDashboardComponent v-if="user.isLoggedIn" />
  </div>
</template>
