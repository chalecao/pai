<template>
  <div class="menus-wrapper">
    <div class="selection-title__wrapper" :title="selectionTitle">
      <svgicon :icon="'system/elements/'+selectionIcon" width="22" height="22" :original="true"></svgicon>
      <span class="selection-title">{{selectionTitle}}</span>
    </div>

    <page-settings
      v-if="(selectionType === 'page')"
      :height="height"
      :width="width"
      :styles="styles"
      :title="title"
      @propchange="onPropChange"
    ></page-settings>

    <global-settings
      v-if="(selectionType === 'global')"
      :zIndex="zIndex"
      :top="top"
      :left="left"
      :bottom="bottom"
      :right="right"
      @propchange="onPropChange"
    ></global-settings>

    <component-settings
      v-if="(selectionType === 'component' || selectionType === 'multiple')"
      :top="top"
      :left="left"
      :bottom="bottom"
      :right="right"
      :zIndex="zIndex"
      :height="height"
      :width="width"
      :styles="styles"
      @propchange="onPropChange"
    ></component-settings>

    <element-settings
      v-if="(selectionType === 'element')"
      :top="top"
      :left="left"
      :bottom="bottom"
      :right="right"
      :zIndex="zIndex"
      :height="height"
      :width="width"
      :text="text"
      :styles="styles"
      :classes="classes"
      :dependency="dependency"
      :attrs="attrs"
      :displayName="displayName"
      @propchange="onPropChange"
    ></element-settings>

    <mdc-settings
      v-if="(selectionType === 'mdc')"
      :top="top"
      :left="left"
      :bottom="bottom"
      :right="right"
      :zIndex="zIndex"
      :height="height"
      :width="width"
      :text="text"
      :external="external"
      :styles="styles"
      :attrs="attrs"
      @propchange="onPropChange"
    ></mdc-settings>
  </div>
</template>


<script>
import cloneDeep from "clone-deep";
import { mapState, mapMutations } from "vuex";
import { updatePage, updateEgglement } from "@/store/types";

import PageSettings from "./submenus/PageSettings.vue";
import ElementSettings from "./submenus/ElementSettings.vue";
import ComponentSettings from "./submenus/ComponentSettings.vue";
import MdcSettings from "./submenus/MdcSettings.vue";
import GlobalSettings from "./submenus/GlobalSettings.vue";

import WebSafeFonts from "@/assets/WebSafeFonts";
import "@/assets/icons/system/editor/";
import "@/assets/icons/system/elements/";

