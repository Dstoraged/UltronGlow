<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <div class="row" style="padding: 6px; text-align: left">
          <div class="col-md-4">
            <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
              {{$t('storagePool.createSP')}}
            </h4>
          </div>
        </div>

        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="auto"
          class="center-form max-width-10"
          @submit.native.prevent="submitForm"
        >
          <el-form-item :label="$t('storagePool.storagespaceprice')">
            {{ "1.25 UTG / TB" }}
          </el-form-item>
          <el-form-item :label="$t('storagePool.amountPledged')" prop="pledge">
            <f-number-re
              min="625"
              max="100000000000"
              step="0.01"
              v-model="ruleForm.pledge"
              re-val-type="number"
              units=" UTG"
              :control-step="100"
              :control="true"
            />
         <label style="font-weight: 400">{{ $t("storagePool.addMesg") }}</label>
           <!-- <el-slider
              v-model="ruleForm.pledge"
              :step="1.25"
              :min="625"
              :tooltip="false"
              :show-tooltip="false"
              :max="1000000"
            />-->

          </el-form-item>
          <el-form-item :label="$t('storagePool.SPCommission')" prop="rates">
            <f-number-re
              min="0"
              max="100"
              step="1"
              v-model="ruleForm.rates"
              re-val-type="number"
              style="max-width: 180px"
              units="%"
              :control-step="10"
              :control="true"
            />
            <label style="font-weight: 400"
              >&nbsp;{{$t("storagePool.ratesMessage") }}</label
            >
            <el-slider
              v-model="ruleForm.rates"
              :step="1"
              :min="0"
              :tooltip="false"
              :show-tooltip="false"
              :max="100"
              v-if="false"
            />
          </el-form-item>
          <el-form-item :label="$t('storagePool.SPRewardRatio')" prop="ratio">
            <f-number-re
              min="0"
              max="100"
              step="1"
              v-model="ruleForm.ratio"
              re-val-type="number"
              style="max-width: 180px"
              :control-step="10"
              :control="true"
              units="%"
            />
            <label style="font-weight: 400"
              >&nbsp; {{ $t("storagePool.ratioMessage") }}</label
            >

            <el-slider
              v-model="ruleForm.ratio"
              :step="1"
              :min="0"
              :tooltip="false"
              :show-tooltip="false"
              :max="100"
              :control="true"
              v-if="false"
            />
          </el-form-item>

          <el-form-item :label="$t('storagePool.maxStorage')"> {{ upperLimit }}TB </el-form-item>
          <el-form-item :label="$t('storagePool.estimatedFactor')">{{ coefficient }} </el-form-item>
          <el-form-item :label="$t('storagePool.revenuesaddress')" prop="revenue_address">
            <el-input
              show-word-limit
              type="textarea"
              v-model.trim="ruleForm.revenue_address"
              autocomplete="true"
              :autosize="{ minRows: 3, maxRows: 6 }"
            ></el-input>
          </el-form-item>
          <el-form-item class="text-center" label-width="0px">
            <el-button type="primary" @click="submitForm">{{$t("storagePool.create")}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { ethers } from "ethers";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import webSdk from "@/utils/webSdk.js";
import utils from "@/utils/utils";
import { setPageQuery } from "@/utils/table.js";
import fNumberRe from "@/components/modules/fNumberRe.vue";
export default {
  name: "StoragePledge",
  components: { fNumberRe },
  props: {},
  data() {
    let _this_ = this;

    return {
      ruleForm: {
        pledge: 625,
        rates: 0,
        ratio: 0,
        revenue_address: "",
      },
      rules: {
        pledge: [
          { required: true, message:_this_.$t("messages.required") },
          { type: "number", message:_this_.$t("storagerental.inputeinfo") },
          {
            validator: (rule, value, callback) => {
              if (value < 625) {
                return callback(new Error(`>=625`));
              }
              callback();
            },
          },
        ],
        ratio: [
          { required: true, message: _this_.$t("messages.required") },
          { type: "number", message: _this_.$t("storagerental.inputeinfo")},
        ],
        rates: [
          { required: true, message:_this_.$t("messages.required")},
          { type: "number", message: _this_.$t("storagerental.inputeinfo")},
        ],
        revenue_address: [
          {
            validator: (rule, value, callback) => {
              let valueL = "";
              if (utils.isEmpty(value)) {
                return callback();
              }

              try {
                value = webSdk.sdkUtils.hashToUX(value, true);
                valueL = ethers.utils.getAddress(value);
              } catch (error) {}
              if (valueL) {
                callback();
              } else {
                callback(new Error(_this_.$t("messages.pleaseaddress")));
              }
            },
            trigger: "change",
          },
        ],
      },
    };
  },

  methods: {
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let sdk = this.$store.getters.getsdk || null;
          if (sdk) {
            let _this_ = this;
            let setData = {
              title:_this_.$t("storagePool.createSP") ,
              // context: ` `,
              request: null,
              closebtnshow: false,
              closewin(type) {
                if (type == 2) {
                  _this_.$router.push("/storagePools");
                }
              },
              success() {
                /*_this_.$notify({
                    title: _this_.$t("loadingSubPan.finish"),
                    message: _this_.$t("messages.rentgok"),
                    type: "success",
                  });*/
              },
              err() {
                _this_.$message.error("failed");
              },
            };

            let typeJson = webSdk.typeJson.addsp;
            if (utils.isEmpty(_this_.ruleForm.revenue_address)) {
              typeJson = webSdk.typeJson.addspt;
            }

            let request = sdk.sendTransactionTo(
              typeJson,
              {
                bigNum: _this_.ruleForm.pledge,
                rates: _this_.ruleForm.rates,
                ratio: _this_.ruleForm.ratio,
                addr1: _this_.ruleForm.revenue_address,
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
    numUtg(val) {
      if (utils.isEmpty(val)) return "";

      return `${val} UTG`;
    },
    bytesToSize(val) {
      return utils.bytesToSize(val || 0);
    },
    formatTime(time) {
      return helper.formatTimimg(time);
    },
    getAddrFormat(data, number) {
      return helper.getAddrFormat(data, number);
    },
    goToUrl(name, params) {
      console.log("params=" + params);
      helper.goPathUrl(this, name, params);
    },
  },
  computed: {
    upperLimit() {
      if(this.ruleForm.pledge){
        return utils.uumbersHandle([this.ruleForm.pledge,1.25],["/"],8)
      }
    return 0
    },
    coefficient() {
      if(this.ruleForm.pledge){
        return utils.uumbersHandle([this.ruleForm.pledge,625,0.83],["/","*"],8)
      }
     return 0
    },
  },
};
</script>
<style lang="scss" scoped></style>
