import types from '@/store/types'
import localforage from "@/polyfills/localforage4vscode";

const internalComponentMutations = {
  /**
   * Adds a component reference to the state.project.components array
   *
   * @param {object} componentRef : Component reference for the project
   */
  [types._saveComponentRef]: function (state, componentRef) {
    state.project.components.push(componentRef)
  },

  /**
   * Updates the component reference usage count.
   *
   * @param {number} payload.compIndex : Component's index
   * @param {number} payload.newCount : New usage count
   */
  [types._updateComponentRef]: function (state, payload) {
    state.project.components.splice(payload.compIndex, 1, {
      ...state.project.components[payload.compIndex],
      usageCount: payload.newCount
    })
  },

  /**
   * Removes a component reference from the state.project.components array
   *
   * @param {string} componentRefIndex : Index of the component reference to remove
   */
  [types._removeComponentRef]: function (state, componentRefIndex) {
    state.project.components.splice(componentRefIndex, 1)
  },

  /**
   * 添加自定义组件
   *
   * @param {string} componentJson: compoent JSON schema
   */
  [types._addCustomComponent]: function (state, componentJson) {
    state.project.customComponents.push(componentJson)
  },

  [types._addMarketComponent]: function (state, componentJson) {
    state.project.marketComponents.push(componentJson)
  },

  [types._delMarketComponent]: function (state, index) {
    let marketComponents = []
    state.project.marketComponents.forEach((it, idx) => {
      if (idx != index) {
        marketComponents.push(it)
      }
    })
    console.log(marketComponents, index)
    state.project.marketComponents = marketComponents
  },

  [types._deleteCustomComponent]: function (state, comp) {
    console.log(comp)
    if (comp && comp.id) {
      state.project.customComponents.splice(state.project.customComponents.findIndex(com => com.id == comp.id), 1)
    }
  },


  /**
   * 加载自定义组件
   *
   * @param {string} componentJson: compoent JSON schema
   */
  [types._loadCustomComponent]: async function (state, componentJson) {
    state.project.customComponents = componentJson
  },
}

const componentMutations = {
  ...internalComponentMutations
}

export default componentMutations
