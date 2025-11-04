<script setup lang="ts">
import { DisplayModuleType, type DisplayModule } from '@/services/DisplayService'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps<{
  modules: DisplayModule[]
  width?: number
  height?: number
}>()

const emit = defineEmits<{
  (e: 'update:modules', val: DisplayModule[]): void
  (e: 'rectClicked', id: number, rect: DisplayModule): void
}>()

// container ref and style
const root = ref<HTMLElement | null>(null)
// CSSProperties typing can be strict; cast to unknown to satisfy TS in templates
const containerStyle = computed<Record<string, string>>(() => ({
  width: String(props.width ?? 480) + 'px',
  height: String(props.height ?? 800) + 'px',
  position: 'relative',
  background: '#fff',
  overflow: 'hidden',
}))

// internal state for interactions
let activePointerId: number | null = null
let action: 'drag' | 'resize' | null = null
let targetRect: DisplayModule | null = null
let startX = 0
let startY = 0
let startRect: DisplayModule | null = null
let currentHandle = ''
let movedOrResized = false
const MOVE_THRESHOLD = 3 // pixels

const handles = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']

function moduleBG(m: DisplayModule) {
  switch (m.type) {
    case DisplayModuleType.StaticImage:
    case DisplayModuleType.SimpleText:
    case DisplayModuleType.Weather:
    case DisplayModuleType.Calendar:
    default:
      return '/img/modules/unknown.png'
  }
}

function moduleText(m: DisplayModule) {
  const result = `[${m.position}]`
  switch (m.type) {
    case DisplayModuleType.StaticImage:
      return `${result} Static Image`
    case DisplayModuleType.SimpleText:
      return `${result} Simple Text`
    case DisplayModuleType.Weather:
      return `${result} Weather`
    case DisplayModuleType.Calendar:
      return `${result} Calendar`
    default:
      return 'Unknown Module'
  }
}

function moduleStyle(r: DisplayModule) {
  return {
    position: 'absolute',
    left: r.x + 'px',
    top: r.y + 'px',
    width: r.width + 'px',
    height: r.height + 'px',
    boxSizing: 'border-box',
  } as Record<string, string>
}

// Compute inline style for the inner text block so that one of its
// dimensions (width or height) equals 50% of the container (root)
// and the other dimension preserves the text's aspect ratio.
function innerStyle(r: DisplayModule) {
  // container size (props.width/height) defaulted like containerStyle
  const cW = props.width ?? 480
  const cH = props.height ?? 800

  // desired max dimension is 50% of container
  const targetW = Math.round(cW * 0.5)
  const targetH = Math.round(cH * 0.5)

  // compute aspect ratio of the rect's box (width/height)
  const rectAR = r.width / r.height || 1

  // We want one of the inner dimensions to equal targetW or targetH
  // Choose which dimension to fix by comparing target aspect ratios
  // If rect is wider than tall (ar>1), prefer width = targetW, else height = targetH.
  let w: number
  let h: number

  if (rectAR >= 1) {
    // fix width, scale height to preserve rectAR
    w = targetW
    h = Math.round(w / rectAR)
    // ensure it doesn't exceed targetH
    if (h > targetH) {
      h = targetH
      w = Math.round(h * rectAR)
    }
  } else {
    // fix height, scale width
    h = targetH
    w = Math.round(h * rectAR)
    if (w > targetW) {
      w = targetW
      h = Math.round(w / rectAR)
    }
  }

  return {
    width: w + 'px',
    height: h + 'px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as Record<string, string>
}

function startDrag(e: PointerEvent, rect: DisplayModule) {
  ;(e.target as Element).setPointerCapture(e.pointerId)
  activePointerId = e.pointerId
  action = 'drag'
  movedOrResized = false
  targetRect = rect
  // idx unused
  startX = e.clientX
  startY = e.clientY
  startRect = { ...rect }
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
}

function startResize(e: PointerEvent, rect: DisplayModule, handle: string) {
  ;(e.target as Element).setPointerCapture(e.pointerId)
  activePointerId = e.pointerId
  action = 'resize'
  movedOrResized = false
  targetRect = rect
  currentHandle = handle
  startX = e.clientX
  startY = e.clientY
  startRect = { ...rect }
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
}

function onPointerMove(e: PointerEvent) {
  if (activePointerId !== e.pointerId) return
  if (!targetRect || !startRect) return

  const dx = e.clientX - startX
  const dy = e.clientY - startY

  if (!movedOrResized && Math.hypot(dx, dy) >= MOVE_THRESHOLD) {
    movedOrResized = true
  }

  if (action === 'drag') {
    targetRect.x = Math.max(0, Math.round(startRect.x + dx))
    targetRect.y = Math.max(0, Math.round(startRect.y + dy))
    sync()
  } else if (action === 'resize') {
    applyResize(targetRect, startRect, currentHandle, dx, dy)
    sync()
  }
}

function applyResize(
  r: DisplayModule,
  base: DisplayModule,
  handle: string,
  dx: number,
  dy: number,
) {
  // simple resize logic: modify x,y,width,height depending on handle
  let newX = base.x
  let newY = base.y
  let newW = base.width
  let newH = base.height

  if (handle.includes('e')) newW = Math.max(10, Math.round(base.width + dx))
  if (handle.includes('s')) newH = Math.max(10, Math.round(base.height + dy))
  if (handle.includes('w')) {
    newW = Math.max(10, Math.round(base.width - dx))
    newX = Math.round(base.x + dx)
  }
  if (handle.includes('n')) {
    newH = Math.max(10, Math.round(base.height - dy))
    newY = Math.round(base.y + dy)
  }

  // clamp to container
  const maxW = (props.width ?? 480) - newX
  const maxH = (props.height ?? 800) - newY
  newW = Math.min(newW, Math.max(10, maxW))
  newH = Math.min(newH, Math.max(10, maxH))

  r.x = Math.max(0, newX)
  r.y = Math.max(0, newY)
  r.width = newW
  r.height = newH
}

function onPointerUp(e: PointerEvent) {
  if (activePointerId !== e.pointerId) return
  activePointerId = null
  action = null
  targetRect = null
  startRect = null
  currentHandle = ''
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
}

function sync() {
  // emit update to allow parent to react if using v-model:modules or listen
  emit('update:modules', props.modules)
}

function onRectClick(rect: DisplayModule, idx: number) {
  // only emit when user didn't move or resize the rectangle during this interaction
  if (movedOrResized) return

  // ensure we provide a numeric id as requested; fall back to index
  let idNum = Number(rect.position ?? idx)
  if (Number.isNaN(idNum)) idNum = idx
  emit('rectClicked', idNum, rect)
}

// cleanup
onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
})

