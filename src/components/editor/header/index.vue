<template>
  <div class="headegg mdc-theme--background" :class="{'not-scrolled': scroll0}">
    <a class="home-btn">π</a>
    <div class="head-menu-bar">
      <span class="head-menu-item" @click="showModal('组件市场')">组件市场</span>
      <span class="head-menu-item">页面模板</span>
      <span class="head-menu-item">我的页面</span>
    </div>
    <!-- <input class="title-input" v-model="tmpProjectTitle" @blur="onTitleBlur"
    title="Project title" placeholder="Project title"/>-->

    <div class="spacer"></div>
    <action-bar></action-bar>
    <user-menu></user-menu>
    <a-modal :title="title" v-model="visible" :footer="null">
      审核组件：
      <a-list
        class="demo-loadmore-list"
        itemLayout="horizontal"
        :loading="loading"
        :dataSource="auditdata"
        v-if="oauth.wphost == wpmain"
      >
        <a-list-item slot="renderItem" v-if="showAudit(item.author)" slot-scope="item, index">
          <a slot="actions" @click="auditOk(item,index)">审核通过</a>
          <a slot="actions" @click="auditDel(item,index)">删除</a>
          <div>{{item.name}}</div>
        </a-list-item>
      </a-list>可用组件：
      <a-list
        class="demo-loadmore-list"
        :loading="loading"
        itemLayout="horizontal"
        :dataSource="data"
      >
        <a-list-item slot="renderItem" slot-scope="item, index">
          <a slot="actions" @click="useComponents(item)">使用</a>
          <a slot="actions" v-if="showAudit(item.author)" @click="auditDel2(item,index)">删除</a>
          <div>{{item.name}}</div>
        </a-list-item>
      </a-list>
    </a-modal>
  </div>
</template>


<script>
import { mapState, mapMutations } from "vuex";
import {
  updateProject,
  paiComponentMarket,
  _addMarketComponent
} from "@/store/types";
import WPAPI from "wpapi/browser/wpapi";

import UserMenu from "./UserMenu";
import ActionBar from "./ActionBar";
import { handleComa } from "@/mixins/util";

import "@/assets/icons/product/vuegg";

export default {
  name: "headegg",
  components: { ActionBar, UserMenu },
  props: ["scroll0"],
  data: function() {
    return {
      visible: false,
      title: "云π",
      tmpProjectTitle: "",
      loading: true,
      loadingMore: false,
      showLoadingMore: true,
      auditdata: [],
      data: []
    };
  },
  computed: mapState({
    project: state => (state ? state.project : {}),
    projectTitle: state => (state ? state.project.title : ""),
    wp: state => state.wp,
    oauth: state => state.oauth,
    wpmain: state => state.app.wpmain
  }),
  methods: {
    useComponents(item) {
      this._addMarketComponent(item);
    },
    auditOk(item, index) {
      this.wp
        .pages()
        .id(item.id)
        .update({
          status: "publish"
        })
        .then(res => {
          this.auditdata.slice(index, 1);
          this.$message.error("组件集合审核通过成功");
        });
    },
    auditDel(item, index) {
      this.wp
        .pages()
        .id(item.id)
        .delete()
        .then(res => {
          this.auditdata.slice(index, 1);
          this.$message.error("组件集合删除成功");
        });
    },
    auditDel2(item, index) {
      this.wp
        .pages()
        .id(item.id)
        .delete()
        .then(res => {
          this.data.slice(index, 1);
          this.$message.error("组件集合删除成功");
        });
    },
    showAudit(id) {
      return (
        this.oauth.wphost == this.wpmain &&
        (this.oauth.userId == 1 || this.oauth.userId == id)
      );
    },
    showModal(title) {
      this.title = title;
      this.visible = true;
      if (this.oauth.wphost == this.wpmain) {
        this.getData(res => {
          this.auditdata = res.results;
        }, "draft");
      }
      this.getData(res => {
        this.loading = false;
        this.data = res.results;
      }, "publish");
    },
    getData(callback, status) {
      let wp = this.wp;
      if (this.oauth.wphost != this.wpmain) {
        wp = new WPAPI({
          endpoint: this.wpmain + "/wp-json"
        });
      }
      wp.pages()
        .param("parent", paiComponentMarket)
        .param("status", status)
        .then(pages => {
          let results = [];
          try {
            pages.forEach(p => {
              results.push({
                id: p.id,
                author: p.author,
                name: p.title.rendered,
                close: true,
                icon: "component",
                del: true,
                comps: JSON.parse(handleComa(p.content.rendered))
              });
            });
          } catch (e) {
            console.log(e);
          }
          callback({ results });
        });
    },
    onLoadMore() {
      this.loadingMore = true;
      this.getData(res => {
        this.data = this.data.concat(res.results);
        this.loadingMore = false;
        this.$nextTick(() => {
          window.dispatchEvent(new Event("resize"));
        });
      });
    },
    onTitleBlur() {
      if (this.tmpProjectTitle && this.tmpProjectTitle !== this.projectTitle) {
        this.updateProject({ title: this.tmpProjectTitle });
      } else {
        this.tmpProjectTitle = this.projectTitle;
      }
    },
    ...mapMutations([updateProject, _addMarketComponent])
  },
  created: function() {
    this.tmpProjectTitle = this.projectTitle;
  },
  watch: {
    projectTitle: function(val) {
      this.tmpProjectTitle = val;
    }
  }
};
</script>


<style scoped>
.headegg {
  z-index: 1000;
  height: 64px;
  width: calc(100% - 240px);
  color: rgba(0, 0, 0, 0.66);
  padding: 0 25px 0 25px;
  margin-right: 240px;
  border: none;
  display: flex;
  flex-shrink: 0;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-self: stretch;
  align-items: center;
  box-sizing: border-box;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12),
    0 3px 1px -2px rgba(0, 0, 0, 0.2);

  transition-duration: 0.2s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-property: max-height, box-shadow;
}
.not-scrolled {
  box-shadow: none;
}

/* IN DEVICES SMALLER THAN 1024px -> NO DRAWER (so remove margins) */
@media screen and (max-width: 1024px) {
  .headegg {
    margin: 0px;
    width: 100%;
  }
}

.home-btn {
  margin-right: 25px;
  padding: 0;
  font-size: 48px;
  background: #dcdad8;
  width: 50px;
  text-align: center;
  height: 50px;
  line-height: 50px;
  color: rgb(43, 106, 115);
}

.spacer {
  width: 12px;
}

.head-menu-bar {
  flex-grow: 1;
  font-size: 18px;
}
.head-menu-item {
  cursor: pointer;
  margin-right: 20px;
}

.title-input {
  flex-grow: 1;
  border: 0;
  height: 56px;
  background: transparent;
  outline: none;
}
</style>
