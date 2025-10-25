<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import 'flag-icons/css/flag-icons.min.css'
import AuthService from '@/services/AuthService'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const { t, locale } = useI18n()
const lang = ref(locale.value)

const userStore = useUserStore()
const { isLoggedIn } = storeToRefs(userStore)

function changeLang(val: string) {
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
        <img src="/img/logo.png" alt="logo" height="38" />
        <span class="ms-2">EPaperDisplay</span>
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNavbar"
        aria-controls="mainNavbar"
        aria-expanded="false"
        :aria-label="t('menuBar.toggle')"
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
        </ul>

        <div class="d-flex align-items-center me-3" v-if="!isLoggedIn">
          <RouterLink class="btn btn-outline-primary btn-sm me-2" to="/signin">{{
            t('menuBar.signin')
          }}</RouterLink>

          <!-- Provider buttons: assume backend routes /auth/google and /auth/facebook -->
          <a
            class="btn btn-outline-secondary btn-sm me-1 provider-btn"
            @click="AuthService.google()"
            :title="t('menuBar.signinGoogle')"
            :aria-label="t('menuBar.signinGoogle')"
          >
            <img src="/img/social/google.svg" alt="Google" class="icon icon-google" />
          </a>

          <a
            class="btn btn-outline-secondary btn-sm provider-btn"
            @click="AuthService.facebook()"
            :title="t('menuBar.signinFacebook')"
            :aria-label="t('menuBar.signinFacebook')"
          >
            <img src="/img/social/facebook.svg" alt="Facebook" class="icon icon-facebook" />
          </a>
        </div>
        <div class="d-flex align-items-center me-3" v-if="isLoggedIn">
          <div class="btn btn-outline-primary btn-sm me-2" @click="userStore.logOut()">
            {{ t('menuBar.signout') }}
          </div>
        </div>
        <span
          class="btn btn-outline-secondary btn-sm btn-sm fi fi-us"
          @click="changeLang('en')"
        ></span>
        <span
          class="btn btn-outline-secondary btn-sm btn-sm fi fi-cz"
          @click="changeLang('cs')"
        ></span>
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

/* provider buttons and icon sizing */
.provider-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  padding: 0.25rem;
}

.provider-btn .icon {
  width: 16px;
  height: 16px;
}
.fi {
  height: 21px;
  width: 28px;
  margin-left: 10px;
}
</style>
