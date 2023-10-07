<template>
  <div>
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body">
          <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
            {{ $t("node.punishRecharge") }}
          </h4>
          <el-form
            label-width="150px"
            style="max-width: 520px; margin: 0px auto; text-align: left"
          >
            <el-form-item :label="$t('node.nodeAddress')">{{
              message.node_address
            }}</el-form-item>
            <el-form-item :label="$t('node.RechargeCreditScore')">{{
              message.estimatedpayment
            }}</el-form-item>
            <el-form-item>
              <el-button
                type="text"
                size="medium"
                @click="goToUrl(message)"
                class="equal-width"
                >{{ $t("node.recharge") }}</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <NodeSuppleList :pledgeaddress="node_address" />
  </div>
</template>
<script>
import NodeSuppleList from "./components/NodeSuppleList.vue";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
export default {
  name: "NodeSupple",
  components: {
    NodeSuppleList,
  },
  data() {
    return {
      node_address: "",
      message: {
        node_address: "",
        node_type: 0,
        pledge_amount: 0,
        punilshamount: 0,
        releaseday: 0,
        time: "",
        estimatedpayment: 0,
        pledgeAmount: 0,
      },
    };
  },

  created() {
    this.node_address = this.$route.params.round;
    this.info();
  },

  methods: {
    formatTimed(timestamp, format) {
      return helper.formatTime(timestamp, format);
    },
    getDataFormat(data, pow = 18, decimal = 10000) {
      return helper.getDataFormat(data, pow, decimal);
    },
    formatTime(time) {
      return helper.formatTimimg(time);
    },
    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },
    getAddrFormat(data, number) {
      return helper.getAddrFormat(data, number);
    },

    info() {
      const param = {
        node_address: this.$route.params.round,
      };
      api
        .postJson("/platform/node/getcadnode", param)
        .then((response) => {
          this.message.node_address = response.result.node_address;
          this.message.node_type = response.result.node_type;
          this.message.pledge_amount = helper.getDataFormat(
            response.result.pledge_amount,
            18,
            10000
          );
          this.message.fractions = response.result.fractions;
          this.message.releaseday = response.result.releaseday;
          this.message.join_time = response.result.join_time;
          this.getPledgeAmount();
        })
        .catch((error) => {
          // this.$message.error(error.message)
          // this.dialogVisible = true
          console.error(error);
        });
    },

    getPledgeAmount() {
      const param = {};
      api
        .postJson("/platform/node/getNodePledgeAmount", param)
        .then((response) => {
          this.message.pledgeAmount = Math.ceil(
            helper.getDataFormat(response.result.NODE_PLEDGE_AMOUNT, 18, 10000)
          );
          if (typeof this.message.fractions === "undefined")
            this.message.estimatedpayment = "";
          else
            this.message.estimatedpayment =
              (Math.ceil(helper.getDataFormat(response.result, 18, 10000)) /
                100) *
                parseInt(this.message.fractions) +
              " UTG";
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
