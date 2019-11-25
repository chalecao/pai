<template>
  <div class="menus-wrapper">
    <menu-toggle
      v-for="ele in elementConfig"
      :menuHeader="ele.name"
      :key="ele.name"
      :startClosed="ele.close"
      @oper="showOper()"
      cusKey="oper"
    >
      <div class="el-menu">
        <div
          class="el-menu__el"
          :key="element.displayName + element.name"
          v-for="element in ele.comps"
          :title="element.name"
          draggable="true"
          @dragstart="e => dragstartHandler(e, element)"
          @click="e => addItemToStage(e, element)"
        >
          <svgicon
            :icon="'system/elements/'+(ele.icon||element.icon||element.name)"
            width="24"
            height="24"
            color="rgba(0,0,0,.87)"
          ></svgicon>
          <span>{{element.displayName || element.name}}</span>
          <div class="el-menu__el_close">
            <a-badge
              v-if="!!element.delable"
              count="x"
              class="el-menu__el_badge"
              :numberStyle="{backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset'}"
              @click.stop.prevent="delComp(element)"
            />
          </div>
        </div>
      </div>
    </menu-toggle>
    <a-modal title="发布组件库" v-model="visible" @ok="handlePublish">
      名称：
      <a-input v-model="compName"></a-input>价格：
      <a-input v-model="compFee" placeholder="0 - 10"></a-input>
    </a-modal>
  </div>
</template>


<script>
import { mapState, mapActions } from "vuex";
import {
  registerElement,
  deleteCustomComponent,
  pubComp2market,
  noLoginMessage
} from "@/store/types";

import basicElements from "@/assets/BasicElements";
import materialComponents from "@/assets/MaterialComponents";
import antdComponents from "@/assets/AntdComponents";
import fusionComponents from "@/assets/FusionComponents";
import mockComponents from "@/assets/MockComponents";
import MenuToggle from "@/components/editor/common/MenuToggle";

import "@/assets/icons/system/elements/";

export default {
  name: "elements-menu",
  components: { MenuToggle },
  data: function() {
    return {
      visible: false,
      compName: "",
      compFee: 0
    };
  },
  computed: {
    ...mapState({
      activePage: state => state.app.selectedPage,
      oauth: state => state.oauth,
      wpmain: state => state.app.wpmain,
      elementConfig: state => [
        {
          name: "基本组件",
          comps: basicElements,
          close: false
        },
        // {
        //   name: "Fusion组件",
        //   comps: fusionComponents,
        //   close: true
        // },
        // {
        //   name: "ANTD组件",
        //   comps: antdComponents,
        //   close: true
        // },
        // {
        //   name: "MDL组件",
        //   comps: materialComponents,
        //   close: true
        // },
        {
          name: "自定义组件",
          comps: state.project.customComponents,
          close: true,
          icon: "component",
          delable: true
        }
      ]
    })
  },

  methods: {
    dragstartHandler(e, item) {
      e.dataTransfer.dropEffect = "copy";
      e.dataTransfer.effectAllowed = "all";
      e.dataTransfer.setData("text/plain", JSON.stringify(this.initItem(item)));
    },
    showOper() {
      if (this.oauth.wphost == this.wpmain) {
        this.visible = true;
      } else {
        this.$message.error("没有权限，请联系管理员");
      }
    },
    handlePublish() {
      if (!this.oauth.isAuthorized) {
        this.$message.error(noLoginMessage);
        this.visible = false;
      } else if (!this.compName) {
        this.$message.error("请填写组件合集名称");
      } else {
        this.$message.info(
          "感谢贡献组件，组件审结通过之后，就会展示在组件库中"
        );
        this.visible = false;
        this.pubComp2market({ name: this.compName, price: this.compFee });
      }
    },
    addItemToStage(e, item) {
      console.log("addItemToStage", item);
      let heightInContainer = 0;
      let childrenInContainer = document.querySelector(".mr-container")
        .children;
      [].forEach.call(childrenInContainer, el => {
        let _height = parseInt(getComputedStyle(el).height);
        if (!isNaN(_height)) {
          heightInContainer += _height;
        }
      });
      item.top = heightInContainer;
      item.left = 0;
      this.registerElement({
        pageId: this.activePage.id,
        el: this.initItem(item),
        global: e.shiftKey
      });
    },
    delComp(curComp) {
      console.log(curComp);
      this.$confirm({
        title: `确定删除组件？`,
        onOk: () => {
          this.deleteCustomComponent(curComp);
        },
        onCancel() {}
      });
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

    ...mapActions([registerElement, deleteCustomComponent, pubComp2market])
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
  overflow-y: auto;
}

.el-menu {
  width: 100%;
  height: 100%;
  display: grid;
  margin: 1px;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(1px, 72px);
}

.el-menu__el {
  position: relative;
  width: 79px;
  cursor: pointer;
  padding-top: 1em;
  color: rgba(0, 0, 0, 0.87);
  text-align: center;
  border-radius: 2px;
  background-color: transparent;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.el-menu__el:hover {
  background-color: rgba(0, 0, 0, 0.08);
}
.el-menu__el span {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: x-small;
}
.el-menu__el_close {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0;
  z-index: 999;
}
.el-menu__el_close {
  padding: 0;
}
.el-menu__el_badge {
  cursor: pointer;
}
</style>
