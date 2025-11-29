declare module 'bootstrap' {
  export class Modal {
    constructor(element: Element | null, options?: unknown)
    show(): void
    hide(): void
    toggle(): void
    dispose(): void
  }

  export class Toast {
    constructor(element: Element | null, options?: { autohide?: boolean; delay?: number })
    show(): void
    hide(): void
    dispose(): void
  }
}
