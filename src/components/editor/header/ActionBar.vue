<template>
  <div class="action-bar__wrapper">
    <button v-if="isSyncing" title="syncing" :disabled="true" class="action-btn syncing">
      <svgicon icon="system/actions/sync" width="24" height="24" color="rgba(0,0,0,.38)"></svgicon>
    </button>

    <button v-tooltip="'撤销'" class="action-btn" :disabled="!canUndo" @click="$root.$emit('undo')">
      <svgicon
        icon="system/actions/undo"
        width="24"
        height="24"
        :color="canUndo ? '#2b6a73' : 'rgba(0,0,0,.38)'"
      ></svgicon>
    </button>

    <button v-tooltip="'重做'" class="action-btn" :disabled="!canRedo" @click="$root.$emit('redo')">
      <svgicon
        icon="system/actions/redo"
        width="24"
        height="24"
        :color="canRedo ? '#2b6a73' : 'rgba(0,0,0,.38)'"
      ></svgicon>
    </button>

    <router-link :to="{name: 'preview'}">
      <button v-tooltip="'预览'" class="action-btn">
        <svgicon icon="system/actions/preview" width="24" height="24" color="#2b6a73"></svgicon>
      </button>
    </router-link>

    <div class="separator"></div>

    <button
      v-tooltip="'清空'"
      class="action-btn"
      :disabled="isLoading"
      @click="$root.$emit('open-confirm-dialog')"
    >
      <svgicon icon="system/actions/delete" width="24" height="24" color="#2b6a73"></svgicon>
    </button>
    <button
      v-tooltip="'代码'"
      class="action-btn"
      :disabled="isLoading"
      @click="$root.$emit('open-code-dialog')"
    >
      <svgicon icon="system/editor/font" width="24" height="24" color="#2b6a73"></svgicon>
    </button>

    <mdc-menu-anchor>
      <button v-tooltip="'打开'" class="action-btn" :disabled="isLoading" @click="showLoadFromMenu">
        <svgicon icon="system/actions/folder" width="24" height="24" color="#2b6a73"></svgicon>
      </button>
      <mdc-menu ref="loadFromMenu" @select="onSelectLoadFrom">
        <mdc-menu-item disabled>打开项目:</mdc-menu-item>
        <mdc-menu-divider></mdc-menu-divider>
        <mdc-menu-item>
          <input
            type="file"
            ref="inputOpenLocal"
            @change="openLocalFile"
            :value="fileValue"
            accept=".gg"
          />
          本地
        </mdc-menu-item>
        <mdc-menu-item>URL地址</mdc-menu-item>
      </mdc-menu>
    </mdc-menu-anchor>

    <!-- <mdc-menu-anchor>
      <button v-tooltip="'下载'" class="action-btn" :disabled="isLoading" @click="showDownloadMenu">
        <svgicon icon="system/actions/download" width="24" height="24" color="#2b6a73"></svgicon>
      </button>
      <mdc-menu ref="downloadMenu" @select="onSelectDownload">
        <mdc-menu-item disabled>Download:</mdc-menu-item>
        <mdc-menu-divider></mdc-menu-divider>
        <mdc-menu-item>Vuegg project (.gg)</mdc-menu-item>
        <mdc-menu-item>Vue sources (.zip)</mdc-menu-item>
      </mdc-menu>
    </mdc-menu-anchor>-->

    <div class="separator"></div>
    <mdc-menu-anchor>
      <button
        v-tooltip="saveBtnTitle"
        class="action-btn"
        @contextmenu.exact.stop.prevent="showCloudMenu"
      >
        <svgicon
          icon="system/actions/cloud_off"
          v-if="!isLoggedIn"
          width="24"
          height="24"
          @click="$root.$emit('open-login-dialog')"
          color="rgba(0,0,0,.38)"
        ></svgicon>
        <svgicon
          icon="system/actions/cloud_up"
          v-else-if="hasChanges"
          @click="syncProject"
          width="24"
          height="24"
          color="#2b6a73"
        ></svgicon>
        <svgicon
          icon="system/actions/cloud_done"
          v-else
          width="24"
          height="24"
          color="rgba(0,0,0,.38)"
        ></svgicon>
      </button>
      <mdc-menu ref="cloudMenu" @select="onSelectCloud">
        <mdc-menu-item>登录云π</mdc-menu-item>
        <mdc-menu-item>上传项目</mdc-menu-item>
        <mdc-menu-item>拉取项目</mdc-menu-item>
        <!-- <mdc-menu-item>退出登录</mdc-menu-item> -->
      </mdc-menu>
    </mdc-menu-anchor>
  </div>
