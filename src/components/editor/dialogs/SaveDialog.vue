<template>
  <dialog class="save-dialog">
    <a-form @submit="handleSubmit">
      <a-form-item label="前端框架" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-select defaultValue="react" @change="handleSelectChange">
          <a-select-option value="html">Base HTML</a-select-option>
          <a-select-option value="react">React</a-select-option>
          <a-select-option value="vue">Vue</a-select-option>
        </a-select>
      </a-form-item>
      <a-tabs defaultActiveKey="1">
        <a-tab-pane tab="html/js/jsx" key="1">
          <pre v-highlightjs :key="componentType" class="save-code-preview">
            <code class="javascript">
    {{html}}
            </code>
          </pre>
        </a-tab-pane>
        <a-tab-pane tab="css" key="2" forceRender>
          <pre v-highlightjs :key="componentType" class="save-code-preview">
            <code class="javascript">
    {{css}}
            </code>
          </pre>
        </a-tab-pane>
      </a-tabs>
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
import { generateCode, generateCodeCss } from "@/factories/html5Factory";
export default {
  name: "save-dialog",
  created: function() {
    this.$root.$on("open-code-dialog", this.openDialog);
  },
  beforeDestroy: function() {
    this.$root.$off("open-code-dialog", this.openDialog);
  },
  data() {
    return {
      formLayout: "horizontal",
      form: this.$form.createForm(this),
      componentType: "react",
      html: "",
      css: ""
    };
  },
  computed: {
    ...mapState({
      project: state => state.project,
      activePage: state => state.app.selectedPage
    })
  },
  watch: {
    componentType(val) {
      console.log(val);
      this.html = generateCode(this.activePage, val);
      this.css = generateCodeCss(this.activePage, val);
    }
  },
  methods: {
    generateCode(page, type) {
      return generateCode(page, type);
    },
    generateCodeCss(page, type) {
      return generateCodeCss(page, type);
    },
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
