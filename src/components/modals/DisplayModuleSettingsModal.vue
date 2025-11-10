<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Modal } from 'bootstrap'
import type {
  DisplayModule,
  ModuleData_Calendar,
  ModuleData_SimpleText,
  ModuleData_StaticImage,
  ModuleData_Weather,
} from '@/services/DisplayService'
import { useI18n } from 'vue-i18n'
import { DisplayModuleType } from '@/services/DisplayService'

const { t } = useI18n()

function updateData(e: Event) {
  if (localModule.value && e.target) {
    const target = e.target as HTMLSelectElement
    const type = parseInt(target.value, 10) as DisplayModuleType

    switch (type) {
      case DisplayModuleType.StaticImage:
        localModule.value.data = { url: '' } as ModuleData_StaticImage
        break
      case DisplayModuleType.SimpleText:
        localModule.value.data = { text: '' } as ModuleData_SimpleText
        break
      case DisplayModuleType.Weather:
        localModule.value.data = {} as ModuleData_Weather
        break
      case DisplayModuleType.Calendar:
        localModule.value.data = {} as ModuleData_Calendar
        break
      default:
        localModule.value.data = undefined
        break
    }
  }
}

const props = defineProps<{
  modelValue: boolean
  module: DisplayModule | null
}>()

const emit = defineEmits<{
  (e: 'closed', module: DisplayModule | null): void
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
  modalEl.value.addEventListener('hidden.bs.modal', () => {})
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
    if (!props.module) return
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

function close() {
  emit('closed', localModule.value)
}
</script>

<template>
  <div class="modal fade" tabindex="-1" role="dialog" aria-hidden="true" ref="modalEl">
    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ t('modal.displayModule.title') }}</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="close"></button>
        </div>
        <div class="modal-body">
          <!-- Placeholder form for ModuleData. We'll implement fields later. -->
          <div v-if="localModule" class="mb-3">
            <div class="input-group mb-3">
              <label class="input-group-text" for="displaymodulesettingsmodal-type">{{
                t('modal.displayModule.type')
              }}</label>

              <select
                class="form-select"
                id="displaymodulesettingsmodal-type"
                v-model="localModule.type"
                @change="updateData"
              >
                <option :value="DisplayModuleType.StaticImage">
                  {{ t('general.moduleTypes.1') }}
                </option>
                <option :value="DisplayModuleType.SimpleText">
                  {{ t('general.moduleTypes.2') }}
                </option>
                <option :value="DisplayModuleType.Weather">
                  {{ t('general.moduleTypes.3') }}
                </option>
                <option :value="DisplayModuleType.Calendar">
                  {{ t('general.moduleTypes.4') }}
                </option>
              </select>
            </div>

            <div class="input-group mb-3">
              <label class="input-group-text" for="displaymodulesettingsmodal-position-x">{{
                t('modal.displayModule.position')
              }}</label>

              <input
                type="text"
                class="form-control"
                id="displaymodulesettingsmodal-position-x"
                v-model="localModule.x"
              />
              <input
                type="text"
                class="form-control"
                id="displaymodulesettingsmodal-position-y"
                v-model="localModule.y"
              />
            </div>

            <div class="input-group mb-3">
              <label class="input-group-text" for="displaymodulesettingsmodal-size-width">{{
                t('modal.displayModule.size')
              }}</label>

              <input
                type="text"
                class="form-control"
                id="displaymodulesettingsmodal-size-width"
                v-model="localModule.width"
              />
              <input
                type="text"
                class="form-control"
                id="displaymodulesettingsmodal-size-height"
                v-model="localModule.height"
              />
            </div>

            <template v-if="localModule?.type === DisplayModuleType.StaticImage">
              <div class="input-group mb-3">
                <label class="input-group-text" for="displaymodulesettingsmodal-staticimage-url">{{
                  t('modal.displayModule.staticImage.url')
                }}</label>

                <input
                  type="text"
                  class="form-control"
                  id="displaymodulesettingsmodal-staticimage-url"
                  v-model="(localModule.data as ModuleData_StaticImage).url"
                />
              </div>
            </template>
            <template v-if="localModule.type === DisplayModuleType.SimpleText"> </template>
            <template v-if="localModule.type === DisplayModuleType.Calendar"> </template>
            <template v-if="localModule.type === DisplayModuleType.Weather"> </template>
          </div>
          <div v-else class="text-muted">{{ t('modal.displayModule.noModule') }}</div>
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
