<template>
  <div>
    <h-tbale ref="htable" :show-subtitle="true" :table-id="tableId + address" :table-heard="tableHeard"
      :table-data="tableData" :show-right-tools="false" right-btn-col-width="100px" @inint-ok="tableInit"
      @load="loadTable">
      <div class="btn-group" slot="table_title_right_type" slot-scope="scope" v-if="scope.type == 'pc'">
        <button class="btn btn-secondary btn-sm btn-block" style="
                padding: 1px;
                border-radius: 4px;
                margin-left: 6px;
                height: 19px;
              " @click="btnTypePopover(scope.type)">
          <i class="mdi mdi-filter"></i>
        </button>
        <div :id="`lvType_${scope.type}`" style="
                display: none;
                position: absolute;
                z-index: 999999;
                right: 0;
                top: 30px;
                width: 250px;
                background-color: #ffffff;
                border: #ececec solid 1px;
                padding: 15px;
                border-radius: 4px;
                -webkit-box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
                box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
                border-top: #23cbe0 solid 2px;
              ">
          <div>
            <div class="form-group row">
              <div class="col-sm-12">
                <select class="form-control" v-model="selType">
                  <option value="all"></option>
                  <option value="6">{{ $t("storagereward.type6") }}</option>
                  <option value="10">{{ $t("storagereward.type10") }}</option>
                </select>
              </div>
            </div>
            <div class="popover-footer" style="text-align: center">
              <button type="button" class="btn btn-primary btn-sm" @click="bntTypeFilter(scope.type)">
                <i class="fa fa-filter"></i>{{ $t("comm.filter") }}
              </button>
              <button type="button" class="btn btn-primary btn-sm" @click="bntTypeClear(scope.type)">
                <i class="fa fa-eraser"></i>{{ $t("comm.clear") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </h-tbale>
  </div>
</template>
<script>
import { Message } from "element-ui";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import utils from "@/utils/utils";
import HTbale from "@/components/modules/HTbale.vue";
import { setPageQuery } from "@/utils/table.js";
export default {
  name: "RewardRelease",
  components: { HTbale },
  props: {
    address: {
      type: String,
      default: "",
    },
    tableId: {
      type: String,
      default: "RewardRelease_auto",
    },
  },
  data() {
    const types = {
      1: "storagereward.type1",
      2: "storagereward.type2",
      3: "storagereward.type3",
      4: "storagereward.type4",
      5: "storagereward.type5",
      6: "storagereward.type6",
      7: "storagereward.type7",
      8: "storagereward.type8",
      9: "storagereward.type9",
      10: "storagereward.type10",
      17: "storagereward.type17",
      18: "storagereward.type18",
    };
    let _this_ = this;
    return {
      tableHeard: [
        {
          title: "lock.revenuesaddress",
          name: "revenueaddress",
          format: true,
          popover: true,
          minWidth: "180px",
        },
        {
          title: "lock.blockNumber",
          name: "blockNumber",
          minWidth: "90px",
        },
        {
          title: "market.type",
          name: "type",
          minWidth: "150px",
          valMap(val) {
            return _this_.$t(_this_.types[val] || "");
          },
        },

        {
          title: "storagemining.releasedquantity",
          name: "releaseamount",
          minWidth: "140px",
          valMap(val) {
            return `${utils.clearZero(val, 8)} UTG`;
          },
        },
        /*
       {
           title: "lock.burningratio",
           name: "burntratio",
           minWidth: "100px",
           valMap(val) {
             return `${ utils.weedZero((val || 0) * 100,2) }%`;
           },
           more: true,
            hide: window.$url.burntRatioHide,
         },
        */
        {
          title: "lock.burningamount",
          name: "burntamount",
          minWidth: "120px",
          valMap(val) {
            return `${utils.clearZero(val, 8)} UTG `;
          },
          more: true,
        },


        {
          title: "lock.freedTime",
          name: "curtime",
          type: "time",
          minWidth: "120px",
        },
      ],
      tableData: [],

      pageSizerl: 10,
      pagerl: 1,
      totalrl: 0,
      totalPagerl: 0,
      rewardReleaseList: [],
      loadText: this.$t("comm.clickLoad"),
      searchInput: null,
      types,
      isMobile: utils.isMobile(),
      selType: "all",
    };
  },
  watch: {
    address: {
      immediate: true,
      handler(id) {
        console.log(id);
        this.tableInit(null, 1);
      },
    },
  },
  methods: {
    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    async loadTable(query, toTop = true, pageNum) {
      if (!query && this.$refs.htable) {
        query = this.$refs.htable.tableQuery;
      }
      if (!query) return;
      query.pageNum = pageNum || query.pageNum;

      var params = {
        current: query.pageNum,
        size: query.pageSize,
        address: this.address,
        //type: this.node_type,
        types: [6, 10],
      };

      if (
        this.selType != "all" &&
        this.selType != null &&
        this.selType != "undefined"
      ) {
        params.types = [this.selType];
      }

      //query.loadingShow();
      query.loadingShow(params, pageNum);

      await utils.getNowHeight();
      api
        .postJson("/platform/getStorageRewardList", params)
        .then((response) => {
          query.loadingHide();

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }
          let re = response.result || {};
          let tableData = re.records || [];

          this.tableData = tableData;
          setPageQuery(query, re);
          this.totalrl = re.total || 0;
          if (toTop && this.tableData.length > 0) {
            query.toTop();
          }
        })
        .catch((error) => {
          query.loadingHide(JSON.stringify(error).includes("timeout") ? 1 : 2);
        });
    },

    seachData(val) {
      this.tableInit(null, 1);
    },

    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },

    btnTypePopover(type) {
      var dv = "lvType_" + type;
      $("#" + dv).toggle();
    },

    bntTypeFilter(type) {
      var dv = "lvType_" + type;
      $("#" + dv).toggle();
      this.seachData();
    },

    bntTypeClear(type) {
      var dv = "lvType_" + type;
      $("#" + dv).toggle();
      this.selType = "all";
      this.seachData();
    },
  },
  watch: {
    address: function () {
      this.tableInit(null, 1);
    },
  },
};
</script>
<style lang="scss" scoped>

</style>
