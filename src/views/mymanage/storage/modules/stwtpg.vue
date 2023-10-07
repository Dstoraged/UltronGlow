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
            style="max-width: 700px; margin: 0px auto; text-align: left"
          >
            <el-form-item :label="$t('storageNode.pledge_total')">
              {{ `${havAmount || 0} / ${pledgeAmount || 0}` }}
            </el-form-item>

            <el-form-item :label="$t('storagemining.miner')">
              <el-popover
                placement="bottom"
                trigger="click"
                :content="nodeData.deviceAddr"
              >
                <span slot="reference">
                  {{ getAddrFormat(nodeData.deviceAddr) }}
                </span>
              </el-popover>
            </el-form-item>
            <el-form-item :label="$t('storageNode.adminAddress')">
              <el-popover
                placement="bottom"
                trigger="click"
                :content="nodeData.managerAddr"
              >
                <span slot="reference">
                  {{ getAddrFormat(nodeData.managerAddr) }}
                </span>
              </el-popover>
            </el-form-item>
            <el-form-item :label="$t('storageNode.SNRewardRatio')">
              {{ `${nodeData.entrustRate || 0} %` }}
            </el-form-item>
            <el-form-item :label="$t('storagePool.remainingPledges')">
              {{ `${maxPledgeNum || 0} UTG` }}
            </el-form-item>

            <el-form-item :label="$t('storagePool.amountPledged')" prop="pledgeNum">
              <el-slider
                :disabled="maxPledgeNum < 1 && false"
                v-model="form.pledgeNum"
                :step="1"
                :min="0"
                :max="maxPledgeNum"
                show-input
                class="phone_form_input"
                :tooltip="false"
              />
            </el-form-item>

            <el-form-item style="text-align: center" label-width="0px">
              <el-button
                :loading="btnLoading"
                type="primary"
                @click="onSubmit"
                >{{ $t("storagePool.pledge") }}</el-button
              >
            </el-form-item>
          </el-form>
          <!-- :disabled="form.rent_time <= 0 || form.rent_space <= 0 || !form.rent_address|| this.form.utgamount <= 0" -->
        </div>
      </div>
    </div>
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body">
          <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
            <span>{{ $t("storagePool.entrustingPledgeRecords") }}</span>
          </h4>
          <stwtpg-list :address="nodeData.deviceAddr" />
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
import stwtpgList from "./stwtpgList.vue";
export default {
  name: "stwtpg",
  props: {
    title: {
      type: String,
      default: "storageNode.trustpledge",
    },
    back: {
      type: String,
      default: "/storagenode",
    },
    isManage: {
      type: Boolean,
      default: false,
    },
    toType: {
      type: String,
      default: "stwtpg",
    },
  },
  components: {
    stwtpgList,
    FNumber,
  },
  data() {
    let _this_ = this;
    return {
      loading: false,
      btnLoading: false,
      nodeAddr: "",
      nodeData: {},
      form: {
        pledgeNum: 0,
      },
      rules: {
        pledgeNum: [
          {
            validator: (rule, value, callback) => {
              if (value >= 1) {
                callback();
              } else {
                callback(new Error(_this_.$t(">=1")));
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
          this.examine();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    walletSelect() {
      return utils.walletSelect({
        _this_: this,
        addr: this.nodeData.managerAddr,
      });
    },
    examine() {
      if (this.isManage) {
        let reObj = this.walletSelect();
        if (!reObj) return;
        this.toChain(reObj.sdk);
      } else {
        this.btnLoading = true;
        let selectAddr = this.$store.getters.account || "";
        api
          .postJson("/platform/isEntrustPledge", {
            pledge_address: selectAddr,
            node_address: this.nodeData.deviceAddr,
          })
          .then(({ result = {} }) => {
            this.btnLoading=false
            if (!!result.isPledge) {
              this.toChain();
            } else {
              this.$message({
                message: this.$t(`messages.notPledgeAddr`),
                type: "error",
              });
            }
          });
      }
    },
    toChain(sdk) {
      sdk = sdk || this.$store.getters.getsdk;
      if (!sdk) return;
      let _this_ = this;
      let setData = {
        title: `${this.$t(this.title)}`,
        context: `${_this_.$t('storagemining.miner')}: ${_this_.nodeData.deviceAddr}<br/>${_this_.$t('storagemining.pledgequantity')}:${_this_.form.pledgeNum} UTG`,
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
        webSdk.typeJson[this.toType],
        {
          addr1: this.nodeData.deviceAddr,
          bigNum: this.form.pledgeNum,
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
          this.form.pledgeNum = this.maxPledgeNum || 0;
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
