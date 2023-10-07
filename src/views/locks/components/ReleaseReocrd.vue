<template>
  <div class="container-fluid" v-show="total > 0">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
          <span>{{ $t("ftable.releaserecord") }}</span>
        </h4>
        <p class="sub-title" style="width: 100%; text-align: left">
          {{ $t("ftable.totalnumberrelease", [total]) }}
        </p>
        <h-tbale
          ref="releaseReocrdTable"
          :table-heard="tableHeardreleaseReocrd"
          :table-data="tableDatareleaseReocrd"
          :show-right-tools="false"
          :tableId="'ReleaseReocrdtableId'+node_addr+blockNumber"
          :showSubtitle="false"
          @inint-ok="tableInitreleaseReocrd"
          @load="loadTablereleaseReocrd"
          @colClick="colClick"
        >
        </h-tbale>
      </div>
    </div>
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
  name: "ReleaseReocrd",
  components: { HTbale },
  props: {
    blockNumber: {
      type: String,
      default: "",
    },
    node_addr: {
      type: String,
      default: "",
    },
    node_type: {
      type: String,
      default: "",
    },
  },
  data() {
    let _this_ = this;
    return {
      tableHeardreleaseReocrd: [
        {
          title: "mymanageMining.revenuesaddress",
          name: "revenue_address",
          format: true,
          popover: true,
          isClick: true,
        },
        {
          title: "lock.freed",
          name: "releaseamount",
          valMap(val) {
            return `${utils.clearZero(val)} UTG`;
          },
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
      total: 0,

      searchInput: null,
    };
  },

  methods: {
    tableInitreleaseReocrd(query, pageNum) {
      this.loadTablereleaseReocrd(query, false, pageNum);
    },
    loadTablereleaseReocrd(query, toTop = true, pageNum) {
      if (!query && this.$refs.releaseReocrdTable) {
        query = this.$refs.releaseReocrdTable.tableQuery;
      }

      if (!query) return;
      query.pageNum = pageNum || query.pageNum;

      //query.loadingShow();

      var param = {
        current: query.pageNum,
        size: query.pageSize,
        address: this.node_addr,
        type: this.node_type,
        blockNumber: this.blockNumber,
      };

      query.loadingShow(param, pageNum);      
      api
        .postJson("/platform/lockUtgMinerInfo", param)
        .then((response) => {
          query.table_loading = false;

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }
          let re = response.result || {};
          this.tableDatareleaseReocrd = re.records || [];
          if (response.result != null) {
            this.total = response.result.total;
          }
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
        case "revenue_address":
          this.goToUrl("AccountDetail", row.revenue_address);
          break;
      }
    },

    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },
  },
};
</script>
<style lang="scss" scoped></style>
