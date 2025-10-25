import Service from './Service'

export type User = {
  name: string
  email: string
}

class AuthService extends Service {
  /**
   * Sign in with Google OAuth. Starts all the flow including redirect
   * to google oauth and then back to this SPA.
   *
   * @param redirectUrl URL to redirect back after sign in (optional,
   * defaults to current URL).
   */
  public async google(redirectUrl?: string) {
    const url = this.getUrl('/auth/google/redirect')
    if (!redirectUrl) {
      redirectUrl = window.location.href
    }

    window.location.href = `${url}?origin=${encodeURIComponent(redirectUrl)}`
  }

  /**
   * Sign in with Facebook OAuth. Starts all the flow including redirect
   * to facebook oauth and then back to this SPA.
   *
   * @param redirectUrl URL to redirect back after sign in (optional,
   * defaults to current URL).
   */
  public async facebook(redirectUrl?: string) {
    const url = this.getUrl('/auth/facebook/redirect')
    if (!redirectUrl) {
      redirectUrl = window.location.href
    }

    window.location.href = `${url}?origin=${encodeURIComponent(redirectUrl)}`
  }

  /**
   * Reads information about currently logged user. If no user is
   * logged in or there's some error, returns null.
   * @returns The user information or null when failed.
   */
  public async getUser() {
    const url = this.getUrl('/auth/user')
    const data = await this.fetchJSON(url, {
      method: 'GET',
    })
    return data == null ? null : (data.user as User)
  }

  /**
   * Logs out the current user.
   * @returns The result of the logout request or null when failed.
   */
  public async logOut() {
    const url = this.getUrl('/auth/logout')
    return await this.fetchJSON(url, {
      method: 'POST',
    })
  }
}

export default new AuthService()
