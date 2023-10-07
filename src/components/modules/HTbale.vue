<template>
  <div
    v-loading="tableQuery.table_loading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.2)"
    element-loading-text=""
    class="ie_htable_context"
  >
    <div ref="top_DIV"></div>
    <slot name="top_title" v-if="!heardAllHid" :data="tableQuery">
      <h4
        v-show="!!title"
        class="mt-0 header-title"
        style="width: 100%; text-align: left"
      >
        <span>{{ $t(title) }} </span>
      </h4>
      <p
        v-if="!!showSubtitle"
        class="sub-title"
        style="width: 100%; text-align: left"
      >
        <slot name="top_subtitle">
          {{ $t("ftable.totalnumber", [tableQuery.total || 0]) }}
        </slot>
      </p>
    </slot>
    <!--PC-->
    <div class="table-responsive pc_table" style="min-height: 200px">
      <table class="table table-hover">
        <thead v-if="showTitles">
          <tr style="background-color: #f8fafd">
            <th v-if="showOrder" min-width="40px">{{ $t("ftable.order") }}</th>
            <template v-for="(item, cd) in tableHeard">
              <th
                scope="col"
                :key="cd"
                :style="{
                  width: item.width || 'auto',
                  'min-width': item.minWidth || '40px',
                }"
                v-if="!item.hide || item.hide == 0"
              >
                <slot
                  :name="'table_title_' + item.name"
                  :data="item"
                  :type="'pc'"
                >
                  {{ item.titleNotT ? item.title : $t(item.title) }}
                  <slot
                    :name="'table_title_right_' + item.name"
                    :data="item"
                    :type="'pc'"
                  >
                  </slot>
                </slot>
              </th>
            </template>

            <th
              scope="col"
              :style="{
                'min-width': rightBtnColWidth,
                width: rightBtnColWidth,
              }"
              v-if="showRightTools"
            >
              {{ $t("ftable.action") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(dataL, dataCd) in tableData">
            <tr :key="`${dataCd}_tr`">
              <td v-if="showOrder">{{ dataCd + 1 + rand }}</td>
              <template v-for="(item, cd) in tableHeard">
                <td
                  :key="cd"
                  :style="item.style || ''"
                  v-if="!item.hide || item.hide == 0"
                >
                  <slot
                    :name="'table_cell_' + item.name"
                    :data="dataL"
                    :type="'pc'"
                  >
                    <div
                      @click="item.isClick ? colClick(item, dataL) : null"
                      :class="item.isClick ? ['cursor', 'clickColor'] : ''"
                    >
                      <template v-if="!!item.popover">
                        <el-popover
                          placement="bottom"
                          trigger="hover"
                          :content="dataL[item.name]"
                        >
                          <span slot="reference">
                            {{
                              getTableHeard(
                                item.name,
                                dataL[item.name],
                                dataL,
                                item
                              )
                            }}</span
                          >
                        </el-popover>
                      </template>
                      <span
                        v-else-if="!!item.isHtml"
                        v-html="
                          getTableHeard(
                            item.name,
                            dataL[item.name],
                            dataL,
                            item
                          )
                        "
                      ></span>
                      <span v-else>
                        {{
                          getTableHeard(
                            item.name,
                            dataL[item.name],
                            dataL,
                            item
                          )
                        }}
                      </span>
                      <slot
                        :name="'table_cell_right_' + item.name"
                        :data="dataL"
                        :type="'pc'"
                      ></slot>
                    </div>
                  </slot>
                </td>
              </template>
              <td v-if="showRightTools">
                <div class="button-items">
                  <slot name="rightCol" :data="dataL" :type="'pc'"> </slot>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <!---->
      <div
        v-if="!tableData || tableData.length === 0"
        style="text-align: center; color: #555; line-height: 50pt"
        v-show="!tableQuery.table_loading"
      >
        <span :style="{ color: tableQuery.errMsg ? 'red' : '' }">{{
          $t(tableQuery.errMsg || "comm.noData")
        }}</span
        ><el-button icon="el-icon-refresh" type="text" @click="load(1)" />
      </div>
    </div>
    <!---->

    <div
      class="table-responsive phone_table"
      style="border: none; padding-top: 10px"
    >
      <ul
        class="table table-hover mb-0 phone_table_context"
        style="margin: 0px; padding: 0px; border: none"
        v-for="(dataL, dataCd) in tableData"
        :key="dataCd"
      >
        <ul class="phone_table_context_sub">
          <li colspan="8" class="mar_pad_zero">
            <div class="row mar_pad_zero">
              <div class="col-lg-12 mar_pad_zero">
                <ul class="table table-hover mb-0 mar_pad_zero">
                  <li scope="col" class="phone_li_label" v-if="showOrder">
                    {{ $t("ftable.order") }}{{ " " }}{{ dataCd + 1 + rand }}
                  </li>
                  <!---->
                  <div
                    v-for="(item, tCd) in tableHeard"
                    :key="`default_${tCd}`"
                    v-show="!item.more || moreMap[dataCd]"
                  >
                    <li
                      scope="col"
                      class="phone_li_label"
                      v-if="showTitles"
                      style="font-size: 10pt"
                    >
                      <slot
                        :name="'table_title_' + item.name"
                        :data="item"
                        :type="'app'"
                      >
                        {{ item.titleNotT ? item.title : $t(item.title) }}

                        <slot
                          :name="'table_title_right_' + item.name"
                          :data="item"
                          :type="'app'"
                        >
                        </slot>
                      </slot>
                    </li>
                    <li class="phone_li_value">
                      <slot
                        :name="`table_cell_${item.name}`"
                        :data="dataL"
                        :type="'app'"
                      >
                        <div
                          @click="item.isClick ? colClick(item, dataL) : null"
                          :class="item.isClick ? ['cursor', 'clickColor'] : ''"
                        >
                          <template v-if="!!item.popover">
                            <el-popover
                              placement="bottom"
                              trigger="hover"
                              :content="dataL[item.name]"
                            >
                              <span slot="reference">
                                {{
                                  getTableHeard(
                                    item.name,
                                    dataL[item.name],
                                    dataL,
                                    item
                                  )
                                }}</span
                              >
                            </el-popover>
                          </template>
                          <div
                            v-else-if="!!item.isHtml"
                            v-html="
                              getTableHeard(
                                item.name,
                                dataL[item.name],
                                dataL,
                                item
                              )
                            "
                          ></div>

                          <div v-else>
                            {{
                              getTableHeard(
                                item.name,
                                dataL[item.name],
                                dataL,
                                item
                              )
                            }}
                          </div>
                          <slot
                            :name="'table_cell_right_' + item.name"
                            :data="dataL"
                            :type="'app'"
                          ></slot>
                        </div>
                      </slot>
                    </li>
                  </div>

                  <!---->
                  <div style="text-align: left" v-show="isMore">
                    <a
                      data-toggle="collapse"
                      class="accordion collapsed"
                      style="color: #007bff"
                      @click="moreMap[dataCd] = !moreMap[dataCd]"
                    >
                      <li>
                        {{
                          moreMap[dataCd]
                            ? $t("comm.stow")
                            : $t("comm.showMore")
                        }}
                      </li>
                    </a>
                  </div>

                  <div v-if="showRightTools" class="table_row phone_btns">
                    <slot name="rightCol" :data="dataL" :type="'app'"> </slot>
                  </div>

                  <div
                    style="
                      border-bottom: 1px solid rgba(222, 226, 230, 1);
                      margin-bottom: 30px;
                      padding-bottom: 20px;
                    "
                  ></div>
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </ul>

      <!---->
      <div
        v-if="!tableData || tableData.length === 0"
        style="text-align: center; color: #555; line-height: 50pt"
        v-show="!tableQuery.table_loading"
      >
        <span :style="{ color: tableQuery.errMsg ? 'red' : '' }">{{
          $t(tableQuery.errMsg || "comm.noData")
        }}</span
        ><el-button icon="el-icon-refresh" type="text" @click="load(1)" />
      </div>
    </div>

    <!---->
    <div
      style="margin-bottom: 0px"
      class="row bottom_page_tools"
      v-if="showPageTools && tableQuery.total > 0"
    >
      <div
        class="col-md-5 col-sm-12"
        style="font-size: 9pt; margin: 0px; padding: 0px"
      >
        <ul class="pagination" style="justify-content: left; font-size: 9pt">
          <li class="page-item">
            <a
              class=""
              style="
                padding: 10px;
                border: none;
                border-radius: 6px;
                display: block;
              "
              >{{ $t("pagination.show") }}</a
            >
          </li>
          <li class="page-item">
            <div class="col-sm-12" style="margin: 0px; padding: 0px">
              <select
                v-model.number="tableQuery.pageSize"
                class="custom-select"
                @change="load(1)"
              >
                
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </li>
          <li class="page-item">
            <a
              class=""
              style="
                padding: 10px;
                border: none;
                border-radius: 6px;
                display: block;
              "
              >{{ $t("comm.records") }}</a
            >
          </li>
        </ul>
      </div>

      <!---->
      <div
        class="col-md-7 col-sm-12 justify-content-end bottom_pagination_tools"
        style="font-size: 9pt; margin: 0px; padding: 0px"
      >
        <ul class="pagination fyright">
          <li class="page-item">
            <a
              class="page-link"
              @click="load(1)"
              href="javascript:void(0)"
              style="
                padding: 10px;
                margin: 4px;
                border: none;
                background-color: #eaf8f9;
                border-radius: 6px;
                color: #41c0cb;
                font-size: 9pt;
              "
              >{{ $t("comm.firstPage") }}</a
            >
          </li>
          <li class="page-item">
            <a
              @click="
                tableQuery.pageNum > 1 ? load(tableQuery.pageNum - 1) : load(1)
              "
              class="page-link"
              href="javascript:void(0)"
              style="
                padding: 10px;
                margin: 4px;
                border: none;
                background-color: #eaf8f9;
                border-radius: 6px;
                color: #41c0cb;
              "
              ><i class="mdi mdi-chevron-left"></i
            ></a>
          </li>
          <li class="page-item">
            <a
              class="page-link"
              href="javascript:void(0)"
              style="
                padding: 10px;
                margin: 4px;
                border: none;
                background-color: #eaf8f9;
                border-radius: 6px;
                color: #757575;
              "
            >
              {{ tableQuery.pageNum }} /<span>{{ tableQuery.totalPages }}</span>
            </a>
          </li>
          <li class="page-item">
            <a
              @click="
                tableQuery.pageNum < tableQuery.totalPages
                  ? load(tableQuery.pageNum + 1)
                  : load(tableQuery.totalPages)
              "
              href="javascript:void(0)"
              class="page-link"
              style="
                padding: 10px;
                margin: 4px;
                border: none;
                background-color: #eaf8f9;
                border-radius: 6px;
                color: #41c0cb;
              "
              ><i class="mdi mdi-chevron-right"></i
            ></a>
          </li>
          <li class="page-item">
            <a
              @click="tableQuery.totalPages > 0 && load(tableQuery.totalPages)"
              href="javascript:void(0)"
              class="page-link"
              style="
                padding: 10px;
                margin: 4px;
                border: none;
                background-color: #eaf8f9;
                border-radius: 6px;
                color: #41c0cb;
              "
              >{{ $t("comm.lastPage") }}</a
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import tableUtils from "@/utils/table";
//import request from "@/tboot/ajax.js";
import utils from "@/utils/utils.js";
import * as helper from "@/utils/helper";

export default {
  name: "fTable",
  props: {
    tableId: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    showSubtitle: {
      type: Boolean,
      default: true,
    },

    tableHeard: {
      type: Array,
      default() {
        return [];
      },
    },
    tableData: {
      type: Array,
      default() {
        return [];
      },
    },
    showTitles: {
      type: Boolean,
      default: true,
    },
    showOrder: {
      type: Boolean,
      default: true,
    },

    heardAllHid: {
      type: Boolean,
      default: false,
    },

    border: {
      type: Boolean,
      default: false,
    },
    expand: {
      type: Boolean,
      default: false,
    },
    rightBtnSize: {
      type: String,
      default: "mini",
    },
    showCheckbox: {
      type: Boolean,
      default: false,
    },

    rightBtnColWidth: {
      type: String,
      default: "120px",
    },
    showRightTools: {
      type: Boolean,
      default: false,
    },
    topRightToolsShow: {
      type: Boolean,
      default: true,
    },
    optionMap: {
      type: Object,
      default() {
        return {
          value: "key",
          label: "value",
        };
      },
    },
    showOverflowTooltip: {
      type: Boolean,
      default: false,
    },
    selectInit: {
      type: Function,
      default() {
        return null;
      },
    },
    showPageTools: {
      type: Boolean,
      default: true,
    },
    upLoadTime: {
      type: Number,
      default: 0,
    },
  },

  data() {
    let errTypes = {
      1: "messages.responsetimeout",
      2: "messages.responsecommon",
    };

    let tableQuery = tableUtils.newTableData().query;
    tableQuery.errMsg = "";
    tableQuery.toTop = () => {
      if (utils.isMobile() && this.$refs.top_DIV) {
        //DOTO-jquery
        let top = $(this.$refs.top_DIV).offset().top;
        $("html, body").animate({ scrollTop: top }, 500);
      }
    };
    tableQuery.setParams = (params = {}) => {
      this.sessionSetDatas(params);
    };
    tableQuery.getParams = (yparams = {}) => {
      let params = this.sessionGetDatas();
      params && Object.assign(yparams, params);
      this.sessionGetPages(tableQuery, yparams);
      tableQuery.setParams(yparams);
      return yparams;
    };
    tableQuery.clearParams = () => {
      this.sessionClearDatas();
    };
    tableQuery.assign = function (searchs, params) {
      for (let key in searchs) {
        if (!utils.isEmpty(searchs[key])) {
          params[key] = searchs[key];
        }
      }
    };
    tableQuery.backfill = function (params, searchs) {
      for (let key in searchs) {
        if(params[key]!==undefined){
          searchs[key] = params[key];
        }
        
      }
    };
    tableQuery.loadingShow = (params, clearSession = false, option = {}) => {
      let searchs = option.searchs;
      if (searchs) {
        tableQuery.assign(searchs, params);
      }

      clearSession && tableQuery.clearParams();
      params && tableQuery.getParams(params);

      tableQuery.table_loading = true;
      this.clearTimes();

      if (searchs) {
        tableQuery.backfill(params, searchs);
      }
    };

    tableQuery.loadingHide = (errMsgCode, errMsg = "") => {
      errMsg = utils.isEmpty(errMsgCode) ? errMsg : errTypes[errMsgCode];
      tableQuery.errMsg = errMsg;
      tableQuery.table_loading = false;
      console.log("----",this.upLoadTime)
      if (this.upLoadTime) {
        this.setTimeoutUp &&
          clearTimeout(this.setTimeoutUp) &&
          (this.setTimeoutUp = null);
          
        this.setTimeoutUp = setTimeout(() => {
          this.$emit("load", this.tableQuery, false);
        }, this.upLoadTime);
      }
    };
    return {
      errTypes,
      setTimeoutUp: null,
      isRouterAlive: true,
      tableQuery,
      tableValsMap: this.getTableValsMap(),
      imgurl: (window.$url || {}).imgUrl || "",
      allDelete: true,
      moreMap: {},
    };
  },
  beforeDestroy() {
    this.clearTimes();
  },
  methods: {
    sessionGetPages(tableQuery, datas = {}) {
      tableQuery = tableQuery || this.tableQuery;
      if (!tableQuery) return;

      let pageNum = datas.current || tableQuery.pageNum;
      pageNum = parseInt(pageNum || 1);
      tableQuery.pageNum = pageNum > 0 ? pageNum : 1;
      let pageSize = datas.size || tableQuery.pageSize;
      pageSize = parseInt(pageSize || 10);
      tableQuery.pageSize = pageSize > 0 ? pageSize : 10;
    },

    sessionSetDatas(params = {}) {
      if (!this.tableId) return;
      sessionStorage.setItem(`${this.tableId}_params`, JSON.stringify(params));
    },
    sessionGetDatas() {
      if (!this.tableId) return;
      let params = sessionStorage.getItem(`${this.tableId}_params`);
      return JSON.parse(params || "{}");
    },
    sessionClearDatas() {
      sessionStorage.removeItem(`${this.tableId}_params`);
    },
    clearTimes() {
      this.setTimeoutUp &&
        clearTimeout(this.setTimeoutUp) &&
        (this.setTimeoutUp = null);
    },
    getAddrFormat(val, num = 10) {
      if (val && val.length <= num) {
        return val;
      }
      return helper.getAddrFormat(val, num);
    },
    ieUpdate() {
      this.isRouterAlive = false;
      this.$nextTick(() => (this.isRouterAlive = true));
    },
    handleSelectionChange() {
      if (
        this.$refs.multipleTable.selection == null ||
        this.$refs.multipleTable.selection.length == 0
      ) {
        this.allDelete = true;
      } else {
        this.allDelete = false;
      }
      this.$emit("select-change", this.$refs.multipleTable.selection);
    },
    sortChange(column) {
      //prop, order
      this.tableQuery.sortBy = column.prop;
      this.tableQuery.descending = column.order == "descending" ? true : false;
      this.$emit("load", this.tableQuery, true, this.tableQuery.pageNum);
    },
    rightTools(type, scope) {
      this.$emit("right-tools", type, scope);
    },
    topTools(type) {
      this.$emit("top-tools", type);
    },
    load(page = this.tableQuery.pageNum) {
      this.tableQuery.pageNum = page;
      this.$emit("load", this.tableQuery, true, this.tableQuery.pageNum);
    },
    getTableHeard(key, val, row, citem, fnum = 10) {
      if (this.tableValsMap[key]) {
        if (typeof this.tableValsMap[key] == "function") {
          val = this.tableValsMap[key](val, row, citem);
        } else {
          val = this.tableValsMap[key][val];
        }
      }

      if (citem.format) {
        fnum = citem.fnum || fnum;
        val = this.getAddrFormat(val, fnum);
      }

      /* if (citem.format && citem.fnum) {
        val = this.getAddrFormat(val, citem.fnum);
      }*/
      /*if (citem.format) {
        val = this.getAddrFormat(val, fnum);
      }*/
      if (citem.type == "time") {
        val = this.formatTime(val);
      }

      if (citem.type == "timimg") {
        val = this.formatTimimg(val);
      }

      if (citem.valT) {
        val = this.$t(val);
      }

      if (!utils.isEmpty(val) && !utils.isEmpty(citem.units)) {
        val += "" + citem.units;
      }
      return val;
    },
    getTableValsMap() {
      var map = {};
      this.tableHeard.forEach((element) => {
        if (element.valMap) {
          map[element.name] = element.valMap;
        }
        /*  else if (element.optionUrl) {
          let optionMap = element.optionMap || this.optionMap;
          let namesL = [];
          if (!utils.isEmpty(optionMap.label)) {
            let ynames = optionMap.label.split(",");
            ynames.forEach((key) => {
              if (!utils.isEmpty(key)) {
                namesL.push(key.trim());
              }
            });
          }

          let index = element.optionUrl.lastIndexOf("?");
          let rdata = {};
          if (index >= 0) {
            let str = element.optionUrl.substring(
              index + 1,
              element.optionUrl.length
            );
            rdata = utils.getUrlParams(str);
          }

          request({
            url: element.optionUrl,
            method: "post",
            rdata,
          })
            .then((response) => {
              let arr = response || [];
              let valMap = {};
              arr.forEach((item) => {
                let labelsL = "";
                namesL.forEach(function (nameL) {
                  let labelL = item[nameL];
                  if (!utils.isEmpty(labelL)) {
                    labelsL += labelsL.length > 0 ? "  " + labelL : labelL;
                  }
                });
                let valL = item[optionMap.value];
                if (
                  element.vaType == "number" &&
                  valL !== null &&
                  valL !== undefined
                ) {
                  valL = parseFloat(valL);
                }
                valMap[valL] = labelsL;
              });

              //   map[element.name] = valMap
              this.$set(map, element.name, valMap);
              //this.ieUpdate()
            })
            .catch((err) => {
              console.log(err);
            });
        }*/
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
    formatTimimg(time) {
      if (utils.isEmpty(time)) {
        return "";
      }
      return helper.formatTimimg(time);
    },

    expandChange(row, arrs) {
      this.$emit("expand-change", row, arrs);
    },
    onAddr(item, row) {
      this.$emit("onAddr", item, row);
    },
    colClick(item, dataL) {
      this.$emit("colClick", { col: item, row: dataL });
    },
    setMoreMap(newVal) {
      let moreMap = {};
      newVal.forEach((item, cd) => {
        moreMap[cd] = false;
      });

      this.moreMap = moreMap;
    },
  },

  mounted() {
    //this.sessionGet();

    this.tableQuery.errMsg = " ";
    this.$emit("inint-ok", this.tableQuery);
  },
  computed: {
    rand() {
      return (this.tableQuery.pageNum - 1) * this.tableQuery.pageSize;
    },

    isMore() {
      let re = this.tableHeard.find((item) => {
        if (item.more) {
          return true;
        }
      });
      return !!re;
    },
  },
  watch: {
    tableHeard: {
      immediate: true,
      handler: function () {
        //newV, oldV
        this.tableValsMap = this.getTableValsMap();
      },
    },
    tableData: {
      immediate: true,
      handler: function (newVal) {
        this.setMoreMap(newVal);
      },
    },
    /* "tableQuery.query": function () {
      this.tableQuery.pageNum = 1;
      if (this.loadTime) {
        clearTimeout(this.loadTime);
        this.loadTime = null;
      }
      this.loadTime = setTimeout(() => {
        this.load();
      }, 700);
    },*/
  },
};
</script>
<style scoped>
.clickColor {
  color: #2ebac6;
  cursor: pointer;
}
.bottom_page_tools {
  padding: 0px 15px;
}
@media (min-width: 700px) {
  .pc_table {
    display: list-item;
  }
  .phone_table {
    display: none;
  }
  .bottom_pagination_tools .pagination {
    float: right;
  }
}

@media (max-width: 700px) {
  .pc_table {
    display: none;
  }
  .bottom_pagination_tools {
    width: 100%;
    text-align: center;
  }
}

.phone_table_div {
  text-align: center;
}
.phone_table {
  background-color: #fff;
  width: 100%;

  max-width: 600px;
  text-align: left;
  margin-bottom: 10px;
}
.phone_label,
.phone_val {
  display: inline-block;
  padding: 5px;
  vertical-align: top;
}
.phone_label {
  font-weight: 600;
  color: #888;
  font-size: 12px;
}
.phone_val {
  font-size: 12px;
}
.phone_btns {
  text-align: center;
  border-top: solid 1px #eee;
  padding-top: 3px;
}
.table_item {
  box-shadow: 0px 0px 13px 0px rgba(236, 236, 241, 1);
  margin-bottom: 20px;
  clear: both;
  background-color: #fff;
  padding: 10px;
}

.bottom_line {
  border-bottom: solid 1px #eee;
}
/*************************** */
.phone_table_context {
  list-style: none;
  line-height: 26px;
  border: #dcdcdc solid 1px;
  border-radius: 8px;
  padding: 10px;
  margin: 8px 0px;
}
.phone_table_context_sub {
  list-style: none;
  margin: 0px;
  padding: 0px 10px;
}
.mar_pad_zero {
  margin: 0px;
  padding: 0px;
  list-style: none;
}
.phone_li_label {
  font-weight: bold;
  font-size: 12pt;
}
.phone_li_value {
  padding-left: 15px;
}

.table-responsive {
  min-height: 50px;
}
</style>
<style>
.ie_htable_context .el-icon-loading {
  font-size: 32px;
}
</style>
