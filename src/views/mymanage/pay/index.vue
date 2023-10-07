<template>
  <div>
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body">
          <h4 class="mt-0 header-title" style="text-align: left"></h4>
          <div style="width: 100%; text-align: center; padding: 20px">
            <el-form
              ref="form"
              :rules="rules"
              :model="form"
              label-width="auto"
              style="max-width: 500px; margin: 0px auto"
              @submit.native.prevent
            >
              <el-form-item
                :label="$t('mymanage.address')"
                required
                prop="address"
                class="phone_form_input"
              >
                <el-input v-model="form.address" />
              </el-form-item>

              <el-form-item
                :label="$t('mymanage.pay')"
                prop="ful"
                class="phone_form_input"
              >
                <f-number
                  :min="'0.000001'"
                  :max="'999999999999999999'"
                  v-model="form.ful"
                  step="0.000001"
                  units="SRT"
                />
              </el-form-item>
              <el-form-item label="" label-width="0px">
                <div class="ie-form-item__label" style="text-align: left">
                  {{ $t("mymanage.estimate") }}{{ "：" }}{{ estimate }}
                  UTG
                </div>
              </el-form-item>
              <el-form-item label-width="0px">
                <el-button
                  type="primary"
                  v-loading="exchRate <= 0"
                  @click="onSubmit"
                  :disabled="form.ful <= 0"
                  >{{ $t("mymanage.pay") }}</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>

    <PayRecord :param="getParam" :up-load-time="20000" />
  </div>
</template>
<script>
import PayRecord from "./PayRecord.vue";
import fNumber from "@/components/modules/fNumberRe.vue";
import { Decimal } from "decimal.js";
import utils from "@/utils/utils";
import webSdk from "@/utils/webSdk.js";
import * as api from "@/api/api";
export default {
  name: "NodeDetail",
  components: {
    PayRecord,
    fNumber,
  },
  data() {
    let _this_ = this;
    return {
      form: {
        address: "",
        ful: "",
        utg: "",
      },
      utgamount: 0,
      rules: {
        address: [
          {
            validator: (rule, val, callback) => {
              if (utils.isEmpty(val)) {
                callback(new Error(_this_.$t("messages.pleaseaddress")));
                return;
              }
              let addL = "";
              try {
                addL = webSdk.sdkUtils.getAddress(val);
              } catch (error) {}
              if (addL) {
                callback();
              } else {
                callback(new Error(_this_.$t("messages.pleaseaddress")));
              }
            },
            trigger: "change",
          },
        ],
        ful: [
          {
            required: true,
            validator: (rule, val, callback) => {
              if (utils.isEmpty(_this_.form.ful)) {
                callback(new Error(_this_.$t("messages.required")));
              } else {
                callback();
              }
            },
            trigger: "change",
          },
        ],
      },
      exchRate: 0,
    };
  },
  created() {
    this.form.address = this.$store.getters.account;
    this.loadData();
  },
  activated() {
    this.loadData();
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let addr = this.form.address;
          let ful = new Decimal(this.form.ful || "0");
          let exchRate = new Decimal(this.exchRate || "0");
          let valL = ful.div(exchRate);
          let exful = this.form.ful
            ? this.exchRate > 0
              ? this.form.ful / this.exchRate
              : 0
            : 0;
          if (exful > this.utgamount) {
            this.$message.error(`${this.$t("messages.exchSRT")}`);
            return;
          }
          if (valL.isZero()) {
            return;
          }
          try {
            addr = webSdk.sdkUtils.getAddress(addr);
          } catch (error) {}

          let sdk = this.$store.getters.getsdk || null;

          if (sdk) {
            let _this_ = this;
            let setData = {
              title: `${this.$t("mymanage.pay")}`,

              context: `${valL.toFixed()} UTG => ${ful.toFixed()} SRT<br/>${
                this.form.address
              }<br/>`,
              request: null,
              success() {
                if (_this_.$refs.ftable) {
                  _this_.$refs.ftable.getAddrList();
                  _this_.loadData();
                }
              },
              err() {
                _this_.$message.error("failed");
              },
            };

            let request = sdk.sendTransactionTo(
              webSdk.typeJson.exch,
              {
                value: valL.toFixed(),
                addr1: addr,
              },
              setData
            );
            setData.request = request;
            this.$store.dispatch("setNotification", setData);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    loadData() {
      api
        .postJson("/platform/srt/getExchRate", { txType: "ExchRate" })
        .then((response) => {
          let exchRate = response.result || 0;
          this.exchRate = exchRate > 0 ? exchRate / 10000 : 0;
        })
        .catch((error) => {
          this.exchRate = 1.5;
          console.error(error);
        });

      let param = {
        revenue_address: this.$store.getters.account,
      };
      api
        .postJson("/platform/my/outLine", param)
        .then((response) => {
          let result = response.result || {};

          this.utgamount = utils.clearZero(result.balance || 0);
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  computed: {
    labelWidth() {
      return utils.isMobile() ? "" : "auto";
    },
    getParam() {
      let address = this.$store.getters.account;
      return { param1: address, txType: "Exch" };
    },
    estimate() {
      let num = this.form.ful
        ? this.exchRate > 0
          ? this.form.ful / this.exchRate
          : 0
        : 0;
      let re = "0";
      try {
        re = new Decimal(num || 0).toFixed();
        re = utils.weedZero(re, 18);
      } catch (error) {}
      return re;
    },
  },

  watch: {
    "$store.getters.account": function () {
      this.form.address = this.$store.getters.account;
      this.loadData();
    },
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
</style>
