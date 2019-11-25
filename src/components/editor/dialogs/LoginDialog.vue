<template>
  <dialog>
    <p class="upload-dialog__title">登录WP账号</p>
    <div class="upload-dialog__content">
      <mdc-textfield v-model="wphost" label="WordPress地址" required class="upload-dialog__input" />
      <mdc-textfield
        v-model="account"
        @input="checkPasswd"
        label="账号"
        required
        class="upload-dialog__input"
      />
      <mdc-textfield
        v-model="passwd"
        label="密码"
        @input="checkPasswd"
        :helptext="repoError"
        minlength="1"
        helptext-validation
        helptext-persistent
        required
        class="upload-dialog__input"
        :class="{'mdc-text-field--invalid': repoError}"
      />
    </div>
    <div class="upload-dialog__actions">
      <mdc-button @click="onLogin" unelevated :disabled="!valid">登录</mdc-button>
      <mdc-button @click="closeDialog">取消</mdc-button>
    </div>
  </dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { logIn } from "@/store/types";
import dialogPolyfill from "dialog-polyfill/dialog-polyfill";
import localforage from "@/polyfills/localforage4vscode";

export default {
  name: "login-dialog",
  data: function() {
    return {
      valid: false,
      wphost: "",
      account: "",
      passwd: "",
      repoError: ""
    };
  },
  created: function() {
    this.$root.$on("open-login-dialog", this.openDialog);
  },
  beforeDestroy: function() {
    this.$root.$off("open-login-dialog", this.openDialog);
  },
  computed: {
    ...mapState({
      loggedUser: state => state.oauth.authenticatedUser,
      projectTitle: state => (state ? state.project.title : "")
    })
  },
  watch: {
    loggedUser: function(val) {
      console.log("loggedUser", val);
      if (val) {
        this.closeDialog();
      } else {
        this.repoError = "登录失败，请检查账号密码";
      }
    }
  },

  methods: {
    checkPasswd() {
      if (!this.account || !this.passwd || !this.wphost) {
        this.repoError = "请输入完整信息";
      } else {
        this.repoError = "";
      }
      this.valid =
        this.wphost && this.account && this.passwd && !this.repoError;
    },

    async openDialog() {
      if (!this.$el.showModal) {
        dialogPolyfill.registerDialog(this.$el);
      }
      this.$el.showModal();
    },

    onLogin() {
      this.logIn({
        wphost: this.wphost,
        username: this.account,
        password: this.passwd
      });
    },

    resetDialog() {
      this.isValid = false;
      this.repo = "";
      this.repoError = "";
    },

    closeDialog() {
      this.resetDialog();
      this.$el.close();
    },

    ...mapActions([logIn])
  }
};
</script>


<style scoped>
.upload-dialog__title {
  font-size: 24px;
  font-weight: 500;
  padding: 24px 24px 0;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.upload-dialog__content {
  padding: 20px 24px 24px;
  color: rgba(0, 0, 0, 0.54);
}
.upload-dialog__content .upload-dialog__input {
  width: 100%;
}

.upload-dialog__actions {
  padding: 8px 8px 8px 24px;
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: wrap;
}
</style>
