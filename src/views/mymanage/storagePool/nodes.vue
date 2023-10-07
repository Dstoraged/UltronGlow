<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <div class="row" style="padding: 6px; text-align: left">
          <div class="col-md-4 i-ma-sm">
            <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
            {{ $t("storagePool.poolNodeManagement")}}
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
                v-model="searchs.data.query"
                @keyup.enter="tableInit(null, 1)"
                style="border-right: 0px; width: 60%"
              />
              <div class="input-group-append">
                <button
                  class="btn btn-block waves-effect waves-light"
                  type="button"
                  @click="loadTable(null, true, 1)"
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
          :table-id="tableId"
          :table-heard="tableHeard"
          :table-data="tableData"
          :show-right-tools="true"
          @inint-ok="tableInit"
          @load="loadTable"
          @colClick="colClick"
        >
          <template slot="table_cell_activeStatus" slot-scope="scope">
            <span
              :class="scope.data.activeStatus == 1 ? 'text-green' : 'text-red'"
              >{{ scope.data.activeStatus == 1 ? $t("storagePool.joined") : $t("comm.exited") }}</span
            >
          </template>
          <template slot="table_cell_quantity" slot-scope="scope">
            <span class="pointer main-color" @click="toNodes">{{
              scope.data.quantity
            }}</span>
          </template>

          <div slot="rightCol" slot-scope="scope" class="width-10">
            <el-button
              size="mini"
              type="text"
              v-if="scope.data.activeStatus == 1"
              @click="move(scope.data)"
            >
              {{$t("storagePool.remove")}}
            </el-button>
            <span v-else> - </span>
          </div>
        </h-tbale>
      </div>
    </div>
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
  name: "StoragePledge",
  components: { HTbale },
  props: {},
  data() {
    let _this_ = this;

    return {
      tableId: "storagePool_Index",
      searchs: {
        data: {
          query: "",
          activeStatus: "",
        },
        win: {
          activeStatus: false,
        },
      },
      tableHeard: [
        {
          title: "storageNode.storagePool",
          name: "spHash",
          format: true,
          popover: true,
          minWidth: "110px",
          fnum: 6,
          isClick: true,
        },
        {
          title: "storagePool.rate",
          name: "entrustRate",
          units: " %",
          more: true,
        },
        {
          title: "storagemining.miner",
          name: "managerAddr",
          format: true,
          popover: true,
          isClick: true,
          fnum: 6,
          minWidth: "110px",
        },
        {
          title: "storagePool.addTime",
          name: "instime",

          minWidth: "110px",
        },
        {
          title: "storagePool.addHeight",
          name: "activeHeight",
          isClick: true,
          more: true,
          minWidth: "150px",
        },
        {
          title: "storagePool.activeStatus",
          name: "activeStatus",
          more: true,
          isClick: true,
          minWidth: "85px",
        },
      ],
      tableData: [],
      total: 0,
    };
  },

  methods: {
    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    loadTable(query, toTop = true, pageNum) {
      if (!this.$store.getters.account) return;
      if (!query && this.$refs.htable) {
        query = this.$refs.htable.tableQuery;
      }
      if (!query) return;
      query.pageNum = pageNum || query.pageNum;

      var params = {
        current: query.pageNum,
        size: query.pageSize,
        pledge_addr: webSdk.sdkUtils.splitAddress(
          this.$store.getters.account,
          false
        ),
      };
      Object.assign(params, this.searchs.data);

      //query.loadingShow();
      query.loadingShow(params, query.pageNum);

      api
        .postJson("/platform/getStorageRequestList", params)
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
    colClick(data) {
      let col = data.col || {};
      let row = data.row || {};
      switch (col.name) {
        case "spHash":
          this.goToUrl("mymanage/rentdetail", row.spHash);
          break;
        case "activeHeight":
          this.goToUrl("BlockDetail", row.activeHeight);
          break;
        case "managerAddr":
          this.goToUrl("AccountDetail", row.managerAddr);
          break;

        case "revenueAddr":
          this.goToUrl("AccountDetail", row.revenueAddr);
          break;
      }
    },

    formatTime(time) {
      return helper.formatTimimg(time);
    },
    getAddrFormat(data, number) {
      return helper.getAddrFormat(data, number);
    },
    goToUrl(name, params) {
      console.log("params=" + params);
      helper.goPathUrl(this, name, params);
    },
    move(row) {
      let sdk = this.$store.getters.getsdk || null;
      if (sdk) {
        let _this_ = this;
        let setData = {
          title: `${_this_.$t('storagePool.removeSN')}`,
          context: `${_this_.$t('storagePool.storagePoolAddress')}: ${row.spHash}<br/>${_this_.$t('storagemining.miner')}: ${row.managerAddr}`,
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
            hash: row.spHash,
            addr1: row.managerAddr,
          },
          setData
        );
        setData.request = request;
        this.$store.dispatch("setNotification", setData);
      }
    },
  },

  watch: {
    "$store.getters.account": function () {
      this.tableInit(null, 1);
    },
  },
};
</script>
<style lang="scss" scoped></style>
