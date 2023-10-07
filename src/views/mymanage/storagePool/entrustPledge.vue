<template>
  <div>
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body">
          <div class="row" style="padding: 6px; text-align: left">
            <div class="col-md-4">
              <h4
                class="mt-0 header-title"
                style="width: 100%; text-align: left"
              >
                {{$t("Transactions.spwtpg")}}
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
            <el-form-item :label="$t('storagePool.SPRewardRatio')">
              {{ `${datas.entrustRate || 0} %` }}
            </el-form-item>

            <el-form-item :label="$t('storagePool.amountPledged')" prop="amount">
              <f-number-re
                min="1"
                step="1"
                v-model="ruleForm.amount"
                re-val-type="string"
                units=" UTG"
                control
                controlStep="10"
              />
              <span style="color: #888; font-size: 13px">{{$t("storagePool.pledgeMessage2")}}</span>
            </el-form-item>
            <el-form-item class="text-center" label-width="0px">
              <el-button type="primary" @click="submitForm">{{$t("storagePool.pledge")}}</el-button>
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
              <h4
                class="mt-0 header-title"
                style="width: 100%; text-align: left"
              >
                {{$t("storagePool.entrustingPledgeRecords")}}
              </h4>
            </div>
          </div>

          <pledge-rewards
            :address="address"
            :pledge_address="$store.getters.account"
            :show-search="false"
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
import { setPageQuery } from "@/utils/table.js";
import fNumberRe from "@/components/modules/fNumberRe.vue";
import pledgeRewards from "./modules/pledgeRewardsList.vue";
export default {
  name: "StoragePledge",
  components: { fNumberRe, pledgeRewards },
  props: {},
  data() {
    let _this_ = this;

    return {
      loading: false,
      ruleForm: {
        amount: "1",
      },
      rules: {
        amount: [
          { message: _this_.$t("messages.required"), required: true },
          {
            validator: (rule, value, callback) => {
              if (value <= 0) {
                callback(new Error(">=1"));
              } else {
                callback();
              }
            },
          },
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
        })
        .catch((error) => {
          console.error(error);
        });
    },
    submitForm(formName) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          let selectAddr = this.$store.getters.account || "";
          api
            .postJson("/platform/isEntrustPledge", {
              pledge_address: selectAddr,
              node_address: this.datas.hash,
            })
            .then(({ result = {} }) => {
              this.btnLoading = false;
              if (!!result.isPledge) {
                this.toChain();
              } else {
                this.$message({
                  message: this.$t(`storagePool.pledgeMessage`),
                  type: "error",
                });
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    toChain(sdk) {
      sdk = sdk || this.$store.getters.getsdk;
      if (sdk) {
        let _this_ = this;
        let setData = {
          title: `${_this_.$t("storageNode.trustpledge")}`,
          context: ` ${_this_.$t(
            "storagePool.storagePoolAddress"
          )}: ${_this_.getAddrFormat(_this_.datas.hash)}`,
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

        let request = sdk.sendTransactionTo(
          webSdk.typeJson.spwtpg,
          {
            hash: _this_.datas.hash,
            bigNum: this.ruleForm.amount,
          },
          setData
        );
        setData.request = request;
        this.$store.dispatch("setNotification", setData);
      }
    },
    numUtg(val) {
      if (utils.isEmpty(val)) return "";
      return `${utils.clearZero(val)} UTG`;
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
    awaitNum() {
      return Number(
        utils.uumbersHandle(
          [
            utils.clearZero(this.datas.totalNum || 0),
            utils.clearZero(this.datas.totalAmount || 0),
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
