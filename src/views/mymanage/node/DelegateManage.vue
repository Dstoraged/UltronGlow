<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 30px">
      <div class="card-body">
        <div class="row" style="padding: 6px; text-align: left">
          <div class="col-md-4">
            <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
              <span>{{ $t("node.delegatemanage") }}</span>
            </h4>
            <p class="sub-title" style="width: 100%; text-align: left">
              {{ $t("node.currentNumber", [totalp]) }}
            </p>
          </div>
          <div class="col-md-4">
            <div class="input-group" style="margin: 0 auto">
              <input
                type="text"
                class="form-control"
                :placeholder="$t('node.nodeSearch')"
                id="demo"
                v-model="searchInput"
                @keyup.enter="tableInitnodePledgeList(null, 1)"
                style="border-right: 0px; width: 60%"
              />
              <div class="input-group-append">
                <button
                  class="btn btn-block waves-effect waves-light"
                  type="button"
                  @click="tableInitnodePledgeList(null, 1)"
                  style="background-color: #d4d4d4"
                >
                  {{ $t("comm.search") }}
                </button>
              </div>

              <div class="btn-group" v-if="isMobile">
                <button
                  class="btn btn-secondary btn-sm btn-block"
                  style="
                    padding: 1px;
                    border-radius: 4px;
                    margin-left: 6px;
                    height: 35px;
                    width: 25px;
                  "
                  @click="btnPopover"
                >
                  <i class="mdi mdi-filter"></i>
                </button>
                <div
                  id="lvMobile"
                  style="
                    display: none;
                    position: absolute;
                    z-index: 999999;
                    right: 0;
                    top: 30px;
                    width: 300px;
                    background-color: #ffffff;
                    border: #ececec solid 1px;
                    padding: 15px;
                    border-radius: 4px;
                    -webkit-box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
                    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
                    border-top: #23cbe0 solid 2px;
                  "
                >
                  <div>
                    <div class="form-group row">
                      <div class="col-sm-4">
                        {{ $t("market.pledgestatus") }}
                      </div>
                      <div class="col-sm-8">
                        <select
                          class="form-control"
                          name="selectStatus"
                          v-model="selStatus"
                          id="selectStatus"
                          @change="handleStatusChange()"
                        >
                          <option value="all" selected>
                            {{ $t("node.plestatus") }}
                          </option>
                          <option value="0">{{ $t("node.plestatus0") }}</option>
                          <option value="1">{{ $t("node.plestatus1") }}</option>
                        </select>
                      </div>
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
              </div>
            </div>
          </div>
        </div>
        <h-tbale
          ref="htableNodePledgeList"
          :table-heard="nodePledgeListTableHeard"
          :table-data="nodePledgeListtableData"
          :show-right-tools="true"
          :tableId="'nodePledgeListtableId' + pledge_address"
          :showSubtitle="false"
          :up-load-time="20000"
          @inint-ok="tableInitnodePledgeList"
          @load="loadTablenodePledgeList"
          @colClick="colClick"
        >
          <template slot="table_cell_pledge_status" slot-scope="scope">
            <span v-if="scope.data.pledge_status == 1" style="color: #2ebac6">
              {{ $t(plestauts[scope.data.pledge_status]) }}
            </span>
            <span v-else style="color: #b6b6b4">
              {{ $t(plestauts[scope.data.pledge_status]) }}
            </span>
          </template>

          <div
            class="btn-group"
            slot="table_title_right_pledge_status"
            slot-scope="scope"
            v-if="scope.type == 'pc'"
          >
            <button
              class="filter-btn btn-secondary"
              @click="btnPlegdeStatusPopover(scope.type)"
              id="BtnStatusPopover"
            >
              <i class="mdi mdi-filter"></i>
            </button>
            <div
              :id="`lvPlegdeStatus_${scope.type}`"
              style="
                display: none;
                position: absolute;
                z-index: 999999;
                right: 0;
                top: 30px;
                width: 200px;
                background-color: #ffffff;
                border: #ececec solid 1px;
                padding: 15px;
                border-radius: 4px;
                -webkit-box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
                box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
                border-top: #23cbe0 solid 2px;
              "
            >
              <div>
                <div class="form-group row">
                  <div class="col-sm-12">
                    <select
                      class="form-control"
                      name="selectStatus"
                      v-model="selStatus"
                      id="selectStatus"
                      @change="handleStatusChange()"
                    >
                      <option value="all" selected>
                        {{ $t("node.plestatus") }}
                      </option>
                      <option value="0">{{ $t("node.plestatus0") }}</option>
                      <option value="1">{{ $t("node.plestatus1") }}</option>
                    </select>
                  </div>
                </div>
                <div class="popover-footer" style="text-align: center">
                  <button
                    type="button"
                    class="btn btn-primary btn-sm"
                    @click="bntPlegdeStatusFilter(scope.type)"
                  >
                    <i class="fa fa-filter"></i>{{ $t("comm.filter") }}
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary btn-sm"
                    @click="bntPlegdeStatusClear(scope.type)"
                  >
                    <i class="fa fa-eraser"></i>{{ $t("comm.clear") }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            class="btn-group"
            slot="table_title_right_node_type"
            slot-scope="scope"
            v-show="scope.type == 'pc'"
          >
            <template>
              <button
                class="filter-btn btn-secondary"
                @click="searchs.win.etType = !searchs.win.etType"
              >
                <i class="mdi mdi-filter"></i>
              </button>

              <div class="filter-win" v-show="searchs.win.etType">
                <div>
                  <select class="form-control" v-model="searchs.data.etType">
                    <option value="">{{ $t("ftable.all") }}</option>
                    <option value="PoS">PoS</option>
                    <option value="SN">SN</option>
                    <option value="SP">SP</option>
                  </select>
                </div>
                <div class="popover-footer" style="text-align: center">
                  <button
                    type="button"
                    class="btn btn-primary btn-sm"
                    @click="filterEtType"
                  >
                    <i class="fa fa-filter"></i>{{ $t("comm.filter") }}
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary btn-sm"
                    @click="clearEtType"
                  >
                    <i class="fa fa-eraser"></i>{{ $t("comm.clear") }}
                  </button>
                </div>
              </div>
            </template>
          </div>
          <template slot="rightCol" slot-scope="scope">
            <el-dropdown v-if="scope.type == 'pc'" trigger="click">
              <el-button size="mini" type="default" icon="el-icon-menu">
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-button
                    :disabled="!showMov(scope.data)"
                    type="default"
                    size="mini"
                    class="width-10 mb-xs"
                    @click="move(scope.data, 'PoS')"
                  >
                    {{ $t("comm.restake", ["PoS"]) }}</el-button
                  >
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    :disabled="!showMov(scope.data)"
                    type="default"
                    size="mini"
                    class="width-10 mb-xs"
                    @click="move(scope.data, 'SN')"
                  >
                    {{ $t("comm.restake", ["SN"]) }}</el-button
                  >
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    :disabled="!showMov(scope.data)"
                    type="default"
                    size="mini"
                    class="width-10 mb-xs"
                    @click="move(scope.data, 'SP')"
                  >
                    {{ $t("comm.restake", ["SP"]) }}</el-button
                  >
                </el-dropdown-item>

                <el-dropdown-item>
                  <el-button
                    type="default"
                    size="mini"
                    @click="goToExitPledge(scope.data)"
                    class="width-10 mb-xs"
                    :disabled="!scope.data.table_btn_quit"
                  >
                    {{ $t("node.btnTitle") }}</el-button
                  >
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <div v-else>
              <el-button
                v-if="showMov(scope.data)"
                type="text"
                size="mini"
                @click="move(scope.data, 'PoS')"
              >
                {{ $t("comm.restake", ["PoS"]) }}</el-button
              >
              <el-button
                v-if="showMov(scope.data)"
                type="text"
                size="mini"
                @click="move(scope.data, 'SN')"
              >
                {{ $t("comm.restake", ["SN"]) }}</el-button
              >
              <el-button
                v-if="showMov(scope.data)"
                type="text"
                size="mini"
                @click="move(scope.data, 'SP')"
              >
                {{ $t("comm.restake", ["SP"]) }}</el-button
              >

              <el-button
                type="text"
                style="color: red"
                size="mini"
                @click="goToExitPledge(scope.data)"
                v-show="scope.data.table_btn_quit"
              >
                {{ $t("node.btnTitle") }}</el-button
              >
            </div>
          </template>
        </h-tbale>
      </div>
    </div>
  </div>
</template>
<script>
import { Message } from "element-ui";
import * as api from "@/api/api";
import utils from "@/utils/utils";
import * as helper from "@/utils/helper";
import webSdk from "@/utils/webSdk.js";
import HTbale from "@/components/modules/HTbale.vue";
import { setPageQuery } from "@/utils/table.js";
export default {
  name: "NodepledgeTrans",
  components: { HTbale },
  props: {},

  data() {
    let _this_ = this;
    const plestauts = {
      0: "node.plestatus0",
      1: "node.plestatus1",
    };
    return {
      searchs: {
        win: {
          etType: false,
        },
        data: {
          etType: "",
        },
      },
      nodePledgeListTableHeard: [
        {
          title: "node.pledgeahash",
          name: "pledge_hash",
          format: true,
          popover: true,
          fnum: 6,
        },
        {
          title: "node.address",
          name: "node_address",
          format: true,
          popover: true,
          fnum: 6,
        },
        /*
        {
          title: "node.manageaddress",
          name: "manage_address",
          format: true,
          popover: true,
          more: true,
          fnum: 12,
        },
        */
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
        },
        {
          title: "nodeMove.delegationType",
          name: "node_type",
          more: true,
        },
        {
          title: "node.exitpledgeheight",
          name: "unpledge_number",
          more: true,
        },

        {
          title: "node.pledgetime",
          name: "pledge_time",
          valMap(val) {
            return helper.formatTime(val, 1);
          },
          more: true,
        },
      ],
      nodePledgeListtableData: [],
      totalp: 0,
      pledge_address: "",
      plestauts,
      selStatus: "all",
      searchInput: "",
      isMobile: utils.isMobile(),
      loadDataOk: false,
      promiseperiod: 547,
      plegdetimeOut: 30,
      plegdetimeWithin: 30,
      mangeaddressflag: 0,
    };
  },

  created() {
    this.pledge_address = this.$store.getters.account;
  },

  methods: {
    clearEtType() {
      this.searchs.data.etType = "";
      this.filterEtType();
    },
    filterEtType() {
      this.searchs.win.etType = false;
      this.loadTablenodePledgeList(null, false, 1);
    },
    tableInitnodePledgeList(query, pageNum) {
      this.loadTablenodePledgeList(query, false, pageNum);
    },
    async loadTablenodePledgeList(query, toTop = true, pageNum) {
      if (!this.loadDataOk) {
        this.loadData();
        return;
      }

      if (!query && this.$refs.htableNodePledgeList) {
        query = this.$refs.htableNodePledgeList.tableQuery;
      }
      if (!query) return;
      query.pageNum = pageNum || query.pageNum;

      //query.loadingShow();

      var params = {
        current: query.pageNum,
        size: query.pageSize,
        pledge_address: this.$store.getters.account,
      };

      if (this.searchInput !== "" && this.searchInput != null) {
        params.node_address = this.searchInput;
      }

      if (
        this.selStatus != "all" &&
        this.selStatus != null &&
        this.selStatus != "undefined"
      ) {
        params.pledge_status = this.selStatus;
      }

      params.etType = utils.isEmpty(this.searchs.data.etType)
        ? undefined
        : this.searchs.data.etType;
      query.loadingShow(params, pageNum);
      this.plegde_addr = params.pledge_address;

      this.nodePledgeListtableData = [];

      utils.loadGlobalDatas().then(() => {
        utils.getNowHeight().then(() => {
          //DOTO--
         //  params.pledge_address="0x4F3607911E64629BfDb3f370FEFdB68cA3AddEc5";
          params.isEt = 1;
          params.blockNumber = utils.totalBlockNumber_get();
          params.dayNumber = window.$url.dayOneNumber;
       
          api
            .postJson("/platform/getNodePledgeList", params)
            .then((response) => {
              query.loadingHide();

              if (response.statusCode !== 0) {
                Message.error(response.message);
              }
              let re = response.result || {};

              let tableData = re.records || [];

              tableData.forEach((item, index) => {
                if (
                  utils.plegdeTime(item.node_number, this.promiseperiod) == 0
                ) {
                  item.plegdetime = utils.plegdeTime(
                    item.pledge_number,
                    this.plegdetimeWithin
                  );
                } else {
                  item.plegdetime = utils.plegdeTime(
                    item.pledge_number,
                    this.plegdetimeOut
                  );
                }

                item.promiseperiods = utils.plegdeTime(
                  item.node_number,
                  this.promiseperiod
                );
                let maddres = item.manage_address || "";
                let paccount = this.$store.getters.account;
                //DOTO--
                item.table_btn_quit = item.entrustExit; /*
              item.pledge_status == 1 &&
              ((item.promiseperiods == 0 &&
                item.plegdetime == 1 &&
                maddres.toLocaleLowerCase() != paccount.toLocaleLowerCase()) ||
                (item.promiseperiods == 1 && item.plegdetime == 1));*/

               // item.table_btn_quit = this.showExit(item, item.table_btn_quit);

                //item.table_btn_quit = item.pledge_status == 1; //test

                console.log(maddres, paccount);
                console.log(
                  "node_number=" +
                    item.node_number +
                    " plegdetime=" +
                    item.plegdetime,
                  "promiseperiods=" + item.promiseperiods
                );
              });
              this.nodePledgeListtableData = tableData;

              if (response.result != null) {
                this.totalp = response.result.total;
              }

              setPageQuery(query, re);
              if (toTop && this.nodePledgeListtableData.length > 0) {
                query.toTop();
              }
            })
            .catch((error) => {
              query.loadingHide(
                JSON.stringify(error).includes("timeout") ? 1 : 2
              );
            });
        });
      });
    },
    colClick(data) {
      let col = data.col || {};
      let row = data.row || {};
    },

    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },

    handleStatusChange() {
      var val = $("#selectStatus").val();
      this.selStatus = val;
      sessionStorage.setItem("selStatus", val);
    },

    btnPopover() {
      $("#lvMobile").toggle();
    },

    btnFilter() {
      $("#lvMobile").toggle();
      this.tableInitnodePledgeList(null, 1);
    },

    btnClear() {
      $("#lvMobile").toggle();
      this.selStatus = "all";
      this.tableInitnodePledgeList(null, 1);
    },

    btnPlegdeStatusPopover(type) {
      var dv = "lvPlegdeStatus_" + type;
      $("#" + dv).toggle();
    },

    bntPlegdeStatusFilter(type) {
      var dv = "lvPlegdeStatus_" + type;
      $("#" + dv).toggle();
      this.tableInitnodePledgeList(null, 1);
    },

    bntPlegdeStatusClear(type) {
      var dv = "lvPlegdeStatus_" + type;
      $("#" + dv).toggle();
      this.selStatus = "all";
      this.tableInitnodePledgeList(null, 1);
    },

    checkManageAddr(maddres) {
      this.mangeaddressflag = 0;
      var lparams = {
        current: 1,
        size: 20,
        pledge_address: maddres,
        pledge_status: 1,
      };
      api.postJson("/platform/getNodePledgeList", lparams).then((response) => {
        if (response.result != null) {
          if (response.result.total <= 1) {
            this.mangeaddressflag = 1;
          }
        }
      });
    },
    exitPos(data) {
      let maddres = data.manage_address || "";
      let paccount = this.$store.getters.account;
      let mangeflag = 0;

      if (maddres.toLocaleLowerCase() == paccount.toLocaleLowerCase()) {
        mangeflag = this.mangeaddressflag; //this.checkManageAddr(maddres);
      }
      this.$confirm(
        mangeflag == 1
          ? `${this.$t("messages.exitAllpledgetext")}`
          : `${this.$t("messages.exitpledgetext")}`,
        {
          confirmButtonText: `${this.$t("messages.confirm")}`,
          cancelButtonText: `${this.$t("messages.cancel")}`,
          type: "warning",
        }
      )
        .then(() => {
          let sdk = this.$store.getters.getsdk || null;

          let paddress = data.pledge_address;
          let waddress = this.$store.getters.account;
          if (paddress.toLocaleLowerCase() != waddress.toLocaleLowerCase()) {
            this.$message.error(
              `${this.$t("mymanageMining.pleasetoytrustaddr")}`
            );
            return;
          }

          if (sdk) {
            let _this_ = this;
            data.table_btn_quit = false;
            let setData = {
              title: `${this.$t("node.signouttrustplegde")}`,
              //context: `${this.$t("mymanageNode.node")}：${helper.getAddrFormat(data.pledge_address,15)}`,
              context: `${this.$t("mymanageNode.node")}：${
                data.pledge_address
              }`,
              closebtnshow: true,
              request,
              success() {
                this.$notify({
                  title: "success",
                  message: `${_this_.$t("node.signouttrustplegde")} OK : ${
                    data.param1
                  }`,
                  type: "success",
                });

                data.table_btn_quit = false;
              },
              err() {
                data.table_btn_quit = true;
                // _this_.$message.error("failed");
              },
            };
            let request = null;
            if (mangeflag == 0) {
              request = sdk.sendTransactionTo(
                webSdk.typeJson.candetexit,
                {
                  addr1: data.node_address,
                  hash: data.pledge_hash,
                },
                setData
              );
            } else {
              request = sdk.sendTransactionTo(
                webSdk.typeJson.candexit,
                {
                  addr1: data.node_address,
                },
                setData
              );
            }
            setData.request = request;
            this.$store.dispatch("setNotification", setData);
          }
        })
        .catch(() => {});
    },
    goToExitPledge(data) {
      switch (`${data.node_type || ""}`.toLowerCase()) {
        case "pos":
          this.exitPos(data);
          break;

        case "sn":
          this.exitSnSp(data, "wtpgexit");
          break;
        case "sp":
          this.exitSnSp(data, "spwtexit");
          break;
      }
    },
    exitSnSp(data, type) {
      let reObj = utils.walletSelect({
        _this_: this,
        addr: data.pledge_address,
        msg: "mymanageMining.pleasetoytrustaddr",
      });
      if (!reObj) return;
      let { sdk } = reObj;
      this.$confirm(`${this.$t("messages.exitpledgetext")}`, {
        confirmButtonText: `${this.$t("messages.confirm")}`,
        cancelButtonText: `${this.$t("messages.cancel")}`,
        type: "warning",
      }).then(() => {
        let _this_ = this;
        data.table_btn_quit = false;
        let setData = {
          title: `${this.$t("node.signouttrustplegde")} `,
          context: `${this.$t("mymanageNode.node")}：${helper.getAddrFormat(
            data.pledge_address
          )}`,
          closebtnshow: true,
          request,
          success() {
            this.$notify({
              title: "success",
              message: `${_this_.$t("node.signouttrustplegde")} OK : ${
                data.param1
              }`,
              type: "success",
            });

            data.table_btn_quit = false;
          },
          err() {
            data.table_btn_quit = true;
            // _this_.$message.error("failed");
          },
        };
        let request = null;
        request = sdk.sendTransactionTo(
          webSdk.typeJson[type],
          {
            addr1: data.node_address,
            hash: data.pledge_hash,
          },
          setData
        );

        setData.request = request;
        this.$store.dispatch("setNotification", setData);
      });
    },

    loadData() {
      api
        .postJson("/platform/getStorageBasicSet", {})
        .then((response) => {
          if (!this.loadDataOk) {
            let result = response.result;
            this.promiseperiod = Number(result["12"] || 547);
            this.plegdetimeOut = Number(result["13"] || 30);
            this.plegdetimeWithin = Number(result["14"] || 30);
            this.loadDataOk = true;
            this.tableInitnodePledgeList(null, 1);
          }
        })
        .catch((error) => {
          console.error(error);
        });

      this.mangeaddressflag = 0;
      var lparams = {
        current: 1,
        size: 20,
        pledge_address: this.$store.getters.account,
        pledge_status: 1,
      };
      api.postJson("/platform/getNodePledgeList", lparams).then((response) => {
        if (response.result != null) {
          if (response.result.total <= 1) {
            this.mangeaddressflag = 1;
          }
        }
      });
    },
    move(row, type) {
      switch (type.toLocaleLowerCase()) {
        case "pos":
          this.goToUrl("mymanage/posmove", row.pledge_address);
          break;
        case "sn":
          this.goToUrl("mymanage/snmove", row.pledge_address);
          break;
        case "sp":
          this.goToUrl("mymanage/spmove", row.pledge_address);
          break;
      }
    },
    showExit(row, origin) {
      if (row.pledge_status != 1) return false;
      switch (`${row.node_type || ""}`.toLocaleLowerCase()) {
        case "pos":
          return origin && this.showMov(row);

        case "sn":
        case "sp":
          return this.showMov(row);
      }
    },
    showMov(row) {
      if (row.pledge_status != 1) return false;
      if (row.pledge_address == row.manage_address) return false;
      return row.transfer;
    },
  },
  watch: {
    "$store.getters.account": function () {
      this.plegde_addr = this.$store.getters.account;
      this.tableInitnodePledgeList(null, 1);
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
  