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
const modules = ref<DisplayModule[]>([])
const loading = ref(false)
const error = ref(false)
const showImageModal = ref(false)
const imageUrl = ref<string>('')
const showModuleModal = ref(false)
const moduleData = ref<DisplayModule | null>(null)
const changed = ref(false)

function openImageModal(url: string) {
  imageUrl.value = DisplayService.getUrl(url)
  showImageModal.value = true
}

function openModuleModal(module: DisplayModule) {
  moduleData.value = module
  showModuleModal.value = true
}

function onModuleChanged(updated: DisplayModule | null) {
  // Update modules list and display when the modal emits changes
  if (!updated) return

  const idx = modules.value.findIndex((m) => (m.position ?? -1) === (updated.position ?? -1))
  if (idx >= 0) {
    // replace the existing module with the updated one
    modules.value.splice(idx, 1, updated)
  } else {
    // not found -> append
    modules.value.push(updated)
  }

  if (display.value) display.value.modules = modules.value
  moduleData.value = updated
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
    if (display.value) {
      // ensure modules array exists and sync
      if (!Array.isArray(display.value.modules)) display.value.modules = []
      modules.value = display.value.modules
    }
  } catch (e: unknown) {
    console.error(e)
    error.value = true
  } finally {
    loading.value = false
  }
}

function viewDisplay() {
  if (display.value) {
    openImageModal(`/display/${display.value.id}/image`)
  }
}

function setModule(id: number): void {
  if (display?.value?.modules) {
    const mod: DisplayModule | undefined = display.value.modules.find(
      (m) => (m.position ?? 0) === id,
    )
    if (mod) {
      openModuleModal(mod)
    }
  }
}

function syncRectangles(r: DisplayModule[]): void {
  modules.value = r
  if (display.value) {
    display.value.modules = r
  }
}

function updateModulesFromTable(r: DisplayModule[]) {
  modules.value = r
  if (display.value) display.value.modules = r
  changed.value = true
}

function addModule() {
  // create a default module object with next position
  const pos =
    modules.value.length > 0 ? Math.max(...modules.value.map((m) => m.position ?? 0)) + 1 : 1
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
  modules.value.push(m)
  if (display.value) display.value.modules = modules.value
  changed.value = true
}

function removeModule(pos: number) {
  const idx = modules.value.findIndex((m) => (m.position ?? -1) === pos)
  if (idx >= 0) {
    modules.value.splice(idx, 1)
    // reassign positions to maintain stable positions (optional)
    modules.value = modules.value.map((m, i) => ({ ...m, position: i + 1 }))
    if (display.value) display.value.modules = modules.value
    changed.value = true
  }
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
          @click="viewDisplay"
          v-if="display != null && !error && !loading"
        >
          <i class="bi bi-arrow-clockwise"></i>
          {{ t('display.btn.view') }}
        </button>
        <button
          class="btn btn-primary me-2"
          @click="viewDisplay"
          :disabled="!changed"
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
        :modules="modules"
        @update:modules="updateModulesFromTable"
        @add-module="addModule"
        @remove-module="removeModule"
        @edit-module="setModule"
      />

      <div class="card d-flex flex-row justify-content-center align-items-center mb-3">
        <div class="display">
          <DisplayComponent
            :modules="modules"
            :width="display?.width"
            :height="display?.height"
            @update:rectangles="syncRectangles"
            @rect-clicked="setModule"
          />
        </div>
      </div>
    </div>
    <ImageModal v-model="showImageModal" :imageUrl="imageUrl" title="Preview Image" />
    <DisplayModuleSettingsModal
      v-model="showModuleModal"
      :module="moduleData"
      title="Module Settings"
      @changed="onModuleChanged"
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
