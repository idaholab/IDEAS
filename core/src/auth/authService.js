import jwtDecode from 'jwt-decode'
import Config from '../api/config'
import buildURL from 'build-url'
const axios = require('axios').default

export class Authentication {
  authorize () {
    let state = localStorage.getItem('state')
    let codeChallenge = localStorage.getItem('code_challenge')

    if (!state || !codeChallenge) {
      codeChallenge = btoa(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))
      state = btoa(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))

      localStorage.setItem('state', state)
      localStorage.setItem('code_challenge', codeChallenge)
    }

    return buildURL(`${Config.deepLynxUrl}/oauth/authorize`, {
      queryParams: {
        response_type: 'code',
        client_id: Config.deepLynxAppID,
        redirect_uri: `${Config.appUrl}/dashboard`,
        state,
        scope: 'all',
        code_challenge: codeChallenge,
        code_challenge_method: 'plain'
      }
    })
  }

  RetrieveJWT () {
    const jwt = localStorage.getItem('user.token')

    if (jwt) return jwt
    return ''
  }

  IsLoggedIn () {
    const user = localStorage.getItem('user')

    if (user) {
      const userT = JSON.parse(user)

      // check to see if we're expired
      if (Date.now() >= userT.exp * 1000) {
        localStorage.removeItem('user')
        localStorage.removeItem('user.token')

        return false
      }

      return true
    }

    return false
  }

  Logout () {
    localStorage.removeItem('user')
    localStorage.removeItem('user.token')
  }

  IsAdmin () {
    const user = localStorage.getItem('user')

    if (user) {
      const u = JSON.parse(user)

      return u.admin
    }

    return false
  }

  CurrentUserID () {
    const user = localStorage.getItem('user')

    if (user) {
      const u = JSON.parse(user)

      return u.id
    }

    return ''
  }

  CurrentUser () {
    const user = localStorage.getItem('user')

    if (user) {
      const u = JSON.parse(user)

      return u
    }

    return null
  }

  // Verifies that a user has the proper permissions for performing a given action on
  // a resource. Keep in mind that this DOES NOT dictate what the user is authorized to do
  // on the Deep Lynx backend. This is purely for display control purposes and should always
  // be taken with a grain of salt because as of July 2020 we do not have an auto-renew on
  // JWTs in place
  Auth (resource, action, containerID) {
    const user = localStorage.getItem('user')

    if (!user) return false

    const u = JSON.parse(user)
    if (u.admin) return true

    if (!containerID) containerID = Config.containerID

    // permissions are stored as an array of strings in the format of
    // domain(containerID), resource, action. We assume that if the initial array
    // has a value the subsequent value contains all three above specified values
    for (const set of u.permissions) {
      if (set[0] === containerID && set[1] === resource && set[2] === action) {
        return true
      }
    }

    return false
  }
}

// AuthPlugin exports a large majority of functions as prototype functionality
// on the Vue object. Saves us time from having to import the auth object and
// construct it each time we want to use it. Also allows us to set application
// level configuration later if we need it.
export default function AuthPlugin (Vue) {
  Vue.prototype.$auth = new Authentication()
}

// used by the router for pulling and decoding the jwt
export async function LoginFromToken (token, state) {
  const storedState = localStorage.getItem('state')

  if (state !== storedState) return false

  // exchange temporary token for full access token from service
  const resp = await axios.post(buildURL(`${Config.deepLynxUrl}/oauth/exchange`),
    {
      grant_type: 'authorization_code',
      code: token,
      redirect_uri: `${Config.appUrl}`,
      client_id: Config.deepLynxAppID,
      code_verifier: localStorage.getItem('code_challenge')
    },
    { headers: { 'Access-Control-Allow-Origin': '*' } })

  if (resp.status < 200 || resp.status > 299 || resp.data.isError) {
    // TODO: Logger
    return new Promise(resolve => resolve(false))
  }

  const decodedToken = jwtDecode(resp.data.value)

  // store as `user`
  localStorage.setItem('user', JSON.stringify(decodedToken))
  localStorage.setItem('user.token', resp.data.value)
  return new Promise(resolve => resolve(true))
}

// Helper func, mainly used by the API for building the authorization header
export function RetrieveJWT () {
  const jwt = localStorage.getItem('user.token')

  if (jwt) return jwt
  return ''
}

// Can you spoof IsLoggedIn? Sure, just like you can spoof most JWTs. While the
// frontend might suddenly let you in places you shouldn't be, the backend won't
// honor malformed jwt requests.
export function IsLoggedIn () {
  const user = localStorage.getItem('user')

  if (user) {
    const userT = JSON.parse(user)

    // check to see if we're expired
    if (Date.now() >= userT.exp * 1000) {
      localStorage.removeItem('user')
      localStorage.removeItem('user.token')

      return false
    }

    return true
  }

  return false
}
