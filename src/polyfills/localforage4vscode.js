// eslint-disable-next-line no-undef
import localforage from "localforage"
if (window.acquireVsCodeApi) {
  const vscode = acquireVsCodeApi()
  const localforage4vscode = {
    hook: () => { },
    onInit: (hook) => {
      localforage4vscode.hook = hook
    },
    config: () => {

    },
    getItem: (key) => {
      const preState = vscode.getState()
      return preState ? preState[key] : ''
    },
    setItem: (key, value) => {
      let preState = vscode.getState()
      if (!preState) preState = {}
      preState[key] = value
      vscode.setState(preState)
      vscode.postMessage({
        command: 'saveState',
        text: JSON.stringify(vscode.getState())
      })
    },
    clear: () => {
      vscode.setState({})
    }
  }

  // Handle messages sent from the extension to the webview
  window.addEventListener('message', event => {
    const message = event.data // The json data that the extension sent
    switch (message.command) {
      case 'updateState':
        vscode.setState(JSON.parse(message.text))
        localforage4vscode.hook()
        break

    }
  })
}
export default window.acquireVsCodeApi ? localforage4vscode : localforage
