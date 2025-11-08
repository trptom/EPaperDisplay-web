import Service from './Service'

export enum DisplayModuleType {
  StaticImage = 1,
  SimpleText = 2,
  Weather = 3,
  Calendar = 4,
}

export type Display = {
  id: string
  name: string
  token: string
  model: number
  width: number
  height: number
  language: string
  timezone: string
  latitude: number
  longitude: number
  ip_filter: boolean
  displayed: number
  modules?: DisplayModule[]
}

export type DisplayModule = {
  position: number
  type: DisplayModuleType
  x: number
  y: number
  width: number
  height: number
  border: number
  data?: ModuleData
}

export type ModuleData =
  | ModuleData_StaticImage
  | ModuleData_SimpleText
  | ModuleData_Weather
  | ModuleData_Calendar

export type ModuleData_StaticImage = {
  url: string
  aspect_ratio?: number
}

export type ModuleData_SimpleText = {
  text: string
  alignment_x?: 'left' | 'center' | 'right'
  alignment_y?: 'top' | 'center' | 'bottom'
  font_family?: string
  font_size: number
}

export type ModuleData_Weather = {
  lat: number
  lon: number
  units: 'metric' | 'imperial'
}

export type ModuleData_Calendar = {
  iCalUrl: string
  itemsCount: number
}

class DisplayService extends Service {
  /**
   * Reads information about all displays of current user.
   * @returns The user information or null when failed.
   */
  public async all() {
    const url = this.getUrl('/displays')
    const data = await this.fetchJSON(url, {
      method: 'GET',
    })
    return data == null ? null : (data.displays as Display[])
  }

  /**
   * Adds a new display for the current user with default settings.
   * @returns The new display information or null when failed.
   */
  public async create() {
    const url = this.getUrl('/display/create')
    const data = await this.fetchJSON(url, {
      method: 'POST',
    })
    return data == null ? null : (data as Display)
  }

  /**
   * Reads information about all displays of current user.
   * @returns The display information or null when failed.
   */
  public async get(display: Display | number) {
    const url = this.getUrl(
      '/display/' + (typeof display === 'number' ? display : display.id) + '/get',
    )
    const data = await this.fetchJSON(url, {
      method: 'GET',
    })
    return data == null ? null : (data as Display)
  }

  /**
   * Fetches the image for a display. After image is not needed anymore,
   * you should call URL.revokeObjectURL() with the returned URL to free memory.
   * @param display The display to fetch the image for.
   * @returns The image URL or an error.
   */
  public async getImage(display: Display | number): Promise<string> {
    const url = this.getUrl(
      '/display/' + (typeof display === 'number' ? display : display.id) + '/image',
    )
    const res = await fetch(url, { method: 'GET' })
    if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`)
    const blob = await res.blob()
    if (blob.type !== 'image/png' && !blob.type.startsWith('image/')) {
      // optional: accept other image types or convert
    }
    return URL.createObjectURL(blob)
  }

  /**
   * Fetches the image for a display module. After image is not needed anymore,
   * you should call URL.revokeObjectURL() with the returned URL to free memory.
   * @param display The display to fetch the image for.
   * @param module The module of display to fetch the image for.
   * @returns The image URL or an error.
   */
  public async getModuleImage(
    display: Display | number,
    module: DisplayModule | number,
  ): Promise<string> {
    const url = this.getUrl(
      '/display/' +
        (typeof display === 'number' ? display : display.id) +
        '/module/' +
        (typeof module === 'number' ? module : module.position) +
        '/image',
    )
    const res = await fetch(url, { method: 'GET' })
    if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`)
    const blob = await res.blob()
    if (blob.type !== 'image/png' && !blob.type.startsWith('image/')) {
      // optional: accept other image types or convert
    }
    return URL.createObjectURL(blob)
  }
}

export default new DisplayService()
