<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  msg: string
}>()

const { t } = useI18n()

const descriptionHtml = computed(() => {
  const vite = '<a href="https://vite.dev/" target="_blank" rel="noopener">Vite</a>'
  const vue = '<a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>'
  return t('hello.description', { vite, vue })
})
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ props.msg }}</h1>
    <h3 v-html="descriptionHtml"></h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
