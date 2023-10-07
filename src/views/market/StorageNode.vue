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
                :placeholder="$t('market.SearchAddress')"
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
                          <option value="all">{{ $t("market.status") }}</option>
                          <option value="0" selected>
                            {{ $t("market.status0") }}
                          </option>
                          <option value="1">{{ $t("market.status1") }}</option>
                          <!-- <option value="5">{{ $t("market.status5") }}</option> -->
                          <option value="6">{{ $t("market.status6") }}</option>
                          <option value="-1">
                            {{ $t("market.status-1") }}
                          </option>
                        </select>
                      </div>
                    </div>

                    <div class="form-group row">
                      <div class="col-sm-4">
                        {{ $t("market.timespace24h") }}
                      </div>
                      <div class="col-sm-8">
                        <select class="form-control" v-model="vaild24status">
                          <option value="all">{{ $t("market.status") }}</option>
                          <option value="0">
                            {{ $t("storagepledge.vaild24Status0") }}
                          </option>
                          <option value="1">
                            {{ $t("storagepledge.vaild24Status1") }}
                          </option>
                          <option value="-1">
                            {{ $t("storagepledge.vaildStatus1") }}
                          </option>
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
          ref="StorageNodeHTable"
          :table-heard="tableHeard"
          :table-data="tableData"
          :show-right-tools="true"
          tableId="StorageNodetableId"
          :up-load-time="20000"
          :showSubtitle="false"
          @inint-ok="tableInit"
          @load="loadTable"
          rightBtnColWidth="100px"
          @colClick="colClick"
        >
          <template slot="table_title_declareSpace">
            {{ `${$t("market.rentedspace")} / ${$t("market.totalspace")}` }}
          </template>

          <template slot="table_cell_deviceAddr" slot-scope="scope">
            <el-popover
              placement="bottom"
              width="380"
              trigger="hover"
              :content="scope.data.deviceAddr"
            >
              <span
                slot="reference"
                style="color: #00caca"
                class="cursor"
                @click="goToUrl('StorageDetail', scope.data.deviceAddr)"
              >
                {{ getAddrFormat(scope.data.deviceAddr, 6) }}
              </span>
            </el-popover>
            <el-tooltip class="item" placement="bottom" effect="light">
              <div slot="content">
                <span style="font-size: 14px">
                  {{ $t("market.awaitpledgemsg1") }}
                  <br />
                  {{ $t("market.awaitpledgemsg2") }}
                  <br />
                  {{ $t("market.awaitpledgemsg3") }}
                </span>
              </div>
              <i
                class="fa fa-info-circle"
                style="color: #ff0000"
                v-show="
                  scope.data.pledgeStatus == 0 && scope.data.prepledgeAmount
                "
              ></i>
              <!--
              <i class="fa fa-info-circle" style="color: #ff0000" v-show="
                scope.data.pledgeStatus == 0 &&
                scope.data.prepledgeAmount &&
                ((scope.data.prepledgeAmount || 0) -(scope.data.pledgeAmount || 0)) >0
              "></i>
              -->
            </el-tooltip>
          </template>

          <template slot="table_cell_pledgeStatus" slot-scope="scope">
            <div v-html="pledgeStatusSpan(scope.data.pledgeStatus)"></div>

            <!-- <span v-if="scope.data.pledgeStatus == -1" style="color: #ff0000">
              {{ $t(types[scope.data.pledgeStatus]) }}
            </span>
            <span v-else-if="scope.data.pledgeStatus == 0" style="color: #00caca">
              {{ $t(types[scope.data.pledgeStatus]) }}
            </span>
            <span v-else-if="scope.data.pledgeStatus == 1" style="color: #adadad">
              {{ $t(types[scope.data.pledgeStatus]) }}
            </span>
            <span v-else-if="scope.data.pledgeStatus == 5" style="color: #ffff93">
              {{ $t(types[scope.data.pledgeStatus]) }}
            </span>
            <span v-else-if="scope.data.pledgeStatus == 6" style="color: #ffe153">
              {{ $t(types[scope.data.pledgeStatus]) }}
            </span>
            <span v-else style="color: #6c6c6c">
              {{ $t(types[scope.data.pledgeStatus]) }}
            </span>-->
          </template>

          <template slot="table_cell_vaild24Status" slot-scope="scope">
            <span v-if="scope.data.pledgeStatus == 0">
              <a
                href="javascript:;"
                @click="goToUrl('PosrProof', scope.data.deviceAddr)"
              >
                <span
                  v-if="scope.data.vaild24Status == 1"
                  style="color: #00caca"
                >
                  {{ $t("storagepledge.vaild24Status1") }}
                </span>
                <span
                  v-else-if="scope.data.vaild24Status == 0"
                  style="color: #ff0000"
                >
                  {{ $t("storagepledge.vaild24Status0") }}
                </span>
                <span v-else></span>
              </a>
            </span>
            <span v-else></span>
          </template>

          <template slot="table_cell_vaildProgress" slot-scope="scope">
            <span v-if="scope.data.pledgeStatus == 0">
              <div class="form-inline">
                <div class="row" style="margin: auto">
                  <div
                    class="col"
                    style="padding-right: 5px; padding-left: 0px"
                  >
                    <span style="width: 100px"
                      >{{ $t("market.verifying") }}:</span
                    >
                  </div>
                  <div
                    class="col"
                    style="padding-left: 0px; padding-right: 5px; width: 100px"
                  >
                    <el-progress
                      :text-inside="true"
                      :stroke-width="20"
                      :percentage="scope.data.vaildProgress || 0"
                    >
                    </el-progress>
                  </div>
                </div>
              </div>
            </span>
            <span v-else></span>
          </template>

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
                      id="selectStatus"
                      @change="handleStatusChange()"
                    >
                      <option value="all">{{ $t("market.status") }}</option>
                      <option value="0" selected>
                        {{ $t("market.status0") }}
                      </option>
                      <option value="0+7">
                        {{ $t("market.status0") }}+{{ $t("market.status7") }}
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

          <div
            class="btn-group"
            slot="table_title_right_vaild24Status"
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
              @click="btnVaild24StatusPopover(scope.type)"
              id="Btn24StatusPopover"
            >
              <i class="mdi mdi-filter"></i>
            </button>
            <div
              :id="`lvVaild24status_${scope.type}`"
              style="
                display: none;
                position: absolute;
                z-index: 999999;
                right: 0;
                top: 30px;
                width: 180px;
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
                    <select class="form-control" v-model="vaild24status">
                      <option value="all">{{ $t("market.status") }}</option>
                      <option value="0">
                        {{ $t("storagepledge.vaild24Status0") }}
                      </option>
                      <option value="1">
                        {{ $t("storagepledge.vaild24Status1") }}
                      </option>
                      <option value="-1">
                        {{ $t("storagepledge.vaildStatus1") }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="popover-footer" style="text-align: center">
                  <button
                    type="button"
                    class="btn btn-primary btn-sm"
                    @click="bntVaild24StatusFilter(scope.type)"
                  >
                    <i class="fa fa-filter"></i>{{ $t("comm.filter") }}
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary btn-sm"
                    @click="bntVaild24StatusClear(scope.type)"
                  >
                    <i class="fa fa-eraser"></i>{{ $t("comm.clear") }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <template slot="rightCol" slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              :disabled="scope.data.pledgeStatus !== 7 "
              class="equal-width"
              @click="goStwtpgUrl(scope.data)"
              >{{ $t("storageNode.trustpledge") }}</el-button
            >
            <el-button
              type="text"
              size="mini"
              :disabled="scope.data.pledgeStatus !== 0"
              @click="goToUrlHire(scope.data.deviceAddr)"
              class="equal-width"
              >{{ $t("market.hire") }}</el-button
            >
          </template></h-tbale
        >
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
  name: "StorageNode",
  components: { HTbale },
  props: {},
  data() {
    const types = {
      "-1": "market.status-1",
      0: "market.status0",
      1: "market.status1",
      5: "market.status5",
      6: "market.status6",
    };

    const vaildtypes = {
      0: "storagepledge.vaildStatus0",
      1: "storagepledge.vaildStatus1",
      2: "storagepledge.vaildStatus2",
    };

    let _this_ = this;
    return {
      tableHeard: [
        {
          title: "market.deviceaddress",
          name: "deviceAddr",
          format: true,
          fnum: 6,
          popover: true,
          isClick: true,
          minWidth: "120px",
        },
        {
          title: "storageNode.adminAddress",
          name: "managerAddr",
          format: true,
          fnum: 6,
          popover: true,
          isClick: true,
          minWidth: "120px",
        },
        {
          title: "market.revenuesaddress",
          name: "revenueAddr",
          format: true,
          fnum: 6,
          popover: true,
          isClick: true,
          more: true,
          minWidth: "120px",
        },
        {
          title: "market.totalspace",
          name: "declareSpace",
          valMap(val, item) {
            let rentedspace = "";
            if (item.declareSpace >= item.freeSpace) {
              rentedspace = utils.bytesToSize(
                item.declareSpace - item.freeSpace
              );
            } else {
              rentedspace = utils.bytesToSize(0);
            }

            return `${rentedspace} / ${utils.bytesToSize(val || 0)}`;
          },
          minWidth: "180px",
        },
        /* {
          title: "market.rentedspace",
          name: "rentedspace",
          valMap(val, item) {
            if (item.declareSpace >= item.freeSpace)
              return utils.bytesToSize(item.declareSpace - item.freeSpace);
            else return utils.bytesToSize(0);
          },
          more: true,
        },
        {
          title: "market.availablespace",
          name: "freeSpace",
          valMap(val) {
            if (val >= 1024 * 1024 * 1024 * 5)
              return utils.bytesToSize(val - 1024 * 1024 * 1024 * 5 || 0);
            else return utils.bytesToSize(0);
          },
        },*/
        {
          title: "market.bandwidth",
          name: "bwSize",
          valMap(val) {
            return utils.isEmpty(val) ? "" : `${val}  Mbps`;
          },
          more: true,
          minWidth: "150px",
        },
        {
          title: "storageNode.pledgedAnTotal",
          name: "pledgeAmount",
          valMap(val, item) {
            let havAmount =
              helper.getDataFormat(item.havAmount, 18, 10000).toFixed(4) +
              " UTG";
            let pledgeAmount =
              helper.getDataFormat(val, 18, 10000).toFixed(4) + " UTG";
            return `${havAmount} / ${pledgeAmount}`;
          },
          minWidth: "120px",
        },
        {
          title: "storageNode.status",
          name: "pledgeStatus",
          more: true,
          minWidth: "120px",
        },
        {
          title: "market.timespace24h",
          name: "vaild24Status",
          more: true,
          minWidth: "180px",
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
          title: "market.timespacecur",
          name: "vaildProgress",
          valMap(val) {
            return utils.isEmpty(val) ? 0 : val;
          },
          more: true,
          minWidth: "200px",
        },
      ],
      tableData: [],
      total: 0,

      searchInput: "",
      types,
      selStatus: "0+7",
      vaildtypes,
      vaild24status: "all",
      isMobile: utils.isMobile(),
    };
  },

  methods: {
    pledgeStatusSpan(val) {
      return utils.getPledgeStatus(val).span;
    },
    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    loadTable(query, toTop = true, pageNum) {
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
      };
      /*
      if (this.searchInput !== "" && this.searchInput != null) {
        param.node_address = this.searchInput;
      }
      */
      if (this.searchInput !== "" && this.searchInput != null) {
        param.addr = this.searchInput;
      }

      if (
        this.selStatus != "all" &&
        this.selStatus != null &&
        this.selStatus != "undefined"
      ) {
        if (this.selStatus == "0+7") {
          param.statusList = [0, 7];
        } else {
          param.status = this.selStatus;
        }
      }

      if (
        this.vaild24status != "all" &&
        this.vaild24status != null &&
        this.vaild24status != "undefined"
      ) {
        param.vaild24_status = this.vaild24status;
      }

      query.loadingShow(param, pageNum);
      this.searchInput = param.addr;
      //  this.selStatus = param.status;
      this.vaild24status = param.vaild24_status;

      api
        .postJson("/platform/getStorageSpaceList", param)
        .then((response) => {
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
        })
        .catch((error) => {
          query.loadingHide(JSON.stringify(error).includes("timeout") ? 1 : 2);
        });
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
      }
    },

    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },

    goToUrlDetail(name, data) {
      if (data.deviceAddr) {
        helper.goPathUrl(this, name, `${data.deviceAddr}_${data.storageid}`);
      }
    },

    goToUrlHire(contract) {
      if (contract) {
        helper.goPathUrl(this, "mymanage/marketrental", contract);
      }
    },
    goStwtpgUrl(row) {
      helper.goPathUrl(this, "mymanage/stwtpg", row.deviceAddr);
    },
    setItemText(data) {
      return () => {
        return +data + " %";
      };
    },
    getAddrFormat(data, number) {
      return helper.getAddrFormat(data, number);
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
      this.tableInit(null, 1);
    },

    btnClear() {
      $("#lvMobile").toggle();
      this.selStatus = "0";
      this.vaild24status = "all";
      this.tableInit(null, 1);
    },

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
      this.selStatus = "0";
      this.tableInit(null, 1);
    },

    btnVaild24StatusPopover(type) {
      var dv = "lvVaild24status_" + type;
      $("#" + dv).toggle();
    },

    bntVaild24StatusFilter(type) {
      var dv = "lvVaild24status_" + type;
      $("#" + dv).toggle();
      this.tableInit(null, 1);
    },

    bntVaild24StatusClear(type) {
      var dv = "lvVaild24status_" + type;
      $("#" + dv).toggle();
      this.vaild24status = "all";
      this.tableInit(null, 1);
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
