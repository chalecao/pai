import shortid from 'shortid'
import newPage from './pageFactory'

function newProject(title) {
  return {
    id: shortid.generate(),
    title: title,
    components: [],
    customComponents: [],//自定义组件合集
    marketComponents: [],//只记录id即可
    pages: [newPage('Home', '/')]
  }
}

export default newProject
