<template>
  <div>
    <h-tbale
      ref="htable"
      :table-id="'StorageReward' + revenueAddr"
      :show-subtitle="true"
      :table-heard="tableHeard"
      :table-data="tableData"
      @inint-ok="tableInit"
      @load="loadTable"
    >
      <span slot="top_subtitle" class="phone_font_12">
        {{
          $t("storagereward.currentTotal", [
            totals,
            statsTotals.totalAmounts,
            statsTotals.releaseamounts,
          ])
        }}</span
      >

      <!--<div
        class="btn-group"
        slot="table_title_right_type"
        slot-scope="scope"
        v-show="scope.type == 'pc'"
      >
        <template>
          <button
            class="filter-btn btn-secondary"
            @click="searchs.win.type = !searchs.win.type"
          >
            <i class="mdi mdi-filter"></i>
          </button>

          <div class="filter-win" v-show="searchs.win.type">
            <div>
              <select class="form-control"  clearable v-model="searchs.data.type">
                <option value="">ALL</option>
                <option v-for="(item,cd) in types" :key="cd" :value="cd">
                  {{ $t(item) }}
                </option>
              </select>
            </div>
            <div class="popover-footer" style="text-align: center">
              <button
                type="button"
                class="btn btn-primary btn-sm"
                @click="btnFilter"
              >
                <i class="fa fa-filter"></i>{{ $t("comm.filter") }}
              </button>
              <button
                type="button"
                class="btn btn-primary btn-sm"
                @click="btnClear"
              >
                <i class="fa fa-eraser"></i>{{ $t("comm.clear") }}
              </button>
            </div>
          </div>
        </template>
      </div>-->
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
  name: "StorageReward",
  components: { HTbale },
  props: {
    revenueAddr: {
      type: [String],
      default: "",
    },
    type: {
      type: Number,
      default: 0,
    },
    devflag: {
      type: Number,
      default: 0,
    },
    tableId: {
      type: String,
      default: "Storagespacerewards",
    },
  },
  data() {
    let _this_ = this;
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
    };
    return {
      types,
      searchs: {
        win: {
          type: false,
        },
        data: {
          type: "",
        },
      },
      tableHeard: [
        {
          title:
            _this_.devflag === 0
              ? "storagereward.deviceaddress"
              : "storagereward.revenuesaddress",
          name: "address",
          format: true,
          popover: true,
          minWidth: "220px",
          valMap(val, data) {
            if (_this_.devflag === 0) return val;
            else return data.revenue_address;
          },
        },

/*        {
          title: "storagereward.rewardtype",
          name: "type",
          more: true,
          valMap(val) {
            return _this_.$t(types[val]);
          },
        },*/
        {
          title: "storagereward.blockNumber",
          name: "blockNumber",
          minWidth: "82px",
          more: true,
        },
        {
          title: "storagereward.reward",
          name: "totalAmount",
          minWidth: "90px",

          valMap(val) {
            return `${utils.clearZero(val)} UTG`;
          },
        },

        {
          title: "storagereward.totalAmount",
          name: "LockAmount",
          valMap(val, item) {
            return `${utils.clearZero(
              (item.totalAmount || 0) - (item.releaseamount || 0)
            )} UTG`;
          },
          minWidth: "110px",
        },
        {
          title: "storagereward.leftAmount",
          name: "releaseamount",
          more: true,
          valMap(val) {
            return `${utils.clearZero(val)} UTG`;
          },
          minWidth: "130px",
        },
        /*
         {
           title: "lock.burningamount",
           name: "burntamount",
           valMap(val, item) {
             if(item.totalAmount>0)
               return `${utils.clearZero(val,5)} UTG (${utils.weedZero(((val ||0)/item.totalAmount) * 100,2)}%)`;
             else
               return `${utils.clearZero(val)} UTG (0%)`;
           },
           more: true,
         },
 */
        {
          title: "lock.burningamount",
          name: "burntamount",
          minWidth: "120px",
          valMap(val) {
            return `${utils.clearZero(val)} UTG`;
          },
          more: true,
        },

        {
          title: "storagereward.unlocktime",
          name: "lockingTime",
          minWidth: "160px",
          valMap(val, item) {
            return `${utils.lockingTime(
              item.startTime,
              item.avgBlockTime,
              item.unLockNumber,
              item.releaseHeigth
            )}${_this_.$t("lock.day")}`;
          },
        },
      ],
      tableData: [],

      pageSizes: 10,
      pages: 1,
      totals: 0,
      totalPages: 0,
      StoragespacerewardsList: [],
      loadText: this.$t("comm.clickLoad"),
      searchInput: null,
      statsTotals: {
        totalAmounts: "--",
        releaseamounts: "--",
      },
    };
  },
  watch: {
    revenueAddr: {
      immediate: true,
      handler(id) {
        console.log(id);
        this.tableInit(null, 1);
      },
    },
  },
  methods: {
    btnClear() {
      for (let key in this.searchs.data) {
        this.searchs.data[key] = "";
      }
      this.btnFilter();
    },
    btnFilter() {
      for (let key in this.searchs.win) {
        this.searchs.win[key] = false;
      }
      this.tableInit(null, 1);
    },
    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    async loadTable(query, toTop = true, pageNum) {
      if (!query && this.$refs.htable) {
        query = this.$refs.htable.tableQuery;
      }
      if (!query) return;
      this.getStorageRewardStat();
      query.pageNum = pageNum || query.pageNum;

      var params = {
        current: query.pageNum,
        size: query.pageSize,
        revenueAddress: null,
        address: null,
        type: this.type,
      };
      if (this.devflag === 0) {
        params.revenueAddress = this.revenueAddr;
      } else {
        params.address = this.revenueAddr;
      }
      //DOTO--
      //Object.assign(params,this.searchs.data);
      //query.loadingShow();
      query.loadingShow(params, pageNum);

      await utils.getNowHeight();
      api
        .postJson("/platform/lockUtgMinerInfo", params)
        .then((response) => {
          query.loadingHide();

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }
          let re = response.result || {};
          this.tableData = re.records || [];

          setPageQuery(query, re);
          this.totals = re.total || 0;
          if (toTop && this.tableData.length > 0) {
            query.toTop();
          }
        })
        .catch((error) => {
          query.loadingHide(JSON.stringify(error).includes("timeout") ? 1 : 2);
        });
    },

    formatTime(time) {
      return helper.formatTimimg(time);
    },
    getAddrFormat(data, number) {
      return helper.getAddrFormat(data, number);
    },
    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },

    toMinerView(data) {
      if (data.address) {
        helper.goPathUrl(this, "MinerView", `${data.address}`);
      }
    },

    seachData() {
      this.tableInit(null, 1);
    },

    getStorageRewardStat() {
      var params = {
        revenueAddress: null,
        address: null,
        type: this.type, //5,
      };
      if (this.devflag === 0) {
        params.revenueAddress = this.revenueAddr;
      } else {
        params.address = this.revenueAddr;
      }
      api
        .postJson("/platform/getStorageRewardStat", params)
        .then((response) => {
          let result = response.result || {};
          this.statsTotals.totalAmounts = `${utils.clearZero(
            result.totalAmount
          )} UTG`;
          this.statsTotals.releaseamounts = `${utils.clearZero(
            result.releaseamount
          )} UTG`;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  /*
  watch: {
    devflag: {
      immediate: true,
      handler: function (valNew) {
        this.tableHeard[0].title =
          valNew === 0
            ? "storagereward.deviceaddress"
            : "storagereward.revenuesaddress";
        this.tableInit(null, 1);
      },
    },
    revenueAddr: function () {
      this.tableInit(null, 1);
    },
  },
  */
};
</script>
<style lang="scss" scoped>
@media (max-width: 700px) {
  .phone_font_12 {
    font-size: 12px;
    font-weight: 400;
  }
}
</style>
