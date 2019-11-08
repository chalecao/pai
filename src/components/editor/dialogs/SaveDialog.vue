<template>
  <dialog class="save-dialog">
    <a-form @submit="handleSubmit">
      <a-form-item label="Base Component Set" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-select
          defaultValue="antd"
          placeholder="select the base component set"
          @change="handleSelectChange"
        >
          <a-select-option value="html">Base HTML</a-select-option>
          <a-select-option value="antd">Antd React</a-select-option>
          <a-select-option value="fusion">Fusion React</a-select-option>
        </a-select>
      </a-form-item>
      <pre v-highlightjs :key="componentType" class="save-code-preview">
          <code class="javascript">
import React, { useContext } from 'react'
import * as yup from 'yup'
{{ComponentConfig[componentType].comp}}
import moment from 'moment'
import {ConfigForm} from 'config-component'
{{ComponentConfig[componentType].css}}

export default function App() {
  const [data, setData] = useState({
    firstName: 'hello world',
    lastName: 'how are you',
    desc: 'something you know',
    items: [],
    img: IMG,
  })
  useEffect(() => {
    setTimeout(() => {
      setData({
        firstName: 'haha',
        lastName: 'fine, thank you',
        img: '',
        items: [1, 2, 3, 4],
      })
    }, 1000)
  }, [])
  const onChangeWrapper = (e) => {
    console.log(e)
  }
  return (
    <ConfigComponent
      uiConfig={{
        items: [
          {
            comp: 'h2',
            children: data.firstName,
            props: {
              onClick: onChangeWrapper,
            },
          },
          {
            comp: 'div',
            children: [
              {
                comp: 'p',
                children: 'hello',
              }, {
                comp: 'p',
                children: 'world',
              },
            ],
          },
          {
            comp: 'p',
            children: data.lastName,
          },
          {
            comp: 'img',
            props: {
              width: '100px',
              src: data.img || EmptyImg,
            },
          },
          {
            label: 'desc: ',
            comp: 'p',
            children:
              'configComponent support html tag or components you defined with componentSet variable.',
            props: {},
          },
        ],
      }}
    />
  )
}
          </code>
        </pre>

      <a-form-item :wrapper-col="{ span: 6, offset: 18 }">
        <a-button class="cancel-btn" @click="closeDialog">cancel</a-button>
        <a-button type="primary" html-type="submit">Generate</a-button>
      </a-form-item>
    </a-form>
  </dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { clearProject } from "@/store/types";
import dialogPolyfill from "dialog-polyfill/dialog-polyfill";

export default {
  name: "save-dialog",
  created: function() {
    this.$root.$on("open-save-dialog", this.openDialog);
  },
  beforeDestroy: function() {
    this.$root.$off("open-save-dialog", this.openDialog);
  },
  data() {
    return {
      formLayout: "horizontal",
      form: this.$form.createForm(this),
      componentType: "antd",
      ComponentConfig: {
        antd: {
          comp: "import * as Components from 'antd'",
          css: "import 'antd/dist/antd.css'"
        },
        fusion: {
          comp: "import * as Components from '@alifd/next'",
          css: "import '@alifd/next/dist/next.css'"
        },
        html: {
          comp: "",
          css: ""
        }
      }
    };
  },
  computed: {
    ...mapState({
      project: state => state.project
    })
  },
  methods: {
    openDialog() {
      if (!this.$el.show) {
        dialogPolyfill.registerDialog(this.$el);
      }
      this.$el.show();
      console.log(this.project);
    },

    onConfirm() {
      this.clearProject();
      this.closeDialog();
    },

    handleSelectChange(value) {
      console.log(value);
      this.componentType = value;
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
        }
        this.closeDialog();
      });
    },
    closeDialog() {
      this.$el.close();
    },

    ...mapActions([clearProject])
  }
};
</script>


<style scoped>
.save-dialog {
  width: 850px !important;
  top: 100px;
  z-index: 1049;
  padding-bottom: 0;
}
.save-code-preview {
  margin: 0;
  padding: 0;
  margin-top: -20px;
  display: block;
  left: 0;
  height: 400px;
  background: #f6f6f6;
}
.cancel-btn {
  margin-right: 10px;
  margin-top: 10px;
}
</style>
