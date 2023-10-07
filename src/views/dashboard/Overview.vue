<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body" style="padding: 0px">
        <div
          class="media"
          style="
            display: -webkit-flex;
            display: flex;
            -webkit-align-items: center;
            align-items: center;
            padding: 10px 20px;
            border-bottom: 1px solid #ebebeb;
            font-family: Helvetica, Arial, sans-serif;
          "
        >
          <img
            class="d-flex mr-3 thumb-sm"
            src="@/assets/images/icon_dq.png"
            style="width: 20px; height: 20px"
          />
          <h4 class="font-16 m-1">{{ $t("home.overview") }}</h4>
        </div>
        <div class="row" style="padding: 0px; margin: 0px">
          <div
            class="col-md-3"
            style="border-right: 1px solid #e7e7e7"
            v-for="(item, cd) in topDivs"
            :key="cd"
          >
            <div
              class="media"
              style="
                display: -webkit-flex;
                display: flex;
                -webkit-align-items: center;
                align-items: center;
                -webkit-justify-content: center;
                justify-content: center;
                border-bottom: 1px solid #e7e7e7;
                padding: 20px 0;
                font-family: Helvetica, Arial, sans-serif;
              "
            >
              <div
                class="media-body align-self-center"
                style="text-align: center"
              >
                <h4 class="font-14 m-1">{{ $t(item.title) }}</h4>
                <h4 class="font-16 m-1" @click="goToAtionUrl(item.id)">
                  <span
                    class="cursor"
                    style="font-size: 16pt; color: #2ebac6"
                    >{{ topData[item.name] || "--" }}</span
                  >
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import utils from "@/utils/utils";
import { showCardLoading, hideLoading } from "@/utils/loading";
export default {
  name: "Overview",
  data() {
    return {
      blockTotal: "--",
      tranTotal: "--",
      destroyTotal: "--",
      walletAddrTotal: "--",
      blockTimeTotal: "--",
      computingPower: "--",
      activeMiner: "--",
      totalNetWorkTraffic: "--",
      totalCirculationQuantity: "--",
      totalDugQuantity: "--",
      addresspools: "--",
      totalPledgeQuantity: "--",
      totalLockUpQuantity: "--",
      totalTransactionValue: "--",
      yesterTransactionValue: "--",
      yesterNewAccount: "--",
      voterSize: "--",
      voterTotal: "--",
      voterProportion: "--",
      desutg: "--",
      topDivs: [
        {
          name: "totalBlockNumber",
          title: "home.totalBlockNumber",
          id: "BlockNumber",
        },
        { name: "bandWidthSize", title: "home.storage", id: "BandWidth" },

        { name: "pledgeNum", title: "home.pledge", id: "pledge" },
        { name: "lockNum", title: "home.lock", id: "lock" },
        { name: "destrNum", title: "home.desutg", id: "desutg" },
        { name: "utgToGb", title: "home.power", id: "power" },
        { name: "utg24", title: "home.lastoutput", id: "utg24" },
        { name: "gbutgRate", title: "home.curgbtoutgradio", id: "gbutgRate" },
        {
          name: "nextElectTime",
          title: "home.nextelection",
          id: "nextelection",
        },
      ],
      topData: {},
      pledgeDivs: [
        { name: "bw0_300", title: "1-300" },
        { name: "bw301_800", title: "301-800" },
        { name: "bw801_1500", title: "801-1500" },
        { name: "bw1500", title: ">1500" },
      ],
      //pledgeData: {},
      timer: {},
      timer2: {},
      intervalData: null,
    };
  },

  created() {},
  mounted() {
    this.getTotalData();
   // this.getPlgeRange();
    this.intervalData = setInterval(() => {
      this.getTotalData();
      //this.getPlgeRange();
      //console.log("Timer ........................................")
    }, 20000);
  },
  beforeDestroy() {
    if (this.intervalData) {
      clearInterval(this.intervalData);
    }
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.timer2) {
      clearInterval(this.timer2);
    }
  },

  methods: {
    formatTime(time) {
      return helper.formatTimimg(time);
    },
    changeSymbol(address, Symbol, digits) {
      return helper.changeSymbol(address, Symbol, digits);
    },
    changeBackSymbol(address, Symbol, digits) {
      return helper.changeBackSymbol(address, Symbol, digits);
    },
    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },

    goToAtionUrl(name) {
      if (name == "BlockNumber") {
        helper.goPathUrl(this, "ViewBlocks", "");
      }

      if (name == "BandWidth") {
        helper.goPathUrl(this, "StorageNode", "");
      }

      if (name == "power") {
        helper.goPathUrl(this, "BandwidthLock", "");
      }

      if (name == "pledge") {
        helper.goPathUrl(this, "Allpledge", "");
      }

      if (name == "lock") {
        helper.goPathUrl(this, "AllLocks", "");
      }

      if (name == "utg24") {
        helper.goPathUrl(this, "Lastoutput", "");
      }

      if (name == "desutg") {
        helper.goPathUrl(this, "Destroy", "");
      }
    },
    getAddrFormat(data, number) {
      return helper.getAddrFormat(data, number);
    },

    commaSeparateNumber(val) {
      while (/(\d+)(\d{3})/.test(val.toString())) {
        val = val.toString().replace(/(\d+)(\d{3})/, "$1" + "," + "$2");
      }
      return val;
    },

    /*
    getPlgeRange() {
      api
        .postJson("/platform/getBwPlgeRange", "", 60000)
        .then((response) => {
          this.pledgeData = response.result || {};
        })
        .catch((err) => {
          console.error(err);
        });
    },
    */
    getSuffix(val, aStr = "") {
      if (val) {
        let strL = "M";
        let num = 1024;
        let numL = num;
        let valL = val;
        if (valL / numL >= 1) {
          strL = "G";
          valL = val / numL;
          numL *= num;
        }
        if (val / numL >= 1) {
          strL = "T";
          valL = val / numL;
          numL *= num;
        }
        if (val / numL >= 1) {
          strL = "P";
          valL = val / numL;
          numL *= num;
        }
        if (val / numL >= 1) {
          valL = val / numL;
          strL = "E";
        }
        return valL + " " + strL + aStr;
      }
      return val;
    },
    getTotalData() {
      //showCardLoading();
      var that = this;
      api
        .postJson("/platform/getDatas", "", 60000)
        .then((response) => {
          //hideLoading();
          if (response.statusCode !== 0) {
            that.$message({
              type: "error",
              message: response.message,
            });
          } else {
            if (response.result === null || response.result.total === 0) {
              return;
            }
            const data = response.result || {};

            if (
              data.bandWidthSize != "" &&
              data.bandWidthSize != null &&
              data.bandWidthSize != "undefined"
            )
              data.bandWidthSize = utils.bytesToSize(data.bandWidthSize);
            else data.bandWidthSize = "--";

            data.pledgeNum = data.pledgeNum
              ? data.pledgeNum + " UTG"
              : data.pledgeNum;

            data.lockNum =
              helper.getDataFormat(data.lockNum, 18, 10000).toFixed(4) + " UTG";
            data.destrNum =
              helper.getDataFormat(data.destrNum, 18, 10000).toFixed(4) +
              " UTG";
            data.nextElectTime = data.nextElectTime
              ? data.nextElectTime + " BLOCK"
              : data.nextElectTime;

            data.utgToGb =
              helper.getDataFormat(data.utgToGb, 18, 10000).toFixed(4) + " UTG";

            data.gbutgRate = data.gbutgRate.toFixed(4) + " GB/UTG";              
           
            /*
            data.utgToGb = data.utgToGb
              ? data.utgToGb + " UTG/GB"
              : data.utgToGb;
            */
            data.utg24 =
              helper.getDataFormat(data.utg24, 18, 10000).toFixed(4) + " UTG";
            this.topData = data;
          }
        })
        .catch((error) => {
          //hideLoading();
          console.error(error);
        });
        /*
      api
        .postJson("/platform/getDataForUtg", "", 60000)
        .then((response) => {
          if (response.statusCode !== 0) {
            that.$message({
              type: "error",
              message: response.message,
            });
          } else {
            if (response.result === null || response.result.total === 0) {
              return;
            }
            const data = response.result;
            that.computingPower = data.ComputingPower;
            that.activeMiner = data.ActiveMiner;
            that.totalNetWorkTraffic = data.TotalNetWorkTraffic;
          }
        })
        .catch((error) => {
          // this.$message.error(error.message)
          // this.dialogVisible = true
          console.error(error);
        });
        */
    },
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
</style>
