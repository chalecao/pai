import newProject from './projectFactory'

function newState(project) {
  return {
    app: {
      wpmain: 'https://www.fed123.com',
      isLoading: false,
      isBlockLoading: false,
      hasChanges: false,
      isSyncing: false,
      canUndo: false,
      canRedo: false,
      pageDialog: {
        isNew: true,
        isOpen: false
      },
      selectedPage: null,
      selectedElements: [],
      customComponents: [],
      editorZoom: 1
    },
    wp: null,
    oauth: {
      wphost: '',
      userId: null,
      isAuthorized: null,
      authenticatedUser: null
    },
    project: project || newProject('component name')
  }
}

export default newState
