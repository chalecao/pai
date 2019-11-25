<template>
  <div class="menu-toggle" v-show="!hidden">
    <div class="menu-toggle__header" @click="toggleMenu()">
      <span>{{menuHeader}}</span>
      <a-popover title="操作" v-if="!!cusKey">
        <template slot="content">
          <a-badge
            class="el-menu__el_badge"
            :count="cusIcon"
            :numberStyle="{cursor:'pointer'}"
            @click.stop.prevent="emitKey(cusKey)"
          />
          <a-badge
            count="删除"
            class="el-menu__el_badge"
            :numberStyle="{backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset',cursor:'pointer'}"
            @click.stop.prevent="emitKey('del')"
          />
        </template>

        <a-badge
          count="···"
          :numberStyle="{backgroundColor: '#fff', color: '#999',padding:'0', boxShadow: '0 0 0 1px #d9d9d9 inset'}"
        />
      </a-popover>
      <svgicon
        v-if="isClosed"
        icon="system/expand"
        width="16"
        color="#737373"
        @click.stop.prevent="toggleMenu()"
      ></svgicon>
      <svgicon
        v-else
        icon="system/collapse"
        width="16"
        color="#737373"
        @click.stop.prevent="toggleMenu()"
      ></svgicon>
    </div>
    <div ref="content" class="menu-toggle__content" :class="{'is-closed': isClosed}">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import "@/assets/icons/system/collapse";
import "@/assets/icons/system/expand";

export default {
  name: "menu-toggle",
  props: {
    menuHeader: { type: String, default: "" },
    cusIcon: { type: String, default: "" },
    cusKey: { type: String, default: "" },
    startClosed: { type: Boolean, dafault: false },
    hidden: { type: Boolean, dafault: false }
  },
  data: function() {
    return {
      initialized: false,
      isClosed: false,
      maxHeight: "auto"
    };
  },
  mounted: function() {
    this.$nextTick(function() {
      // this.maxHeight = window.getComputedStyle(this.$refs.content)["height"];
      this.isClosed = this.startClosed;
    });
  },
  // computed: {
  //   elStyle() {
  //     return this.isClosed
  //       ? { "max-height": 0 }
  //       : { "max-height": this.maxHeight };
  //   }
  // },
  methods: {
    emitKey(key) {
      this.$emit(key);
    },
    toggleMenu() {
      if (!this.isClosed) {
        // this.maxHeight = window.getComputedStyle(this.$refs.content)["height"];
      }

      this.isClosed = !this.isClosed;
      this.isClosed ? this.$emit("closed") : this.$emit("opened");
    }
  }
};
</script>

<style scoped>
.menu-toggle {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.menu-toggle__header {
  padding: 10px 25px;
  font-size: small;
  font-weight: bold;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.54);
  display: flex;
  align-items: center;
}
.menu-toggle__add {
  width: 30px;
  cursor: pointer;
}

.menu-toggle__header:hover {
  color: rgba(0, 0, 0, 0.87);
}

.menu-toggle__header span {
  display: inline-block;
  width: calc(100% - 20px);
  user-select: none;
}

.menu-toggle__header .svg-icon {
  display: inline-block;
}

.menu-toggle__content {
  overflow: hidden;
  max-height: auto !important;
  transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.menu-toggle__content.is-closed {
  max-height: 0;
}
</style>
