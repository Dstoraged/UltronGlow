<template>
  <div>
    <h-tbale
      ref="StorageNodeHTable"
      :table-heard="tableHeard"
      :table-data="tableData"
      :show-right-tools="false"
      :up-load-time="30000"
      :showSubtitle="true"
      @inint-ok="tableInit"
      @load="loadTable"
      rightBtnColWidth="100px"
      @colClick="colClick"
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
              <option value="">{{ $t("market.status") }}</option>
              <option value="0" selected>
                {{ $t("market.status0") }}
              </option>
              <option value="1">{{ $t("market.status1") }}</option>
              <option value="6">{{ $t("market.status6") }}</option>
              <option value="7">{{ $t("market.status7") }}</option>
              <option value="-1">{{ $t("market.status-1") }}</option>
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
import webSdk from "@/utils/webSdk.js";
export default {
  components: { HTbale },
  props: {
    address: {
      type: String,
      default: "",
    },
  },
  data() {
    let _this_ = this;
    return {
      storagePoolData: {},
      searchs: {
        win: { status: false },
        data: { status: "" },
      },
      tableHeard: [
        {
          title: "market.deviceaddress",
          name: "device_addr",
          format: true,
          fnum: 6,
          popover: true,
          isClick: true,
        },
        {
          title: "storagePool.activeStatus",
          name: "pledge_status",
          isHtml: true,
          valMap(val) {
            return _this_.pledgeStatusSpan(val);
          },
        },
        {
          title: "storagePool.spaceUsage",
          name: "declare_space",
          valMap(val) {
            return utils.bytesToSize(val || 0);
          },
        },
        {
          title: "storagePool.spaceRate",
          name: "spaceRate",
          valMap(val) {
            return `${val || 0} %`;
          },
        },
        {
          title: "storagePool.addTime",
          name: "sp_jointime",
          more: true,
          valMap(val) {
            return utils.isEmpty(val) ? "" : helper.formatTime(val, 1);
          },
        },

        {
          title: "storagePool.addHeight",
          name: "sp_height",
          more: true,
        },
      ],
      tableData: [],
      total: 0,
      isMobile: utils.isMobile(),
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    btnClear() {
      for (let key in this.searchs.data) {
        this.searchs.data[key] = "";
      }
      this.btnFilter();
    },
    btnFilter() {
      for (let key in this.searchs.win) {
        this.searchs.win[key] = false;
      }
      this.tableInit(null, 1);
    },

    pledgeStatusSpan(val) {
      return utils.getPledgeStatus(val).span;
    },
    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    loadTable(query, toTop = true, pageNum) {
      if (!this.address) return;
      if (!query && this.$refs.StorageNodeHTable) {
        query = this.$refs.StorageNodeHTable.tableQuery;
      }

      if (!query) return;
      query.pageNum = pageNum || query.pageNum;
      if (query.pageSize == 0) query.pageSize = 10;
      query.loadingShow();

      var param = {
        current: query.pageNum,
        size: query.pageSize,
        spHash: this.address,
      };
      Object.assign(param, this.searchs.data);
      query.loadingShow(); //, { searchs: this.searchs.data });

      api
        .postJson("/platform/getSnListBySpHash", param)
        .then((response) => {
          query.loadingHide();

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
        })
        .catch((error) => {
          query.loadingHide(JSON.stringify(error).includes("timeout") ? 1 : 2);
        });
    },
    colClick(data) {
      let col = data.col || {};
      let row = data.row || {};
      switch (col.name) {
        case "device_addr":
          this.goToUrl("StorageDetail", row.device_addr);
          break;
        case "revenueAddr":
          this.goToUrl("RewardDetail", row.revenueAddr);
          break;
      }
    },

    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },

    getAddrFormat(data, number) {
      return helper.getAddrFormat(data, number);
    },
    loadData() {
      if (!this.address) return;
      api
        .postJson(`/spPool/getStoragePoolInfo/${this.address}`, {})
        .then((response) => {
          this.storagePoolData = response.result || {};
        })
        .catch((error) => {
          console.error(error);
        });
    },
    remove(row) {
      let _this_ = this;
      let { sdk } = this.walletSelect;
      let setData = {
        title: `${_this_.$t('storagePool.removeSN')}`,
        context: ` ${_this_.$t('storagePool.SNnode')}：${row.device_addr}`,
        request: null,
        closebtnshow: false,
        success() {
          /*_this_.$notify({
                    title: _this_.$t("loadingSubPan.finish"),
                    message: _this_.$t("messages.rentgok"),
                    type: "success",
                  });*/
        },
        err() {
          _this_.$message.error("failed");
        },
      };

      let request = sdk.sendTransactionTo(
        webSdk.typeJson.spremovesn,
        {
          hash: this.address,
          addr1: row.device_addr,
        },
        setData
      );
      setData.request = request;
      this.$store.dispatch("setNotification", setData);
    },
  },
  computed: {
    walletSelect() {
      return utils.walletSelect({
        _this_: this,
        addr: this.storagePoolData.managerAddr,
        isMsg: false,
      });
    },
  },
  watch: {
    address() {
      this.tableInit(null, 1);
      this.loadData();
    },
  },
};
</script>
<style lang="scss" scoped>
.span_tooltip {
  display: none;
}

.cursor {
  cursor: pointer;
}

a:hover .span_tooltip {
  border: 1px solid;
  display: block;
  position: absolute;
  background: #ffffff;
  border-color: "#019858";
  width: 270px;
  height: 40px;
  margin: 4px 0 0 10px;
  padding: 8px;
}
</style>
