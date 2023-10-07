<template>
  <div>
    <div class="row" style="padding: 6px; text-align: left">
      <div class="col-md-12 i-ma-sm">
        <p class="sub-title" style="width: 100%; text-align: left">
          {{
            $t("storagereward.currentTotal", [
              totalr,
              statsTotalr.totalAmountr,
              statsTotalr.releaseamountr,
            ])
          }}
        </p>
      </div>
    </div>
    <h-tbale
      ref="htable"
      :show-subtitle="false"
      :table-id="tableId + address"
      :table-heard="tableHeard"
      :table-data="tableData"
      :show-right-tools="false"
      right-btn-col-width="100px"
      @inint-ok="tableInit"
      @load="loadTable"
    >
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
  components: { HTbale },
  props: {
    address: {
      type: String,
      default: "",
    },
    spAddr: {
      type: String,
      default: "",
    },

    tableId: {
      type: String,
      default: "storagePoolReward_auto",
    },
  },
  data() {
    let _this_ = this;
    return {
      tableHeard: [
        {
          title: "lock.profitaddress",
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
          title: "storagereward.reward",
          name: "totalAmount",
          minWidth: "90px",

          valMap(val) {
            return `${utils.clearZero(val, 8)} UTG`;
          },
        },

        {
          title: "storagereward.totalAmount",
          name: "LockAmount",
          valMap(val, item) {
            return `${utils.clearZero(
              (item.totalAmount || 0) - (item.releaseamount || 0),
              8
            )} UTG`;
          },
          minWidth: "110px",
        },
        {
          title: "lock.leftAmount",
          name: "releaseamount",
          minWidth: "140px",
          valMap(val) {
            return `${utils.clearZero(val, 8)} UTG`;
          },
        },

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
          title: "lock.lockNumber",
          name: "lockingTime",

          minWidth: "120px",
          valMap(val, item) {
            let re = utils.lockingTime(
              item.startTime,
              item.avgBlockTime,
              item.unLockNumber,
              item.releaseHeigth
            );
            return `${re || 0}${_this_.$t("lock.day")}`;
          },
        },
      ],
      tableData: [],
      totalr: 0,
      searchInput: null,
      statsTotalr: {
        totalAmountr: "--",
        releaseamountr: "--",
      },
    };
  },
  mounted() {
    this.getStorageRentalRewardStat();
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
      this.getStorageRentalRewardStat();
      if (!query && this.$refs.htable) {
        query = this.$refs.htable.tableQuery;
      }
      if (!query) return;
      query.pageNum = pageNum || query.pageNum;

      var params = {
        current: query.pageNum,
        size: query.pageSize,
        address: this.address,
        types: [21],
      };

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
          this.totalr = re.total || 0;
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
        helper.goPathUrl(this, "MinerView", `${data.address}_${data.type}`);
      }
    },
    toRelease(data) {
      if (data.address && data.type) {
        helper.goPathUrl(
          this,
          "releaseList",
          `${data.address}_${data.type + 1}_${data.blockNumber}_${
            data.revenue_address
          }`
        );
      }
    },

    seachData() {
      this.tableInit(null, 1);
      this.getStorageRentalRewardStat();
    },

    getStorageRentalRewardStat() {
      var params = {
        address: this.spAddr,
        type: 21,
      };
      api
        .postJson("/platform/getStorageRewardStat", params)
        .then((response) => {
          let result = response.result || {};
          this.statsTotalr.totalAmountr = `${utils.clearZero(
            result.totalAmount
          )} UTG`;
          this.statsTotalr.releaseamountr = `${utils.clearZero(
            result.releaseamount
          )} UTG`;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  watch: {
    spAddr: function () {
      this.seachData();
    },
    address:function () {
      this.seachData();
    },
  },
};
</script>
<style lang="scss" scoped></style>
