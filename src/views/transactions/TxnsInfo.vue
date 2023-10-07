<template>
  <div>
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body" style="text-align: left">
          <h4 class="mt-0 header-title">{{ $t("trandetail.title") }}</h4>
          <p style="font-size: 12pt; color: #2ebac6; padding: 0px; margin: 6px 0">
            {{ tranAddr }}
          </p>
          <p style="
              font-size: 12pt;
              color: #a4a4a4;
              padding: 0px;
              margin: 6px 0px;
            ">
            <img v-if="tranInfo.status == 1" src="@/assets/images/icon_cg.png" alt style="width: 16px; height: 16px" />
            <img v-if="tranInfo.status != 1" src="@/assets/images/icon_sc.png" alt style="width: 16px; height: 16px" />
            <span style="color: #2ebac6; padding: 0px 6px">
              {{ tranInfo.status == 1 ? $t("comm.success") : $t("comm.fail") }}
            </span>
            <span>
              {{ formatTime(tranInfo.time) }}{{ $t("comm.before") }}（{{
                  tranInfo.timeStamp
              }}
              +8UTC）
            </span>
          </p>

          <div class="table-responsive">
            <table class="max-table-ie table table-hover mb-0">
              <tbody>
                <tr>
                  <td style="min-width: 120px">{{ $t("trandetail.Block") }}</td>
                  <td>
                    <span class="cursor" style="color: #2ebac6" @click="goToUrl('BlockDetail', tranInfo.blockNumber)">{{
                        tranInfo.blockNumber
                    }}</span>
                    <span>
                      （{{ $t("trandetail.verifyBlock", [confirmBlock]) }}）
                    </span>
                  </td>
                </tr>

                <tr>
                  <td style="min-width: 120px">{{ $t("trandetail.From") }}</td>
                  <td s>
                    <span class="cursor" style="color: #2ebac6" @click="goToUrl('AccountDetail', tranInfo.fromAddr)">{{
                        tranInfo.fromAddrf
                    }}</span>
                  </td>
                </tr>
                <tr>
                  <td style="min-width: 120px">{{ $t("trandetail.to") }}</td>
                  <td>
                    <span class="cursor" style="color: #2ebac6" @click="goToUrl('AccountDetail', tranInfo.toAddr)">{{
                        tranInfo.toAddrf
                    }}</span>
                  </td>
                </tr>
                <tr>
                  <td style="min-width: 120px">
                    {{ $t("Transactions.type") }}
                  </td>
                  <td>{{ $t(tranInfo.ufooperatorName) }}</td>
                </tr>
                <tr v-if="tranInfo.ufooperator == 'TokenTransfer'">
                  <td style="min-width: 120px">
                    {{ $t("Transactions.contractaddress") }}
                  </td>
                  <td>
                    <span class="cursor" style="color: #2ebac6" @click="goToUrl('TokenInfo', tranInfo.contract)">{{
                        $t(tranInfo.contract)
                    }}</span>
                  </td>
                </tr>

                <tr v-if="tranInfo.ufooperator == 'TokenTransfer'">
                  <td style="min-width: 120px">
                    <span v-if="tokentype == 0"> {{ $t("trandetail.tokentran0") }}</span>
                    <span v-else-if="tokentype == 1"> {{ $t("trandetail.tokentran1") }}</span>
                    <span v-else> {{ $t("trandetail.tokentran2") }}</span>
                  </td>
                  <td>
                    <ul class="list-unstyled mb-0" id="wrapperContent">
                      <li class="media align-items-baseline mb-2" v-for="(item, index) in tokenData" :key="index">
                        <span class="row-count text-secondary small mr-1"><i class="fa fa-caret-right"></i></span>
                        <div class="media-body">
                          <span class="mr-1"><b>{{ $t("trandetail.From") }}</b></span>
                          <span class="hash-tag text-truncate mr-1">
                            <span class="hash-tag text-truncate hash-tag-custom-from tooltip-address cursor"
                              style="color: #2ebac6" @click="goToUrl('AccountDetail', item.fromAddr)">{{ item.fromAddrs
                              }}</span>
                          </span><span class="mr-1"><b>{{ $t("trandetail.to") }}</b></span>
                          <span class="hash-tag text-truncate mr-1">
                            <span class="hash-tag text-truncate hash-tag-custom-to tooltip-address cursor"
                              style="color: #2ebac6" @click="goToUrl('AccountDetail', item.toAddr)">{{ item.toAddrs
                              }}</span>
                          </span>
                          <span class="mr-1"><b>For</b></span>
                          <span class="mr-1">{{ item.amounts }}</span>
                          <span class="mr-1 cursor" style="color: #2ebac6"
                            @click="goToUrl('token', item.contract)">{{ item.tokennames }}</span>
                        </div>
                      </li>
                    </ul>
                  </td>
                </tr>

                <tr>
                  <td>Nonce</td>
                  <td>{{ tranInfo.nonce }}</td>
                </tr>
                <tr>
                  <td style="min-width: 120px">
                    {{ $t("trandetail.tranValue") }}
                  </td>
                  <td>{{ getDataFormats(tranInfo.value) }} UTG</td>
                </tr>
                <tr>
                  <td style="min-width: 120px">
                    {{ $t("trandetail.handleFee") }}
                  </td>
                  <td>
                    {{ getDataFormatZero(tranInfo.gasUsed * tranInfo.gasPrice) }}
                    <!--
                    {{
                      getDataFormats(
                        tranInfo.gasUsed * tranInfo.gasPrice,
                        18,
                        10000
                      )
                    }}
                    -->
                    UTG
                  </td>
                </tr>
                <tr>
                  <td style="min-width: 120px">
                    {{ $t("trandetail.GasUsed") }}
                  </td>
                  <td>
                    {{ tranInfo.gasUsed }}（{{ tranInfo.gasUsedRate }} %）
                  </td>
                </tr>
                <tr>
                  <td style="min-width: 120px">
                    {{ $t("trandetail.GasLimit") }}
                  </td>
                  <td>{{ tranInfo.gasLimit }}</td>
                </tr>
                <tr>
                  <td style="min-width: 120px">
                    {{ $t("trandetail.GasPrice") }}
                  </td>
                  <td>{{ getDataFormat(tranInfo.gasPrice, 9) }} Gwei</td>
                </tr>

                <tr v-for="(item, cd) in additions" :key="cd">
                  <td style="min-width: 120px">{{ $t(item.title) }}</td>
                  <td>
                    {{
                      item.isT
                        ? $t(getAdditionsVal(item, tranInfo[item.name]))
                        : getAdditionsVal(item, tranInfo[item.name])
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!--
    <RentalRecord  :txHash="tranAddr" ref="ftable" v-if="ufooperator=='stProof' || ufooperator=='stReValid'"/>
    -->
  </div>
</template>
<script>
import { Message } from "element-ui";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import txnsinfoDatas from "@/utils/txnsinfoDatas";
import utils from "@/utils/utils";
import RentalRecord from "./RentalRecord.vue";
export default {
  name: "TxnsInfo",
  components: {
    RentalRecord,
  },
  props: {},
  data() {
    const types = Object.assign({} ,utils.Transactions);
    return {
      tranAddr: "",
      ufooperator: "",
      dialogVisible: false,
      newBlock: 0,
      confirmBlock: 0,
      additions: [],
      tranInfo: {},
      types,
      paramlen: 0,

      tokenData: [],
      tokenTotal: 0,
      contract: "",
      tokenname: "",
      tokentype: 0,
    };
  },
  created() {
    // this.tranAddr = this.$route.params.id;
    let idL = this.$route.params.id;
    console.log("idL=" + idL);
    let ids = idL.split("_");
    this.paramlen = ids.length;
    this.tranAddr = ids[0];
    this.ufooperator = ids[1];

    this.getTranInfo();
    this.getTokenTrans();
    sessionStorage.setItem("detail", true);
  },
  methods: {
    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },
    formatTime(time) {
      return helper.formatTimimg(time);
    },

    getDataFormatZero(data) {
      return utils.clearZero(data, 5)
    },

    getDataFormats(data, pow = 18, decimal = 10000) {
      return utils.weedZero(helper.getDataFormat(data, pow, decimal), 8);
    },
    getDataFormat(data, pow = 18, decimal = 10000) {
      return helper.getDataFormat(data, pow, decimal);
    },
    getAddrFormat(data, number) {
      return helper.getAddrFormat(data, number);
    },
    additionsData() {
      let item = this.tranInfo || {};
      if (item.status != 1) {
        this.additions = [];
        return;
      }
      let jsonL = txnsinfoDatas[item.ufoprefix] || {};
      this.additions = jsonL[item.ufooperator] || [];
    },
    getAdditionsVal(item, val) {
      if (item.units) {
        return item.valFun(val) + " " + item.units;
      }

      if (item.valFun) {
        return item.valFun(val);
      }

      if (item.ftFun && utils.isMobile()) {
        return item.ftFun(val, 10);
      }

      if (item.valMap) {
        return item.valMap[val];
      }

      if (item.valdepMap) {
        console.log("valdepMap=" + item.valdepMap[val]);
        return item.valdepMap[val];
      }

      if (item.statusMap) {
        console.log("statusMap=" + item.statusMap[val]);
        return item.statusMap[val];
      }

      return val;
    },

    getBlockList() {
      var param = {
        current: 1,
        size: 1,
      };
      api
        .postJson("/platform/getBlockList", param)
        .then((response) => {
          if (response.statusCode !== 0) {
            Message.error(response.message);
          } else {
            this.newBlock = response.result.records[0]["blockNumber"];
            this.confirmBlock = this.newBlock - this.tranInfo.blockNumber;
          }
        })
        .catch((error) => {
          Message.error(error.message);
          this.dialogVisible = true;
          console.error(error);
        });
    },

    getTokenTrans() {
      var paramt = {
        current: 1,
        size: 100,
        hash: this.tranAddr,
      };
      api
        .postJson("/platform/getTransTokenListForContract", paramt)
        .then((response) => {
          let re = response.result || {};
          this.tokenData = re.records || [];
          if (response.result != null) this.tokenTotal = response.result.total;

          if (this.tokenTotal > 0) {
            let item = this.tokenData[0];
            this.contract = item.tokenname;
            this.tokenname = item.contract;
            this.tokentype = item.coinType;
          }

          this.tokenData.forEach((item, index) => {
            item.amounts = utils.weedZero(helper.getDataFormat(item.amount, item.decimals, 10000), 8);
            item.fromAddrs = utils.isMobile() ? this.getAddrFormat(item.fromAddr, 5) : this.getAddrFormat(item.fromAddr, 10);
            item.toAddrs = utils.isMobile() ? this.getAddrFormat(item.toAddr, 5) : this.getAddrFormat(item.toAddr,10);
            if (item.symbol)
              item.tokennames = item.tokenname + " (" + item.symbol + ")";
            else
              item.tokennames = item.tokenname
          })
        })
        .catch((error) => {
          console.log(error);
        });
    },


    getTranInfo() {
      var param = {
        txHash: this.tranAddr,
      };
      api
        .postJson("/platform/getTransactionByTxHash", param)
        .then((response) => {
          this.tranInfo = response.result;
          this.tranInfo.fromAddrf = utils.isMobile()
            ? this.getAddrFormat(this.tranInfo.fromAddr, 10)
            : this.tranInfo.fromAddr;
          this.tranInfo.toAddrf = utils.isMobile()
            ? this.getAddrFormat(this.tranInfo.toAddr, 10)
            : this.tranInfo.toAddr;
          this.tranInfo.contract = utils.isMobile()
            ? this.getAddrFormat(this.tranInfo.contract, 10)
            : this.tranInfo.contract;
          this.tranInfo.time = this.tranInfo.timeStamp;
          this.tranInfo.timeStamp = helper.formatTime(
            this.tranInfo.timeStamp / 1000,
            1000,
            "yyyy-MM-dd hh:mm:ss"
          );
          this.tranInfo.gasUsedRate =
            Math.floor(
              (this.tranInfo.gasUsed / this.tranInfo.gasLimit) * 10000
            ) / 100;
          this.timer = setInterval(() => {
            this.tranInfo.time++;
          }, 1000);
          this.tranInfo.ufooperatorName =
            this.types[this.tranInfo.ufooperator || "common"];
          this.ufooperator = this.tranInfo.ufooperator;

          this.additionsData();
          this.getBlockList();
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },

  watch: {
    ufooperator: function () {
      if (this.paramlen == 0) {
        //this.$refs.ftable.getRentalList(1);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
</style>
