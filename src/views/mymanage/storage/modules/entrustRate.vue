<template>
  <div>
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body">
          <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
            {{ $t(title) }}
          </h4>

          <el-form
            v-loading="loading"
            ref="rentalForm"
            :rules="rules"
            :model="form"
            label-width="auto"
            style="max-width: 520px; margin: 0px auto; text-align: left"
            @submit.native.prevent="onSubmit"
          >
            <el-form-item :label="$t('storagemining.miner')">
              {{ nodeData.deviceAddr }}
            </el-form-item>

            <el-form-item :label="$t('storageNode.SNRewardRatio')">
              {{ `${nodeData.entrustRate || 0} %` }}
            </el-form-item>

            <el-form-item :label="`${$t('storagePool.amountPledged')}(%)`" prop="pledgeNum">
              <el-slider
                v-model="form.newEntrustRate"
                :step="1"
                :min="0"
                :max="100"
                show-input
                class="phone_form_input"
                :tooltip="false"
              />
            </el-form-item>

            <el-form-item style="text-align: center" label-width="0px">
              <el-button type="primary" @click="onSubmit">{{
                $t("storagePool.pledge")
              }}</el-button>
            </el-form-item>
          </el-form>
          <!-- :disabled="form.rent_time <= 0 || form.rent_space <= 0 || !form.rent_address|| this.form.utgamount <= 0" -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import { Decimal } from "decimal.js";
import utils from "@/utils/utils";
import webSdk from "@/utils/webSdk.js";
import FNumber from "@/components/modules/fNumberRe.vue";

export default {
  props: {
    title: {
      type: String,
      default: "storageNode.SNRewardRatio",
    },
    back: {
      type: String,
      default: "/mymanage/storageServicenode",
    },
  },
  components: {
    FNumber,
  },
  data() {
    let _this_ = this;
    return {
      loading: false,
      nodeAddr: "",
      nodeData: {},
      form: {
        newEntrustRate: 50,
      },
      rules: {
        newEntrustRate: [
          {
            validator: (rule, value, callback) => {
              if (value >= 0 && value <= 100) {
                callback();
              } else {
                callback(new Error(_this_.$t("0~100")));
              }
            },
          },
        ],
      },
    };
  },

  created() {
    this.nodeAddr = this.$route.params.id;
    this.loadNode();
  },
  mounted() {},
  activated() {},
  methods: {
    onSubmit() {
      this.$refs.rentalForm.validate((valid) => {
        if (valid) {
          this.stwtreward();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    stwtreward(row) {
      let _this_ = this;
      let reObj = utils.walletSelect({
        _this_,
        addr: _this_.nodeData.managerAddr,
      });
      if (!reObj) return;
      let { sdk } = reObj;

      let setData = {
        title: `storageNode.trustpledge`,
        context: `${_this_.$t('storagemining.miner')}: ${_this_.nodeData.deviceAddr}<br/>${_this_.form.newEntrustRate} %`,
        request: null,
        closebtnshow: false,
        success() {},
        closewin(type) {
          if (type == 2) {
            _this_.$router.push(_this_.back);
          }
        },
        err() {
          _this_.$message.error("failed");
        },
      };

      let request = sdk.sendTransactionTo(
        webSdk.typeJson.stwtreward,
        {
          addr1: this.nodeData.deviceAddr,
          ratio: this.form.newEntrustRate * 100,
        },
        setData
      );
      setData.request = request;
      this.$store.dispatch("setNotification", setData);
    },
    loadNode() {
      if (utils.isEmpty(this.nodeAddr)) return;
      this.loading = true;
      let param = {
        device_addr: this.nodeAddr,
      };

      api
        .post("/platform/getStorageSpaceInfo", param)
        .then((response) => {
          this.loading = false;
          let result = response.result || {};

          this.nodeData = result;
          this.form.newEntrustRate = this.nodeData.entrustRate;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    getAddrFormat(val, num = 8) {
      if (utils.isMobile()) {
        return helper.getAddrFormat(val, num);
      }
      return val;
    },
  },
  computed: {
    maxPledgeNum() {
      return parseInt(
        utils.uumbersHandle([this.pledgeAmount, this.havAmount], ["-"], 0)
      );
    },
    havAmount() {
      return helper.getDataFormat(this.nodeData.havAmount, 18, 10000);
    },
    pledgeAmount() {
      return helper.getDataFormat(this.nodeData.pledgeAmount, 18, 10000);
    },
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
</style>
