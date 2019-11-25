<template>
  <div id="pages-menu">
    <ul class="pages-list">
      <div
        v-for="(page, pageIndex) in projectPages"
        :key="page.id"
        :class="{active: (page.id === activePage.id)}"
        @click="changePageIfNeeded(page)"
      >
        <li @contextmenu.exact.stop.prevent="showOptsMenu(page)" class="pages-list__item">
          <span class="pages-list-item__start-detail">
            <svgicon
              v-if="pageIndex === 0"
              icon="system/home"
              width="24"
              height="24"
              :color="(page.id === activePage.id)?'rgba(0,0,0,.87)':'rgba(0,0,0,.54)'"
            ></svgicon>
            <svgicon
              v-else
              icon="system/page"
              width="24"
              height="24"
              :color="(page.id === activePage.id)?'rgba(0,0,0,.87)':'rgba(0,0,0,.54)'"
            ></svgicon>
          </span>

          <div>
            <span class="pages-list-item__title">{{page.name}}</span>
            <span
              class="pages-list-item__subtitle"
              v-show="(page.id === activePage.id)"
              :title="page.path"
            >{{page.path}}</span>
          </div>

          <span class="pages-list-item__end-detail">
            <mdc-menu-anchor v-show="(page.id === activePage.id)">
              <svgicon
                icon="system/more_vert"
                width="24"
                height="24"
                @click.native="showOptsMenu(page)"
              ></svgicon>
              <mdc-menu :ref="'menu-'+page.id" @select="(selected)=>onSelect(selected, pageIndex)">
                <mdc-menu-item>修改页面</mdc-menu-item>
                <mdc-menu-item>复制页面</mdc-menu-item>
                <mdc-menu-item :disabled="(projectPages.length === 1)">删除页面</mdc-menu-item>
                <mdc-menu-divider></mdc-menu-divider>
                <mdc-menu-item>保存到WP(草稿)</mdc-menu-item>
                <mdc-menu-item>发布到WP(线上))</mdc-menu-item>
                <mdc-menu-item>查看详情</mdc-menu-item>
              </mdc-menu>
            </mdc-menu-anchor>
          </span>
        </li>
        <div class="pages-list_tags">
          <a-badge
            v-if="page.wpstatus == 'publish'"
            :count="'已发布-'+page.wpid"
            :numberStyle="{backgroundColor: '#52c41a'} "
          />
          <a-badge v-if="page.wpstatus == 'draft'" :count="'草稿-'+page.wpid" />
          <a-badge
            v-if="!page.wpid"
            count="未发布"
            :numberStyle="{backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset'}"
          />
        </div>
      </div>
    </ul>

    <mdc-fab class="new-page-btn" @click="_togglePageDialog({isOpen: true, isNew: true})">
      <svgicon icon="system/add_page" width="24" height="24"></svgicon>
    </mdc-fab>
    <a-modal title="页面详情" v-model="visible" :footer="null">
      页面ID：{{activePage.wpid}}
      <br />
      状态：{{!activePage.wpid?"未发布":(activePage.wpstatus == 'draft'?'草稿':'已发布')}}
      <br />
      页面地址：(推广用户：{{oauth.userId}})
      <br />
      <a :if="activePage.wpid" :href="getLink()" target="_blank">{{getLink()}}</a>
      <br />分享推广：
      <br />
      <qrcode-vue
        class="margin-l-40"
        :if="activePage.wpid"
        :value="getLink()"
        :size="150"
        level="H"
      ></qrcode-vue>
    </a-modal>
  </div>
</template>


<script>
import { mapState, mapActions, mapMutations } from "vuex";
import {
  duplicatePage,
  publishPage,
  removePage,
  _changeActivePage,
  _togglePageDialog,
  _clearSelectedElements,
  noLoginMessage
} from "@/store/types";
import QrcodeVue from "qrcode.vue";

import "@/assets/icons/system/home";
import "@/assets/icons/system/page";
import "@/assets/icons/system/more_vert";
import "@/assets/icons/system/add_page";

