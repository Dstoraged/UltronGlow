<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <div class="row" style="padding: 6px; text-align: left">
          <div class="col-md-4">
            <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
              {{ $t(totitle) }}
            </h4>
            <p class="sub-title" style="width: 100%; text-align: left">
              {{ $t("Transactions.currentTranNumber", [total]) }}
            </p>
          </div>
          <div class="col-md-4">
            <div class="input-group" style="margin: 0 auto">
              <input type="text" class="form-control" :placeholder="$t('Transactions.addrSearch')" id="demo"
                v-model="searchInput" @keyup.enter="tableInit(null, 1)" style="border-right: 0px; width: 60%" />
              <div class="input-group-append">
                <button class="btn btn-block waves-effect waves-light" type="button" @click="tableInit(null, 1)"
                  style="background-color: #d4d4d4">
                  {{ $t("comm.search") }}
                </button>
              </div>
              <div class="btn-group" v-if="isMobile">
                <button class="btn btn-secondary btn-sm btn-block" style="
                    padding: 1px;
                    border-radius: 4px;
                    margin-left: 6px;
                    height: 35px;
                    width: 25px;
                  " @click="btnPopover">
                  <i class="mdi mdi-filter"></i>
                </button>
                <div id="lvMobile" style="
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
                  ">
                  <div>
                    <div class="form-group row">
                      <div class="col-sm-4">
                        {{ $t("Transactions.type") }}
                      </div>
                      <div class="col-sm-8">
                        <select class="form-control" v-model="selType">
                          <option value="all">{{ "" }}</option>
                           <option 
                           v-for="(label,key) in types"
                           :key="key"
                           :value="key=='common'?'':key"
                           >
                            {{ $t(label) }}
                          </option>
                       
                       
                         <!-- <option value="">{{ $t("Transactions.common") }}</option>
                          <option value="Bind">
                            {{ $t("Transactions.Bind") }}
                          </option>
                          <option value="Unbind">
                            {{ $t("Transactions.Unbind") }}
                          </option>
                          <option value="Rebind">
                            {{ $t("Transactions.Rebind") }}
                          </option>

                          <option value="stProof">
                            {{ $t("Transactions.stProof") }}
                          </option>
                          <option value="stReValid">
                            {{ $t("Transactions.stReValid") }}
                          </option>
                          <option value="stReq">
                            {{ $t("Transactions.stReq") }}
                          </option>
                          <option value="stExit">
                            {{ $t("Transactions.stExit") }}
                          </option>

                          <option value="stRent">
                            {{ $t("Transactions.stRent") }}
                          </option>
                          <option value="stRentPg">
                            {{ $t("Transactions.stRentPg") }}
                          </option>
                          <option value="stReNew">
                            {{ $t("Transactions.stReNew") }}
                          </option>
                          <option value="stReNewPg">
                            {{ $t("Transactions.stReNewPg") }}
                          </option>
                          <option value="stRescind">
                            {{ $t("Transactions.stRescind") }}
                          </option>

                          <option value="chPrice">
                            {{ $t("Transactions.chPrice") }}
                          </option>
                          <option value="FlwLock">
                            {{ $t("Transactions.FlwLock") }}
                          </option>

                          <option value="CndLock">
                            {{ $t("Transactions.CndLock") }}
                          </option>
                          <option value="RwdLock">
                            {{ $t("Transactions.RwdLock") }}
                          </option>
                          <option value="stset">
                            {{ $t("Transactions.stset") }}
                          </option>
                          <option value="Deposit">
                            {{ $t("Transactions.Deposit") }}
                          </option>
                          <option value="ExchRate">
                            {{ $t("Transactions.ExchRate") }}
                          </option>
                          <option value="Exch">
                            {{ $t("Transactions.Exch") }}
                          </option>

                          <option value="CandReq">
                            {{ $t("Transactions.CandReq") }}
                          </option>
                          <option value="CandExit">
                            {{ $t("Transactions.CandExit") }}
                          </option>
                          <option value="CandPnsh">
                            {{ $t("Transactions.CandPnsh") }}
                          </option>
                          <option value="TlcChAdmin1">
                            {{ $t("Transactions.TlcChAdmin1") }}
                          </option>
                          <option value="TlcPickup">
                            {{ $t("Transactions.TlcPickup") }}
                          </option>
                          <option value="ContractNew">
                            {{ $t("Transactions.ContractNew") }}
                          </option>
                          <option value="TokenNew">
                            {{ $t("Transactions.TokenNew") }}
                          </option>
                          <option value="TokenTransfer">
                            {{ $t("Transactions.TokenTransfer") }}
                          </option>

                          <option value="chbw">
                            {{ $t("Transactions.chbw") }}
                          </option>
                          <option value="stCatchUp">
                            {{ $t("Transactions.stCatchUp") }}
                          </option>

                          <option value="CandEntrust">
                            {{ $t("Transactions.CandEntrust") }}
                          </option>
                          <option value="CandETExit">
                            {{ $t("Transactions.CandETExit") }}
                          </option>
                          <option value="CandChaRate">
                            {{ $t("Transactions.CandChaRate") }}
                          </option>-->
                        </select>
                      </div>
                    </div>

                    <div class="form-group row">
                      <div class="col-sm-4">
                        {{ $t("Transactions.status") }}
                      </div>
                      <div class="col-sm-8">
                        <select class="form-control" v-model="selStatus">
                          <option value="all"></option>
                          <option value="0">{{ $t("comm.fail") }}</option>
                          <option value="1">{{ $t("comm.success") }}</option>
                        </select>
                      </div>
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
                </div>
              </div>
            </div>
          </div>
        </div>

        <h-tbale ref="txnshtable" :table-heard="tableHeard" :table-data="tableData" :show-right-tools="false"
          :showSubtitle="false" :up-load-time="30000" table-id="ViewTxnsTableId" @inint-ok="tableInit" @load="loadTable"
          @colClick="colClick">
          <img slot="table_cell_img" src="@/assets/images/icon_to.png" class="thumb-xs ml-2" height="21" width="21" />
          <template slot="table_cell_status" slot-scope="scope">
            <span v-if="scope.data.status == 1" style="color: #2ebac6">{{
            $t("comm.success")
            }}</span>
            <span v-else style="color: red; margin-right: 20px">{{ $t("comm.fail") }}
            </span>
          </template>

          <div class="btn-group" slot="table_title_right_ufooperator" slot-scope="scope" v-if="scope.type == 'pc'">
            <button class="btn btn-secondary btn-sm btn-block" style="
                padding: 1px;
                border-radius: 4px;
                margin-left: 6px;
                height: 19px;
              " @click="btnTxnTypePopover(scope.type)">
              <i class="mdi mdi-filter"></i>
            </button>
            <div :id="`lvTxnType_${scope.type}`" style="
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
              ">
              <div>
                <div class="form-group row">
                  <div class="col-sm-12">
                    <select class="form-control" v-model="selType">
                      <option value="all">{{ "" }}</option>
                           <option 
                           v-for="(label,key) in types"
                           :key="key"
                           :value="key=='common'?'':key"
                           >
                            {{ $t(label) }}
                          </option>
                    <!--  <option value="all"></option>
                      <option value="">{{ $t("Transactions.common") }}</option>
                      <option value="Bind">
                        {{ $t("Transactions.Bind") }}
                      </option>
                      <option value="Unbind">
                        {{ $t("Transactions.Unbind") }}
                      </option>
                      <option value="Rebind">
                        {{ $t("Transactions.Rebind") }}
                      </option>

                      <option value="stProof">
                        {{ $t("Transactions.stProof") }}
                      </option>
                      <option value="stReValid">
                        {{ $t("Transactions.stReValid") }}
                      </option>
                      <option value="stReq">
                        {{ $t("Transactions.stReq") }}
                      </option>
                      <option value="stExit">
                        {{ $t("Transactions.stExit") }}
                      </option>

                      <option value="stRent">
                        {{ $t("Transactions.stRent") }}
                      </option>
                      <option value="stRentPg">
                        {{ $t("Transactions.stRentPg") }}
                      </option>
                      <option value="stReNew">
                        {{ $t("Transactions.stReNew") }}
                      </option>
                      <option value="stReNewPg">
                        {{ $t("Transactions.stReNewPg") }}
                      </option>
                      <option value="stRescind">
                        {{ $t("Transactions.stRescind") }}
                      </option>

                      <option value="chPrice">
                        {{ $t("Transactions.chPrice") }}
                      </option>
                      <option value="FlwLock">
                        {{ $t("Transactions.FlwLock") }}
                      </option>

                      <option value="CndLock">
                        {{ $t("Transactions.CndLock") }}
                      </option>
                      <option value="RwdLock">
                        {{ $t("Transactions.RwdLock") }}
                      </option>
                      <option value="stset">
                        {{ $t("Transactions.stset") }}
                      </option>
                      <option value="Deposit">
                        {{ $t("Transactions.Deposit") }}
                      </option>
                      <option value="ExchRate">
                        {{ $t("Transactions.ExchRate") }}
                      </option>
                      <option value="Exch">
                        {{ $t("Transactions.Exch") }}
                      </option>

                      <option value="CandReq">
                        {{ $t("Transactions.CandReq") }}
                      </option>
                      <option value="CandExit">
                        {{ $t("Transactions.CandExit") }}
                      </option>
                      <option value="CandPnsh">
                        {{ $t("Transactions.CandPnsh") }}
                      </option>
                      <option value="TlcChAdmin1">
                        {{ $t("Transactions.TlcChAdmin1") }}
                      </option>
                      <option value="TlcPickup">
                        {{ $t("Transactions.TlcPickup") }}
                      </option>
                      <option value="ContractNew">
                        {{ $t("Transactions.ContractNew") }}
                      </option>
                      <option value="TokenNew">
                        {{ $t("Transactions.TokenNew") }}
                      </option>
                      <option value="TokenTransfer">
                        {{ $t("Transactions.TokenTransfer") }}
                      </option>

                      <option value="chbw">
                        {{ $t("Transactions.chbw") }}
                      </option>
                      <option value="stCatchUp">
                        {{ $t("Transactions.stCatchUp") }}
                      </option>

                      <option value="CandEntrust">
                        {{ $t("Transactions.CandEntrust") }}
                      </option>
                      <option value="CandETExit">
                        {{ $t("Transactions.CandETExit") }}
                      </option>
                      <option value="CandChaRate">
                        {{ $t("Transactions.CandChaRate") }}
                      </option>-->
                    </select>
                  </div>
                </div>
                <div class="popover-footer" style="text-align: center">
                  <button type="button" class="btn btn-primary btn-sm" @click="bntTxnTypeFilter(scope.type)">
                    <i class="fa fa-filter"></i>{{ $t("comm.filter") }}
                  </button>
                  <button type="button" class="btn btn-primary btn-sm" @click="bntTxnTypeClear(scope.type)">
                    <i class="fa fa-eraser"></i>{{ $t("comm.clear") }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="btn-group" slot="table_title_right_status" slot-scope="scope" v-if="scope.type == 'pc'">
            <button class="btn btn-secondary btn-sm btn-block" style="
                padding: 1px;
                border-radius: 4px;
                margin-left: 6px;
                height: 19px;
              " @click="btnTxnStatusPopover(scope.type)">
              <i class="mdi mdi-filter"></i>
            </button>
            <div :id="`lvTxnStatus_${scope.type}`" style="
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
              ">
              <div>
                <div class="form-group row">
                  <div class="col-sm-12">
                    <select class="form-control" v-model="selStatus">
                      <option value="all"></option>
                      <option value="0">{{ $t("comm.fail") }}</option>
                      <option value="1">{{ $t("comm.success") }}</option>
                    </select>
                  </div>
                </div>
                <div class="popover-footer" style="text-align: center">
                  <button type="button" class="btn btn-primary btn-sm" @click="bntTxnStatusFilter(scope.type)">
                    <i class="fa fa-filter"></i>{{ $t("comm.filter") }}
                  </button>
                  <button type="button" class="btn btn-primary btn-sm" @click="bntTxnStatusClear(scope.type)">
                    <i class="fa fa-eraser"></i>{{ $t("comm.clear") }}
                  </button>
                </div>
              </div>
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
import HTbale from "@/components/modules/HTbale.vue";
import { setPageQuery } from "@/utils/table.js";
export default {
  name: "ViewTxns",
  components: { HTbale },
  props: {
    toaddress: {
      type: String,
      default: "",
    },
    totitle: {
      type: String,
      default: "home.transactions",
    },
  },
  data() {
    let _this_ = this;
    const types = Object.assign({} ,utils.Transactions);
    return {
      tableHeard: [
        {
          title: "Transactions.TxnHash",
          name: "hash",
          format: true,
          popover: true,
          isClick: true,
        },
        {
          title: "Transactions.Block",
          name: "blockNumber",
          more: true,
          isClick: true,
        },
        {
          title: "Transactions.Age",
          name: "timeStamp",
          valMap(val) {
            return `${helper.formatTimimg(val)}${_this_.$t("comm.before")}`;
          },
          more: true,
        },
        {
          title: "Transactions.From",
          name: "fromAddr",
          format: true,
          popover: true,
          isClick: true,
        },
        {
          title: "",
          titleNotT: true,
          name: "img",
          width: "21px",
          minWidth: "21px",
          more: true,
        },
        {
          title: "Transactions.To",
          name: "toAddr",
          format: true,
          popover: true,
          isClick: true,
        },
        {
          title: "Transactions.Value",
          name: "value",
          valMap(val) {
            return (
              utils.weedZero(helper.getDataFormat(val, 18, 10000), 8) + " UTG"
            );
          },
          more: true,
        },
        {
          title: "Transactions.TxnFee",
          name: "gasUsed",
          valMap(val, item) {
            return (
              utils.clearZero(val * item.gasPrice,5)+ " UTG"
              /*
              utils.weedZero(
                helper.getDataFormat(val * item.gasPrice, 18, 10000),
                8
              ) + " UTG"
              */
            );
          },
          more: false,
        },
        {
          title: "Transactions.type",
          name: "ufooperator",
          valMap(val) {
            return `${_this_.$t(_this_.types[val || "common"])}`;
          },
        },
        {
          title: "Transactions.status",
          name: "status",
        },
      ],
      tableData: [],
      total: 0,

      types,
      searchInput: null,
      selType: "all",
      selStatus: "all",
      isMobile: utils.isMobile(),
    };
  },
  methods: {
    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    loadTable(query, toTop = true, pageNum) {
      if (!query && this.$refs.txnshtable) {
        query = this.$refs.txnshtable.tableQuery;
      }

      if (!query) return;
      query.pageNum = pageNum || query.pageNum;
      if (query.pageSize == 0) query.pageSize = 10;
      //query.loadingShow();

      var param = {
        current: query.pageNum,
        size: query.pageSize,
      };
      if (this.searchInput !== "" && this.searchInput != null) {
        param.address = this.searchInput;
      }
      if (
        this.selType != "all" &&
        this.selType != null &&
        this.selType != "undefined"
      ) {
        param.ufooperator = this.selType;
      }
      if (
        this.selStatus != "all" &&
        this.selStatus != null &&
        this.selStatus != "undefined"
      ) {
        param.status = this.selStatus;
      }

      query.loadingShow(param, pageNum);
      this.searchInput = param.address;
      this.selType = param.ufooperator;
      this.selStatus = param.status;

      api
        .postJson("/platform/getTransactionList", param)
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
        case "hash":
          this.goToUrl("TxnsInfo", row.hash);
          break;
        case "blockNumber":
          this.goToUrl("BlockDetail", row.blockNumber);
          break;
        case "fromAddr":
          this.goToUrl("AccountDetail", row.fromAddr);
          break;
        case "toAddr":
          this.goToUrl("AccountDetail", row.toAddr);
          break;
      }
    },

    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
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
      this.selType = "all";
      this.selStatus = "all";
      this.tableInit(null, 1);
    },

    btnTxnTypePopover(type) {
      var dv = "lvTxnType_" + type;
      $("#" + dv).toggle();
    },

    bntTxnTypeFilter(type) {
      var dv = "lvTxnType_" + type;
      $("#" + dv).toggle();

      this.tableInit(null, 1);
    },

    bntTxnTypeClear(type) {
      var dv = "lvTxnType_" + type;
      $("#" + dv).toggle();
      this.selType = "all";
      this.tableInit(null, 1);
    },

    btnTxnStatusPopover(type) {
      var dv = "lvTxnStatus_" + type;
      $("#" + dv).toggle();
    },

    bntTxnStatusFilter(type) {
      var dv = "lvTxnStatus_" + type;
      $("#" + dv).toggle();
      this.tableInit(null, 1);
    },

    bntTxnStatusClear(type) {
      var dv = "lvTxnStatus_" + type;
      $("#" + dv).toggle();
      this.selStatus = "all";
      this.tableInit(null, 1);
    },
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
</style>