// ensure modules array is watched and kept as source of truth; we mutate objects directly
watch(
  () => props.modules,
  () => {},
  { deep: true },
)
</script>

<template>
  <div class="display-root" :style="containerStyle" ref="root">
    <div
      v-for="(module, idx) in modules"
      :key="module.position ?? idx"
      class="rect"
      :style="moduleStyle(module)"
      @pointerdown.stop.prevent="startDrag($event, module)"
      @click.stop="onRectClick(module, idx)"
    >
      <div class="rect-image" :style="{ backgroundImage: `url(${moduleBG})` }">
        <div class="rect-text" :style="innerStyle(module)" v-html="moduleText"></div>
      </div>

      <!-- resize handles -->
      <div
        v-for="handle in handles"
        :key="handle"
        class="handle"
        :data-handle="handle"
        @pointerdown.stop.prevent="startResize($event, module, handle)"
      ></div>
    </div>
  </div>
</template>

<!-- no extra script block -->

<style scoped>
.display-root {
  border: 1px solid #ddd;
  background: #f7f7f7;
}
.rect {
  border: 1px dashed rgba(0, 0, 0, 0.2);
  background: transparent;
  touch-action: none; /* allow pointer events */
  cursor: pointer;
}
.rect-image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
}
.rect-text {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  /* allow inner HTML content to scale if it contains images/text */
}
.handle {
  position: absolute;
  width: 10px;
  height: 10px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 2px;
}
/* place handles roughly */
.handle[data-handle='n'] {
  left: 50%;
  top: -5px;
  transform: translateX(-50%);
  cursor: ns-resize;
}
.handle[data-handle='s'] {
  left: 50%;
  bottom: -5px;
  transform: translateX(-50%);
  cursor: ns-resize;
}
.handle[data-handle='e'] {
  right: -5px;
  top: 50%;
  transform: translateY(-50%);
  cursor: ew-resize;
}
.handle[data-handle='w'] {
  left: -5px;
  top: 50%;
  transform: translateY(-50%);
  cursor: ew-resize;
}
.handle[data-handle='ne'] {
  right: -5px;
  top: -5px;
  cursor: nesw-resize;
}
.handle[data-handle='nw'] {
  left: -5px;
  top: -5px;
  cursor: nwse-resize;
}
.handle[data-handle='se'] {
  right: -5px;
  bottom: -5px;
  cursor: nwse-resize;
}
.handle[data-handle='sw'] {
  left: -5px;
  bottom: -5px;
  cursor: nesw-resize;
}
</style>
