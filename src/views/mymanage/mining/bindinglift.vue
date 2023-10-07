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
            label-width="150px"
            style="max-width: 500px; margin: 0px auto; text-align: left"
          >
            <el-form-item :label="$t('mymanageMining.mineraddr')">{{
              from.miner_addr
            }}</el-form-item>
            <el-form-item :label="$t('mymanageMining.revenuesaddress')">{{
              from.revenue_address
            }}</el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="onSubmit"
                v-loading="loading"
                :disabled="loading || !from.isok"
                >{{ $t("messages.unbinding") }}</el-button
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
import webSdk from "@/utils/webSdk.js";
import { ethers } from "ethers";
import * as api from "@/api/api";

export default {
  props: {
    title: {
      type: String,
      default: "messages.bindinglift",
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
    };
  },
  created() {
    this.from.miner_addr = this.$route.params.id;
    if (!this.from.miner_addr) {
      return;
    }
    this.loadData();
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
      let minerAddr = this.from.miner_addr;

      let setData = {
        title: `${this.$t(this.title)}`,
        context: `${this.$t("mymanageMining.mineraddr")}:${minerAddr}`,
        request: null,
        closebtnshow: false,
        success(response) {
          fun(response);
        },
      };
      let request = sdk.sendTransactionTo(
        webSdk.typeJson.unbind,
        {
          addr1: minerAddr,
          type: 1,
        },
        setData
      );

      setData.request = request;

      this.$store.dispatch("setNotification", setData);
    },
    toPoolOk() {
      this.$store.dispatch("setWinStatus", false);
      let message = `${this.$t("loadingSubPan.finish")}`;
      let title = this.$t(this.title);
      this.$notify({
        title,
        message,
        type: "success",
      });

      this.goTheUrl("MymanageMining");
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        }
        let sdk = this.$store.getters.getsdk || null;
        let waddress = "";
        let revenue_address = "";
        try {
          revenue_address = webSdk.sdkUtils.getAddress(
            this.from.revenue_address
          );
          waddress = webSdk.sdkUtils.getAddress(this.$store.getters.account);
        } catch (error) {}
        if (revenue_address != waddress) {
          this.$message.error(`${this.$t("mymanageMining.pleasetoyaddr")}`);
          return;
        }
        this.toData(sdk, () => {
          this.toPoolOk();
        });
      });
    },
    loadData() {
      this.loading = true;
      let tabledata = {
        miner_addr: this.from.miner_addr,
      };
      api
        .postJson("/platform/my/getminerdetail", tabledata)
        .then((response) => {
          let item = response.result || {};
          let miner_addr = item.miner_addr;
          let revenue_address = item.revenue_address;
          if (miner_addr) {
            this.from = {
              miner_addr,
              revenue_address,
              isok: true,
            };
          } else {
            this.from = {
              miner_addr: "",
              revenue_address: "",
              isok: false,
            };
          }

          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
  },
};
</script>