export default {
  name: "pages-menu",
  data: function() {
    return {
      visible: false
    };
  },
  components: {
    QrcodeVue
  },
  computed: mapState({
    activePage: state => state.app.selectedPage || { id: 0 },
    projectPages: state => (state ? state.project.pages : []),
    oauth: state => state.oauth,
    isLoading: state => state.app.isLoading
  }),
  methods: {
    changePageIfNeeded(page) {
      if (page.id !== this.activePage.id) {
        this._clearSelectedElements();
        this._changeActivePage(page);
      }
    },

    getLink() {
      if (this.activePage.wpstatus == "draft") {
        return this.activePage.wplink + "&userid=" + this.oauth.userId;
      } else {
        return this.activePage.wplink + "?userid=" + this.oauth.userId;
      }
    },

    showOptsMenu(page) {
      this.changePageIfNeeded(page);
      this.$refs["menu-" + page.id][0].show();
    },

    onSelect(selected, pageIndex) {
      const EDIT = 0;
      const DUPLICATE = 1;
      const EXPORT_WP = 3;
      const EXPORT_WP_PUB = 4;
      const DETAIL = 5;
      const DELETE = 2;

      switch (selected.index) {
        case EDIT:
          this._togglePageDialog({ isOpen: true, isNew: false });
          break;
        case DUPLICATE:
          this._clearSelectedElements();
          this.duplicatePage({ page: this.activePage });
          break;
        case EXPORT_WP:
          //todo: add transform
          if (!this.oauth.isAuthorized) {
            this.$message.error(noLoginMessage);
          } else {
            this.publishPage({
              page: this.activePage,
              status: "draft",
              succCB: () => {
                this.visible = true;
              }
            });
            this.$message.info("页面草稿发布中，稍后请在我的页面中查看");
          }
          break;
        case EXPORT_WP_PUB:
          //todo: add transform
          if (!this.oauth.isAuthorized) {
            this.$message.error(noLoginMessage);
          } else if (!this.activePage.wpid) {
            this.$message.error("请先保存到草稿，然后才能发布哦");
          } else {
            this.publishPage({
              page: this.activePage,
              status: "publish",
              succCB: () => {
                this.visible = true;
              }
            });
            this.$message.info("页面正式发布中，稍后请在我的页面中查看");
          }
          break;

        case DELETE:
          this.$confirm({
            title: `确定删除页面？`,
            onOk: () => {
              let fallbackPage =
                this.projectPages[pageIndex > 0 ? 0 : 1] || null;
              this.changePageIfNeeded(fallbackPage);
              this.removePage({ pageIndex });
            },
            onCancel() {}
          });

          break;
        case DETAIL:
          //todo: add transform
          this.visible = true;
          break;
      }
    },

    ...mapActions([duplicatePage, removePage, publishPage]),
    ...mapMutations([
      _clearSelectedElements,
      _togglePageDialog,
      _changeActivePage
    ])
  }
};
</script>


<style scoped>
#pages-menu {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  height: calc(100% - 175px);
  width: 100%;
  position: absolute;
  overflow: visible;
  overflow-y: auto;
}

.pages-list {
  color: rgba(0, 0, 0, 0.87);
  margin: 0;
  padding: 0;
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 400;
  letter-spacing: 0.04em;
  line-height: 1.75rem;
  list-style-type: none;
}

.active {
  background-color: #fff;
}

.pages-list__item {
  padding: 4px 16px;
  overflow: inherit;
  cursor: pointer;

  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 48px;
}
.pages-list-item__start-detail {
  width: 24px;
  height: 24px;
  margin-left: 0;
  margin-right: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.pages-list-item__end-detail {
  width: 24px;
  height: 24px;
  margin-left: auto;
  margin-right: 0;
}

.pages-list-item__title,
.pages-list-item__subtitle {
  width: 115px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pages-list-item__subtitle {
  font-size: 0.76rem;
  margin-bottom: 4px;
  font-weight: 400;
  letter-spacing: 0.04em;
  line-height: 1.25rem;
}
.pages-list-item__title {
  color: rgba(0, 0, 0, 0.38);
}

.pages-list__item:hover .pages-list-item__title,
.pages-list-item__subtitle {
  color: rgba(0, 0, 0, 0.54);
}
.active .pages-list__item .pages-list-item__title,
.active .pages-list__item:hover .pages-list-item__title {
  color: rgba(0, 0, 0, 0.87);
}

.mdc-menu-anchor {
  cursor: pointer;
}
.mdc-menu {
  background-color: #fff;
  left: -130px !important;
}

.new-page-btn {
  position: fixed;
  right: 92px;
  bottom: 32px;
}
.pages-list_tags {
  padding: 0 16px;
}
.margin-l-40 {
  margin-left: 140px;
}
</style>
