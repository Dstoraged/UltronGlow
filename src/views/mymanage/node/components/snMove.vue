<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <div class="row" style="padding: 6px; text-align: left">
          <div class="col-md-4">
            <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
              {{ pledge_type }}{{ $t("nodeMove.transfer") }}
            </h4>
          </div>
        </div>

        <el-form
          v-if="isChange"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="auto"
          class="center-form max-width-10"
          v-loading="loading"
        >
          <el-form-item :label="$t('nodeMove.delegationType')">
            {{ pledge_type }}{{ $t("nodeMove.delegation") }}
          </el-form-item>
          <el-form-item :label="$t('nodeMove.theCurrentNode')">
            {{ datas.node_address }}
          </el-form-item>
          <el-form-item :label="$t('nodeMove.distributionRatio')">
           {{EntrustRate}}
          </el-form-item>
          <el-form-item :label="$t('nodeMove.transferablePledge')">
            {{ clearZero(datas.pledge_amount) }}
          </el-form-item>

          <el-form-item :label="$t('nodeMove.goalNode')" prop="newAddr">
            {{ ruleForm.newAddr }}
            <el-button v-if="isChange" type="text" @click="selectWin = true">{{
              $t("nodeMove.select")
            }}</el-button>
          </el-form-item>
          <f-table-cels v-if="selectItem"
          :notHeards="['deviceAddr']"
          :heards="selectheard" :data-item="selectItem"></f-table-cels>
          <!--<template v-if="selectItem">
            <el-form-item :label="$t('nodeMove.nodeRewardRatio')">
              {{ `${selectItem.entrustRate || 0} %` }}
            </el-form-item>
          </template>-->

          <el-form-item class="text-center" label-width="0px">
            <el-button type="primary" @click="submitForm">{{
              $t("nodeMove.transfer")
            }}</el-button>
          </el-form-item>
        </el-form>
        <span v-else style="color: orange">{{ $t("nodeMove.message2") }}</span>
      </div>
    </div>
    <select-node
      :now-addr="datas.node_address"
      v-model="selectWin"
      v-if="selectWin"
      @onSub="onSelect"
    ></select-node>
  </div>
</template>
<script>
import { Message } from "element-ui";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import webSdk from "@/utils/webSdk.js";
import utils from "@/utils/utils";
import selectNode from "./selectSnNode.vue";
import { ethers } from "ethers";
import fTableCels from "@/components/modules/fTableCels.vue";

export default {
  name: "snMove",
  components: { selectNode,fTableCels },

  data() {
    let _this_ = this;

    return {
      loading: false,
      loadingPledge: false,
      nodeAddr: "",
      pledge_type: "SN",
      selectWin: false,
      selectItem: null,
      selectheard:null,
      isChange: false,
      ruleForm: {
        newAddr: "",
      },
      rules: {
        newAddr: [{ message: _this_.$t("comm.selected"), required: true }],
      },
      datas: {},

      toTypes: {
        SP: "spwtfd",
        SN: "wtfd",
        PoS: "PoSwtfd",
      },
    };
  },
  created() {
    this.nodeAddr = this.$route.params.id || "";
    this.loadData();
  },
  methods: {
    clearZero(val = 0) {
      return `${utils.clearZero(val)} UTG`;
    },
    bytesToSize(val) {
      return utils.bytesToSize(val);
    },
    loadData() {
      this.loading = true;

      api
        .postJson(`/platform/getPledgeByPledgeAddr`, {
          pledge_address: this.nodeAddr || "",
          isEt: 1,
        })
        .then((response) => {
          this.datas = response.result || {};
          this.loadPledges();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    loadPledges() {
      this.isChange = !!this.datas.node_address;
      this.loading = false;
      /*  if (utils.isEmpty(this.datas.pledgeAddr)) {
        this.loading = false;
        return (this.isChange = false);
      }

      api
        .postJson(`/platform/isPledgeTransfer`, {
          pledge_address: this.datas.pledgeAddr,
        })
        .then((re) => {
          this.loading = false;
          let result = re.result || {};
          this.isChange = !!result.isTransfer;
        })
        .catch((err) => {
          console.error(err);
        });*/
    },
    submitForm(formName) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (
            utils.walletSelect({
              _this_: this,
              addr: this.datas.managerAddr,
              isMsg: false,
            })
          ) {
            return this.$notify.warn(_this_.$t(""));
          }

          let reObj = utils.walletSelect({
            _this_: this,
            addr: this.datas.pledge_address,
            msg: "nodeMove.message",
          });
          if (!reObj) return;

          let { sdk } = reObj; //this.$store.getters.getsdk || null;
          if (sdk) {
            let _this_ = this;
            let setData = {
              title: `${this.pledge_type} ${_this_.$t(
                "nodeMove.completeTransaction"
              )}`,

              request: null,
              closebtnshow: false,
              closewin(type) {
                if (type == 2) {
                  _this_.goToUrl("mymanage/delegatemanage", "");
                }
              },
              success() {
                _this_.$notify({
                  title: _this_.$t("loadingSubPan.finish"),
                  message: _this_.$t("nodeMove.completeTransaction"),
                  type: "success",
                });
              },
              err() {
                _this_.$message.error("failed");
              },
            };

            let request = sdk.sendTransactionTo(
              webSdk.typeJson[_this_.toTypes[_this_.datas.node_type]],
              {
                type: _this_.pledge_type, //_this_.datas.node_type,
                addr1: _this_.datas.node_address,
                addr2: _this_.ruleForm.newAddr,
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
      helper.goPathUrl(this, name, params);
    },
    onSelect(item,heards) {
      this.ruleForm.newAddr = item.deviceAddr;
      this.selectheard = heards
      this.selectItem = item;
      this.$refs.ruleForm.validate();
      this.selectWin = false;
    },
  },
  computed:{
    EntrustRate() {
      let val = this.datas.entrustRate || 0;

      if (val == 0) {
        return "0 %";
      }
      if (this.datas.node_type == "PoS") {
        return `${(val / 100).toFixed(2)} %`;
      }
      return `${val} %`;
    },
  }
};
</script>
<style lang="scss" scoped>
.center-form {
  width: 500px;
  min-width: 300px;
}
</style>
