<template>
  <div>
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body">
          <h4 class="mt-0 header-title viewheader">
            {{ $t("contracts.contractdetail") }}
          </h4>
          <div class="row">
            <div class="col-md-7">
              <div class="card viewcard">
                <div class="card-body viewcardbody">
                  <h4 class="mt-0 header-title" style="text-align: left">
                    {{ $t("contracts.overview") }}
                  </h4>
                  <VTable :table-heard="tableLeftHeard" :datas="accInfo" title-width="110px" id="tableLeftHeardid">
                  </VTable>
                </div>
              </div>
            </div>
            <div class="col-md-5" v-if="true">
              <div class="card viewcard">
                <div class="card-body viewcardbody">
                  <h4 class="mt-0 header-title" style="text-align: left">
                    {{ $t("contracts.profilesummary") }}
                  </h4>
                  <VTable :table-heard="tableRightHeard" :datas="accInfo" title-width="110px" id="tableRightHeardid">
                  </VTable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body" style="margin: 20px 4px; padding: 0px">
          <div class="col-md-2" style="margin: 0px; padding: 0px">
            <ul class="nav nav-pills nav-justified" role="tablist" style="
                font-size: 11pt;
                font-weight: bold;
                margin: 0px;
                padding: 0px;
              ">
              <li class="nav-item waves-effect waves-light">
                <a class="nav-link active" data-toggle="tab" href="#lock-nodeaward" role="tab" aria-selected="true"
                  @click="handleNavLink($event)">
                  <span class="d-none d-md-block">{{ $t("home.tran") }}</span>
                  <span class="d-block d-md-none">{{ $t("home.tran") }}</span>
                </a>
              </li>

              <li class="nav-item waves-effect waves-light" v-if="true">
                <a class="nav-link" data-toggle="tab" href="#lock-contract" role="tab" @click="handleNavLink($event)">
                  <span class="d-none d-md-block" style="margin-right:10px;">{{
                      $t("contracts.contract")
                  }}
                    <i class="fa fa-check-circle check-text-success" style=" position:relative; top:-6px;   font-size: 8pt;"
                      v-if="contracttotal > 0"></i>
                  </span>
                  <span class="d-block d-md-none">{{
                      $t("contracts.contract")
                  }}
                    <i class="fa fa-check-circle check-text-success" style=" position:relative; top:-6px;   font-size: 8pt;"
                      v-if="contracttotal > 0"></i>
                  </span>
                </a>
              </li>

              <li class="nav-item waves-effect waves-light" v-if="false">
                <a class="nav-link" data-toggle="tab" href="#lock-ExtractRecords" role="tab"
                  @click="handleNavLink($event)">
                  <span class="d-none d-md-block">{{
                      $t("contract.extractRecord")
                  }}
                  </span>
                  <span class="d-block d-md-none">{{
                      $t("contract.extractRecord")
                  }}</span>
                </a>
              </li>
            </ul>
          </div>
          <!-- Tab panes -->
          <div class="tab-content" style="margin-top: 20px">
            <div class="tab-pane active" id="lock-nodeaward" role="tabpanel" style="margin: 0px; padding: 0px">
              <ContractTran :contract="accAddr" />
            </div>

            <div class="tab-pane" id="lock-contract" role="tabpanel">
              <ContractCode :contract="accAddr" :contractname="contractname" :accInfo="accInfo"
                :contractcode="contractcode" />
            </div>

            <div class="tab-pane" id="lock-ExtractRecords" role="tabpanel" v-if="false">
              <ExtractRecords :contract="accAddr" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog :visible.sync="recodeDialogVisible" class="register-limit-dialog" width="320px" center>
      <div slot="footer" class="dialog-footer">
        <div ref="qrCodeUrl" class="qrcode"></div>
        <div class="acc-addr" style="font-size: 9px">{{ accAddr }}</div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ContractTran from "./components/ContractTran.vue";
import ContractCode from "./components/ContractCode.vue";
//import ExtractRecords from "./components/ExtractRecords.vue";
import { Message } from "element-ui";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import QRCode from "qrcodejs2";
import VTable from "@/components/modules/VTable.vue";

