<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import logoUrl from '@/assets/img/logo.svg'

const { t, locale } = useI18n()
const lang = ref(locale.value)

function changeLang(e: Event) {
  const val = (e.target as HTMLSelectElement).value
  locale.value = val
  lang.value = val
  try {
    localStorage.setItem('locale', val)
  } catch {
    console.error('Cannot access localStorage')
  }
}

watch(
  () => locale.value,
  (v: string) => {
    lang.value = v
  },
)
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
    <div class="container-fluid">
      <RouterLink class="navbar-brand d-flex align-items-center" to="/">
        <img :src="logoUrl" alt="logo" height="38" />
        <span class="ms-2">EPaperDisplay</span>
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNavbar"
        aria-controls="mainNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="mainNavbar">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">{{ t('menuBar.home') }}</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/about">{{ t('menuBar.about') }}</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/signin">{{ t('menuBar.signin') }}</RouterLink>
          </li>
        </ul>

        <form class="d-flex align-items-center">
          <label for="lang" class="me-2 mb-0 small">{{ t('menuBar.lang') }}:</label>
          <select id="lang" class="form-select form-select-sm" v-model="lang" @change="changeLang">
            <option value="en">English</option>
            <option value="cs">Čeština</option>
          </select>
        </form>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* ensure the brand text stays compact */
.navbar-brand img {
  display: inline-block;
}

/* small tweak to make the navbar height predictable */
.navbar {
  height: var(--navbar-height);
}
</style>
