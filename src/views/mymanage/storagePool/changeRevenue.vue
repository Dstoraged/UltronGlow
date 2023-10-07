<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
          {{ btnText}}
        </h4>

        <el-form
          v-loading="loading"
          label-position="left"
          label-width="auto"
          style="max-width: 520px; margin: 0px auto; text-align: left"
          :model="form.data"
          :rules="form.rules"
          ref="ie_form"
          @submit.native.prevent="submitForm"
        >
          <el-form-item size="mini" :label="$t('storagePool.storagePoolAddress')">
            {{ pledgeData.hash }}
          </el-form-item>
          <el-form-item size="mini" v-if="isUp" :label="originalLabel">
            {{ originalAddress }}
            <el-button @click="unbind" type="text" style="color: red"
              >{{$t("messages.bindinglift")}}</el-button
            >
          </el-form-item>

          <el-form-item prop="new_revenueAddr" :label="newLabel" size="mini">
            <el-input
              show-word-limit
              type="textarea"
              v-model.trim="form.data.new_revenueAddr"
              autocomplete="true"
              :autosize="{ minRows: 3, maxRows: 6 }"
            ></el-input>
          </el-form-item>

          <div class="foot-btn" style="text-align: center">
            <el-button type="primary" @click="submitForm">
              {{ btnText}}
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import FNumber from "@/components/modules/fNumberRe.vue";
import webSdk from "@/utils/webSdk";
import utils from "@/utils/utils";
import * as api from "@/api/api";

import { ethers } from "ethers";
export default {
  components: { FNumber },

  data() {
    let _this_ = this;
    return {
      loading: false,
      nodeAddr: "",
      pledgeData: {},

      form: {
        data: {
          new_revenueAddr: "",
        },
        rules: {
          new_revenueAddr: [
            {
              validator: (rule, value, callback) => {
                if (utils.isEmpty(value)) {
                  return callback(
                    new Error(_this_.$t("messages.pleaseaddress"))
                  );
                }
                let valL = "";
                try {
                  valL = ethers.utils.getAddress(
                    webSdk.sdkUtils.hashToUX(value, true)
                  );
                } catch (error) {}

                if (utils.isEmpty(valL)) {
                  return callback(
                    new Error(_this_.$t("messages.pleaseaddress"))
                  );
                }

                callback();
              },
              trigger: "change",
            },
          ],
        },
      },
    };
  },
  created() {
    this.nodeAddr = this.$route.params.id;
    this.loadPledge();
  },
  activated() {
    this.loadPledge();
  },

  methods: {
    loadPledge(addr) {
      this.loading = true;
      addr = addr || this.nodeAddr;
      if (!addr) {
        return;
      }

      api
        .post(`/spPool/getStoragePoolInfo/${addr}`)
        .then((re) => {
          let reObj = re.result || {};
          this.pledgeData = reObj;
          this.loading = false;
        })
        .catch((err) => {
          console.log("error", err);
        });
    },
    walletSelect() {
      return utils.walletSelect({
        _this_: this,
        addr: this.pledgeData.managerAddr,
      });
    },
    getAddrFormat(val, num = 9) {
      if (utils.isMobile()) {
        return helper.getAddrFormat(val, num);
      }
      return val;
    },
    onOkBtn() {
      this.$router.push("/mymanage/storagePool");
    },
    submitForm() {
      this.$refs["ie_form"].validate((valid) => {
        if (valid) {
          let reObj = this.walletSelect();
          if (!reObj) return;
          let { sdk } = reObj;

          let title = "storagePool.bindingRewardAddress";
          let context = "";
          let hash = this.pledgeData.hash;
          let newRevenueAddr = webSdk.sdkUtils.hashToUX(
            this.form.data.new_revenueAddr,
            true
          );
          let type = "sprvebind";
          if (this.isUp) {
            title = "storagePool.rewardTransfer";
            context = `${this.$t("storagePool.newRewardAddress")} :${this.getAddrFormat(newRevenueAddr)}`;
          }
          newRevenueAddr = newRevenueAddr.toLocaleLowerCase();

          let json = {
            title,
            hash,
            newRevenueAddr,
            context,
            type,
            typeData: "bind",
            sdk,
          };
          this.onAction(json, () => {
            this.onOkBtn();
          });
        }
      });
    },
    unbind() {
      let reObj = this.walletSelect();
      if (!reObj) return;
      let { sdk } = reObj;

      let json = {
        title: "messages.bindinglift",
        hash: this.pledgeData.hash,
        context: "",
        type: "sprveunbind",
        typeData: "unbind",
        sdk,
      };
      this.onAction(json, () => {
        this.onOkBtn();
      });
    },

    onAction(json, fun) {
      let sdk = json.sdk;
      let titleL = this.$t(json.title);

      let setData = {
        title: `${titleL}`,
        context: json.context,
        request: null,
        closebtnshow: false,
        closewin(type) {
          if (type == 2) {
            fun();
          }
        },
      };
      let request = sdk.sendTransactionTo(
        webSdk.typeJson[json.type],
        {
          addr1: json.newRevenueAddr,
          type: json.typeData,
          hash: json.hash,
        },
        setData
      );
      setData.request = request;

      this.$store.dispatch("setNotification", setData);
    },
  },
  computed: {
    originalAddress() {
      return this.pledgeData.revenueAddr;
    },
    btnText() {
      return this.isUp ?this.$t("storagePool.rewardTransfer")  : this.$t("storagePool.bindingRewardAddress");
    },
    originalLabel() {
      return this.isUp ? this.$t("storagePool.originalRewardAddress") :this.$t("storagePool.bindingRewardAddress") ;
    },
    newLabel() {
      return this.isUp ? this.$t("storagePool.newRewardAddress") :this.$t("storagePool.revenuesaddress") ;
    },
    isUp() {
      return !!this.pledgeData.revenueAddr;
    },
  },
};
</script>
<style >
.el-button--primary {
  background-color: #23cbe0;
  border: 1px solid #23cbe0;
}
.ie_pledge_div .el-form-item {
  border-bottom: 1px solid #eee;
}
</style>