<template>
  <div>
    <menu-toggle menuHeader="General">
      <dim-pos
        :height="h"
        :width="w"
        :top="t"
        :bottom="b"
        :left="l"
        :right="r"
        @change="({type, value}) => emitChanges(type, value)"
      ></dim-pos>

      <div class="menu">
        <mdc-textfield
          class="text-item"
          v-model="displayN"
          label="displayName"
          dense
          @keyup.native="e => onPropChanges('displayName', e.target.value)"
        />
        <mdc-textfield
          class="text-item"
          label="class"
          :value="typeof cls == 'object'?JSON.stringify(cls):(cls||'')"
          dense
          @blur="e => e && onPropChanges('classes', typeof cls == 'object'? JSON.parse(e.target.value):e.target.value)"
        />
        <mdc-textfield
          class="text-item"
          label="dependency"
          :value="typeof dep == 'object'?JSON.stringify(dep):(dep||'')"
          dense
          @blur="e => e && onPropChanges('dependency', typeof dep == 'object'? JSON.parse(e.target.value):e.target.value)"
        />
        <slider
          label="Opacity"
          icon="system/editor/opacity"
          min="0"
          max="100"
          step="1"
          :value="sty['opacity'] * 100 || 100"
          @change="currentValue => onStyleChanges('opacity', currentValue / 100)"
        ></slider>

        <color-picker
          label="Background color"
          icon="system/editor/bg_color"
          :color="sty['background-color']"
          @input="newColor => onStyleChanges('background-color', newColor)"
        ></color-picker>

        <stack-order :zIndex="z" @change="newValue => emitChanges('zIndex', newValue)"></stack-order>
      </div>
    </menu-toggle>

    <menu-toggle menuHeader="Text" :hidden="hideTextSettings">
      <div class="menu">
        <text-align
          @change="newValue => onStyleChanges('text-align', newValue)"
          :textAlign="sty['text-align']"
        ></text-align>

        <mdc-textfield
          class="text-item"
          v-model="sty['line-height'] "
          label="Line height"
          dense
          @keyup.native="e => onStyleChanges('line-height', e.target.value)"
        />

        <mdc-textfield
          class="text-item"
          v-model="sty.position"
          label="Position"
          dense
          @keyup.native="e => onStyleChanges('position', e.target.value)"
        />

        <font-style
          @change="({prop, value}) => onStyleChanges(prop, value)"
          :fontWeight="sty['font-weight']"
          :fontStyle="sty['font-style']"
          :textDecoration="sty['text-decoration']"
        ></font-style>

        <slider
          label="Font size"
          icon="system/editor/font_size"
          min="1"
          max="100"
          step="1"
          :value="parseInt(sty['font-size']) || 16"
          @change="currentValue => onStyleChanges('font-size', (currentValue + 'px'))"
        ></slider>

        <color-picker
          label="Text Color"
          icon="system/editor/text_color"
          :color="sty['color']"
          @input="newColor => onStyleChanges('color', newColor)"
        ></color-picker>

        <icon-select
          class="text-item"
          icon="system/editor/font"
          label="Font family"
          :value="sty['font-family'] || 'Roboto, sans-serif'"
          @change="newValue => onStyleChanges('font-family', newValue)"
        >
          <optgroup v-for="fontFamily in fonts" :key="fontFamily.family" :label="fontFamily.family">
            <option
              v-for="font in fontFamily.fonts"
              :key="font.name"
              :value="font.definition"
            >{{font.name}}</option>
          </optgroup>
        </icon-select>

        <mdc-textfield
          class="text-item"
          v-model="att.value"
          label="Text"
          dense
          v-if="(typeof att.value !== 'undefined' && att.value !== null)"
          @keyup.native="e => onAttrsChanges('value', e.target.value)"
        />

        <mdc-textfield
          class="text-item"
          v-model="txt"
          label="Text"
          dense
          v-else
          @keyup.native="e => emitChanges('text', e.target.value)"
        />
      </div>
    </menu-toggle>

    <menu-toggle
      menuHeader="Placeholder"
      :hidden="(typeof att.placeholder === 'undefined' || att.placeholder === null)"
    >
      <div class="menu">
        <mdc-textfield
          class="text-item"
          v-model="att.placeholder"
          label="Placeholder"
          dense
          @keyup.native="e => onAttrsChanges('placeholder', e.target.value)"
        />
      </div>
    </menu-toggle>

    <menu-toggle menuHeader="Image" :hidden="(typeof att.src === 'undefined' || att.src === null)">
      <div class="menu">
        <mdc-textfield
          class="text-item text-item-image"
          v-model="att.src"
          label="Image URL"
          dense
          @keyup.native="e => onAttrsChanges('src', e.target.value)"
        />

        <div class="margin-l-20">
          <input type="file" class="custom-img-upload" />
          <a-button @click="upload">
            <a-icon type="upload" />上传
          </a-button>
        </div>
      </div>
    </menu-toggle>

    <menu-toggle menuHeader="Border">
      <div class="menu">
        <icon-select
          class="text-item"
          :value="borderSelected"
          :icon="'system/editor/border' + borderSelected"
          label="Border"
          @change="newValue => borderSelected = newValue"
        >
          <option value>All borders</option>
          <option value="-top">Top</option>
          <option value="-bottom">Bottom</option>
          <option value="-left">Left</option>
          <option value="-right">Right</option>
        </icon-select>

        <slider
          label="Border radius"
          icon="system/editor/corner_radius"
          min="0"
          max="50"
          step="1"
          :value="parseInt(sty['border-radius']) || 0"
          @change="currentValue => onStyleChanges('border-radius', (currentValue + 'px'))"
        ></slider>

        <icon-select
          class="text-item"
          icon="system/editor/border_style"
          label="Style"
          :value="sty['border' + borderSelected + '-style'] || 'inherit'"
          @change="currentValue => onStyleChanges('border' + borderSelected + '-style', currentValue)"
        >
          <option value="none">none</option>
          <option value="dotted">dotted</option>
          <option value="dashed">dashed</option>
          <option value="solid">solid</option>
          <option value="double">double</option>
          <option value="groove">groove</option>
          <option value="ridge">ridge</option>
          <option value="inset">inset</option>
          <option value="outset">outset</option>
          <option value="inherit">inherit</option>
        </icon-select>

        <slider
          label="Border width"
          icon="system/editor/border_weight"
          min="0"
          max="25"
          step="1"
          :value="parseInt(sty['border' + borderSelected + '-width']) || 0"
          @change="currentValue => onStyleChanges('border' + borderSelected + '-width', (currentValue + 'px'))"
        ></slider>

        <color-picker
          label="Border color"
          icon="system/editor/border_color"
          :color="sty['border' + borderSelected + '-color']"
          @input="newColor => onStyleChanges('border' + borderSelected + '-color', newColor)"
        ></color-picker>
      </div>
    </menu-toggle>
    <menu-toggle menuHeader="其他属性" :showOper="true">
      <template v-slot:tipsContent>
        <a-badge
          count="+"
          class="el-menu__el_badge"
          :numberStyle="{backgroundColor: '#fff', color: 'red', boxShadow: '0 0 0 1px #d9d9d9 inset',cursor:'pointer'}"
          @click="addHandler( 'attribute')"
        />
      </template>
      <div class="menu">
        <div v-for="(item, key, index) in att" :key="key">
          <mdc-checkbox
            v-if="typeof item === 'boolean'"
            class="text-item"
            :label="key"
            v-model="att[key]"
            @change="onAttrsChanges(key, att[key])"
          ></mdc-checkbox>

          <slider
            v-else-if="typeof item === 'number'"
            :label="key"
            class="text-item"
            :min="(att[key] <= 1) ? '0' : '1'"
            :max="(att[key] <= 1) ? '1' : '250'"
            :value="att[key] || 100"
            @change="currentValue => onAttrsChanges(key, currentValue)"
          ></slider>

          <icon-select
            v-else-if="item.range && Array.isArray(item.range)"
            class="text-item"
            :label="key"
            :value="att[key].value"
            @change="currentValue => onAttrsChanges(key, {value: currentValue, range:item.range})"
          >
            <option v-for="itm in item.range" :key="itm" :value="itm">{{itm}}</option>
          </icon-select>

          <mdc-textfield
            v-else
            class="text-item"
            :ref="att[key]"
            :label="key"
            :value="typeof att[key] == 'object'?JSON.stringify(att[key]):att[key]"
            dense
            @blur="e => e && onAttrsChanges(key, typeof att[key] == 'object'? JSON.parse(e.target.value):e.target.value)"
          />
          <i class="menu-toggle__delete" @click="()=>deleteItem('attribute',key)">-</i>
        </div>
      </div>
    </menu-toggle>
    <menu-toggle menuHeader="其他样式" :showOper="true">
      <template v-slot:tipsContent>
        <a-badge
          count="+"
          class="el-menu__el_badge"
          :numberStyle="{backgroundColor: '#fff', color: 'red', boxShadow: '0 0 0 1px #d9d9d9 inset',cursor:'pointer'}"
          @click="addHandler( 'style')"
        />
      </template>
      <div class="menu">
        <div v-for="(item, key, index) in sty" :key="key">
          <mdc-checkbox
            v-if="typeof item === 'boolean'"
            class="text-item"
            :label="key"
            v-model="sty[key]"
            @change="onStyleChanges(key, sty[key])"
          ></mdc-checkbox>

          <slider
            v-else-if="typeof item === 'number'"
            :label="key"
            class="text-item"
            :min="(sty[key] <= 1) ? '0' : '1'"
            :max="(sty[key] <= 1) ? '1' : '250'"
            :value="sty[key] || 100"
            @change="currentValue => onStyleChanges(key, currentValue)"
          ></slider>

          <icon-select
            v-else-if="item.range && Array.isArray(item.range)"
            class="text-item"
            :label="key"
            :value="sty[key].value"
            @change="currentValue => onStyleChanges(key, {value: currentValue, range:item.range})"
          >
            <option v-for="itm in item.range" :key="itm" :value="itm">{{itm}}</option>
          </icon-select>

          <mdc-textfield
            v-else
            class="text-item"
            :ref="sty[key]"
            :label="key"
            :value="typeof sty[key] == 'object'?JSON.stringify(sty[key]):sty[key]"
            dense
            @blur="e => e && onStyleChanges(key, typeof sty[key] == 'object'? JSON.parse(e.target.value):e.target.value)"
          />
          <i class="menu-toggle__delete" @click="()=>deleteItem('style',key)">-</i>
        </div>
      </div>
    </menu-toggle>
    <a-modal title="请输入要添加的key" v-model="visible" @ok="handleOk">
      <a-input v-model="tempkey" />
    </a-modal>
  </div>
