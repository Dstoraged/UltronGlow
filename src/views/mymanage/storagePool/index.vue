<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <div class="row" style="padding: 6px; text-align: left">
          <div class="col-md-4 i-ma-sm">
            <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
              {{ $t("menu.storagePool") }}
            </h4>
            <p class="sub-title" style="width: 100%; text-align: left">
              {{ $t("ftable.totalnumber", [total]) }}
            </p>
          </div>
          <div class="col-md-4 i-ma-sm">
            <div class="input-group" style="margin: 0 auto">
              <input type="text" class="form-control" :placeholder="$t('storagePool.searchMsg2')"
                v-model="searchs.data.query" @keyup.enter="tableInit(null, 1)" style="border-right: 0px; width: 60%" />
              <div class="input-group-append">
                <button class="btn btn-block waves-effect waves-light" type="button" @click="btnFilter"
                  style="background-color: #d4d4d4">
                  {{ $t("comm.search") }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <h-tbale ref="htable" :show-subtitle="false" :table-id="tableId" :table-heard="tableHeard" :table-data="tableData"
          :show-right-tools="true" :up-load-time="20000" @inint-ok="tableInit" @load="loadTable" @colClick="colClick">
          <div class="btn-group" slot="table_title_right_feeRate">
            <el-popover placement="top-start" width="300" trigger="hover" :content="$t('storagePool.ratesMessage')">
              <el-button slot="reference" class="btn  btn-sm btn-block" style="
                padding: 1px;
                border-radius: 4px;
                margin-left: 0px;
                height: 19px;"><i class="mdi dripicons-information"></i></el-button>
            </el-popover>
          </div>
          <div class="btn-group" slot="table_title_right_entrustRate">
            <el-popover placement="top-start" width="300" trigger="hover" :content="$t('storagePool.ratioMessage')">
              <el-button slot="reference" class="btn  btn-sm btn-block" style="
                padding: 1px;
                border-radius: 4px;
                margin-left: 0px;
                height: 19px;"><i class="mdi dripicons-information"></i></el-button>
            </el-popover>
          </div>
          <div class="btn-group" slot="table_title_right_activeStatus" slot-scope="scope" v-show="scope.type == 'pc'">
            <template>
              <button class="filter-btn btn-secondary" @click="searchs.win.status = !searchs.win.status">
                <i class="mdi mdi-filter"></i>
              </button>

              <div class="filter-win" v-show="searchs.win.status">
                <div>
                  <select class="form-control" v-model="searchs.data.status">
                    <option value="">{{ $t("market.status") }}</option>
                    <option value="1">{{ $t("market.status0") }}</option>
                    <option value="0">{{ $t("market.status7") }}</option>
                    <option value="2">{{ $t("comm.exited") }}</option>
                  </select>
                </div>
                <div class="popover-footer" style="text-align: center">
                  <button type="button" class="btn btn-primary btn-sm" @click="btnFilter">
                    <i class="fa fa-filter"></i>{{ $t("comm.filter") }}
                  </button>
                  <button type="button" class="btn btn-primary btn-sm" @click="btnClear">
                    <i class="fa fa-eraser"></i>{{ $t("comm.clear") }}
                  </button>
                </div>
              </div>
            </template>
          </div>

          <div slot="rightCol" slot-scope="scope">
            <el-dropdown v-if="scope.type == 'pc'" trigger="click">
              <el-button size="mini" type="default" icon="el-icon-menu">
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <template>
                  <el-dropdown-item>
                    <el-button style="width: 100%" type="default" size="mini" :disabled="scope.data.activeStatus != 1 || !showQuit(scope.data)
                      " @click="exit(scope.data)">
                      <span>{{ $t("storagePool.exit") }} </span>
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button style="width: 100%" type="default" size="mini" :disabled="scope.data.activeStatus != 1"
                      @click="goToUrl('mymanage/setfeerate', scope.data.hash)">
                      <span>{{ $t("storagePool.rate") }} </span>
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button style="width: 100%" type="default" size="mini" :disabled="scope.data.activeStatus != 1"
                      @click="goToUrl('mymanage/setpoolratio', scope.data.hash)">
                      <span>{{ $t("storagePool.SPRewardRatio") }} </span>
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button style="width: 100%" type="default" size="mini" :disabled="scope.data.activeStatus != 1 &&
                      scope.data.activeStatus !== 0
                      " @click="
    goToUrl('mymanage/StoragePoolPledge', scope.data.hash)
    ">
                      {{ $t("storagePool.pledge") }}
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button style="width: 100%" type="default" size="mini" :disabled="scope.data.activeStatus != 1"
                      @click="
                        goToUrl('mymanage/poolChangeRevenue', scope.data.hash)
                        ">
                      {{ $t("storagePool.revenuesaddress") }}
                    </el-button>
                  </el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
            <div v-else>
              <template>
                <el-button v-if="scope.data.activeStatus == 1 &&
                  scope.data.activeStatus !== 0
                  " type="text" size="mini" @click="
    goToUrl('mymanage/StoragePoolPledge', scope.data.hash)
    ">
                  <span> {{ $t("storagePool.pledge") }} </span>
                </el-button>
                <el-button v-if="scope.data.activeStatus == 1" type="text" size="mini"
                  @click="goToUrl('mymanage/setfeerate', scope.data.hash)">
                  <span>{{ $t("storagePool.rate") }} </span>
                </el-button>
                <el-button v-if="scope.data.activeStatus == 1" type="text" size="mini"
                  @click="goToUrl('mymanage/setpoolratio', scope.data.hash)">
                  <span> {{ $t("storagePool.SPRewardRatio") }} </span>
                </el-button>

                <el-button v-if="scope.data.activeStatus == 1" type="text" size="mini" @click="
                  goToUrl('mymanage/poolChangeRevenue', scope.data.hash)
                  ">
                  <span> {{ $t("storagePool.revenuesaddress") }} </span>
                </el-button>
                <el-button type="text" style="color: red" @click="exit(scope.data)"
                  v-if="showQuit(scope.data) && scope.data.activeStatus == 1">{{ $t("storagePool.exit") }}</el-button>
              </template>
            </div>
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
          status: "",
        },
        win: {
          status: false,
        },
      },
      tableHeard: [
        {
          title: "storagePool.storagePoolAddress",
          name: "hash",
          format: true,
          popover: true,
          minWidth: "160px",
          fnum: 8,
          isClick: true,
        },
        {
          title: "storagePool.SPAdminAddress",
          name: "managerAddr",
          format: true,
          popover: true,
          isClick: true,
          fnum: 6,
          minWidth: "110px",
        },
        {
          title: "storagePool.revenuesaddress",
          name: "revenueAddr",
          format: true,
          popover: true,
          isClick: true,
          fnum: 6,
          minWidth: "110px",
        },
        {
          title: "storagePool.createTime",
          name: "instime",
          more: true,
          minWidth: "130px",
          valMap(val) {
            return utils.isEmpty(val) ? "" : helper.formatTime(val, 1);
          },
        },
        {
          title: "storagePool.createHeight",
          name: "activeHeight",
          more: true,
          isClick: true,
          minWidth: "100px",
        },
        {
          title: "storagePool.activeStatus",
          name: "activeStatus",
          minWidth: "100px",
          isHtml: true,
          valMap(val) {
            switch (`${val}`) {
              case "0":
                return `<span style='color:#555'>${_this_.$t(
                  "market.status7"
                )}</span>`;
              case "1":
                return `<span class='text-green'>${_this_.$t(
                  "market.status0"
                )}</span>`;
              case "2":
                return `<span style='color:#aaa'>${_this_.$t(
                  "comm.exited"
                )}</span>`;
            }
          },
        },
        {
          title: "storagePool.TotalAmountPledged",
          name: "pledgeAmount",
          minWidth: "100px",
          valMap(val) {
            return utils.clearZero(val || 0) + " UTG";
          },
        },

        {
          title: "storagePool.maxSpace",
          name: "totalCapacity",
          minWidth: "120px",
          valMap(val) {
            return utils.bytesToSize(val || 0);
          },
        },
        {
          title: "storagePool.usedSpace",
          name: "usedCapacity",
          minWidth: "100px",
          valMap(val) {
            return utils.bytesToSize(val || 0);
          },
        },
        {
          title: "storagePool.nodeNumber",
          name: "snNum",
          isClick: true,
          minWidth: "100px",
          valMap(val, item) {
            return val || 0;
          },
        },
        {
          title: "storagePool.total",
          name: "spAmount",

          minWidth: "100px",
          valMap(val, item) {
            let addNum = utils.uumbersHandle([val, item.spRelease], ["+"], 18);
            return utils.clearZero(addNum) + " UTG";
          },
        },
        {
          title: "storagePool.rate",
          name: "feeRate",
          more: true,
          valMap(val) {
            return `${val || 0} %`;
          },
          minWidth: "150px",
        },

        {
          title: "storagePool.SPRewardRatio",
          name: "entrustRate",
          more: true,
          minWidth: "210px",
          valMap(val) {
            return `${val || 0} %`;
          },
        },
        {
          title: "storagespace.storagefactor",
          name: "storageRatio",
          more: true,
          valMap(val) {
            return val;
          },
          minWidth: "100px",
        },
      ],
      tableData: [],
      total: 0,
    };
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
      if (!this.$store.getters.account) return;
      if (!query && this.$refs.htable) {
        query = this.$refs.htable.tableQuery;
      }
      if (!query) return;
      query.pageNum = pageNum || query.pageNum;

      var params = {
        current: query.pageNum,
        size: query.pageSize,
        managerAddr: this.$store.getters.account,
      };
      Object.assign(params, this.searchs.data);

      query.loadingShow();
      //query.loadingShow(params, pageNum)//, { searchs: this.searchs.data });
      await utils.loadGlobalDatas().then(() => {
        utils.getNowHeight().then(() => {
          api
            .postJson("/spPool/getStoragePoolList", params)
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
        });
      });
    },
    colClick(data) {
      let col = data.col || {};
      let row = data.row || {};
      switch (col.name) {
        case "hash":
          this.goToUrl("storagePoolDetail", row.hash);
          break;
        case "snNum":
          this.goToUrl("mymanage/storageNodesManage", row.hash);
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
        case "quantity":
          this.goToUrl("mymanage/StoragePoolNodes", row.revenueAddr);
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

    exit(row) {
      let reObj = this.walletSelect(row);
      if (!reObj) return;
      let { sdk } = reObj;

      let _this_ = this;
      let setData = {
        title: `${_this_.$t("Transactions.spexit")}`,
        context: `${_this_.$t(
          "storagePool.storagePoolAddress"
        )}: ${this.getAddrFormat(row.hash)}`,
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
        webSdk.typeJson.spexit,
        {
          hash: row.hash,
        },
        setData
      );
      setData.request = request;
      this.$store.dispatch("setNotification", setData);
    },
    pledgeStatusSpan(val) {
      return utils.getPledgeStatus(val).span;
    },
    walletSelect(row) {
      return utils.walletSelect({
        _this_: this,
        addr: row.managerAddr,
        isMsg: false,
      });
    },

    awaitNum(row) {
      return (
        Number(
          utils.uumbersHandle(
            [
              utils.clearZero(row.pledgeAmount || 0),
              utils.clearZero(row.havAmount || 0),
            ],
            ["-"],
            0
          )
        ) > 0
      );
    },
    showQuit(row) {
      return utils.heightDifference(row.activeHeight, "spexitday");
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
