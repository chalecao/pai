import shortid from 'shortid'

function newPage(name, path, height, width) {
  return {
    wpid: '',
    wplink: '',
    wpstatus: '',
    id: shortid.generate(),
    name: name,
    path: path,
    title: "页面标题",
    width: width || '100%',
    height: height || '100%',
    styles: {
      '--mdc-theme-primary': '#673ab7',
      '--mdc-theme-secondary': '#f44336',
      '--mdc-theme-background': '#ffffff',
      'position': 'relative',
      'margin': 'auto',
      'background-color': '#ffffff',
      'overflow-y': 'auto'
    },
    classes: [],
    children: []
  }
}

export default newPage
