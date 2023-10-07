<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
          <span>{{ $t("mymanage.blockreward") }}</span>
        </h4>
        <p class="sub-title" style="width: 100%; text-align: left">
          {{ $t("ftable.totalnumberrelease", [total]) }}
        </p>

        <h-tbale
          ref="htableReleaseList"
          :table-heard="tableHeard"
          :table-data="tableData"
          :show-right-tools="false"
          :showSubtitle="false"
          :up-load-time="30000"
          :table-id="'ReleaseListTableId' + this.$store.getters.account"
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
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import utils from "@/utils/utils";
import HTbale from "@/components/modules/HTbale.vue";
import { setPageQuery } from "@/utils/table.js";
export default {
  name: "ReleaseList",
  components: { HTbale },
  props: {
    type: {
      type: Number,
      default: 0,
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
          title: "lock.blockNumber",
          name: "blockNumber",
          more: true,
        },
        {
          title: "lock.LockedReward",
          name: "leftAmount",
          valMap(val, item) {
            return `${utils.clearZero(
              (item.totalAmount || 0) - (item.releaseamount || 0),
              4
            )} UTG`;
          },
        },
        {
          title: "lock.ReleasedReward",
          name: "releaseamount",
          valMap(val) {
            return `${utils.clearZero(val, 4)} UTG`;
          },
        },
        {
          title: "lock.ReleasedTime",
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
      tableData: [],
      total: 0,
      searchInput: null,
      address: "",
      types: 0,
      tipsT: {
        just: " just ",
        second: " sec",
        minute: " min",
        hour: " hr",
        day: " day",
        week: " week",
        month: " month",
        year: " year",
      },
    };
  },
  created() {
    let id = this.$route.params.id;
    if (!id) {
      return;
    }
    let ids = id.split("_");
    if (ids.length != 2) {
      return;
    }
    this.address = ids[0];
    this.types = ids[1];
  },

  methods: {
    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    async loadTable(query, toTop = true, pageNum) {
      await utils.getNowHeight();
      if (!query && this.$refs.htableReleaseList) {
        query = this.$refs.htableReleaseList.tableQuery;
      }

      if (!query) return;
      query.pageNum = pageNum || query.pageNum;
      if (query.pageSize == 0) query.pageSize = 10;
      // query.loadingShow();

      var param = {
        current: query.pageNum,
        size: query.pageSize,
        address: this.address,
        revenueAddress: this.$store.getters.account,
        type: this.types,
      };
      Object.assign(param, this.param);

      query.loadingShow(param, pageNum);
      this.types = param.type;
      this.address = param.address;

      api.postJson("/platform/lockUtgMinerInfo", param).then((response) => {
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
          this.toMinerView(row);
          break;
      }
    },

    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },

    toMinerView(data) {
      //console.log("this.type="+this.type)
      if (data.address) {
        if (this.types == 1) {
          helper.goPathUrl(
            this,
            "NodeView",
            `${data.address}_${data.type + 1}`
          );
        } else {
          helper.goPathUrl(this, "MinerView", `${data.address}`);
        }
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
