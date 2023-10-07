<template>
  <div>
    <div class="row" style="padding: 6px; text-align: left">
      <div class="col-md-4 i-ma-sm">
        <p class="sub-title" style="width: 100%; text-align: left">
          {{ $t("ftable.totalnumber", [totalr]) }}
        </p>
      </div>
      <div class="col-md-4 i-ma-sm">
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
      <div
        class="btn-group"
        slot="table_title_right_pledge_status"
        slot-scope="scope"
        v-if="scope.type == 'pc'"
      >
        <button
          class="filter-btn btn-secondary"
          @click="searchs.win.status = !searchs.win.status"
        >
          <i class="mdi mdi-filter"></i>
        </button>

        <div class="filter-win" v-show="searchs.win.status">
          <div>
            <select class="form-control" v-model="searchs.data.status">
              <option value="">{{ $t("node.plestatus") }}</option>
              <option value="0">{{ $t("node.plestatus0") }}</option>
              <option value="1">{{ $t("node.plestatus1") }}</option>
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
      default: "storageRecords_auto",
    },
  },
  data() {
    let _this_ = this;
    return {
      searchs: {
        win: {
          status: false,
        },
        data: {
          pledge_address: "",
          status: "",
        },
      },
      tableHeard: [
        {
          title: "node.pledgeahash",
          name: "pledge_hash",
          format: true,
          popover: true,
          fnum: 15,
        },
        {
          title: "node.pledgeaddress",
          name: "pledge_address",
          format: true,
          popover: true,
          fnum: 15,
        },
        {
          title: "node.pledgeamounte",
          name: "pledge_amount",
          valMap(val) {
            return helper.getDataFormat(val, 18, 10000).toFixed(4) + " UTG";
          },
        },
        {
          title: "node.shareradio",
          name: "ratio",
          valMap(val) {
            if (val != null) {
              if (val > 0) return (val * 100).toFixed(2) + "%";
              else return "<0.01%";
            } else {
              return "";
            }
          },
          more: true,
        },
        {
          title: "node.pledgeNumber",
          name: "pledge_number",
          more: true,
        },
        {
          title: "node.pledgestatus",
          name: "pledge_status",
          more: true,
          isHtml: true,
          valMap(val) {
            switch (`${val}`) {
              case "0":
                return `<span>${_this_.$t("node.plestatus0")}</span>`;
              case "1":
                return `<span>${_this_.$t("node.plestatus1")}</span>`;

              default:
                return "";
            }
            return;
          },
        },
        {
          title: "node.exitpledgeheight",
          name: "unpledge_number",
          more: true,
        },
        /*
        {
          title: "node.exitpledgetype",
          name: "unpledge_type",
          more: true,
        },
        */

        {
          title: "node.pledgetime",
          name: "pledge_time",
          valMap(val) {
            return helper.formatTime(val, 1);
          },
          more: true,
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
    btnClear() {
      for (let key in this.searchs.data) {
        this.searchs.data[key] = "";
      }
      this.btnFilter();
    },
    btnFilter() {
      this.searchs.win.status = false;
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
      query.pageNum = pageNum || query.pageNum;

      var params = {
        current: query.pageNum,
        size: query.pageSize,
        etType: "SN",
        node_address: this.address,
      };
      Object.assign(params, this.searchs.data);
      query.loadingShow()// { searchs: this.searchs.data });

      api
        .postJson("/platform/getNodePledgeList", params)
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
  watch: {
    address() {
      this.seachData();
    },
  },
};
</script>
<style lang="scss" scoped></style>
