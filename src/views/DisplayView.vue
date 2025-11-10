<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import DisplayComponent from '@/components/DisplayComponent.vue'
import ModuleListTable from '@/components/ModuleListTable.vue'
import ImageModal from '@/components/modals/ImageModal.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { Display, DisplayModule, ModuleData_SimpleText } from '@/services/DisplayService'
import DisplayService, { DisplayModuleType } from '@/services/DisplayService'
import DisplayModuleSettingsModal from '@/components/modals/DisplayModuleSettingsModal.vue'

const { t } = useI18n()

// Example: read `id` from the route params using useRoute()
const route = useRoute()

const idParam = computed(() => route.params.id as string | undefined)

const display = ref<Display | null>(null)
const activeModulePosition = ref<number | null>(null)
const modules = computed<DisplayModule[]>(() => display.value?.modules ?? [])
const activeModule = computed<DisplayModule | null>(() => {
  if (!display.value || activeModulePosition.value === null) return null
  return display.value.modules?.find((m) => m.position === activeModulePosition.value) ?? null
})

const loading = ref(false)
const error = ref(false)

const showImageModal = ref(false)
const showModuleModal = ref(false)

const changed = ref(false)

const imageUrl = ref<string>('')

async function openImageModal(img: string | Promise<string>) {
  if (typeof img !== 'string') {
    img = await img
  }

  if (img) {
    imageUrl.value = img
    showImageModal.value = true
  }
}

function openModuleModal() {
  showModuleModal.value = true
}

function setActiveModule(module: DisplayModule | null) {
  activeModulePosition.value = module?.position ?? null
}

function onModuleChanged(module: DisplayModule) {
  if (display.value == null || activeModulePosition.value == null) return

  const idx = display.value.modules.findIndex((m) => m.position === module.position)
  if (idx >= 0) {
    display.value.modules.splice(idx, 1, module)
  }

  changed.value = true
}

async function loadDisplay(id?: number) {
  if (id === undefined && idParam.value) {
    id = parseInt(idParam.value, 10)
  }
  if (!id) {
    error.value = true
    return
  }

  loading.value = true
  error.value = false

  try {
    const data = await DisplayService.get(id)
    display.value = data ?? null
  } catch (e: unknown) {
    console.error(e)
    error.value = true
  } finally {
    loading.value = false
  }
}

function updateModulesFromTable(module: DisplayModule, from: number, to: number) {
  if (display.value == null) return

  const modList = display.value.modules
  if (from < 0 || from >= modList.length || to < 0 || to >= modList.length) return

  changed.value = true

  // Move module in array from => to.
  const [movedModule] = modList.splice(from, 1)
  if (movedModule) {
    modList.splice(to, 0, movedModule)
  }

  // Reassign positions to match new order (1-based)
  for (let i = 0; i < modList.length; i++) {
    modList[i]!.position = i + 1
  }
}

function addModule() {
  if (display.value == null) return

  // create a default module object with next position
  const pos =
    display.value.modules.length > 0
      ? Math.max(...modules.value.map((m) => m.position ?? 0)) + 1
      : 1
  const data: ModuleData_SimpleText = {
    text: '',
    alignment_x: 'left',
    alignment_y: 'top',
    font_family: 'Arial',
    font_size: 16,
  }
  const m: DisplayModule = {
    position: pos,
    type: DisplayModuleType.SimpleText,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    border: 0,
    data: data,
  }

  display.value.modules.push(m)

  changed.value = true
}

function removeModule(module: DisplayModule) {
  if (display.value == null) return

  const idx = display.value.modules.findIndex((m) => (m.position ?? -1) === (module.position ?? -1))
  if (idx >= 0) {
    display.value.modules.splice(idx, 1)
    changed.value = true
  }
}

async function save() {
  if (display.value == null) return

  //const result = await DisplayService.set(display.value);

  changed.value = false
}

onMounted(() => {
  loadDisplay()
})
</script>

