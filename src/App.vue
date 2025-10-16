<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const { t, locale } = useI18n()
const lang = ref(locale.value)

function changeLang(e: Event) {
  const val = (e.target as HTMLSelectElement).value
  locale.value = val
  lang.value = val
}
</script>

<template>
  <header>
    <img :alt="t('hello.title')" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld :msg="t('hello.title')" />

      <nav>
        <RouterLink to="/">{{ t('header.home') }}</RouterLink>
        <RouterLink to="/about">{{ t('header.about') }}</RouterLink>
      </nav>

      <div class="lang-select">
        <label for="lang">{{ t('lang.label') }}:</label>
        <select id="lang" v-model="lang" @change="changeLang">
          <option value="en">English</option>
          <option value="pl">Polski</option>
        </select>
      </div>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
