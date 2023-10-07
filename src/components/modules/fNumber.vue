<template>
  <el-input
    class="cKWxnh"
    type="tel"
    :disabled="disabled"
    v-model="dataStr"
    @input="onChangeData"
    @keyup.enter="onChangeDataNow"
    @blur="onChangeDataNow"
    @focus="onFocus($event)"
  >
    <template slot="prepend" v-if="!!prepend">
      <slot name="prepend">{{ prepend }}</slot>
    </template>
    <template slot="append" v-if="!!units">
      <slot name="units">
        {{ units }}
      </slot>
    </template>
  </el-input>
</template>
<script>
import utils from "@/utils/utils";
export default {
  name: "fNumber",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [Number, String],
      default: undefined,
    },
    step: {
      type: [Number, String],
      default: "1",
    },
    placeholder: {
      type: String,
      default: "",
    },
    max: [String, Number],
    min: [String, Number],
    units: [String, Number],
    prepend: [String, Number],
  },
  data() {
    return {
      timeout: null,
      data: undefined,
      dataStr: "",
    };
  },
  methods: {
    onChangeDataNow() {
      this.timeout && clearTimeout(this.timeout) && (this.timeout = null);
      this.changeData();
    },
    onFocus(event) {
      event.currentTarget.select();
    },
    onChangeData() {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
      this.timeout = setTimeout(() => {
        this.changeData();
      }, 2000);
    },
    changeData() {
      this.data = this.dataStr;
    },
    getNumberStr(newVal) {
      let valL = utils.weedZero(newVal, this.getPrecision);
      if (parseFloat(valL) > parseFloat(this.max)) {
        return utils.weedZero(this.max, this.getPrecision);
      }
      if (parseFloat(valL) < parseFloat(this.min)) {
        return utils.weedZero(this.min, this.getPrecision);
      }
      return valL;
    },
  },
  computed: {
    getStep() {
      let step = parseFloat(this.step || "0");
      return isNaN(step) ? 0 : step;
    },
    getPrecision() {
      let steps = (this.step || "0").split(".");
      return steps.length > 1 ? steps[steps.length - 1].length : 0;
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(newVal) {
        if (this.dataStr !== newVal) {
          this.dataStr = newVal;
          this.changeData();
        }
      },
    },
    data: function (newVal) {
      // this.dataStr = this.getNumberStr(newVal);
      this.dataStr = this.getNumberStr(newVal);
      this.data = utils.isEmpty(this.dataStr) ? undefined : this.dataStr;
      this.$emit("input", this.data);
      this.$emit("change", this.data);
    },
  },
  beforeDestroy() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  },
};
</script>
