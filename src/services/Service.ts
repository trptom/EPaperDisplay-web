import { useUserStore } from '@/stores/user'

// Lazy init because we cannot use the store while initializing. If we do so,
// useUserStore() is called before pinia activated and error is thrown.
let userStore: null | ReturnType<typeof useUserStore> = null

/**
 * Base class for all services.
 */
export default abstract class Service {
  private readonly SERVER_URL = (import.meta.env.VITE_SERVER_URL ?? '') as string

  /**
   * Get the server base URL. You can override this method in subclasses
   * to provide different server URLs for different services.
   * @returns The server base URL.
   */
  protected getServerUrl() {
    return this.SERVER_URL
  }

  /**
   * Get the full URL for a given API path.
   * @param path The API path (e.g. '/users')
   * @returns The full URL (e.g. 'https://api.example.com/users')
   * @see VITE_SERVER_URL environment variable
   */
  public getUrl(path: string): string {
    const base = this.getServerUrl().replace(/\/$/, '')
    const p = path.replace(/^\//, '')
    return `${base}/${p}`
  }

  /**
   * Basic fetch call which returns result of the call without any modifications.
   * @param url url to be called.
   * @param opts call options for fetch().
   * @returns Unmodified fetch() result.
   */
  protected async fetch(url: string, opts?: RequestInit) {
    if (!opts) {
      opts = {}
    }
    if (!opts.method) {
      opts.method = 'GET'
    }
    if (opts.credentials === undefined) {
      opts.credentials = 'include'
    }
    if (!opts.headers) {
      opts.headers = {}
    }
    ;(opts.headers as Record<string, string>)['Accept'] = 'application/json'

    // Add X-XSRF-TOKEN header for laravel.
    const xsrf = this.getCookie('XSRF-TOKEN')
    if (xsrf) {
      ;(opts.headers as Record<string, string>)['X-XSRF-TOKEN'] = xsrf
    }

    const res = await fetch(url, opts)

    if (!res.ok) {
      if (res.status === 401) {
        // Unauthorized, refresh user status.
        if (userStore === null) {
          userStore = useUserStore()
        }
        userStore.refresh()
      }

      console.error(`HTTP error for '${url}'! status: ${res.status}`)
    }

    return res
  }

  /**
   * Extended fetch which, in case of success, returns JSON parsed response.
   * @param url url to be called.
   * @param opts call options for fetch().
   * @returns JSON parsed response or null if failed.
   */
  protected async fetchJSON(url: string, opts?: RequestInit) {
    if (!opts) {
      opts = {}
    }
    if (!opts.method) {
      opts.method = 'GET'
    }
    if (opts.credentials === undefined) {
      opts.credentials = 'include'
    }
    if (!opts.headers) {
      opts.headers = {}
    }
    ;(opts.headers as Record<string, string>)['Accept'] = 'application/json'

    // Add X-XSRF-TOKEN header for laravel.
    const xsrf = this.getCookie('XSRF-TOKEN')
    if (xsrf) {
      ;(opts.headers as Record<string, string>)['X-XSRF-TOKEN'] = xsrf
    }

    const res = await fetch(url, opts)

    if (!res.ok) {
      if (res.status === 401) {
        // Unauthorized, refresh user status.
        if (userStore === null) {
          userStore = useUserStore()
        }
        userStore.refresh()
      }

      console.error(`HTTP error for '${url}'! status: ${res.status}`)
      return null
    }

    return res.json()
  }

  protected getCookie(name: string): string | null {
    const v = document.cookie.split('; ').find((c) => c.startsWith(name + '='))
    return v ? decodeURIComponent(v.split('=')[1]!) : null
  }
}