export default {
  name: "settings-menu",
  components: {
    PageSettings,
    ElementSettings,
    ComponentSettings,
    MdcSettings,
    GlobalSettings
  },
  data: function() {
    return {
      title: null,
      displayName: null,
      text: null,
      height: null,
      lineHeight: null,
      width: null,
      top: null,
      left: null,
      bottom: null,
      right: null,
      zIndex: "auto",
      external: "",
      attrs: {},
      styles: {},
      classes: {},
      dependency: {},
      webSafeFonts: WebSafeFonts
    };
  },
  computed: {
    selectionTitle() {
      return this.selectedElements.length === 0
        ? "Page"
        : this.selectedElements.length > 1
        ? "Multiple Items"
        : this.selectedElements[0].displayName || this.selectedElements[0].name;
    },
    selectionIcon() {
      return this.selectedElements.length === 0
        ? "page"
        : this.selectedElements.length > 1
        ? "multiple"
        : this.selectedElements[0].global
        ? "globe"
        : this.selectedElements[0].external
        ? "mdc"
        : this.selectedElements[0].componegg
        ? "component"
        : this.selectedElements[0].name.toLowerCase();
    },
    selectionType() {
      return this.selectedElements.length === 0
        ? "page"
        : this.selectedElements.length > 1
        ? "multiple"
        : this.selectedElements[0].global
        ? "global"
        : this.selectedElements[0].external
        ? "mdc"
        : this.selectedElements[0].componegg
        ? "component"
        : "element";
    },
    selectedItem() {
      return this.selectedElements.length === 0
        ? this.activePage
        : this.selectedElements.length > 1
        ? this.selectedElements
        : this.selectedElements[0];
    },

    ...mapState({
      activePage: state => state.app.selectedPage,
      selectedElements: state => {
        console.log("selectedElements");
        return state.app.selectedElements;
      }
    })
  },
  methods: {
    onPropChange(changeData) {
      console.log("changeData", changeData);
      if (changeData.value === "") return;
      let newValue = {};

      if (
        typeof changeData.value === "string" &&
        !isNaN(changeData.value) &&
        changeData.value.indexOf("%") === -1 &&
        changeData.value !== "auto"
      ) {
        this[changeData.type] = newValue[changeData.type] = parseInt(
          changeData.value
        );
      } else {
        this[changeData.type] = newValue[changeData.type] = changeData.value;
      }

      this.saveChanges(newValue);
    },

    saveChanges(newValue) {
      if (this.selectionType === "page") {
        this.updatePage({ page: this.activePage, ...newValue });
      } else if (this.selectionType === "multiple") {
        this.selectedItem.map(egglement =>
          this.updateEgglement({ egglement, ...newValue })
        );
      } else {
        this.updateEgglement({ egglement: this.selectedItem, ...newValue });
      }
    },

    ...mapMutations([updatePage, updateEgglement])
  },
  watch: {
    selectedItem: function(val) {
      console.log(val);
      if (val !== null) {
        if (Array.isArray(val)) {
          this.displayName = this.text = this.height = this.width = this.top = this.left = this.bottom = this.right = null;
          this.attrs = this.styles = this.classes = this.dependency = {};
          this.zIndex = "auto";
        } else {
          this.displayName = val.displayName ? val.displayName : "";
          this.text = val.text ? val.text : null;
          this.height =
            val.height && typeof val.height !== "undefined"
              ? val.height.toString()
              : null;
          this.width =
            val.width && typeof val.width !== "undefined"
              ? val.width.toString()
              : null;
          this.top =
            val.top && typeof val.top !== "undefined"
              ? val.top.toString()
              : null;
          this.left =
            val.left && typeof val.left !== "undefined"
              ? val.left.toString()
              : null;
          this.bottom =
            val.bottom && typeof val.bottom !== "undefined"
              ? val.bottom.toString()
              : null;
          this.right =
            val.right && typeof val.right !== "undefined"
              ? val.right.toString()
              : null;
          this.zIndex =
            val.zIndex && typeof val.zIndex !== "undefined"
              ? val.zIndex
              : "auto";
          this.attrs = val.attrs ? cloneDeep(val.attrs) : {};
          this.styles = val.styles ? cloneDeep(val.styles) : {};
          this.classes = val.classes ? cloneDeep(val.classes) : {};
          this.dependency = val.dependency ? cloneDeep(val.dependency) : {};
          this.external = val.external;
          this.title = val.title || "";
        }
      }
    }
  }
};
</script>

<style>
.menus-wrapper input {
  font-size: 0.813rem !important;
}
</style>

<style scoped>
.menus-wrapper {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  height: calc(100% - 58px);
  width: 100%;
  position: absolute;
  overflow-y: auto;
}

.selection-title__wrapper {
  display: inline-flex;
  user-select: none;
  min-height: 22px;
  max-height: 22px;
  padding: 12px 16px;
  background-color: #ffffff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
.selection-title__wrapper svg {
  min-width: 22px;
}
.selection-title {
  padding: 2px 0 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu {
  width: 100%;
  height: 100%;
  margin: 1px;
  margin-bottom: 10px;
  display: grid;
}
.dimension-menu,
.position-menu {
  grid-template-columns: repeat(2, 1fr);
}
.text-menu,
.color-menu,
.image-menu {
  grid-template-columns: repeat(1, 1fr);
}

.icon-bar {
  user-select: none;
  text-align: center;
  margin: 16px 0 4px;
}
.icon-bar svg {
  margin: 0 15px;
  cursor: pointer;
}

.text-input,
.item-wrapper {
  margin: 0 20px 10px;
}

.color-picker__wrapper {
  display: inline-flex;
  margin: 16px 20px 8px;
}

.slider__wrapper {
  display: inline-flex;
  margin: 0 20px;
}
.slider__wrapper svg {
  margin: 12px 0 0 10px;
}

.mini-text-input {
  margin: 0 20px;
}
</style>