<template>
  <div class="container mt-5 pt-5">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h1 class="mb-0">{{ t('display.header') }}</h1>
        <div class="text-muted" v-if="display">
          {{ `${t('display.subheader.id')}: ${display?.id}` }}
        </div>
        <div class="text-muted" v-if="display">
          {{ `${t('display.subheader.token')}: ${display?.token}` }}
        </div>
      </div>
      <div>
        <button
          class="btn btn-outline-secondary me-2"
          @click="() => openImageModal(DisplayService.getImageUrl(display!))"
          :disabled="changed"
          v-if="display != null && !error && !loading"
        >
          <i class="bi bi-arrow-clockwise"></i>
          {{ t('display.btn.view') }}
        </button>
        <button
          class="btn btn-primary me-2"
          :disabled="!changed"
          @click="save"
          v-if="display != null && !error && !loading"
        >
          <i class="bi bi-arrow-clockwise"></i>
          {{ t('display.btn.save') }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="alert alert-secondary">{{ t('display.loading') }}</div>
    <div v-else-if="error || (!loading && !display)" class="alert alert-danger">
      {{ t('display.error') }}
    </div>
    <div v-else-if="display != null">
      <div class="controlPanel">
        <div class="input-group mb-3">
          <label for="display-name-input" class="input-group-text" id="display-name-label">{{
            t('display.control.name')
          }}</label>
          <input
            id="display-name-input"
            type="text"
            class="form-control"
            placeholder=""
            aria-describedby="display-name-label"
            v-model="display.name"
            @keyup="changed = true"
          />
        </div>
        <div class="input-group mb-3 resolution-group">
          <label
            for="display-resolution-input-width"
            class="input-group-text"
            id="display-resolution-label"
            >{{ t('display.control.resolution') }}</label
          >
          <input
            id="display-resolution-input-width"
            type="number"
            class="form-control"
            placeholder="480"
            v-model="display.width"
            @keyup="changed = true"
          />
          <label for="display-resolution-input-height" class="input-group-text x">x</label>
          <input
            id="display-resolution-input-height"
            type="number"
            class="form-control"
            placeholder="800"
            v-model="display.height"
            @keyup="changed = true"
          />
        </div>
      </div>
      <ModuleListTable
        :display="display"
        :view-enabled="!changed"
        @add-clicked="addModule"
        @module-moved="updateModulesFromTable"
        @module-remove-clicked="removeModule"
        @module-edit-clicked="
          (module: DisplayModule) => {
            setActiveModule(module)
            openModuleModal()
          }
        "
        @module-view-clicked="
          (module: DisplayModule) => {
            openImageModal(DisplayService.getModuleImageUrl(display!.id, module.position))
          }
        "
      />

      <div class="card d-flex flex-row justify-content-center align-items-center mb-3">
        <div class="display">
          <DisplayComponent :display="display" :width="display?.width" :height="display?.height" />
        </div>
      </div>
    </div>
    <ImageModal v-model="showImageModal" :imageUrl="imageUrl" title="Preview Image" />
    <DisplayModuleSettingsModal
      v-model="showModuleModal"
      :module="activeModule"
      title="Module Settings"
      @closed="
        (module: DisplayModule | null) => {
          if (module) {
            onModuleChanged(module)
          }
          showModuleModal = false
        }
      "
    />
  </div>
</template>

<style scoped>
.card {
  background-color: var(--bs-secondary-bg);
}

.card > * {
  padding: 0.5em;
}

.controlPanel > .input-group > *:not() {
  width: 0;
  flex-grow: 1;
}

.resolution-group > .input-group-text:first-child {
  flex: 0 0 50%;
  max-width: 50%;
}
.resolution-group > input.form-control:first-of-type,
.resolution-group > input.form-control:last-of-type {
  /* share remaining space, but leave token auto width */
  flex: 1 1 0;
}
.resolution-group > .x {
  flex: 0 0 auto;
  align-self: center;
}
</style>
