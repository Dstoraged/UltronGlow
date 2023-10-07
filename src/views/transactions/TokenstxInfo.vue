<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body" style="text-align: left">
        <h4 class="mt-0 header-title">{{ $t("trandetail.title") }}</h4>
        <p style="font-size: 12pt; color: #2ebac6; padding: 0px; margin: 6px 0">
          {{ tranAddr }}
        </p>
        <p
          style="font-size: 12pt; color: #a4a4a4; padding: 0px; margin: 6px 0px"
        >
          <img
            v-if="tranInfo.status == 1"
            src="@/assets/images/icon_cg.png"
            alt
            style="width: 16px; height: 16px"
          />
          <img
            v-if="tranInfo.status != 1"
            src="@/assets/images/icon_sc.png"
            alt
            style="width: 16px; height: 16px"
          />
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
          <table class="table table-hover mb-0">
            <tbody>
              <tr>
                <td style="min-width: 100px">
                  {{ $t("trandetail.sendAddr") }}
                </td>
                <td>
                  <span
                    class="cursor forcibly-blue equal-width"
                    @click="goToUrl('AccountDetail', tranInfo.fromAddr)"
                    >{{ tranInfo.fromAddr }}</span
                  >
                </td>
              </tr>
              <tr>
                <td style="min-width: 100px">
                  {{ $t("trandetail.acceptAddr") }}
                </td>
                <td>
                  <span
                    class="cursor forcibly-blue equal-width"
                    @click="goToUrl('AccountDetail', tranInfo.toAddr)"
                    >{{ tranInfo.toAddr }}</span
                  >
                </td>
              </tr>
              <tr>
                <td style="min-width: 100px">{{ $t("trandetail.Block") }}</td>
                <td>
                  <span
                    class="cursor blue"
                    @click="goToUrl('BlockDetail', tranInfo.blockNumber)"
                    >{{ tranInfo.blockNumber }}</span
                  >
                  <span>
                    （{{ $t("trandetail.verifyBlock", [confirmBlock]) }}）
                  </span>
                </td>
              </tr>
              <tr>
                <td>Nonce</td>
                <td>{{ tranInfo.nonce }}</td>
              </tr>
              <tr>
                <td style="min-width: 100px">
                  {{ $t("trandetail.tranValue") }}
                </td>
                <td>{{ getDataFormats(tranInfo.value) }} UTG</td>
              </tr>
              <tr>
                <td style="min-width: 100px">
                  {{ $t("trandetail.handleFee") }}
                </td>
                <td>
                  {{
                    getDataFormats(
                      tranInfo.gasUsed * tranInfo.gasPrice,
                      18,
                      10000
                    )
                  }}
                  UTG
                </td>
              </tr>
              <tr>
                <td style="min-width: 100px">{{ $t("trandetail.GasUsed") }}</td>
                <td>{{ tranInfo.gasUsed }}（{{ tranInfo.gasUsedRate }} %）</td>
              </tr>
              <tr>
                <td style="min-width: 100px">
                  {{ $t("trandetail.GasLimit") }}
                </td>
                <td>{{ tranInfo.gasLimit }}</td>
              </tr>
              <tr>
                <td style="min-width: 100px">
                  {{ $t("trandetail.GasPrice") }}
                </td>
                <td>{{ getDataFormat(tranInfo.gasPrice, 9) }} Gwei</td>
              </tr>

              <tr v-for="(item, cd) in additions" :key="cd">
                <td style="min-width: 100px">{{ $t(item.title) }}</td>
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
</template>
<script>
import { Message } from "element-ui";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import txnsinfoDatas from "@/utils/txnsinfoDatas";
import utils from "@/utils/utils";
export default {
  name: "TokenstxInfo",
  components: {},
  data() {
    return {
      tranAddr: "",
      newBlock: 0,
      confirmBlock: 0,
      tranInfo: {},
      timer: {},
      intervalToken: {},
      additions: [],
    };
  },
  mounted() {
    this.tranAddr = this.$route.params.id;
    this.getTranInfo();
    localStorage.setItem("detail", true);
  },
  methods: {
    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },
    formatTime(time) {
      return helper.formatTimimg(time);
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
      this.additions = jsonL[item.ufoOperator] || [];
    },
    getAdditionsVal(item, val) {
      if (item.valFun) {
        return item.valFun(val);
      }
      if (item.valMap) {
        return item.valMap[val];
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
          console.error(error);
        });
    },

    getTranInfo() {
      const param = {
        txHash: this.tranAddr,
      };

      api
        .postJson("/platfrom/getTransactionByTokenHash", param)
        .then((response) => {
          if (response.statusCode !== 0) {
            Message.error(response.message);
          } else {
            this.tranInfo = response.result[0];
            this.tranInfo.time = this.tranInfo.timeStamp;
            this.tranInfo.timeStamp = helper.formatTime(
              this.tranInfo.timeStamp / 1000,
              "yyyy-MM-dd hh:mm:ss"
            );
            this.tranInfo.gasUsedRate =
              Math.floor(
                (this.tranInfo.gasUsed / this.tranInfo.gasLimit) * 10000
              ) / 100;
            this.timer = setInterval(() => {
              this.tranInfo.time++;
            }, 1000);
            this.additionsData();
            this.getBlockList();
          }
        })
        .catch((error) => {
          Message.error(error.ErrMsg);
          console.error(error);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
</style>
