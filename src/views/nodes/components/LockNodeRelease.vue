<template>
  <div>
    <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
      <p class="sub-title" style="width: 100%; text-align: left">
        {{ $t("ftable.totalnumberrelease", [totalre]) }}
      </p>
    </h4>

    <h-tbale
      ref="releaseReocrdTable"
      :table-heard="tableHeardreleaseReocrd"
      :table-data="tableDatareleaseReocrd"
      :show-right-tools="false"
      :tableId="'LockNodeReleasetableId' + node_addr"
      :showSubtitle="false"
      @inint-ok="tableInitreleaseReocrd"
      @load="loadTablereleaseReocrd"
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
  name: "LockNodeRelease",
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
      tableHeardreleaseReocrd: [
        {
          title: "lock.revenuesaddress",
          name: "revenueaddress",
          format: true,
          popover: true,
          isClick: true,
          fnum: 15,
        },
        {
          title: "lock.blockNumber",
          name: "blockNumber",
          //  isClick: true,
          more: true,
        },
        {
          title: "lock.freed",
          name: "releaseamount",
          valMap(val) {
            return `${utils.clearZero(val, 8)} UTG`;
          },
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
          title: "lock.freedTime",
          name: "curtime",
          valMap(val) {
            return helper.formatTime(val, 1);
          },
        },
      ],
      tableDatareleaseReocrd: [],
      totalre: 0,
      searchInput: null,
    };
  },
  watch: {
    node_addr: {
      immediate: true,
      handler(id) {
        console.log(id);
       // this.tableInitreleaseReocrd(null, 1);
      },
    },
  },
  methods: {
    tableInitreleaseReocrd(query, pageNum) {
      this.loadTablereleaseReocrd(query, false, pageNum);
    },
    async loadTablereleaseReocrd(query, toTop = true, pageNum) {
     
      if (!query && this.$refs.LockAbsentBockTable) {
        query = this.$refs.LockAbsentBockTable.tableQuery;
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
        .postJson("/platform/getStorageRewardList", param)
        .then((response) => {
          query.table_loading = false;

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }

          if (response.result != null) {
            this.totalre = response.result.total;
          }
          let re = response.result || {};
          this.tableDatareleaseReocrd = re.records || [];

          setPageQuery(query, re);
          if (toTop && this.tableDatareleaseReocrd.length > 0) {
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
          `${data.address}_${data.type}_${data.blockNumber}_${
            data.revenue_address || ""
          }`
        );
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
