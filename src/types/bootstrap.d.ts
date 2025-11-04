declare module 'bootstrap' {
  // Minimal typing for Modal used in this project
  export class Modal {
    constructor(element: Element | null, options?: unknown)
    show(): void
    hide(): void
    toggle(): void
    dispose(): void
  }
}