export default {
  name: "ContractInfo",
  components: {
    VTable,
    ContractTran,
    ContractCode,
    //ExtractRecords
  },
  data() {
    return {
      tableLeftHeard: [
        {
          title: "contracts.tokenAddress",
          name: "contract",
          popover: true,
          format: true,
          phoneFormat: true,
        },
        { title: "contracts.contractname", name: "contractname" },
        { title: "contracts.Abbreviation", name: "symbol" },
        //{ title: "contracts.decimal", name: "decimals" },
        { title: "contracts.balance", name: "balance" },
        { title: "contracts.txns", name: "txcount" },
      ],

      tableRightHeard: [
        {
          title: "contracts.contractCreator1",
          name: "author",
          popover: true,
          format: true,
          phoneFormat: true,
        },
        {
          title: "contracts.owner",
          name: "admin1",
          popover: true,
          format: true,
          phoneFormat: true,
        },
        {
          title: "contracts.contractCreator2",
          name: "txhash",
          popover: true,
          format: true,
          phoneFormat: true,
        },
      ],

      accAddr: null,
      contractname: "",
      accInfo: {},
      recodeDialogVisible: false,
      ownerflag: false,
      contractcode: "",
      contracttotal: 0,
    };
  },
  created() {
    //this.accAddr = this.$route.params.id;

    let idL = this.$route.params.id;
    console.log("idL=" + idL);
    let ids = idL.split("_");
    this.accAddr = ids[0];
    this.contractname = ids[1];

    localStorage.setItem("ContractInfo", true);
    this.getContractInfo();
  },

  mounted() {
    this.creatQrCode(this.accAddr);
  },

  methods: {
    getAddrFormat(data, number = 15) {
      return helper.getAddrFormat(data, number);
    },

    handleDialog() {
      this.recodeDialogVisible = true;
    },

    handleNavLink(event) {
      $(".nav-link").removeClass("active");
      console.log(event.target.tagName);
      event.currentTarget.className = "nav-link active";
    },

    getContractInfo() {
      const param = {
        contract: this.accAddr,
      };
      api
        .post("/platform/getContractInfo", param)
        .then((response) => {
          if (response.result == null) {
            Message.error(response.message);
          } else {
            this.accInfo = response.result;
            this.accInfo.balance =
              helper
                .getDataFormat(response.result.balance, 18, 10000)
                .toFixed(4) + " UTG";
            this.ownerflag =
              this.accInfo.admin1 != null && this.accInfo.admin1 != "";
            
            this.contractname = this.accInfo.contractname; 
            
            this.accInfo.contractname =
              this.accInfo.contractname === null ||
                typeof this.accInfo.contractname == "undefined"
                ? this.accInfo.name
                : this.accInfo.contractname;

            this.accInfo.contractnames = this.accInfo.contractname;
            this.accInfo.compilerversion = this.accInfo.vername;
            this.accInfo.optimizationenabled = "No with 200 runs";
            this.accInfo.othersettings = "default evmVersion";
            this.contractcode = this.accInfo.input;
            
          }
        })
        .catch((error) => {
          Message.error(error.message);
        });
    },

    handleCopy(data) {
      this.copy(data);
    },
    copy(data) {
      var that = this;
      const url = data;
      const oInput = document.createElement("input");
      oInput.value = url;
      document.body.appendChild(oInput);
      oInput.select();
      document.execCommand("Copy");
      Message({
        message: that.$t("accounts.copySuccess"),
        type: "success",
      });
      oInput.remove();
    },
    creatQrCode(text) {
      new QRCode(this.$refs.qrCodeUrl, {
        text: text,
        width: 260,
        height: 260,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}

@media (min-width: 751px) {
  .viewheader {
    text-align: left;
  }

  .viewcard {
    margin-top: 5px;
  }

  .viewcardbody {
    text-align: left;
  }
}

@media (max-width: 750px) {
  .viewheader {
    text-align: left;
    border-bottom: #dddddd solid 2px;
    line-height: 30px;
    margin-bottom: 20px;
  }

  .viewcard {
    margin-top: 5px;
    border: none;
    box-shadow: none;
  }

  .viewcardbody {
    text-align: left;
    margin: 0px;
    padding: 0px;
  }
}
</style>
