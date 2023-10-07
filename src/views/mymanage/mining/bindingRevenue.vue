<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <h4 class="mt-0 header-title" style="text-align: left">
          {{ $t(title) }}
        </h4>
        <div style="width: 100%; text-align: center; padding-bottom: 20px">
          <el-form
            :model="from"
            ref="form"
            label-width="auto"
            style="max-width: 500px; margin: 0px auto; text-align: left"
          >
            <el-form-item :label="$t('mymanageMining.mineraddr')">{{
              from.miner_addr
            }}</el-form-item>

            <el-form-item :label="$t('mymanageMining.revenuesaddress')">
              <template slot="label">
                {{ $t("mymanageMining.revenuesaddress") }}
                <el-tooltip
                  class="item"
                  :content="$t('messages.upwallet')"
                  placement="top-start"
                >
                  <i class="el-icon-warning" style="color: orange"></i>
                </el-tooltip>
              </template>
              {{ $store.getters.accounty }}
              <!-- <el-input v-model="form.data2.earnings"> </el-input>-->
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                @click="onSubmit"
                v-loading="loading"
                :disabled="loading || !from.isok"
                >{{ $t("messages.binding") }}</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as helper from "@/utils/helper";
import utils from "@/utils/utils";
import webSdk from "@/utils/webSdk.js";
import { ethers } from "ethers";
import * as api from "@/api/api";
export default {
  props: {
    title: {
      type: String,
      default: "binding.bindaddr",
    },
  },
  data() {
    let _this_ = this;
    return {
      loading: false,
      from: {
        miner_addr: "",
        revenue_address: "",
        isok: false,
      },
      rules: [
        {
          validator: (rule, value, callback) => {
            if (utils.isEmpty(value)) {
              callback(new Error(_this_.$t("messages.pleaseaddress")));
              return;
            }
            let valL = "";
            try {
              valL = ethers.utils.getAddress(value);
            } catch (error) {}
            if (valL) {
              callback();
            } else {
              callback(new Error(_this_.$t("messages.pleaseaddress")));
            }
          },
          trigger: "change",
        },
      ],
    };
  },
  created() {
    this.from.miner_addr = this.$route.params.id;
    if (!this.from.miner_addr) {
      return;
    }
    this.from.isok = true;
  },
  methods: {
    goTheUrl(name) {
      helper.goTheUrl(this, name);
    },
    getAddrFormat(addr, num = 10) {
      return helper.getAddrFormat(addr, num);
    },
    onCopy() {
      this.$message({
        showClose: true,
        type: "success",
        message: this.$t("utilsmsg.copyok"),
      });
    },

    toData(sdk, fun) {
      let contractAddr = "ux0000000000000000000000000000000000000000";
      let signaddr = "ux0000000000000000000000000000000000000000";
      let nodeAdd = this.from.miner_addr;
      let revenueAddr = this.$store.getters.accounty;
      try {
        revenueAddr = ethers.utils.getAddress(revenueAddr);
      } catch (error) {}
      let setData = {
        title: `${this.$t(this.title)}`,
        context: `${this.$t(
          "mymanageMining.mineraddr"
        )}:${nodeAdd}<br/>${this.$t("mymanageMining.revenuesaddress")}:${
          this.$store.getters.accounty
        }`,
        request: null,
        closebtnshow: false,
        success(response) {
          fun(response);
        },
      };
      let request = null;

      request = sdk.sendTransactionTo(
        webSdk.typeJson.Bind,
        {
          addr1: nodeAdd,
          type: 1,
          contractAddr,
          signaddr,
          revenueAddr,
        },
        setData
      );

      setData.request = request;

      this.$store.dispatch("setNotification", setData);
    },

    toPoolOk() {
      this.$store.dispatch("setWinStatus", false);
      let message = `${this.$t("coins.success")}`;
      let title = this.$t(this.title);

      this.$notify({
        title,
        message,
        type: "success",
      });

      this.toMining();
    },
    toMining() {
      helper.goUrl(this, "MymanageMining", "");
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        }
        let sdk = this.$store.getters.getsdk || null;
        this.toData(sdk, () => {
          this.toPoolOk();
        });
      });
    },
  },
};
</script>
