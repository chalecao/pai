import shortid from 'shortid'
import newPage from './pageFactory'

function newProject(title) {
  return {
    id: shortid.generate(),
    title: title,
    components: [],
    customComponents: [],//自定义组件合集
    marketComponents: [],//引用市场的组件合集的合集
    pages: [newPage('Home', '/')]
  }
}

export default newProject
