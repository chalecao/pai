/*
  Components from external libraries (ie. vue-mdc-adapter):
  - PARENT -> external, componegg, egglement
  - CHILDREN -> (none)
 */
const antdComponents = [
  // --- DatePicker --- //
  {
    'displayName': '按钮',
    'icon': 'button',
    'name': 'Button',
    'type': 'a-button',
    'external': true,
    'egglement': true,
    'containegg': true,
    'height': 32,
    'width': 82,
    'top': 32,
    'left': 120,
    'text': 'submit',
    'attrs': {
      'type': { value: 'primary', range: ['primary', 'dashed', 'danger', 'link'] },
      'disabled': false,
      'icon': 'cloud'
    },
    'styles': {

    },
    'classes': {},
    'css': '',
    'children': [
    ]
  },
  {
    'displayName': '表单',
    'icon': 'table',
    'name': 'Form',
    'type': 'a-form',
    'external': true,
    'egglement': true,
    'containegg': true,
    'height': 156,
    'width': 400,
    'top': 32,
    'left': 120,
    'attrs': {
      'onSubmit': 'onSubmit',
      'labelCol': { fixedSpan: 8 },
      'wrapperCol': { span: 8 }
    },
    'styles': {},
    'classes': {},
    'css': '',
    'children': [
    ]
  },
  {
    'displayName': '表单项',
    'icon': 'table',
    'name': 'Form.Item',
    'type': 'a-form-item',
    'external': true,
    'egglement': true,
    'containegg': true,
    'height': 50,
    'width': 400,
    'top': 32,
    'left': 120,
    'attrs': {
      'label': 'label',
      'label-col': { span: 5 },
      'wrapper-col': { span: 12 }
    },
    'styles': {},
    'classes': {},
    'css': '',
    'children': [

    ]
  },
  {
    'displayName': '日期选择',
    'icon': 'date',
    'name': 'DatePicker',
    'type': 'a-date-picker',
    'dependencies': [
      {
        'name': 'DatePicker',
        'version': '^1.3.10',
        'imports': [
          ['ant-design-vue/es/date-picker'],
          'ant-design-vue/es/date-picker/style/css'
        ]
      }
    ],
    'external': true,
    'componegg': true,
    'egglement': true,
    'height': 56,
    'width': 170,
    'minHeight': 32,
    'minWidth': 120,
    'attrs': {
      'disabled': false
    },
    'styles': {},
    'classes': {},
    'css': '',
    'children': [
    ]
  }, {
    'displayName': '日期范围',
    'icon': 'date',
    'name': 'RangePicker',
    'type': 'a-range-picker',
    'dependencies': [
      {
        'name': 'RangePicker',
        'version': '^1.3.10',
        'imports': [
          ['ant-design-vue/es/date-picker'],
          'ant-design-vue/es/date-picker/style/css'
        ]
      }
    ],
    'external': true,
    'componegg': true,
    'egglement': true,
    'height': 56,
    'width': 170,
    'minHeight': 32,
    'minWidth': 120,
    'attrs': {
      'disabled': false,
      'format': 'YYYY-MM-DD HH:mm',
      'showTime': { format: 'HH:mm' },
      'placeholder': ['Start Time', 'End Time']
    },
    'styles': {},
    'classes': {},
    'css': '.mr-el .ant-calendar-picker{width:100% !important}',
    'children': [
    ]
  }, {
    'displayName': '表格',
    'icon': 'table',
    'name': 'Table',
    'type': 'a-table',
    'dependencies': [
      {
        'name': 'Table',
        'version': '^1.3.10',
        'imports': [
          ['ant-design-vue/es/table'],
          'ant-design-vue/es/table/style/css'
        ]
      }
    ],
    'external': true,
    'componegg': true,
    'egglement': true,
    'height': 400,
    'width': 170,
    'minHeight': 100,
    'minWidth': 120,
    'attrs': {
      'disabled': false,
      'columns': [{
        title: 'Name',
        dataIndex: 'name',
        sorter: true,
        width: '20%',
        scopedSlots: { customRender: 'name' }
      }, {
        title: 'Gender',
        dataIndex: 'gender',
        filters: [
          { text: 'Male', value: 'male' },
          { text: 'Female', value: 'female' }
        ],
        width: '20%'
      }],
      'dataSource': [{ 'gender': 'male', 'name': 'dd' }, { 'gender': 'male', 'name': 'dd' }],
      'pagination': { pageSize: 10, current: 1, total: 20 },
      'loading': false
    },
    'styles': {},
    'classes': {},
    'css': '',
    'children': [
    ]
  }
]

export default antdComponents
