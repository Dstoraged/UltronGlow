<template>
  <div>
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body">
          <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
            {{ $t("node.nodepledge") }}
          </h4>
          <el-form
            label-width="150px"
            style="max-width: 520px; margin: 0px auto; text-align: left"
          >
            <el-form-item :label="$t('node.address')" required>
              <el-input
                v-model="pledgeaddress"
                :placeholder="$t('node.address')"
                style="width: 400px"
              />
            </el-form-item>
            <el-form-item :label="$t('node.pledgeAmount')">
              {{ message.pledgeAmount }}
            </el-form-item>
            <el-form-item>
              <el-button
                type="text"
                size="medium"
                @click="goToUrl(pledgeaddress)"
                class="equal-width"
                >{{ $t("node.pledge") }}</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <NodePledgeList :pledgeaddress="pledgeaddress" />
  </div>
</template>
<script>
import NodePledgeList from "./components/NodePledgeList.vue";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
export default {
  name: "Nodepledge",
  components: {
    NodePledgeList,
  },
  data() {
    return {
      pledgeaddress: "",
      message: {
        pledgeAmount: 0,
      },
    };
  },

  created() {
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
      var param = {};
      api
        .postJson("/platform/node/getNodePledgeAmount", param)
        .then((response) => {
          this.message.pledgeAmount =
            Math.ceil(
              helper.getDataFormat(
                response.result.NODE_PLEDGE_AMOUNT,
                18,
                10000
              )
            ) + " UTG";
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
