<template>
  <div>
    <h4
      v-if="pParams.nodeType == 'PoS'"
      class="mt-0 header-title"
      style="width: 100%; text-align: left"
    >
      <p class="sub-title" style="width: 100%; text-align: left">
        {{ $t("ftable.totalnumber", [total]) }}
      </p>
    </h4>
    <div v-else class="row" style="text-align: left">
      <div class="col-md-4 i-ma-sm">
        <p class="sub-title" style="width: 100%; text-align: left">
          {{ $t("ftable.totalnumber", [total]) }}
        </p>
      </div>
    </div>
    <h-tbale
      v-if="pParams"
      ref="htable"
      :show-subtitle="false"
      :table-heard="tableHeard"
      :table-data="tableData"
      :show-right-tools="false"
      :up-load-time="20000"
      @inint-ok="tableInit"
      @load="loadTable"
    >
      <div
        class="btn-group"
        slot="table_title_right_rewardType"
        slot-scope="scope"
        v-if="scope.type == 'pc'"
      >
        <button
          class="filter-btn btn-secondary"
          @click="searchs.win.rewardType = !searchs.win.rewardType"
        >
          <i class="mdi mdi-filter"></i>
        </button>

        <div class="filter-win" v-show="searchs.win.rewardType">
          <div>
            <select class="form-control" v-model="searchs.data.rewardType">
              <option
                v-for="(label, key) in options[pParams.nodeType] || {}"
                :key="key"
                :value="key"
              >
                {{ $t(label) }}
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
      </div>
    </h-tbale>
  </div>
</template>
<script>
import { Message } from "element-ui";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import webSdk from "@/utils/webSdk.js";
import utils from "@/utils/utils";
import HTbale from "@/components/modules/HTbale.vue";
import { setPageQuery } from "@/utils/table.js";
export default {
  components: { HTbale },
  props: {
    pParams: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    let _this_ = this;
    return {
      total: 0,
      options: {
        SN: {
          4: "rewards.ServiceReward",
          5: "rewards.GrantReward",
          13: "rewards.SNDelegateReward",
        },
        PoS: {
          3: "rewards.POSReward",
          6: "rewards.POSDelegateReward",
        },
        SP: {
          8: "rewards.SPReward",
          9: "rewards.SPDelegateReward",
        },
      },
      rewardTypes: {
        3: "rewards.POSReward",
        6: "rewards.POSDelegateReward",
        4: "rewards.ServiceReward",
        5: "rewards.GrantReward",
        8: "rewards.SPReward",
        9: "rewards.SPDelegateReward",
        13: "rewards.SNDelegateReward",
      },
      searchs: {
        win: {
          rewardType: false,
        },
        data: {
          rewardType: "",
        },
      },
      tableHeard: [
        {
          title: "lock.revenuesaddress",
          name: "revenueAddress",
          format: true,
          popover: true,
          minWidth: "150px",
          fnum: 8,
        },
        {
          title: "lock.blockNumber",
          name: "blockNumber",
          minWidth: "100px",
        },
        {
          title: "rewards.Reward",
          name: "rewardAmount",
          minWidth: "100px",
          valMap(val) {
            return `${utils.clearZero(val || 0)} UTG`;
          },
        },

        {
          minWidth: "120px",
          title: "storagereward.rewardtype",
          name: "rewardType",
          valMap(val) {
            let label = _this_.rewardTypes[val];
            return utils.isEmpty(label) ? "" : _this_.$t(label);
          },
        },
        {
          title: "rewards.RewardTime",
          name: "instime",
          minWidth: "110px",
          valMap(val) {
            if (utils.isEmpty(val)) return "";
            return helper.formatTime(val, 1);
          },
        },
      ],
      tableData: [],
    };
  },
  methods: {
    btnClear() {
      for (let key in this.searchs.data) {
        this.searchs.data[key] = null;
      }
      this.btnFilter();
    },
    btnFilter() {
      this.searchs.win.rewardType = false;
      this.tableInit(null, 1);
    },
    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    loadTable(query, toTop = true, pageNum) {
      if (!query && this.$refs.htable) {
        query = this.$refs.htable.tableQuery;
      }
      if (!query) return;
      query.pageNum = pageNum || query.pageNum;

      var params = Object.assign(
        {
          current: query.pageNum,
          size: query.pageSize,
        },
        this.searchs.data
      );
      if (!this.pParams.nodeAddress) return;

      Object.assign(params, this.pParams);

      query.loadingShow();
      api
        .postJson("/platform/getNodeLjRewardlist", params)
        .then((response) => {
          query.loadingHide();

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }
          let re = response.result || {};
          let tableData = re.records || [];

          this.tableData = tableData;
          setPageQuery(query, re);
          this.total = re.total || 0;
          if (toTop && this.tableData.length > 0) {
            query.toTop();
          }
        })
        .catch(() => {
          query.loadingHide();
        });
    },
  },
  watch: {
    pParams: {
      immediate: true,
      deep: true,
      handler() {
        this.tableInit(null, 1);
      },
    },
  },
};
</script>