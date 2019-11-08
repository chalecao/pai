/*
  Components from external libraries (ie. vue-mdc-adapter):
  - PARENT -> external, componegg, egglement
  - CHILDREN -> (none)
 */
const fusionComponents = [
  // --- DatePicker --- //
  {
    'displayName': '输入框',
    'icon': 'input',
    'name': 'Input',
    'type': 'f-input',
    'dependencies': [
      {
        'name': 'Input',
        'version': '^1.15.6',
        'imports': [
          ['@alifd/next']
        ]
      }
    ],
    'external': 'react',
    'componegg': true,
    'egglement': true,
    'height': 56,
    'width': 170,
    'top': 32,
    'left': 120,
    'attrs': {
      'disabled': false,
      'size': 'medium',
      'placeholder': 'medium',
      'name': 'test'
    },
    'styles': {},
    'classes': {},
    'css': '.next-input>input{width:100%;height:100%;}',
    'children': [
    ]
  }, {
    'displayName': '表单项',
    'icon': 'table',
    'name': 'FormItem',
    'type': 'f-form-item',
    'external': 'react',
    'containegg': true,
    'egglement': true,
    'height': 156,
    'width': 400,
    'top': 32,
    'left': 120,
    'attrs': {
      'labelCol': { fixedSpan: 8 },
      'wrapperCol': { span: 8 },
      'label': 'Select：',
      'labelAlign': 'left',
      'hasFeedback': true,
      required: true,
      requiredMessage: 'Please select your gender',
      'help': 'Please select a country',
      'name': 'test'
    },
    'styles': {},
    'classes': {},
    'css': '',
    'children': [

    ]
  }, {
    'displayName': '表单',
    'icon': 'table',
    'name': 'Form',
    'type': 'f-form',
    'dependencies': [
      {
        'name': 'Form',
        'version': '^1.15.6',
        'imports': [
          ['@alifd/next']
        ]
      }
    ],
    'external': 'react',
    'containegg': true,
    'egglement': true,
    'height': 156,
    'width': 400,
    'top': 32,
    'left': 120,
    'attrs': {
      // 'field': `new Field(this, {
      //   onChange: (name, value) => {
      //   }
      // })`
    },
    'styles': {},
    'classes': {},
    'css': '',
    'children': [
    ]
  }
]

export default fusionComponents
