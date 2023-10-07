<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
          <span>{{ $t(title) }} </span>
        </h4>
        <p class="sub-title" style="width: 100%; text-align: left">
          {{ $t("ftable.totalnumberrelease", [total]) }}
        </p>
        <h-tbale
          ref="ReleaseRecordTable"
          :table-heard="tableHeard"
          :table-data="tableData"
          :show-right-tools="false"
          :tableId="'ReleaseRecordtableId' + this.$store.getters.account+type"
          :showSubtitle="false"
          @inint-ok="tableInit"
          @load="loadTable"
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
  name: "ReleaseRecord",
  components: { HTbale },
  props: {
    type: {
      type: [String, Number],
      default: 0,
    },
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    let _this_ = this;
    return {
      tableHeard: [
        {
          title: "lock.minerAddress",
          name: "address",
          format: true,
          popover: true,
          isClick: true,
        },
        {
          title: "lock.LockedReward",
          name: "leftAmount",
          valMap(val) {
            return `${utils.clearZero(val, 4)} UTG`;
          },
        },
        {
          title: "lock.ReleasedReward",
          name: "releaseamount",
          valMap(val) {
            return `${utils.clearZero(val, 4)} UTG`;
          },
        },
      ],
      tableData: [],
      total: 0,
      totalPages: 0,
      searchInput: null,
    };
  },

  methods: {
    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    loadTable(query, toTop = true, pageNum) {
      if (!query && this.$refs.ReleaseRecordTable) {
        query = this.$refs.ReleaseRecordTable.tableQuery;
      }

      if (!query) return;
      query.pageNum = pageNum || query.pageNum;

      //query.loadingShow();

      var param = {
        current: query.pageNum,
        size: query.pageSize,
        revenueAddress: this.$store.getters.account,
        type: this.type,
      };
      Object.assign(param, this.param);

      query.loadingShow(param, pageNum);
      this.type = param.type;
      api
        .postJson("/platform/lockUtgMinersByRevAddress", param)
        .then((response) => {
          query.table_loading = false;

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }
          let re = response.result || {};
          this.tableData = re.records || [];
          if (response.result != null) this.total = response.result.total;
          setPageQuery(query, re);
          if (toTop && this.tableData.length > 0) {
            query.toTop();
          }
        });
    },
    colClick(data) {
      let col = data.col || {};
      let row = data.row || {};
      switch (col.name) {
        case "address":
          this.toRelease(row);
          break;
      }
    },

    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },

    toRelease(data) {
      if (data.address) {
        helper.goPathUrl(
          this,
          "mymanage/releaseList",
          `${data.address}_${this.type}`
        );
      }
    },
  },
  watch: {
    "$store.getters.account": function () {
      this.total = 0;
      this.tableInit(null, 1);
    },
  },
};
</script>
<style lang="scss" scoped></style>
