import localforage from '@/polyfills/localforage4vscode'
import showSnackbar from '@/helpers/showSnackbar'
import types from '@/store/types'
import auth from '@/auth'
import WPAPI from "wpapi/browser/wpapi";
import { generateH5 } from "@/factories/html5Factory"
import { handleComa } from '@/mixins/util'

const authActions = {
  /**
   * [description]
   * @return {[type]} [description]
   */
  [types.checkAuth]: async function ({ state, commit }) {
    commit(types._toggleLoadingStatus, true)
    console.log('checkAuth')
    let username = await localforage.getItem('gh-user')
    let password = await localforage.getItem('gh-token')
    let host = await localforage.getItem('gh-host')

    if (!username || !password || !host) {
      if (state.oauth.isAuthorized) { commit(types._toggleAuthorizationStatus, false) }
      if (state.oauth.authenticatedUser !== null) { commit(types._removeAuthenticatedUser) }
    } else {
      let wp = new WPAPI({
        endpoint: host + "/wp-json",
        // This assumes you are using basic auth, as described further below
        username: username,
        password: password
      });
      wp.users().me().then(function (response) {
        console.log(response)
        commit(types._toggleAuthorizationStatus, { host, wp, username, id: response.id })
      }).catch(e => {
        commit(types._toggleAuthorizationStatus, null)
      })
    }

    commit(types._toggleLoadingStatus, false)
  },

  /**
   * [description]
   * @return {[type]} [description]
   */
  [types.logIn]: async function ({ state, commit, dispatch }, { wphost, username, password }) {
    let host = (wphost || state.app.wpmain)
    let wp = new WPAPI({
      endpoint: host + "/wp-json",
      // This assumes you are using basic auth, as described further below
      username: username,
      password: password
    });

    wp.users().me().then(function (response) {
      // console.log(response)
      localforage.setItem('gh-user', username)
      localforage.setItem('gh-token', password)
      localforage.setItem('gh-host', host)
      commit(types._toggleAuthorizationStatus, { host, wp, username, id: response.id })
      dispatch(types.pullProject)
    }).catch(e => {
      commit(types._toggleAuthorizationStatus, null)
    })

  },

  /**
   * 拉取项目
   * @param {*} param0 
   * @param {*} param1 
   */
  [types.pullProject]: async function ({ state, commit }) {
    let userId = state.oauth.userId
    let username = state.oauth.authenticatedUser

    state.wp.pages().param('author', userId).param('status', 'draft').param('search', username).then(pages => {
      let page = pages.find(page => page.author == userId && page.title.rendered == username)
      if (page) {
        console.log(handleComa(page.content.rendered))
        if (!page.content.rendered) return;
        let project = JSON.parse(handleComa(page.content.rendered))
        console.log(project)
        if (!project || Object.keys(project).length < 1) return;
        commit(types.mergeProjectFromWp, { project })
      }
    })
  },
  /**
   * 组件库发布到wp
   * @return {[type]} [description]
   */
  [types.pubComp2market]: async function ({ state, commit, dispatch }, { name, price }) {
    let parentPageId = types.paiComponentMarket
    let cust = JSON.stringify(state.project.customComponents)
    let userId = state.oauth.userId
    let userName = state.oauth.authenticatedUser
    state.wp.pages().create({
      title: `${name}-${userId}-${userName}`,
      content: cust,
      parent: parentPageId
    }).then(function (response) {
      console.log('pubComp2market', response)
    }).catch(e => {
    })

  },
  /**
   * 页面发布到wp
   * @return {[type]} [description]
   */
  [types.publishPage]: async function ({ state, commit, dispatch }, { page, status, succCB }) {
    console.log(page)
    // console.log(generateH5(page))
    let pageHtml = generateH5(page)
    let userId = state.oauth.userId
    let pageTitle = `${page.name}-${page.id}`
    commit(types._toggleLoadingStatus, true)

    if (page.wpid) {
      state.wp.pages().id(page.wpid).update({
        title: pageTitle,
        content: pageHtml,
        status
      }).then(function (response) {
        console.log('publishPage', response)
        commit(types._publishPage, { id: page.id, wpid: response.id, link: response.link, status })
        dispatch(types.checkLastSaved)
        commit(types._toggleLoadingStatus, false)
        succCB && succCB()

      }).catch(e => {
        commit(types._publishPage, {})
        commit(types._toggleLoadingStatus, false)
      })
    } else {
      state.wp.pages().param('author', userId).param('status', 'draft').param('search', pageTitle).then(pages => {
        let draftPage = pages[0]
        if (draftPage) {
          state.wp.pages().id(draftPage.id).update({
            content: pageHtml,
            status
          }).then(function (response) {
            console.log('publishPage', response)
            commit(types._publishPage, { id: page.id, wpid: response.id, link: response.link, status })
            dispatch(types.checkLastSaved)
            commit(types._toggleLoadingStatus, false)
            succCB && succCB()

          }).catch(e => {
            commit(types._publishPage, {})
            commit(types._toggleLoadingStatus, false)
          })
        } else {
          state.wp.pages().create({
            title: pageTitle,
            content: pageHtml,
            status
          }).then(function (response) {
            console.log('publishPage', response)
            commit(types._publishPage, { id: page.id, wpid: response.id, link: response.link, status })
            dispatch(types.checkLastSaved)
            commit(types._toggleLoadingStatus, false)
            succCB && succCB()
          }).catch(e => {
            commit(types._publishPage, {})
            commit(types._toggleLoadingStatus, false)
          })
        }
      })

    }

  },

  /**
   * 同步到wp
   * @return {[type]} [description]
   */
  [types.syncProject2wp]: async function ({ state, dispatch, commit }) {

    dispatch(types.checkLastSaved)

    let wp = state.wp;
    if (!wp) return;

    let userId = state.oauth.userId
    let username = state.oauth.authenticatedUser
    const project = state.project
    const projectB64 = (JSON.stringify(project))

    let wp_page = await wp.pages().param('author', userId).param('status', 'draft').param('search', username)
    console.log('syncProject2wp', wp_page)
    let page = wp_page[0]
    if (page) {
      wp.pages().id(page.id).update({
        title: username,
        content: projectB64,
      }).then(function (response) {
        console.log(response);
        commit(types._syncProject2wp, true)
        dispatch(types.checkLastSaved)
      }).catch(e => {
        commit(types._syncProject2wp, false)
      })

    } else {
      wp.pages().create({
        title: username,
        content: projectB64,
      }).then(function (response) {
        console.log(response);
        commit(types._syncProject2wp, true)
        dispatch(types.checkLastSaved)
      }).catch(e => {
        commit(types._syncProject2wp, false)
      })
    }
  },

  /**
   * [description]
   * @return {[type]} [description]
   */
  [types.logOut]: async function ({ commit }) {
    console.log('logOut')
    commit(types._toggleLoadingStatus, true)

    await localforage.clear()
    commit(types._removeAuthenticatedUser)
    commit(types._toggleAuthorizationStatus, false)

    commit(types._toggleLoadingStatus, false)
  }
}

export default authActions
