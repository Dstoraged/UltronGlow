<template>
  <div>
    <div class="row" style="padding: 6px; text-align: left">
      <div class="col-md-4 i-ma-sm">
        <p class="sub-title" style="width: 100%; text-align: left">
          {{ $t("ftable.totalnumber", [totalr]) }}
        </p>
      </div>
      <div v-if="showSearch" class="col-md-4 i-ma-sm">
        <div class="input-group" style="margin: 0 auto">
          <input
            type="text"
            class="form-control"
            :placeholder="$t('storageNode.pledgeAddressSearch')"
            v-model="searchs.data.pledge_address"
            @keyup.enter="tableInit(null, 1)"
            style="border-right: 0px; width: 60%"
          />
          <div class="input-group-append">
            <button
              class="btn btn-block waves-effect waves-light"
              type="button"
              @click="tableInit(null, 1)"
              style="background-color: #d4d4d4"
            >
              {{ $t("comm.search") }}
            </button>
          </div>
        </div>
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
    tableId: {
      type: String,
      default: "storagePledgeRewards_auto",
    },
    toParams: {
      type: Object,
      default() {
        return {};
      },
    },
    showSearch: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    let _this_ = this;
    return {
      searchs: {
        data: {
          pledge_address: "",
        },
      },
      tableHeard: [
        {
          title: "node.pledgeaddress",
          name: "pledge_address",
          format: true,
          popover: true,
          fnum: 6,
        },
        {
          title: "node.pledgeamounte",
          name: "pledge_amount",
          valMap(val) {
            return helper.getDataFormat(val, 18, 10000).toFixed(4) + " UTG";
          },
        },

        {
          title: "storageNode.reward",
          name: "totalamount",

          more: true,
          valMap(val) {
            return `${utils.clearZero(val)} UTG`;
          },
        },
        {
          title: "storageNode.release",
          name: "releaseamount",

          more: true,
          valMap(val) {
            return `${utils.clearZero(val)} UTG`;
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
        type: 11,
        node_address: this.address,
      };

      Object.assign(params, this.toParams);
      Object.assign(params, this.searchs.data);
      query.loadingShow(); //, { searchs: this.searchs.data });

      api
        .postJson("/platform/getPledgeRewardList", params)
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
    },
  },
};
</script>
<style lang="scss" scoped></style>
