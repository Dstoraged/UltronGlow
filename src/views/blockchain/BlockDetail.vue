<template>
  <div>
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body">
          <div class="row">
            <div class="col-md-7">
              <div class="card" style="margin-top: 5px; margin-bottom: 10px">
                <div class="card-body" style="text-align: left">
                  <h4 class="mt-0 header-title">
                    {{ $t("block.BlocksDetails") }}
                    <span
                      style="
                        color: #2ebac6;
                        font-weight: normal;
                        margin-left: 30px;
                      "
                      >{{ block }}</span
                    >
                  </h4>
                  <p
                    style="
                      font-size: 11pt;
                      color: #a4a4a4;
                      font-weight: normal;
                      padding: 0px;
                      margin: 6px 0px;
                    "
                  >
                    {{ $t("blockinfo.tranNumber", [blockInfo.txsCount]) }}
                    {{ blockInfo.blockSize }} bytes
                    {{ formatTime(blockInfo.timeStamp)
                    }}{{ $t("comm.before") }}（{{
                      formatTimed(
                        blockInfo.timeStamp / 1000,
                        "yyyy-MM-dd hh:mm:ss"
                      )
                    }}
                    +8UTC）
                  </p>
                  <VTable :table-heard="leftTbHeard" :datas="blockInfo">
                  </VTable>
                </div>
              </div>
            </div>
            <div class="col-md-5">
              <div class="card" style="margin-top: 5px; margin-bottom: 10px">
                <div class="card-body" style="text-align: left">
                  <h4 class="mt-0 header-title" style="line-height: 50px">
                    {{ $t("block.UltronNode") }}
                    <span
                      style="
                        color: #2ebac6;
                        font-weight: normal;
                        margin-left: 5px;
                      "
                      v-show="blockInfo.minerAddress !== undefined"
                      >{{ getAddrFormat(blockInfo.minerAddress, 12) }}</span
                    >
                  </h4>
                  <VTable :table-heard="rightTbHeard" :datas="blockInfo">
                  </VTable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <BlockReward :blocknum="block" />
  </div>
</template>
<script>
import BlockReward from "./BlockReward.vue";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import VTable from "@/components/modules/VTable.vue";
export default {
  name: "BlockDetail",
  components: {
    BlockReward,
    VTable,
  },
  props: {},
  data() {
    return {
      leftTbHeard: [
        {
          title: "blockinfo.hash",
          name: "hash",
          popover: true,
          phoneFormat: true,
        },
        {
          title: "blockinfo.parentHash",
          name: "parentHash",
          popover: true,
          phoneFormat: true,
        },
        { title: "blockinfo.difficulty", name: "difficulty" },
        { title: "blockinfo.totalDifficulty", name: "totalDifficulty" },
        { title: "blockinfo.nonce", name: "nonce" },
      ],

      rightTbHeard: [
        {
          title: "block.GasUsed",
          name: "gasUsed",
          valMap(val, item) {
            let gasUsedRate =
              Math.floor((item.gasUsed / item.gasLimit) * 10000) / 100;
            return `${val}(${gasUsedRate})%`;
          },
        },          
        { title: "block.GasLimit", name: "gasLimit" },
        {
          title: "block.GasPrice",
          name: "avgGasPrice",
          valMap(val) {
            return `${helper.getDataFormat(val, 9)} Gwei`;
          },
        },
        {
          title: "block.BlockReward",
          name: "reward",
          valMap(val,item) {
            if(item.blockNumber>=window.$url.burntFeesNumber)
              return helper.getDataFormat((val - item.gasUsed * item.avgGasPrice*0.5), 18, 10000).toFixed(4) + " UTG";
            else
              return helper.getDataFormat(val, 18, 10000).toFixed(4) + " UTG";
          },
        },
        {
          title: "block.BurntFees",
          name: "gasBurnt",
          valMap(val,item) {
            if(item.blockNumber>=window.$url.burntFeesNumber)
              return `${helper.getDataFormat(item.gasUsed * item.avgGasPrice*0.5, 18, 10000)} UTG`;
            else
              return `0 UTG`;
          },
        },
      ],
      block: "",
      timer2: {},
      blockInfo: { gasUsedRate: 0 },
    };
  },
  created() {
    this.block = this.$route.params.id;
    this.getBlockInfo();
    sessionStorage.setItem("detail", true);
  },
  methods: {
    getDataFormat(data, pow = 18, decimal = 10000) {
      return helper.getDataFormat(data, pow, decimal);
    },
    formatTime(time) {
      return helper.formatTimimg(time);
    },
    formatTimed(timestamp, format) {
      //console.log(helper.formatTime(timestamp,1000,format));
      return helper.formatTime(timestamp, 1000, format);
    },
    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },
    getAddrFormat(data, number) {
      return helper.getAddrFormat(data, number);
    },

    getBlockInfo() {
      var param = {
        blockNumber: this.block,
      };
      api
        .post("/platform/searchByNumber", param)
        .then((response) => {
          this.blockInfo = response.result[0];
          this.blockInfo.gasUsedRate =
            Math.floor(
              (this.blockInfo.gasUsed / this.blockInfo.gasLimit) * 10000
            ) / 100;
          this.timer2 = setInterval(() => {
            this.blockInfo.timestamp++;
          }, 1000);
        })
        .catch((error) => {
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
