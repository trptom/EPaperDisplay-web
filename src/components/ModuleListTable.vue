<script setup lang="ts">
import { ref } from 'vue'
import type { Display, DisplayModule } from '@/services/DisplayService'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  display: Display
  viewEnabled: boolean
}>()

const emit = defineEmits<{
  (e: 'add-clicked'): void
  (e: 'module-moved', module: DisplayModule, from: number, to: number): void
  (e: 'module-remove-clicked', module: DisplayModule): void
  (e: 'module-edit-clicked', module: DisplayModule): void
  (e: 'module-view-clicked', module: DisplayModule): void
}>()

const dragIndex = ref<number | null>(null)

function onDragStart(e: DragEvent, idx: number) {
  dragIndex.value = idx
  e.dataTransfer?.setData('text/plain', String(idx))
  e.dataTransfer?.setDragImage(new Image(), 0, 0)
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
}

function onDrop(e: DragEvent, idx: number) {
  e.preventDefault()
  const from = dragIndex.value ?? parseInt(e.dataTransfer?.getData('text/plain') ?? '-1', 10)
  const to = idx
  if (from < 0 || from === to) return
  const copy = props.display.modules.slice()
  const [item] = copy.splice(from, 1)
  if (!item) return
  copy.splice(to, 0, item)
  // After reordering, ensure module.position reflects the new order (1-based)
  for (let i = 0; i < copy.length; i++) {
    // mutate copy items' position to match order (cast to DisplayModule to satisfy types)
    copy[i] = { ...(copy[i] as DisplayModule), position: i + 1 }
  }
  emit('module-moved', item, from, to)
  dragIndex.value = null
}

function addModule() {
  emit('add-clicked')
}

function removeModule(moduleObj: DisplayModule) {
  emit('module-remove-clicked', moduleObj)
}

function editModule(moduleObj: DisplayModule) {
  emit('module-edit-clicked', moduleObj)
}

function viewModule(moduleObj: DisplayModule) {
  emit('module-view-clicked', moduleObj)
}
</script>

<template>
  <div class="module-list-table card mb-3">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h5 class="card-title mb-0">{{ t('components.moduleListTable.title') }}</h5>
        <button class="btn btn-sm btn-primary" @click="addModule">
          {{ t('components.moduleListTable.add') }}
        </button>
      </div>

      <table class="table table-sm">
        <thead>
          <tr>
            <th>{{ t('components.moduleListTable.colName.position') }}</th>
            <th>{{ t('components.moduleListTable.colName.type') }}</th>
            <th>{{ t('components.moduleListTable.colName.area') }}</th>
            <th>{{ t('components.moduleListTable.colName.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(m, idx) in display.modules"
            :key="m.position ?? idx"
            draggable="true"
            @dragstart="onDragStart($event, idx)"
            @dragover.prevent="onDragOver"
            @drop="onDrop($event, idx)"
          >
            <td>{{ m.position }}</td>
            <td>{{ t(`general.moduleTypes.${m.type}`) }}</td>
            <td>{{ `${m.x};${m.y}, ${m.width}x${m.height}` }}</td>
            <td>
              <button class="btn btn-sm btn-outline-secondary me-1" @click="editModule(m)">
                {{ t('components.moduleListTable.edit') }}
              </button>
              <button
                class="btn btn-sm btn-outline-secondary me-1"
                @click="viewModule(m)"
                :disabled="!viewEnabled"
              >
                {{ t('components.moduleListTable.view') }}
              </button>
              <button class="btn btn-sm btn-outline-danger" @click="removeModule(m)">
                {{ t('components.moduleListTable.delete') }}
              </button>
            </td>
          </tr>
          <tr v-if="display.modules.length === 0">
            <td colspan="4" class="text-muted">{{ t('components.moduleListTable.noModules') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.module-list-table .table td,
.module-list-table .table th {
  vertical-align: middle;
}
</style>
