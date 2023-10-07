<template>
<div>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <div class="row" style="padding: 6px; text-align: left">
          <div class="col-md-4">
            <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
              {{$t("storagePool.setRate")}}
            </h4>
          </div>
        </div>

        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="auto"
          class="center-form max-width-10"
          v-loading="loading"
          @submit.native.prevent="submitForm"
        >
          <el-form-item :label="$t('storagePool.storagePoolAddress')">
            {{ datas.hash }}
          </el-form-item>
         
          

          <el-form-item :label="$t('storagePool.SPCommission')" prop="rates">
            <f-number-re
              min="0"
              max="100"
              step="1"
              v-model="ruleForm.rates"
              re-val-type="number"
              style="max-width: 180px"
              :control="true"
              :control-step="10"
              units="%"
            />
            <label style="font-weight: 400"
              >&nbsp;{{$t("storagePool.ratesMessage")  }}</label
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
          <el-form-item class="text-center" label-width="0px">
            <el-button type="primary" @click="submitForm">{{$t("comm.confirmButtonText")}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <div class="row" style="padding: 6px; text-align: left">
          <div class="col-md-4">
            <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
              {{$t('storagePool.rateSettingRecord')}}
            </h4>
          </div>
        </div>
        <txns-records  :address="$store.getters.account" 
        :label="$t('storagePool.rate')"
        tx-type="spfee"
        />
      </div>
    </div>
  </div>
</div>
</template>
<script>
import { Message } from "element-ui";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import webSdk from "@/utils/webSdk.js";
import utils from "@/utils/utils";
import txnsRecords from "./modules/txnsRecords.vue";
import fNumberRe from "@/components/modules/fNumberRe.vue";
export default {
  name: "StoragePledge",
  components: { fNumberRe, txnsRecords },
  props: {},
  data() {
    let _this_ = this;

    return {
      loading: false,
      ruleForm: {
        rates: 0,
      },
      rules: {
        rates: [
          { required: true, message: _this_.$t("messages.required") },
          { type: "number", message: _this_.$t("storagerental.inputeinfo")},
        ],
      },
      datas: {},
    };
  },
  created() {
    this.address = this.$route.params.id;
    this.loadData();
  },
  methods: {
    loadData() {
      this.loading = true;
      if (!this.address) return;
      api
        .postJson(`/spPool/getStoragePoolInfo/${this.address}`, {})
        .then((response) => {
          this.loading = false;
          this.datas = response.result || {};
          this.ruleForm.rates = this.datas.feeRate < 0 ? 0 : this.datas.feeRate;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    submitForm(formName) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let reObj = utils.walletSelect({
            _this_: this,
            addr: this.datas.managerAddr,
          });

          if (reObj) {
            let { sdk } = reObj;
            let _this_ = this;
            let setData = {
              title: `${_this_.$t('storagePool.setRate')}`,
              context: ` ${_this_.$t('storagePool.storagePoolAddress')}: ${_this_.getAddrFormat(
                _this_.datas.hash
              )}<br/>${_this_.$t('storagePool.rate')}：${this.ruleForm.rates} %`,
              request: null,
              closebtnshow: false,
              closewin(type) {
                if (type == 2) {
                  _this_.$router.push("/mymanage/storagePool");
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

            let request = sdk.sendTransactionTo(
              webSdk.typeJson.spfee,
              {
                hash: _this_.datas.hash,
                ratio: this.ruleForm.rates,
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
      return `${utils.clearZero(val)} UTG`;
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
    awaitNum() {
      return Number(
        utils.uumbersHandle(
          [
            utils.clearZero(this.datas.pledgeAmount || 0),
            utils.clearZero(this.datas.havAmount || 0),
          ],
          ["-"],
          0
        )
      );
    },
  },
};
</script>
<style lang="scss" scoped></style>
