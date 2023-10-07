<template>
  <div>
    <div class="row" style="padding: 6px; text-align: left">
      <div class="col-md-4 i-ma-sm">
        <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
          {{ $t("storagePool.SNofSP") }}
        </h4>
        <p class="sub-title" style="width: 100%; text-align: left">
          {{ $t("ftable.totalnumber", [total]) }}
        </p>
      </div>
      <div class="col-md-4 i-ma-sm">
        <div class="input-group" style="margin: 0 auto">
          <input
            type="text"
            class="form-control"
            :placeholder="$t('storagemining.miner')"
            v-model="searchs.data.device_addr"
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
      ref="sublevelStorageNodes"
      :table-heard="tableHeard"
      :table-data="tableData"
      :show-right-tools="true"
      :up-load-time="30000"
      :showSubtitle="false"
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
      <div slot="rightCol" slot-scope="scope" class="width-10">
        <el-button
          v-if="walletSelect && scope.data.joinState == 1"
          @click="remove(scope.data)"
          type="text"
          >{{$t("storagePool.remove")}}</el-button
        >
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
        data: { device_addr: "", status: "" },
        win: { status: false },
      },
      tableHeard: [
        {
          title: "storagePool.storagePoolAddress",
          name: "sp_hash",
          format: true,
          fnum: 6,
          popover: true,
          isClick: true,
        },
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
          name: "joinState",
          isHtml: true,
          valMap(val) {
            switch (`${val}`) {
              case "0":
                return `<span>${_this_.$t('comm.exited')}</span>`;

              case "1":
                return `<span style='color:rgb(46, 186, 198)'>${_this_.$t('storagePool.joined')}</span>`;
              default:
                return "";
            }
          },
          minWidth: "120px",
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
        this.searchs.data[key] = false;
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
      if (!query && this.$refs.sublevelStorageNodes) {
        query = this.$refs.sublevelStorageNodes.tableQuery;
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
      query.loadingShow()//, { searchs: this.searchs.data });

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
        case "sp_hash":
          this.goToUrl("storagepooldetail", row.sp_hash);
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