</template>


<script>
import { mapState, mapActions } from "vuex";
import {
  downloadProject,
  downloadVueSources,
  loadVueggProject,
  syncProject2wp,
  logOut,
  pullProject
} from "@/store/types";

import "@/assets/icons/system/actions";

export default {
  name: "action-bar",
  data: function() {
    return {
      fileValue: null
    };
  },
  computed: {
    saveBtnTitle() {
      return !this.isLoggedIn
        ? "登录云π"
        : this.hasChanges
        ? "点击同步"
        : "同步完成";
    },

    ...mapState({
      isLoading: state => state.app.isLoading,
      isSyncing: state => state.app.isSyncing,
      hasChanges: state => state.app.hasChanges,
      canUndo: state => state.app.canUndo,
      canRedo: state => state.app.canRedo,
      isLoggedIn: state => state.oauth.isAuthorized
    })
  },
  mounted() {
    window.addEventListener("beforeunload", e => {
      (e || window.event).returnValue = "确定离开？";
      //注意：这里return方法是不起作用的
    });
  },
  methods: {
    // --- DOWNLOAD MENU METHODS
    showDownloadMenu() {
      this.$refs.downloadMenu.show();
    },
    showCloudMenu() {
      this.$refs.cloudMenu.show();
    },
    onSelectDownload(selected) {
      const PROJECT = 1;
      const SOURCES = 2;

      switch (selected.index) {
        case PROJECT:
          this.downloadProject();
          break;
        case SOURCES:
          this.downloadVueSources();
          break;
      }
    },

    onSelectCloud(selected) {
      console.log(selected.index);
      switch (selected.index) {
        case 0:
          this.$root.$emit("open-login-dialog");
          break;
        case 1:
          this.syncProject();
          this.$message.info("同步中，请稍后...");
          break;
        case 2:
          this.pullProject();
          this.$message.info("拉取项目中，请稍后...");
          break;
        case 3:
          this.exitAccount();
          break;
      }
    },

    // --- LOAD FROM MENU METHODS
    showLoadFromMenu() {
      this.$refs.loadFromMenu.show();
    },
    onSelectLoadFrom(selected) {
      const PC = 1;
      const URL = 2;

      switch (selected.index) {
        case URL:
          this.$root.$emit("open-load-dialog");
          break;
        case PC:
          this.fileValue = null;
          this.$refs.inputOpenLocal.click();
          break;
      }
    },
    openLocalFile(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = e =>
        this.loadVueggProject({ origin: "pc", content: e.target.result });
      reader.readAsText(file);
    },
    syncProject() {
      this.syncProject2wp();
    },
    exitAccount() {
      this.logOut();
    },

    ...mapActions([
      downloadProject,
      downloadVueSources,
      loadVueggProject,
      syncProject2wp,
      logOut,
      pullProject
    ])
  }
};
</script>


<style scoped>
.action-bar__wrapper {
  height: 100%;
  display: flex;
  flex-shrink: 0;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-self: stretch;
  align-items: center;
  box-sizing: border-box;
}

.action-btn {
  height: 36px;
  width: 36px;
  min-width: 28px;
  min-height: 28px;
  padding: 1px;
  margin: 0 6px;
  border-radius: 100%;

  background-color: transparent;
  border: 0px none;
  user-select: none;
  outline: none;
}
.action-btn:hover {
  background-color: rgba(43, 106, 115, 0.038);
}
.action-btn:active {
  background-color: rgba(43, 106, 115, 0.38);
}
.action-btn * {
  vertical-align: middle;
}

.mdc-menu {
  background-color: #fff;
  transform-origin: right top 0 !important;
  top: 0px !important;
  right: 0px;
  left: auto !important;
}
.mdc-menu-item input {
  display: none;
}

.separator {
  width: 1px;
  height: 16px;
  margin: 0 6px;
  background-color: rgba(0, 0, 0, 0.12);
}

.syncing {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>
