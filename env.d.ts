/// <reference types="vite/client" />

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (opts: {
            client_id: string
            callback: (res: { credential?: string }) => void
          }) => void
          prompt: () => void
          renderButton: (el: HTMLElement, options?: Record<string, unknown>) => void
        }
      }
    }
  }
}

export {}
