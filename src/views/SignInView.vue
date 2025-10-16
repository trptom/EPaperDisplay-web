<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()

const router = useRouter()

const email = ref('')
const password = ref('')
const remember = ref(false)
const loading = ref(false)
const error = ref('')

const signInWithProvider = async (provider: 'google' | 'facebook') => {
  loading.value = true
  error.value = ''
  try {
    // TODO: replace with real OAuth integration
    console.log(`Sign in with ${provider}`)
    // simulate network delay
    await new Promise((r) => setTimeout(r, 600))
    // on success navigate home (adjust route name if needed)
    router.push({ name: 'Home' }).catch(() => {})
  } catch (e) {
    // log for diagnostics
    console.error(e)
    error.value = t('signIn.errorProvider')
  } finally {
    loading.value = false
  }
}

const signInWithCredentials = async () => {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = t('signIn.errorFillAll')
    return
  }
  loading.value = true
  try {
    // TODO: replace with real auth call
    console.log('Sign in with credentials', email.value, remember.value)
    await new Promise((r) => setTimeout(r, 600))
    router.push({ name: 'Home' }).catch(() => {})
  } catch (e) {
    // log for diagnostics
    console.error(e)
    error.value = t('signIn.error')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="sign-in">
    <h1>{{ t('signIn.title') }}</h1>

    <div class="providers">
      <button class="btn google" @click="signInWithProvider('google')" :disabled="loading">
        {{ t('signIn.button.google') }}
      </button>
      <button class="btn facebook" @click="signInWithProvider('facebook')" :disabled="loading">
        {{ t('signIn.button.facebook') }}
      </button>
    </div>

    <div class="or">{{ t('signIn.or') }}</div>

    <form @submit.prevent="signInWithCredentials" class="credentials">
      <label>
        {{ t('signIn.email') }}
        <input v-model="email" type="email" autocomplete="username" />
      </label>
      <label>
        {{ t('signIn.password') }}
        <input v-model="password" type="password" autocomplete="current-password" />
      </label>
      <label class="remember">
        <input type="checkbox" v-model="remember" />
        {{ t('signIn.remember') }}
      </label>

      <div class="error" v-if="error">{{ error }}</div>

      <button type="submit" class="btn primary" :disabled="loading">
        {{ loading ? t('signIn.button.loading') : t('signIn.button.submit') }}
      </button>
    </form>

    <p class="signup-link">
      {{ t('signIn.noAccount') }}
      <a href="#" @click.prevent="$router.push({ name: 'signup' })">{{
        t('signIn.button.signUp')
      }}</a>
    </p>
  </div>
</template>

<style scoped>
.sign-in {
  max-width: 420px;
  margin: 40px auto;
  padding: 20px;
  border-radius: 8px;
  background: var(--card-bg, #fff);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}
.providers {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}
.btn {
  padding: 10px 14px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #f7f7f7;
  cursor: pointer;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.google {
  background: #fff;
  border-color: #ddd;
}
.facebook {
  background: #3b5998;
  color: #fff;
  border-color: #3b5998;
}
.or {
  text-align: center;
  margin: 12px 0;
  color: #666;
}
.credentials label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
}
.credentials input[type='email'],
.credentials input[type='password'] {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 6px;
  border: 1px solid #ccc;
}
.primary {
  width: 100%;
  margin-top: 8px;
  background: var(--primary, #1e88e5);
  color: #fff;
  border-color: transparent;
}
.error {
  color: #b00020;
  margin-top: 6px;
}
.remember {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}
.signup-link {
  margin-top: 12px;
  text-align: center;
  font-size: 14px;
}
</style>
