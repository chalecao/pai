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
      <a-list
        class="demo-loadmore-list"
        :loading="loading"
        itemLayout="horizontal"
        :dataSource="data"
      >
        <div
          v-if="showLoadingMore"
          slot="loadMore"
          :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }"
        >
          <a-spin v-if="loadingMore" />
          <a-button v-else @click="onLoadMore">loading more</a-button>
        </div>
        <a-list-item slot="renderItem" slot-scope="item, index">
          <a slot="actions">使用</a>
          <a slot="actions">审核通过</a>
          <a slot="actions">删除</a>
          <div>{{item.title}}</div>
        </a-list-item>
      </a-list>
    </a-modal>
  </div>
</template>


<script>
import { mapState, mapMutations } from "vuex";
import { updateProject, paiComponentMarket } from "@/store/types";

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
      data: []
    };
  },
  computed: mapState({
    project: state => (state ? state.project : {}),
    projectTitle: state => (state ? state.project.title : ""),
    wp: state => state.wp
  }),
  methods: {
    showModal(title) {
      this.title = title;
      this.visible = true;
      this.getData(res => {
        this.loading = false;
        this.data = res.results;
      });
    },
    getData(callback) {
      wp.pages()
        .param("parent", paiComponentMarket)
        .param("status", "publish")
        .then(pages => {
          let results = [];
          try {
            pages.forEach(p => {
              results.push(JSON.parse(handleComa(p)));
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
    ...mapMutations([updateProject])
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
