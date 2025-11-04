<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Modal } from 'bootstrap'
import type { DisplayModule } from '@/services/DisplayService'

const props = defineProps<{
  modelValue: boolean
  module: DisplayModule | null
  title?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'update:module', v: DisplayModule | null): void
  (e: 'changed', v: DisplayModule | null): void
}>()

const modalEl = ref<HTMLElement | null>(null)
let modalInstance: Modal | null = null

// Create a local reactive copy so the form can edit it safely.
// We'll emit updates whenever this local copy changes.
const localModule = ref<DisplayModule | null>(null)

// Helper to clone module data (shallow is fine for now)
function cloneModule(m: DisplayModule | null): DisplayModule | null {
  return m ? (JSON.parse(JSON.stringify(m)) as DisplayModule) : null
}

onMounted(() => {
  if (!modalEl.value) return
  modalInstance = new Modal(modalEl.value, { backdrop: true })
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
      // when opening, populate local copy from prop
      localModule.value = cloneModule(props.module)
      modalInstance.show()
    } else {
      modalInstance.hide()
    }
  },
)

// Keep localModule in sync when prop changes externally
watch(
  () => props.module,
  (newM) => {
    localModule.value = cloneModule(newM)
  },
  { deep: true },
)

// Emit changes when localModule mutates. We use a deep watch to detect any change
watch(
  localModule,
  (newVal) => {
    emit('update:module', cloneModule(newVal))
    emit('changed', cloneModule(newVal))
  },
  { deep: true },
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
        <div class="modal-body">
          <!-- Placeholder form for ModuleData. We'll implement fields later. -->
          <div v-if="localModule" class="mb-3">
            <p class="small text-muted">
              Module type: <strong>{{ localModule.type }}</strong>
            </p>
            <!-- The actual form inputs will be added later. For now expose JSON editor preview -->
            <pre class="p-2 bg-light rounded">{{ JSON.stringify(localModule.data, null, 2) }}</pre>
          </div>
          <div v-else class="text-muted">No module selected</div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-body pre {
  max-height: 45vh;
  overflow: auto;
}
</style>
