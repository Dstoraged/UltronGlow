<template>
  <div>
    <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
      <p class="sub-title" style="width: 100%; text-align: left">
        {{ $t("lock.currentLockNumber", [totalr]) }}
      </p>
    </h4>

    <h-tbale
      ref="LockNodeRawardTable"
      :table-heard="lockNodeRawardTableHeard"
      :table-data="lockNodeRawardTableData"
      :show-right-tools="false"
      :tableId="'LockNodeRawardtableId' + node_addr"
      :showSubtitle="false"
      @inint-ok="tableInitLockNodeRaward"
      @load="loadTableLockNodeRaward"
      @colClick="colClick"
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
  name: "LockNodeRaward",
  components: { HTbale },
  props: {
    node_addr: {
      type: String,
      default: "",
    },
    node_type: {
      type: Number,
      default: 0,
    },
  },
  data() {
    let _this_ = this;
    return {
      lockNodeRawardTableHeard: [
        {
          title: "lock.revenuesaddress",
          name: "revenueaddress",
          format: true,
          popover: true,
          isClick: true,
        },
        {
          title: "lock.blockNumber",
          name: "blockNumber",
          isClick: true,
          more: true,
        },

        {
          title: "lock.nodeawardAmount",
          name: "totalAmount",
          valMap(val) {
            return `${utils.clearZero(val || 0)} UTG`;
          },
        },

        {
          title: "lock.totalAmount",
          name: "lockAmount",
          valMap(val, item) {
            return `${utils.clearZero(
              (item.totalAmount || 0) - (item.releaseamount || 0)
            )} UTG`;
          },
        },

        {
          title: "lock.leftAmount",
          name: "releaseamount",
          valMap(val) {
            return `${utils.clearZero(val)} UTG`;
          },
          more: true,
        },
        /*
         {
          title: "lock.burningratio",
          name: "burntratio",         
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
          valMap(val) {
            return `${utils.clearZero(val, 4)} UTG `;
          },
          more: true,
        },

        {
          title: "lock.lockNumber",
          name: "releaseHeigth",
          valMap(val, item) {
            return `${utils.lockingTime(
              item.startTime,
              item.avgBlockTime,
              item.unLockNumber,
              item.releaseHeigth
            )} ${_this_.$t("lock.day")}`;
          },
          more: true,
        },
      ],
      lockNodeRawardTableData: [],
      totalr: 0,
      searchInput: null,
    };
  },
  watch: {
    node_addr: {
      immediate: true,
      handler(id) {
        console.log(id);
        //this.tableInitLockNodeRaward(null, 1);
      },
    },
  },
  methods: {
    tableInitLockNodeRaward(query, pageNum) {
      this.loadTableLockNodeRaward(query, false, pageNum);
    },
    async loadTableLockNodeRaward(query, toTop = true, pageNum) {
     
      if (!query && this.$refs.LockNodeRawardTable) {
        query = this.$refs.LockNodeRawardTable.tableQuery;
      }

      if (!query) return;
      query.pageNum = pageNum || query.pageNum;

      // query.loadingShow();

      var param = {
        current: query.pageNum,
        size: query.pageSize,
        address: this.node_addr,
        type: this.node_type, //1,11 111 //this.node_type
      };

      query.loadingShow(param, pageNum);
      
      await utils.getNowHeight();

      api
        .postJson("/platform/getStorageRewardList", param)
        .then((response) => {
          query.table_loading = false;

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }

          if (response.result != null) {
            this.totalr = response.result.total;
          }
          let re = response.result || {};
          this.lockNodeRawardTableData = re.records || [];

          setPageQuery(query, re);
          if (toTop && this.lockNodeRawardTableData.length > 0) {
            query.toTop();
          }
        })
        .catch((error) => {
          query.loadingHide(JSON.stringify(error).includes("timeout") ? 1 : 2);
        });
    },
    colClick(data) {
      let col = data.col || {};
      let row = data.row || {};
      switch (col.name) {
        case "revenueaddress":
          this.goToUrl("AccountDetail", row.revenueaddress);
          break;
        case "blockNumber":
          this.toRelease(row);
          break;
      }
    },

    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },
    toRelease(data) {
      if (data.address && data.type) {
        helper.goPathUrl(
          this,
          "releaseList",
          `${data.address}_${data.type + 1}_${data.blockNumber}_${
            data.revenue_address || ""
          }`
        );
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
