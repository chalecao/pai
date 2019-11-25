<template>
  <div class="menus-wrapper">
    <div class="el-menu-tree">
      <!-- 嵌套不要超过3层 -->
      <div
        :class="getClass(element.id)"
        :key="element.id"
        v-for="element in (selectedPage?selectedPage.children:[])"
        :title="element.name"
        draggable="true"
        @click.stop.prevent="e => selectItemInStage(e, element)"
        @contextmenu.exact.stop.prevent="showOptsMenu(element)"
      >
        <svgicon
          :icon="'system/elements/'+getIcon(element)"
          width="16"
          height="16"
          color="rgba(0,0,0,.87)"
        ></svgicon>
        <span>{{element.text || element.displayName|| element.name }}</span>
        <span class="ele-menu-tree__end-detail">
          <mdc-menu-anchor>
            <svgicon
              icon="system/more_vert"
              width="24"
              height="24"
              @click.stop.prevent="showOptsMenu(element)"
            ></svgicon>
            <mdc-menu :ref="'menu-'+element.id" @select="(selected)=>onSelect(selected, element)">
              <mdc-menu-item>生成组件</mdc-menu-item>
            </mdc-menu>
          </mdc-menu-anchor>
        </span>
        <div v-if=" element.children.length">
          <div
            :class="getClass(element.id)"
            :key="element.id"
            v-for="element in element.children"
            :title="element.name"
            draggable="true"
            @click.stop.prevent="e => selectItemInStage(e, element)"
          >
            <svgicon
              :icon="'system/elements/'+ getIcon(element)"
              width="16"
              height="16"
              color="rgba(0,0,0,.87)"
            ></svgicon>
            <span>{{element.text || element.displayName|| element.name }}</span>
            <div v-if="element.children.length">
              <div
                :class="getClass(element.id)"
                :key="element.id"
                v-for="element in element.children"
                :title="element.name"
                draggable="true"
                @click.stop.prevent="e => selectItemInStage(e, element)"
              >
                <svgicon
                  :icon="'system/elements/'+ getIcon(element)"
                  width="16"
                  height="16"
                  color="rgba(0,0,0,.87)"
                ></svgicon>
                <span>{{element.text || element.displayName|| element.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import {
  getComputedProp,
  fixElementToParentBounds
} from "@/helpers/positionDimension";

import {
  _changeActivePage,
  _rebaseActivePage,
  registerElement,
  getPageIndexById,
  _clearSelectedElements,
  _addSelectedElements,
  moveElement,
  rebaseSelectedElements,
  addCustomComponent
} from "@/store/types";
import basicElements from "@/assets/BasicElements";

import MenuToggle from "@/components/editor/common/MenuToggle";
import cloneDeep from "clone-deep";

import "@/assets/icons/system/elements/";

export default {
  name: "elements-menu",
  components: { MenuToggle },
  data: function() {
    return {
      elements: basicElements
    };
  },
  computed: {
    ...mapState({
      selectedElements: state => state.app.selectedElements || [],
      pages: state => (state ? state.project.pages : []),
      selectedPage: state => state.app.selectedPage,
      activePage: state => state.app.selectedPage
    }),
    ...mapGetters([getPageIndexById])
  },
  watch: {
    // After a redo/undo action this will apply
    selectedPage: function(val) {
      console.log(val);
      this.selectFallbackPage(val);
    }
  },
  methods: {
    showOptsMenu(ele) {
      this.$refs["menu-" + ele.id][0].show();
    },
    onSelect(selected, element) {
      const MAKE_COMPONENT = 0;

      switch (selected.index) {
        case MAKE_COMPONENT:
          // todo
          let el = cloneDeep(element);
          // const componnetSchema = JSON.stringify(element)
          this.addCustomComponent(el);
          break;
      }
    },
    getClass(id) {
      if (this.selectedElements.find(item => item.id == id)) {
        return "el-menu-tree__el selected";
      } else {
        return "el-menu-tree__el";
      }
    },
    getIcon(element) {
      return element.icon || element.name;
    },
    selectFallbackPage(page) {
      if (!page && this.pages.length > 0) {
        this._changeActivePage(this.pages[0]);
      } else {
        this._rebaseActivePage(this.getPageIndexById(page.id));
      }
    },
    selectItemInStage(e, item) {
      this._addSelectedElements([item]);
      if (this.selectedElements.length > 0) {
        document.querySelector(".mr-container").focus();
      }
    },
    initItem(item) {
      return {
        zIndex: "auto",
        top: 0,
        left: 0,
        bottom: "auto",
        right: "auto",
        ...item
      };
    },

    ...mapActions([
      registerElement,
      moveElement,
      rebaseSelectedElements,
      addCustomComponent
    ]),
    ...mapMutations([
      _changeActivePage,
      _rebaseActivePage,
      _clearSelectedElements,
      _addSelectedElements
    ])
  }
};
</script>


<style scoped>
.menus-wrapper {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  height: calc(100% - 58px);
  width: 100%;
  position: absolute;
  left: 0;
  overflow-y: auto;
}

.el-menu-tree {
  width: 100%;
  height: 100%;

  /* display: grid; */
  /* margin: 1px;
  grid-template-columns: repeat(1, 1fr);
  grid-auto-rows: minmax(1px, 72px); */
}

.el-menu-tree__el {
  cursor: pointer;
  padding: 5px 0 5px 15px;
  color: rgba(0, 0, 0, 0.87);
  text-align: left;
  border-radius: 2px;
  background-color: transparent;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.el-menu-tree__el:hover {
  background-color: rgba(0, 0, 0, 0.08);
}
.el-menu-tree__el.selected {
  background-color: rgba(0, 0, 0, 0.08);
}
.el-menu-tree__el span {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: small;
  padding: 0;
  vertical-align: middle;
}
.el-menu-tree__el svg {
  vertical-align: middle;
}
.el-menu-tree .ele-menu-tree__end-detail {
  float: right;
  margin-right: 10px;
  overflow: visible;
}
</style>
