import Service from './Service'

export type Dashboard = {
  usersCount: number
  displaysCount: number
  modulesCount: number
  totalDisplayed: number
}

export type DashboardPrivate = {
  displaysCount: number
}

class DashboardService extends Service {
  /**
   * Reads information about all displays of current user.
   * @returns The user information or null when failed.
   */
  public async public() {
    const url = this.getUrl('/dashboard')
    const data = await this.fetchJSON(url, {
      method: 'GET',
    })
    return data == null ? null : (data as Dashboard)
  }

  /**
   * Adds a new display for the current user with default settings.
   * @returns The new display information or null when failed.
   */
  public async private() {
    const url = this.getUrl('/dashboard/private')
    const data = await this.fetchJSON(url, {
      method: 'GET',
    })
    return data == null ? null : (data as DashboardPrivate)
  }
}

export default new DashboardService()
