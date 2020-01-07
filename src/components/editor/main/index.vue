<template>
  <div class="mainegg">
    <stage :style="previewStyle" v-if="selectedPage" :page="selectedPage" :zoom="zoom"></stage>
    <zoom-menu @zoomChange="zoomHandler" :zoom="zoom" class="zoom-menu"></zoom-menu>
    <div class="mainegg-action-bar">
      <button v-tooltip="'phone'" class="action-btn" @click="breakpoint='sm'">
        <svgicon
          icon="system/dev_sm"
          width="24"
          height="24"
          :color="(breakpoint === 'sm') ? '#fff' : 'rgba(255,255,255,.5)'"
        ></svgicon>
      </button>

      <button v-tooltip="'tablet'" class="action-btn" @click="breakpoint='md'">
        <svgicon
          icon="system/dev_md"
          width="24"
          height="24"
          :color="(breakpoint === 'md') ? '#fff' : 'rgba(255,255,255,.5)'"
        ></svgicon>
      </button>

      <button v-tooltip="'full screen'" class="action-btn" @click="breakpoint='lg'">
        <svgicon
          icon="system/dev_lg"
          width="24"
          height="24"
          :color="(breakpoint === 'lg') ? '#fff' : 'rgba(255,255,255,.5)'"
        ></svgicon>
      </button>
    </div>
  </div>
</template>


<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import {
  _changeActivePage,
  _rebaseActivePage,
  _updateEditorZoom,
  getPageIndexById
} from "@/store/types";

import ZoomMenu from "@/components/editor/common/ZoomMenu";
import Stage from "./Stage";

export default {
  name: "mainegg",
  components: { Stage, ZoomMenu },
  created: function() {
    this.selectFallbackPage(this.selectedPage);
  },
  data: function() {
    return {
      breakpoint: "sm"
    };
  },
  computed: {
    previewStyle() {
      return this.breakpoint === "sm"
        ? { height: "640px", width: "360px", paddingTop: "32px" }
        : this.breakpoint === "md"
        ? { height: "768px", width: "1024px", paddingTop: "12px" }
        : { height: "100%", width: "100%" };
    },
    ...mapState({
      selectedPage: state => state.app.selectedPage,
      pages: state => (state ? state.project.pages : []),
      zoom: state => state.app.editorZoom
    }),
    ...mapGetters([getPageIndexById])
  },
  watch: {
    // After a redo/undo action this will apply
    selectedPage: function(val) {
      if (val) {
        let css = new Set();
        let js = new Set();
        let script = new Set();
        val.children.forEach(comp => {
          if (comp.dependency) {
            comp.dependency.css && css.add(comp.dependency.css);
            comp.dependency.js && js.add(comp.dependency.js);
            comp.dependency.script && script.add(comp.dependency.script);
          }
        });
        console.log(css);
        console.log(js);
        console.log(script);
        css.forEach(item => this.addCss(item));
      }
      this.selectFallbackPage(val);
    }
  },
  methods: {
    selectFallbackPage(page) {
      if (!page && this.pages.length > 0) {
        this._changeActivePage(this.pages[0]);
      } else {
        this._rebaseActivePage(this.getPageIndexById(page.id));
      }
    },
    addCss(href) {
      console.log(href);
      if (Object.values(document.styleSheets).find(item => item.href == href)) {
        return;
      }
      var head = document.getElementsByTagName("HEAD").item(0);
      var style = document.createElement("link");
      style.href = href;
      style.rel = "stylesheet";
      style.type = "text/css";
      head.appendChild(style);
    },

    zoomHandler(zoomValue) {
      this._updateEditorZoom(zoomValue);
    },

    ...mapMutations([_changeActivePage, _rebaseActivePage, _updateEditorZoom])
  }
};
</script>

<style scoped>
.mainegg {
  margin: 0 57px;
  height: calc(100% - 64px);
  display: flex;
}

.zoom-menu {
  bottom: 24px;
  left: 24px;
  padding: 0 6px;
  position: fixed;
}
.mainegg-action-bar {
  bottom: 150px;
  left: 24px;
  padding: 15px 3px;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 50px;
  display: flex;
  flex-direction: column;
}
.mainegg-action-bar button {
  background: transparent;
  border: none;
}
</style>
