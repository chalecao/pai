const baseCss = `
html,body{
  margin:0;
  padding:0;
}
`.replace(/[\r\n]/g, "")
const generateStyle = (obj) => {
  let css = ''
  let { width, height, top, left, right, bottom, id, styles } = obj
  let styObj = { ...styles, width, height, top, left, right, bottom }
  for (let attr in styObj) {
    css += `${attr}:${styObj[attr]};`
  }
  id = id.replace(/\./g, '')
  return `#${id}{${css}}`
}

export const generateAllHtml = (obj) => {
  let { type = 'div', attrs, id, text = "" } = obj
  id = id.replace(/\./g, '')
  return `<${type} id="${id}" ${
    attrs ? Object.keys(attrs).map(at => {
      return `${at}="${attrs[at]}"`
    }).join(" ") : ""
    }>${
    obj.children.length ?
      obj.children.map(item => {
        return generateAllHtml(item)
      }).join('') : text

    }</${type}>`
}

export const generateAllCss = (obj) => {
  let combCss = generateStyle(obj)
  obj.children.forEach(item => {
    combCss += generateAllCss(item)
  })
  return combCss
}

export const generateCode = (obj, type) => {
  let code = ''
  switch (type) {
    case 'html':
      code = generateAllHtml(obj)
      break;
  }
  return code;
}

export const generateCodeCss = (obj, type) => {
  let code = ''
  switch (type) {
    case 'html':
      code = generateAllCss(obj)
      break;
  }
  return code;
}

/**
 * page:{ children, name, }
 * @param {*} page 
 */
export const generateH5 = (page) => {
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no" name="viewport">
    <meta content="yes" name="apple-mobile-web-app-capable">
    <meta content="black" name="apple-mobile-web-app-status-bar-style">
    <meta content="yes" name="apple-mobile-web-app-capable">
    <meta content="black" name="apple-mobile-web-app-status-bar-style">
    <meta content="telephone=no" name="format-detection">
    <meta content="email=no" name="format-detection">
    <title>`.replace(/[\r\n]/g, "") + page.name +
    `</title><style>` +
    `${baseCss}${generateAllCss(page)}` +
    `</style></head><body>` +
    generateAllHtml(page) +
    `</body></html>`
}