<template>
  <div>
    <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
      <p class="sub-title" style="width: 100%; text-align: left">
        {{ $t("lock.currentLockNumber", [totall]) }}
      </p>
    </h4>
    <h-tbale
      ref="htable"
      :table-heard="lockNodeLockTableHeard"
      :table-data="lockNodeLocktableData"
      :show-right-tools="false"
      :tableId="'LockNodeLocktableId' + node_addr"
      :showSubtitle="false"
      @inint-ok="tableInitlockNodeLock"
      @load="loadTablelockNodeLock"
      @colClick="colClick"
    >
    </h-tbale>
  </div>
</template>
<script>
import { Message } from "element-ui";
import utils from "@/utils/utils";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import HTbale from "@/components/modules/HTbale.vue";
import { setPageQuery } from "@/utils/table.js";
export default {
  name: "LockNodeLock",
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
      lockNodeLockTableHeard: [
        {
          title: "lock.revenuesaddress",
          name: "revenue_address",
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
          title: "lock.totalPledgeAmount",
          name: "pledge_amount",
          valMap(val) {
            return `${utils.clearZero(val || 0)} UTG`;
          },
        },
        {
          title: "lock.totalAmount",
          name: "totalAmount",
          valMap(val, item) {
            return `${utils.clearZero(
              (val || 0) - (item.releaseamount || 0)
            )} UTG`;
          },
        },
        {
          title: "lock.freed",
          name: "releaseamount",
          valMap(val) {
            return `${utils.clearZero(val)} UTG`;
          },
          more: true,
        },
        {
          title: "lock.lockNumber",
          name: "startTime",
          valMap(val, item) {
            return `${utils.lockingTime(
              item.startTime,
              item.avgBlockTime,
              item.unLockNumber,
              item.releaseHeigth
            )} ${_this_.$t("lock.day")} UTG`;
          },
          more: true,
        },
      ],
      lockNodeLocktableData: [],
      totall: 0,
    };
  },

  watch: {
    node_addr: {
      immediate: true,
      handler(id) {
        console.log(id);
       // this.tableInitlockNodeLock(null, 1);
      },
    },
  },
  methods: {
    tableInitlockNodeLock(query, pageNum) {
      this.loadTablelockNodeLock(query, false, pageNum);
    },
    async loadTablelockNodeLock(query, toTop = true, pageNum) {
      
      if (!query && this.$refs.htable) {
        query = this.$refs.htable.tableQuery;
      }
      if (!query) return;
      query.pageNum = pageNum || query.pageNum;

      //query.loadingShow();

      var param = {
        current: query.pageNum,
        size: query.pageSize,
        address: this.node_addr,
        type: this.node_type,
      };

      query.loadingShow(param, pageNum);
     
      await utils.getNowHeight();

      api
        .postJson("/platform/lockUtgMinerInfo", param)
        .then((response) => {
          query.table_loading = false;

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }
          let re = response.result || {};
          this.lockNodeLocktableData = re.records || [];
          if (response.result != null) this.totall = response.result.total;

          setPageQuery(query, re);
          if (toTop && this.lockNodeLocktableData.length > 0) {
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
        case "blockNumber":
          this.toRelease(row);
          break;
        case "revenue_address":
          this.goToUrl("AccountDetail", row.revenue_address);
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
            data.revenue_address
          }`
        );
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
