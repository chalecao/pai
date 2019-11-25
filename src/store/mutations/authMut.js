import types from '@/store/types'

const internalAuthMutations = {
  /**
   * Changes the value of "isAuthorized", to the value passed as payload
   *
   * @param {boolean} isAuthorized : Wheter or not the user is authorized
   */
  [types._toggleAuthorizationStatus]: function (state, data) {

    if (data && data.wp) {
      state.wp = data.wp
      state.oauth.isAuthorized = true
      state.oauth.userId = data.id
      state.oauth.wphost = data.wphost
      state.oauth.authenticatedUser = data.username
    } else {
      state.oauth.isAuthorized = false
      state.oauth.authenticatedUser = ''
    }
  },
  /**
   * 同步本地数据到wp
   * @param {*} state 
   * @param {*} isSuccess 
   */
  [types._syncProject2wp]: function (state, isSuccess) {
    state.app.hasChanges = isSuccess
  },

  /**
   * 发布页面到wp
   * @param {*} state 
   * @param {*} isSuccess 
   */
  [types._publishPage]: function (state, { id, wpid, link, status }) {
    if (id) {
      let pages = state.project.pages
      let page = pages.find(p => p.id == id)
      page.wpid = wpid
      page.wplink = link
      page.wpstatus = status
      state.project.pages = pages
    }
    console.log('_publishPage', state)
  },

  /**
   * Sets the authenticated user to the user passed in the payload
   *
   * @param {object} user : The logged user (authenticated)
   * @see {@link https://developer.github.com/v3/users/#get-the-authenticated-user|Github API v3}
   */
  [types._addAuthenticatedUser]: function (state, user) {
    state.oauth.authenticatedUser = user
  },

  /**
   * Removes the authenticatedUser (sets it to NULL)
   */
  [types._removeAuthenticatedUser]: function (state) {
    state.oauth.authenticatedUser = null
  }
}

const authMutations = {
  ...internalAuthMutations
}

export default authMutations
