import Service from './Service'

export type Display = {
  id: string
  name: string
  token: string
  model: number
  width: number
  height: number
  ip_filter: boolean
  displayed: number
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
    const url = this.getUrl('/display/' + (typeof display === 'number' ? display : display.id))
    const data = await this.fetchJSON(url, {
      method: 'GET',
    })
    return data == null ? null : (data as Display)
  }
}

export default new DisplayService()
