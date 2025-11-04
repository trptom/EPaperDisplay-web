<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Modal } from 'bootstrap'

const props = defineProps<{
  modelValue: boolean
  imageUrl: string
  title?: string
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
}>()

const modalEl = ref<HTMLElement | null>(null)
let modalInstance: Modal | null = null
const loading = ref(true)

function onLoad() {
  loading.value = false
}
function onError() {
  loading.value = false
}

onMounted(() => {
  if (!modalEl.value) return
  modalInstance = new Modal(modalEl.value, { backdrop: true })
  // sync hide -> v-model update
  modalEl.value.addEventListener('hidden.bs.modal', () => {
    emit('update:modelValue', false)
  })
  if (props.modelValue) {
    modalInstance.show()
  }
})

onUnmounted(() => {
  modalInstance?.dispose()
  modalInstance = null
})

watch(
  () => props.modelValue,
  (v) => {
    if (!modalInstance) return
    if (v) {
      loading.value = true
      modalInstance.show()
    } else {
      modalInstance.hide()
    }
  },
)

// Reset loading when the imageUrl prop changes so the spinner shows again
watch(
  () => props.imageUrl,
  (newUrl, oldUrl) => {
    if (newUrl && newUrl !== oldUrl) {
      loading.value = true
    }
  },
)

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <div class="modal fade" tabindex="-1" role="dialog" aria-hidden="true" ref="modalEl">
    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="close"></button>
        </div>
        <div class="modal-body d-flex justify-content-center align-items-center">
          <div v-if="loading" class="text-center p-3">
            <div class="spinner-border text-secondary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <!-- Always render the image so the browser requests the URL; keep it visually hidden while loading -->
          <img
            :src="props.imageUrl"
            alt="Preview"
            class="img-fluid"
            :class="{ invisible: loading }"
            @load="onLoad"
            @error="onError"
          />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-body img {
  display: block;
  max-width: 100%;
  height: auto;
  border: solid var(--bs-secondary-color) 5px;
  box-shadow: 0px 0px 20px 3px var(--bs-secondary-border-subtle);
}
</style>
