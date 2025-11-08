<script setup lang="ts">
import { ref } from 'vue'
import type { DisplayModule } from '@/services/DisplayService'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  modules: DisplayModule[]
}>()

const emit = defineEmits<{
  (e: 'update:modules', val: DisplayModule[]): void
  (e: 'add-module'): void
  (e: 'remove-module', pos: number): void
  (e: 'edit-module', id: number, module: DisplayModule): void
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
  const copy = props.modules.slice()
  const [item] = copy.splice(from, 1)
  if (!item) return
  copy.splice(to, 0, item)
  // After reordering, ensure module.position reflects the new order (1-based)
  for (let i = 0; i < copy.length; i++) {
    // mutate copy items' position to match order (cast to DisplayModule to satisfy types)
    copy[i] = { ...(copy[i] as DisplayModule), position: i + 1 }
  }
  emit('update:modules', copy)
  dragIndex.value = null
}

function addModule() {
  emit('add-module')
}

function removeModule(pos: number) {
  emit('remove-module', pos)
}

function editModule(id: number, moduleObj: DisplayModule) {
  emit('edit-module', id, moduleObj)
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
            v-for="(m, idx) in modules"
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
              <button
                class="btn btn-sm btn-outline-secondary me-1"
                @click="editModule(m.position ?? idx, m)"
              >
                {{ t('components.moduleListTable.edit') }}
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="removeModule(m.position ?? idx)"
              >
                {{ t('components.moduleListTable.delete') }}
              </button>
            </td>
          </tr>
          <tr v-if="modules.length === 0">
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
