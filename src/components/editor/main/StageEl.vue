<script>
import { mapState, mapMutations } from "vuex";
import { _clearSelectedElements, _addSelectedElement } from "@/store/types";
import { addcss } from "@/mixins/css";
import MrEl from "@/components/editor/common/mr-vue/MrEl";
import StageEl from "./StageEl";

import { Form, Input, Field } from "@alifd/next";
const FormItem = Form.Item;

export default {
  name: "stage-el",
  props: ["elem", "isPlain"],
  components: {
    MrEl,
    "f-input": Input,
    "f-form-item": FormItem,
    "f-form": Form
  },
  render: function(createElement) {
    let elementO = this.elem.global
      ? { ...this.elem, ...this.componentRef, id: this.elem.id }
      : this.elem;

    let styles = elementO.styles;
    if (this.isPlain && elementO.egglement) {
      styles = {
        ...elementO.styles,
        position: "absolute",
        zIndex: elementO.zIndex,
        minWidth: elementO.minWidth,
        minHeight: elementO.minHeight,
        top:
          typeof elementO.top === "number" ? elementO.top + "px" : elementO.top,
        left:
          typeof elementO.left === "number"
            ? elementO.left + "px"
            : elementO.left,
        bottom:
          typeof elementO.bottom === "number"
            ? elementO.bottom + "px"
            : elementO.bottom,
        right:
          typeof elementO.right === "number"
            ? elementO.right + "px"
            : elementO.right,
        width:
          typeof elementO.width === "number"
            ? elementO.width + "px"
            : elementO.width,
        height:
          typeof elementO.height === "number"
            ? elementO.height + "px"
            : elementO.height
      };
    }

    // 组件包含自定义样式
    if (elementO.css) {
      addcss(elementO.css);
    }

    //转换属性，处理对于select类型的属性非常好用
    let attrs = {};
    for (let key in elementO.attrs) {
      attrs[key] = elementO.attrs[key].value || elementO.attrs[key];
    }

    const data = {
      class: elementO.classes,
      style: styles,
      dependency: elementO.dependency,
      attrs: {
        id: elementO.id,
        "data-id": elementO.id,
        "data-global": elementO.global,
        "data-egglement": elementO.egglement,
        "data-containegg": elementO.containegg,
        "data-componegg": elementO.componegg,
        "data-wrappegg": elementO.wrappegg,
        ...attrs
      }
    };

    let children = [];
    if (elementO.text) {
      children.push(elementO.text);
    } else if (elementO.children) {
      for (let child of elementO.children) {
        children.push(
          createElement(StageEl, {
            props: {
              elem: child,
              isPlain: elementO.componegg || elementO.wrappegg || this.isPlain
            }
          })
        );
      }
    }

    let stageElem;
    if (this.isPlain) {
      stageElem = createElement(elementO.type, data, children);
    } else {
      let mrElProps = {
        active: this.isActive,
        left: elementO.left,
        top: elementO.top,
        right: elementO.right,
        bottom: elementO.bottom,
        zIndex: elementO.zIndex,
        width: elementO.width,
        height: elementO.height,
        minWidth: elementO.minWidth,
        minHeight: elementO.minHeight,
        position: elementO.styles.position || "absolute",
        dependency: elementO.dependency
      };

      // console.log(MrEl, data);

      stageElem = createElement(
        MrEl,
        {
          props: elementO.global ? { ...mrElProps, handles: null } : mrElProps,
          on: { activated: this.activatedHandler }
        },
        [createElement(elementO.type, data, children)]
      );
    }

    return stageElem;
  },
  computed: {
    isActive() {
      return (
        this.selectedElements.findIndex(el => el.id === this.elem.id) !== -1
      );
    },

    componentRef() {
      return this.projectComponents[
        this.projectComponents.findIndex(comp => comp.name === this.elem.name)
      ];
    },

    ...mapState({
      selectedElements: state => state.app.selectedElements,
      projectComponents: state => state.project.components
    })
  },
  methods: {
    activatedHandler(e) {
      e.stopPropagation();
      e.preventDefault();

      if (e.shiftKey && !this.isActive) {
        this._addSelectedElement(this.elem);
      } else if (!e.shiftKey && !this.isActive) {
        this._clearSelectedElements();
        this._addSelectedElement(this.elem);
      }
    },

    ...mapMutations([_clearSelectedElements, _addSelectedElement])
  }
};
</script>
