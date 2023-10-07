<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <div class="row" style="padding: 6px; text-align: left">
          <div class="col-md-4">
            <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
              {{ $t("market.pledgetitle") }}
            </h4>
            <p class="sub-title" style="width: 100%; text-align: left">
              {{ $t("market.totalnumber", [total]) }}
            </p>
          </div>

          <div class="col-md-4">
            <div class="input-group" style="margin: 0 auto">
              <input
                type="text"
                class="form-control"
                :placeholder="$t('market.marketSearch')"
                id="demo"
                v-model="searchInput"
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
          :table-id="'storage_index' + this.$store.getters.account"
          :table-heard="tableHeard"
          :table-data="tableData"
          :show-right-tools="true"
          :up-load-time="20000"
          @inint-ok="tableInit"
          @load="loadTable"
          @colClick="colClick"
          :showSubtitle="false"
        >
          <div
            class="btn-group"
            slot="table_title_right_pledgeStatus"
            slot-scope="scope"
            v-if="scope.type == 'pc'"
          >
            <button
              class="btn btn-secondary btn-sm btn-block"
              style="
                padding: 1px;
                border-radius: 4px;
                margin-left: 6px;
                height: 19px;
              "
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
                    >
                      <option value="">{{ $t("market.status") }}</option>
                      <option value="0" selected>
                        {{ $t("market.status0") }}
                      </option>
                      <option value="1">{{ $t("market.status1") }}</option>
                      <!-- <option value="5">{{ $t("market.status5") }}</option> -->
                      <option value="6">{{ $t("market.status6") }}</option>
                      <option value="7">{{ $t("market.status7") }}</option>
                      <option value="-1">{{ $t("market.status-1") }}</option>
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

          <div slot="rightCol" slot-scope="scope">
            <el-dropdown v-if="scope.type == 'pc'" trigger="click">
              <el-button size="mini" type="default" icon="el-icon-menu">
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-button
                    style="width: 100%"
                    type="default"
                    size="mini"
                    v-if="scope.data.table_btn_stwtpg"
                    @click="stwtpg(scope.data)"
                  >
                    <span>
                      {{ $t("Transactions.stchpg") }}
                    </span>
                  </el-button>
                </el-dropdown-item>
                <!--  <el-dropdown-item>
                 <el-button
                    style="width: 100%"
                    type="default"
                    size="mini"
                    v-if="scope.data.table_btn_bindinglift"
                    @click="bindinglift(scope.data)"
                  >
                    <span>
                      {{ $t("messages.bindinglift") }}
                    </span>
                  </el-button>
                </el-dropdown-item>-->
                <el-dropdown-item>
                  <el-button
                    style="width: 100%"
                    v-if="scope.data.table_btn_plegelift"
                    type="default"
                    size="mini"
                    @click="pledelift(scope.data)"
                    :title="$t('market.nodeeixtmsg')"
                    >{{ $t("messages.pledelift") }}</el-button
                  >
                </el-dropdown-item>

                <el-dropdown-item>
                  <el-button
                    style="width: 100%"
                    type="default"
                    size="mini"
                    @click="goToUrlConfig(scope.data)"
                    class="equal-width"
                  >
                    <span v-if="scope.data.table_btn_isConfig">{{
                      $t("storagerental.rentalconfigmd")
                    }}</span>
                    <span v-else>{{ $t("storagerental.rentalconfignw") }}</span>
                  </el-button>
                </el-dropdown-item>

                <el-dropdown-item>
                  <el-button
                    style="width: 100%"
                    type="default"
                    size="mini"
                    @click="entrustRate(scope.data)"
                    v-show="scope.data.table_btn_entrustRate"
                    >{{ $t("storageNode.SNRewardRatio") }}</el-button
                  >
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    style="width: 100%"
                    type="default"
                    size="mini"
                    @click="setSpHash(scope.data)"
                    v-show="scope.data.table_btn_spHash"
                    >{{ $t("storageNode.setSP")  }}</el-button
                  >
                </el-dropdown-item>
                <el-dropdown-item>
                
                  <el-button
                    style="width: 100%"
                    type="default"
                    size="mini"
                    @click="exitsp(scope.data)"
                    v-show="scope.data.table_btn_exitsp"
                    >{{ $t("storageNode.exitSP") }}</el-button
                  >
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    style="width: 100%"
                    type="default"
                    size="mini"
                    @click="changeRevenues(scope.data)"
                    v-show="scope.data.table_btn_changeRevenues"
                    >{{ $t("storagePool.revenuesaddress")  }}</el-button
                  >
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    style="width: 100%"
                    type="default"
                    size="mini"
                    @click="changeManage(scope.data)"
                    v-show="scope.data.table_btn_changeManage"
                    >{{  $t("storageNode.adminAddress")}}</el-button
                  >
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <div v-else>
              <el-button
                style="color: green"
                type="text"
                size="mini"
                v-show="scope.data.table_btn_stwtpg"
                @click="stwtpg(scope.data)"
              >
                <span>
                  {{ $t("Transactions.stchpg") }}
                </span>
              </el-button>
              <!-- <el-button
                type="text"
                style="color: red"
                @click="bindinglift(scope.data)"
                v-show="scope.data.table_btn_bindinglift"
                >{{ $t("messages.bindinglift") }}</el-button
              >-->

              <el-button
                type="text"
                style="color: red"
                @click="pledelift(scope.data)"
                v-show="scope.data.table_btn_plegelift"
                >{{ $t("messages.pledelift") }}</el-button
              >

              <el-button
                type="text"
                size="mini"
                @click="goToUrlConfig(scope.data)"
                class="equal-width"
              >
                <span v-if="scope.data.table_btn_isConfig">{{
                  $t("storagerental.rentalconfigmd")
                }}</span>
                <span v-else>{{ $t("storagerental.rentalconfignw") }}</span>
              </el-button>

              <el-button
                type="text"
                @click="entrustRate(scope.data)"
                v-show="scope.data.table_btn_entrustRate"
                >{{ $t("storageNode.SNRewardRatio") }}</el-button
              >
              <el-button
                type="text"
                @click="setSpHash(scope.data)"
                v-show="scope.data.table_btn_spHash"
                >{{ $t("storageNode.setSP") }}</el-button
              >
              <el-button
                style="color: red"
                @click="exitsp(scope.data)"
                v-show="scope.data.table_btn_exitsp"
                >{{ $t("storageNode.exitSP") }}</el-button
              >

              <el-button
                type="text"
                @click="changeRevenues(scope.data)"
                v-show="scope.data.table_btn_changeRevenues"
                >{{ $t("storagePool.revenuesaddress") }}</el-button
              >
              <el-button
                type="text"
                @click="changeManage(scope.data)"
                v-show="scope.data.table_btn_changeManage"
                >{{ $t("storageNode.adminAddress") }}</el-button
              >
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
import utils from "@/utils/utils";
import webSdk from "@/utils/webSdk.js";
import HTbale from "@/components/modules/HTbale.vue";
import { setPageQuery } from "@/utils/table.js";
export default {
  name: "MyStorageNode",
  components: { HTbale },
  props: {},
  data() {
    const vaildtypes = {
      0: "storagepledge.vaildStatus0",
      1: "storagepledge.vaildStatus1",
      2: "storagepledge.vaildStatus2",
    };
    let _this_ = this;
    return {
      address: "",

      tableHeard: [
        {
          title: "market.deviceaddress",
          name: "deviceAddr",
          format: true,
          popover: true,
          isClick: true,
          fnum: 6,
          minWidth: "120px",
        },
        {
          title: "storageNode.adminAddress",
          name: "managerAddr",
          format: true,
          popover: true,
          fnum: 6,
          minWidth: "120px",
        },
        {
          title: "market.revenuesaddress",
          name: "revenueAddr",
          format: true,
          popover: true,
          isClick: true,
           fnum: 6,
          minWidth: "120px",
        },
        {
          title: "storagePool.storagePoolAddress",
          name: "spHash",
          format: true,
          popover: true,
          isClick: true,
          fnum: 6,
          minWidth: "150px",
        },
        {
          title: "storageNode.SNRewardRatio",
          name: "entrustRate",
          minWidth: "190px",
          valMap(val) {
            return `${val || 0} %`;
          },
        },
        {
          title: "market.totalspace",
          name: "declareSpace",
          valMap(val) {
            return `${utils.bytesToSize(val || 0)}`;
          },
          minWidth: "115px",
        },
        {
          title: "market.availablespace",
          name: "freeSpace",
          valMap(val) {
            return `${utils.bytesToSize(val || 0)}`;
          },
          minWidth: "115px",
        },

        {
          title: "market.bandwidth",
          name: "bwSize",
          units: " Mbps",
          more: true,
          minWidth: "125px",
        },
        {
          title: "market.pledgeamount",
          name: "pledgeAmount",
          valMap(val) {
            return `${helper.getDataFormat(val, 18, 10000).toFixed(4)} UTG`;
          },
          more: true,
          minWidth: "120px",
        },

        /* {
          title: "market.rentalprice",
          name: "rentPrice",
          valMap(val) {
            return `${helper
              .getDataFormat(val, 18, 10000)
              .toFixed(0)}  ${_this_.$t("storagerental.priceunit")}`;
          },
        },*/

        {
          title: "market.pledgestatus",
          name: "pledgeStatus",
          isHtml: true,
          valMap(val) {
            return _this_.pledgeStatusSpan(val);
          },
          minWidth: "120px",
        },
      ],
      tableData: [],
      vaildtypes,
      dayOneNumber: window.$url.dayOneNumber || 8640,
      total: 0,
      searchInput: "",
      selStatus: "",
    };
  },

  methods: {
    btnPlegdeStatusPopover(type) {
      var dv = "lvPlegdeStatus_" + type;
      $("#" + dv).toggle();
    },
    bntPlegdeStatusFilter(type) {
      var dv = "lvPlegdeStatus_" + type;
      $("#" + dv).toggle();
      this.tableInit(null, 1);
    },

    bntPlegdeStatusClear(type) {
      var dv = "lvPlegdeStatus_" + type;
      $("#" + dv).toggle();
      this.selStatus = "";
      this.tableInit(null, 1);
    },
    pledgeStatusSpan(val) {
      return utils.getPledgeStatus(val).span;
    },
    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    async loadTable(query, toTop = true, pageNum) {
      await utils.loadGlobalDatas();
      await utils.getNowHeight();

      if (!this.$store.getters.account) return;

      if (!query && this.$refs.htable) {
        query = this.$refs.htable.tableQuery;
      }

      if (!query) return;

      query.pageNum = pageNum || query.pageNum;

      var params = {
        current: query.pageNum,
        size: query.pageSize,
        addr: this.$store.getters.account,
        //DOTO--
        // addr: "0x6257ce45e2a1f0660f894399dd56a28da93e636a",
        status: this.selStatus,
      };
      if (this.searchInput !== "" && this.searchInput != null) {
        params.device_addr = this.searchInput;
      }
      //query.loadingShow();

      query.loadingShow(params, pageNum);

      api
        .postJson("/platform/getStorageSpaceList", params)
        .then((response) => {
          query.loadingHide();

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }
          let re = response.result || {};

          let tableData = re.records || [];
          if (response.result != null) this.total = response.result.total;
          tableData.forEach((item) => {
            /*
            (item.table_btn_plegelift =
              item.pledgeStatus == 0 &&
              utils.isEmpty(item.revenueAddr) &&
              item.rentNum <= 0 &&
              item.pledgeNumber + this.dayOneNumber * 365 <
                utils.curBlockNumber());       
                       
                */
            /*  2022-09-01
             (item.table_btn_plegelift = item.pledgeStatus == 0 &&
               (
                 (item.revenueAddr == this.$store.getters.account) ||
                 (item.deviceAddr == this.$store.getters.account && utils.isEmpty(item.revenueAddr) && item.rentNum <= 0)
               )
             );
             */

            /*&&
                (item.revenueAddr ==
                  this.$store.getters.account.toLowerCase() ||
                  (item.deviceAddr ==
                    this.$store.getters.account.toLowerCase() &&
                    utils.isEmpty(item.revenueAddr))));*/

            let awaitNum = this.awaitNum(item);
            let manageAwaitNum = this.manageAwaitNum(item);
            let isActivate = this.isActivate(item);
            let isActivates = this.isActivates(item);
            let isNotActivate = this.isNotActivate(item);
            let isManage = this.isManage(item);

            let overtime = item.pledgeNumber<=(utils.globalDatas_get("utgv2number")||0)
                      console.log("pledgeNumber----",item.pledgeNumber, utils.globalDatas_get("utgv2number"));

            //utils.heightDifference(item.pledgeNumber,"utgv2number",false);
            let showExitsp = this.showExitsp(item);
            let bingSp = this.bingSp(item);

            item.table_btn_isConfig = !(
              utils.isEmpty(item.attachPic) && utils.isEmpty(item.attachText)
            );

            item.table_btn_upbinding = !utils.isEmpty(item.revenueAddr);
            /*
            item.table_btn_binding =
              isNotActivate && utils.isEmpty(item.revenueAddr);
           item.table_btn_bindinglift =
              isNotActivate && !utils.isEmpty(item.revenueAddr);*/

            item.table_btn_plegelift = isActivates && bingSp;
            item.table_btn_stwtpg = awaitNum && isNotActivate;
            item.table_btn_entrustRate = manageAwaitNum && isActivates;
            item.table_btn_spHash = isActivate && bingSp;
            item.table_btn_changeRevenues = isActivates;
            item.table_btn_changeManage =
              overtime && isActivates && item.managerAddr == item.pledgeAddr;

            item.table_btn_exitsp = showExitsp && isActivates;
          });
          this.tableData = tableData;

          setPageQuery(query, re);

          if (toTop && this.tableData.length > 0) {
            query.toTop();
          }
        })
        .catch(() => {
          query.loadingHide();
        });
    },
    showExitsp(row) {
      return (
        this.bingSp(row) && !utils.isEmpty(row.spHash)
        //&&row.manage_address != row.pledge_address)
      );
    },
    bingSp(row) {
      if (!row.spHeight) return true;

      return utils.heightDifference(row.spHeight, "snJoinSpday");
    },
    manageAwaitNum(row) {
      return (
        Number(
          utils.uumbersHandle([row.pledgeAmount, row.managerAmount], ["-"], 0)
        ) > 0
      );
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
    isManage(row) {
      return !utils.isEmpty(row.managerAddr);
    },
    isActivate(row) {
      return `${row.pledgeStatus}` === "0";
    },
    isNotActivate(row) {
      return `${row.pledgeStatus}` === "7";
    },
    isActivates(row) {
      return this.isActivate(row) || this.isNotActivate(row);
    },
    colClick(data) {
      let col = data.col || {};
      let row = data.row || {};
      switch (col.name) {
        case "deviceAddr":
          this.goToUrl("StorageDetail", row.deviceAddr);
          break;
        case "revenueAddr":
          this.goToUrl("RewardDetail", row.revenueAddr);
          break;
        case "spHash":
          this.goToUrl("storagepooldetail", row.spHash);
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

    goToUrlConfig(data) {
      helper.goPathUrl(this, "mymanage/configs", data.deviceAddr);
    },

    pledelift(data) {
      let reObj = utils.walletSelect({ addr: data.managerAddr, _this_: this });
      if (!reObj) return;
      let { sdk } = reObj;
      /*   let wetaddress = this.$store.getters.account.toLowerCase();
      let devaddress = data.deviceAddr.toLowerCase();
      let readdress = data.revenueAddr.toLowerCase();*/

      let exitinfo = "storagepledge.exitinfo1";
      if (data.rentNum > 0) exitinfo = "storagepledge.exitinfo2";
      else exitinfo = "storagepledge.exitinfo1";

      let _this = this;
      this.$confirm(
        `${this.$t(exitinfo)}`,
        `${this.$t("market.pledgeexittitle")}`,
        {
          confirmButtonText: `${this.$t("comm.confirmButtonText")}`,
          cancelButtonText: `${this.$t("comm.cancelButtonText")}`,
          type: "info",
        }
      )
        .then(() => {
          if (sdk) {
            let _this_ = this;
            let setData = {
              title: `${this.$t("market.pledgeexittitle")}`,
              context: `${this.$t("market.deviceaddress")} : ${
                data.deviceAddr
              }`,
              request: null,
              closebtnshow: false,
              success() {
                _this_.tableInit();
                _this_.$notify({
                  title: _this_.$t("loadingSubPan.finish"),
                  message: _this_.$t("messages.pledexitgok"),
                  type: "success",
                });
              },
              err() {
                _this_.$message.error("failed");
              },
            };
            let request = sdk.sendTransactionTo(
              webSdk.typeJson.stExit,
              {
                addr1: data.deviceAddr,
              },
              setData
            );
            setData.request = request;
            _this.$store.dispatch("setNotification", setData);
          }
        })
        .catch(() => {});

      /*
      if (wetaddress === readdress) {
        let exitinfo = "storagepledge.exitinfo1";
        if (data.rentNum > 0)
          exitinfo = "storagepledge.exitinfo2";
        else
          exitinfo = "storagepledge.exitinfo1";

        let _this = this;
        this.$confirm(`${this.$t(exitinfo)}`, `${this.$t("market.pledgeexittitle")}`, {
          confirmButtonText: `${this.$t("comm.confirmButtonText")}`,
          cancelButtonText: `${this.$t("comm.cancelButtonText")}`,
          type: 'info',
          //center: true
        }).then(() => {
          if (sdk) {
            let _this_ = this;
            let setData = {
              title: `${this.$t("market.pledgeexittitle")}`,
              context: `${this.$t("market.deviceaddress")} : ${data.deviceAddr}`,
              request: null,
              closebtnshow: false,
              success() {
                _this_.tableInit();
                _this_.$notify({
                  title: _this_.$t("loadingSubPan.finish"),
                  message: _this_.$t("messages.pledexitgok"),
                  type: "success",
                });
              },
              err() {
                _this_.$message.error("failed");
              },
            };
            let request = sdk.sendTransactionTo(
              webSdk.typeJson.stExit,
              {
                addr1: data.deviceAddr,
              },
              setData
            );
            setData.request = request;
            this.$store.dispatch("setNotification", setData);
          }
        }).catch(() => {
        });
      } else {
        if (wetaddress !== devaddress) {
          this.$message.error(`${this.$t("messages.pledgeAddr")}`);
          return;
        }
        if (sdk) {
          let _this_ = this;
          let setData = {
            title: `${this.$t("market.pledgeexittitle")}`,
            context: `${this.$t("market.deviceaddress")} : ${data.deviceAddr}`,
            request: null,
            closebtnshow: false,
            success() {
              _this_.tableInit();
              _this_.$notify({
                title: _this_.$t("loadingSubPan.finish"),
                message: _this_.$t("messages.pledexitgok"),
                type: "success",
              });
            },
            err() {
              _this_.$message.error("failed");
            },
          };
          let request = sdk.sendTransactionTo(
            webSdk.typeJson.stExit,
            {
              addr1: data.deviceAddr,
            },
            setData
          );
          setData.request = request;
          this.$store.dispatch("setNotification", setData);
        }

      }
      */
    },

    bindinglift(data) {
      if (data.deviceAddr) {
        helper.goPathUrl(this, "mymanage/StorageBindingLift", data.deviceAddr);
      }
    },
    stwtpg(data) {
      if (data.deviceAddr) {
        helper.goPathUrl(this, "mymanage/adjustpg", data.deviceAddr);
      }
    },
    setSpHash(data) {
      if (data.deviceAddr) {
        helper.goPathUrl(this, "mymanage/setstoragepool", data.deviceAddr);
      }
    },
    entrustRate(data) {
      if (data.deviceAddr) {
        helper.goPathUrl(this, "mymanage/entrustrate", data.deviceAddr);
      }
    },
    changeRevenues(data) {
      if (data.deviceAddr) {
        helper.goPathUrl(this, "mymanage/changerevenue", data.deviceAddr);
      }
    },
    changeManage(data) {
      if (data.deviceAddr) {
        helper.goPathUrl(this, "mymanage/changemanage", data.deviceAddr);
      }
    },
    exitsp(data) {
      let reObj = utils.walletSelect({
        _this_: this,
        addr: data.managerAddr,
      });
      if (!reObj) return;

      let { sdk } = reObj;
      let _this_ = this;
      let setData = {
        title: `${this.$t("Transactions.exitsp")}`,
        context: `${this.$t("storagemining.miner")}: ${data.deviceAddr}<br/>${this.$t("storagemining.storagePoolAddress")}:${data.spHash} `,
        request: null,
        closebtnshow: false,
        success() {},
        closewin(type) {
          if (type == 2) {
            _this_.loadTable();
          }
        },
        err() {
          _this_.$message.error("failed");
        },
      };

      let request = sdk.sendTransactionTo(
        webSdk.typeJson.exitsp,
        {
          addr1: data.deviceAddr,
        },
        setData
      );
      setData.request = request;
      this.$store.dispatch("setNotification", setData);
    },
  },
  watch: {
    "$store.getters.account": function () {
      this.tableInit(null, 1);
    },
  },
};
</script>
<style lang="scss" scoped>
.span_tooltip {
  display: none;
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
<style>
@media (min-width: 700px) {
  .el-message-box {
    width: 450px;
  }
}

@media (max-width: 700px) {
  .el-message-box {
    width: 300px;
  }
}
</style>