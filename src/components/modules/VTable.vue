<template>
  <div>
    <div class="table-responsive"  style="min-height:80px;">
      <table class="max-table-ie table table-hover mb-0" style="min-height:80px; border:0px solid #ffffff;">
        <tr style=" margin: 0px; padding: 0px; line-height: 20px;" v-for="(item, cd) in tableHeard" :key="`${cd}_tr`">
          <td :style="{ 'min-width': titleWidth }" style="padding: 8px;">
            <slot :name="`avl_left_first_${item.name}`"></slot> 
            {{ item.titleNotT ? item.title : $t(item.title) }}
            <slot :name="`avl_left_${item.name}`"></slot>            
          </td>
          <td :style="{ color: item.valColor || '' }" style="padding: 8px;">
            <span @click="item.isClick ? colClick(item, datas) : null"
              :class="item.isClick ? ['cursor', 'clickColor'] : ''">
              <template v-if="!!item.popover">
                <el-popover placement="bottom" trigger="hover" :content="datas[item.name]">
                  <span slot="reference">
                    {{ getTableHeard(item.name, item) }}</span>
                </el-popover>
              </template>
              <span v-else-if="!!item.isHtml" v-html="getTableHeard(item.name, item)"></span>
              <span v-else>
                {{ getTableHeard(item.name, item) }}
              </span>
            </span>
            <slot :name="`avl_right_${item.name}`"></slot>
            <slot :name="'table_cell_' + item.name"></slot>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import utils from "@/utils/utils.js";
import * as helper from "@/utils/helper";
export default {
  name: "viewTable",
  props: {
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
    getAddrFormat(val, num = 18) {
      if (val && val.length <= num) {
        return val;
      }
      return helper.getAddrFormat(val, num);
    },

    getTableHeard(key, citem, fnum = 18) {
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
      if (citem.phoneFormat && (utils.isMobile() || this.getMinScreen())) {
        val = this.getAddrFormat(val, 8);
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

    getMinScreen(){
      let screenWidth=document.body.clientWidth;
      if(screenWidth<768){
        return true;
      }
      return false;  
    }
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
