<template>
  <div>
    <slot name="top_title">
      <h4
        v-show="!!title"
        class="mt-0 header-title"
        style="width: 100%; text-align: left"
      >
        <span>{{ $t(title) }} </span>
      </h4>
      <p
        v-if="!!subtitle"
        class="sub-title"
        style="width: 100%; text-align: left"
      >
        <slot name="top_subtitle">
          {{ $t(subtitle) }}
        </slot>
      </p>
    </slot>
    <div class="card" style="margin-top: 5px">
      <div class="card-body" style="text-align: left">
        <div class="table-responsive">
          <table class="max-table-ie table table-hover mb-0">
            <tr v-for="(item, cd) in tableHeard" :key="`${cd}_tr`">
              <td :style="{ 'min-width': titleWidth }">
                {{ item.titleNotT ? item.title : $t(item.title) }}
                <slot :name="`avl_left_${item.name}`"></slot>
              </td>
              <td :style="{ color: item.valColor || '' }">
                <span
                  @click="item.isClick ? colClick(item, datas) : null"
                  :class="item.isClick ? ['cursor', 'clickColor'] : ''"
                >
                  <template v-if="!!item.popover">
                    <el-popover
                      placement="bottom"
                      trigger="hover"
                      :content="datas[item.name]"
                    >
                      <span slot="reference">
                        {{ getTableHeard(item.name, item) }}</span
                      >
                    </el-popover>
                  </template>
                  <span
                    v-else-if="!!item.isHtml"
                    v-html="getTableHeard(item.name, item)"
                  ></span>
                  <span v-else>
                    {{ getTableHeard(item.name, item) }}
                  </span>
                </span>
                <slot :name="`avl_right_${item.name}`"></slot>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import utils from "@/utils/utils.js";
import * as helper from "@/utils/helper";
export default {
  name: "viewTable",
  props: {
    title: {
      type: String,
      default: "",
    },
    subtitle: {
      type: String,
      default: "",
    },
    rowClassName: {
      type: Function,
      default() {
        return undefined;
      },
    },
    tableHeard: {
      type: Array,
      default() {
        return [];
      },
    },
    datas: {
      type: Object,
      default() {
        return {};
      },
    },
    titleWidth: {
      type: String,
      default: "100px",
    },
    heardAllHid: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      tableValsMap: this.getTableValsMap(),
      imgurl: (window.$url || {}).imgUrl || "",
      allDelete: true,
    };
  },
  methods: {
    getAddrFormat(val, num = 15) {
      if (val && val.length <= num) {
        return val;
      }
      return helper.getAddrFormat(val, num);
    },

    getTableHeard(key, citem, fnum = 12) {
      let val = this.datas[key];
      let row = this.datas || {};
      if (this.tableValsMap[key]) {
        if (typeof this.tableValsMap[key] == "function") {
          val = this.tableValsMap[key](val, row, citem);
        } else {
          val = this.tableValsMap[key][val];
        }
      }
      if (!utils.isEmpty(val) && !utils.isEmpty(citem.units)) {
        val += "" + citem.units;
      }
      if (citem.format) {
        val = this.getAddrFormat(val, fnum);
      }
      if (citem.phoneFormat && utils.isMobile) {
        val = this.getAddrFormat(val, 9);
      }
      if (citem.type == "time") {
        val = this.formatTime(val);
      }

      if (citem.type == "timimg") {
        val = this.formatTimimg(val);
      }

      if (citem.valT) {
        val = this.$t(val);
      }
      return val;
    },
    getTableValsMap() {
      var map = {};
      this.tableHeard.forEach((element) => {
        if (element.valMap) {
          map[element.name] = element.valMap;
        }
      });
      return map;
    },
    formatTime(time) {
      if (utils.isEmpty(time)) {
        return "";
      }
      time = time / 1000;
      return helper.formatTime(time);
    },
    formatTimimg() {
      if (utils.isEmpty(time)) {
        return "";
      }
      return helper.formatTimimg(time);
    },

    colClick(item, dataL) {
      this.$emit("colClick", { col: item, row: dataL });
    },
  },

  watch: {
    tableHeard: {
      handler: function () {
        //newV, oldV
        this.tableValsMap = this.getTableValsMap();
      },
    },
  },
};
</script>
<style scoped>
.clickColor {
  color: #2ebac6;
  cursor: pointer;
}

@media (min-width: 700px) {
  .pc_show {
    display: unset;
  }

  .phone_show {
    display: none;
  }
}

@media (max-width: 700px) {
  .pc_show {
    display: none;
  }

  .phone_show {
    display: unset;
  }
}

.max-table-ie tr td {
  white-space: pre-line;
  word-wrap: break-word;
  word-break: break-all;
}
</style>