</template>


<script>
import { mapState, mapActions, mapMutations } from "vuex";
import cloneDeep from "clone-deep";
import WPAPI from "wpapi/browser/wpapi";
import WebSafeFonts from "@/assets/WebSafeFonts";
import { OssImgSuffix, noLoginMessage } from "@/store/types";
import MenuToggle from "@/components/editor/common/MenuToggle";
import Slider from "./controls/Slider";
import IconSelect from "./controls/IconSelect";
import ColorPicker from "./controls/ColorPicker";
import StackOrder from "./controls/StackOrder";
import TextAlign from "./controls/TextAlign";
import FontStyle from "./controls/FontStyle";
import DimPos from "./controls/DimPos";

export default {
  name: "element-settings",
  components: {
    MenuToggle,
    Slider,
    IconSelect,
    ColorPicker,
    StackOrder,
    TextAlign,
    FontStyle,
    DimPos
  },
  props: [
    "displayName",
    "height",
    "width",
    "top",
    "left",
    "bottom",
    "right",
    "zIndex",
    "text",
    "styles",
    "attrs",
    "classes",
    "dependency"
  ],
  data: function() {
    return {
      displayN: this.displayName,
      cls: this.classes,
      dep: this.dependency,
      h: this.height,
      w: this.width,
      t: this.top,
      l: this.left,
      b: this.bottom,
      r: this.right,
      z: this.zIndex,
      txt: this.text,
      sty: cloneDeep(this.styles),
      att: cloneDeep(this.attrs),
      fonts: WebSafeFonts,
      borderSelected: "",
      tempkey: "",
      temptype: "",
      visible: false,
      headers: {
        authorization: "authorization-text"
      }
    };
  },
  computed: mapState({
    wp: state => state.wp
  }),
  watch: {
    displayName(val) {
      this.displayN = val.toString();
    },
    classes(val) {
      // this.cls = cloneDeep(val);
      this.cls = val.toString();
    },
    dependency(val) {
      this.dep = cloneDeep(val);
    },
    height(val) {
      this.h = val.toString();
    },
    width(val) {
      this.w = val.toString();
    },
    top(val) {
      this.t = val.toString();
    },
    left(val) {
      this.l = val.toString();
    },
    bottom(val) {
      this.b = val.toString();
    },
    right(val) {
      this.r = val.toString();
    },
    zIndex(val) {
      this.z = val;
    },
    text(val) {
      this.txt = val;
    },
    styles(val) {
      this.sty = cloneDeep(val);
    },
    attrs(val) {
      this.att = cloneDeep(val);
    }
  },
  computed: {
    hideTextSettings() {
      return (
        (typeof this.txt === "undefined" || this.txt === null) &&
        (typeof this.att.value === "undefined" || this.att.value === null)
      );
    }
  },
  methods: {
    onPropChanges(prop, value) {
      this.emitChanges(prop, value);
    },
    onStyleChanges(prop, value) {
      this.sty[prop] = value;
      this.emitChanges("styles", this.sty);
    },
    upload() {
      if (this.wp) {
        this.wp
          .media()
          .file(document.querySelector(".custom-img-upload").files[0])
          .create({
            title: "custom-img",
            alt_text: "loading..."
          })
          .then(response => {
            // Your media is now uploaded: let's associate it with a post
            // console.log(response)  OssImgSuffix
            this.onAttrsChanges("src", response.source_url);
          })
          .catch(e => {
            console.log(e);
            this.$message.error(noLoginMessage);
          });
      } else {
        this.$message.error(noLoginMessage);
      }
    },

    onAttrsChanges(prop, value) {
      this.att[prop] = value;
      this.emitChanges("attrs", this.att);
    },

    emitChanges(type, value) {
      this.$emit("propchange", { type, value });
    },
    deleteItem(type, key) {
      this.$confirm({
        title: `确定删除${key}?`,
        // content: `确定删除${key}?`,
        onOk: () => {
          if (type == "attribute") {
            delete this.att[key];
            this.emitChanges("attrs", this.att);
          }
          if (type == "style") {
            delete this.sty[key];
            this.emitChanges("styles", this.sty);
          }
        },
        onCancel() {}
      });
    },
    handleOk() {
      this.visible = false;
      if (!this.tempkey) return;

      if (this.temptype == "attribute") {
        this.att[this.tempkey] = "";
        this.emitChanges("attrs", this.att);
      }
      if (this.temptype == "style") {
        this.sty[this.tempkey] = "";
        this.emitChanges("styles", this.sty);
      }
    },
    addHandler(type) {
      this.temptype = type;
      this.visible = true;
    },
    handleChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        this.$message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    }
  }
};
</script>


<style scoped>
.menu {
  width: 100%;
  height: 100%;
  margin: 1px;
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
}
.menu .text-item {
  margin: 0 20px 10px;
}
.text-item-image {
  display: inline-block;
}
.menu-toggle__delete {
  font-size: 32px;
  cursor: pointer;
}
.margin-l-20 {
  margin-left: 20px;
}
</style>
