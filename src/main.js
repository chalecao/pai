import Vue from 'vue'
import VueSVGIcon from 'vue-svgicon'
import VueMDCAdapter from 'vue-mdc-adapter'
import Antd from 'ant-design-vue'
import Tooltip from 'vue-directive-tooltip'
import { VuePlugin } from 'vuera'
import localforage from '@/polyfills/localforage4vscode'
import VueHighlightJS from 'vue-highlightjs'
import 'highlight.js/styles/atom-one-dark.css'

import App from './App'
import router from './router/'
import store from './store/'

import './theme.scss'

import 'normalize.css'
import 'dialog-polyfill/dialog-polyfill.css'
import 'vue-directive-tooltip/dist/vueDirectiveTooltip.css'
import 'ant-design-vue/dist/antd.css'

localforage.config({ name: 'vuegg' })
Vue.use(VueHighlightJS)
Vue.use(VueSVGIcon)
Vue.use(VueMDCAdapter)
Vue.use(Antd)
Vue.use(VuePlugin)
Vue.use(Tooltip, {
  class: 'tooltip-vuegg',
  placement: 'bottom',
  delay: 50
})

Vue.config.productionTip = false

/* eslint-disable no-new */
const vm = new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})

export default vm
