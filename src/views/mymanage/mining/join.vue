<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <h4 class="mt-0 header-title" style="text-align: left">
          {{ $t(title) }}
        </h4>
        <div style="width: 100%; text-align: center; padding: 20px">
          <div style="margin: 0px auto; max-width: 500px; text-align: left">
            <el-form
              :model="from"
              ref="ruleForm"
              label-width="200px"
              class="demo-ruleForm"
            >
              <el-form-item
                prop="miner_addr"
                :label="$t('mymanageMining.mineraddr')"
              >
                {{ from.miner_addr }}
              </el-form-item>
              <el-form-item
                prop="revenue_address"
                :label="$t('mymanageMining.revenuesaddress')"
              >
                {{ from.revenue_address }}
              </el-form-item>
              <el-form-item
                v-if="upAddr"
                :rules="rules"
                prop="neWaddress"
                required
                :label="$t('mymanageMining.newaddress')"
              >
                <el-input v-model="from.neWaddress" />
              </el-form-item>
              <el-form-item>
                <el-button
                  v-loading="loading"
                  :disabled="loading || !from.isok"
                  @click="onSubmit"
                  type="primary"
                  >{{
                    upAddr ? $t("messages.binding") : $t("mymanageMining.join")
                  }}</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as helper from "@/utils/helper";
import utils from "@/utils/utils";
import webSdk from "@/utils/webSdk.js";
import * as ajax from "@/api/api.js";
import { ethers } from "ethers";

export default {
  props: {
    title: {
      type: String,
      default: "mymanageMining.join",
    },
    upAddr: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    let _this_ = this;
    return {
      loading: false,
      from: {
        miner_addr: "",
        revenue_address: "",
        neWaddress: "",
        joinOk: false,
        isok: false,
      },
      rules: [
        { required: true, message: _this_.$t("messages.pleaseaddress") },
        {
          validator: (rule, value, callback) => {
            if (utils.isEmpty(value)) {
              callback(new Error(_this_.$t("messages.pleaseaddress")));
              return;
            }
            let valL = "";
            try {
              valL = webSdk.sdkUtils.getAddress(value);
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
    getRandom(fun) {
      let request = ajax.miningPostJson("/pool/getloginid");
      let setData = {
        title: `${this.$t("messages.randomnumber")}`,
        request,
        closebtnshow: false,
        success(response) {
          fun(response.data.random);
        },
      };
      this.$store.dispatch("setNotification", setData);
    },

    getSign(sdk, random, fun) {
      let devAdd = this.from.miner_addr;

      let setData = {
        title: `${this.$t("messages.signature")}`,
        request: null,
        closebtnshow: false,
        success(response) {
          fun(response);
        },
      };
      let request = sdk.toSignStr(random, devAdd, setData);
      setData.request = request;
      this.$store.dispatch("setNotification", setData);
    },
    getContract(random, jsons, fun) {
      let request = ajax.miningPostJson(
        "/pool/getmultaddr?random=" + random,
        jsons
      );
      let setData = {
        title: `${this.$t("messages.getcontract")}`,
        request,
        closebtnshow: false,
        success(response) {
          fun(response);
        },
      };
      this.$store.dispatch("setNotification", setData);
    },
    toData(sdk, contractAddr, signaddr, fun) {
      contractAddr =
        contractAddr || "UX0000000000000000000000000000000000000000";
      signaddr = signaddr || "UX0000000000000000000000000000000000000000";
      let devAdd = this.from.miner_addr;
      let revenueAddr = this.upAddr
        ? this.from.neWaddress
        : this.from.revenue_address;
      try {
        revenueAddr = webSdk.sdkUtils.getAddress(revenueAddr);
      } catch (error) {}
      let titleL = this.upAddr
        ? this.$t("messages.requestbinding")
        : this.$t("mymanageMining.join");
      let setData = {
        title: `${titleL}`,
        context: `${this.$t("mymanageMining.mineraddr")}:${devAdd}`,
        request: null,
        closebtnshow: false,
        success(response) {
          fun(response);
        },
      };
      let request = sdk.sendTransactionTo(
        webSdk.typeJson.rebind,
        {
          addr1: devAdd,
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
    toPool(sdk, contractAddr, multaddr, fun) {
      let revenueAddr = this.upAddr
        ? this.from.neWaddress
        : this.from.revenue_address;
      try {
        revenueAddr = webSdk.sdkUtils.getAddress(revenueAddr);
      } catch (error) {}
      let setData = {
        title: `${this.$t("messages.notifypool")}`,
        request: null,
        closebtnshow: false,
        success(response) {
          fun(response);
        },
      };
      let request = sdk.toPool(contractAddr, multaddr, revenueAddr, setData);

      setData.request = request;

      this.$store.dispatch("setNotification", setData);
    },
    joinPool() {
      let sdk = this.$store.getters.getsdk || null;
      if (!sdk) {
        return;
      }

      if (this.from.joinOk || !this.upAddr) {
        this.getRandom((random) => {
          this.getSign(sdk, random, (jsons) => {
            this.getContract(random, jsons, (response) => {
              let redata = response.data;
              if (redata) {
                this.toData(sdk, redata.contract, redata.multaddr, () => {
                  this.toPool(sdk, redata.contract, redata.multaddr, () => {
                    this.toPoolOk();
                  });
                });
              }
            });
          });
        });
      } else {
        this.toData(sdk, null, null, (json) => {
          this.toPoolOk();
        });
      }
    },

    toPoolOk() {
      this.$store.dispatch("setWinStatus", false);
      let message = this.upAddr
        ? `${this.$t("messages.newaddress")}：${this.from.neWaddress}`
        : `${this.$t("messages.joinsuccess")}`;
      let title = this.upAddr
        ? this.$t("mymanageMining.transferaddress")
        : this.$t("mymanageMining.join");

      this.$alert(message, title, {
        confirmButtonText: this.$t("messages.confirm"),
        showClose: false,
        closeOnPressEscape: false,
        closeOnHashChange: false,
        center: true,
        callback: () => {
          this.exit();
        },
      });
    },
    exit() {
      helper.goUrl(this, "MymanageMining", "");
    },
    onJoinPool() {
      if (this.upAddr) {
        let newaddress = "";
        let waddress = "";
        let revenue_address = "";
        try {
          revenue_address = webSdk.sdkUtils.getAddress(
            this.from.revenue_address
          );
          newaddress = webSdk.sdkUtils.getAddress(this.from.neWaddress);
          waddress = webSdk.sdkUtils.getAddress(this.$store.getters.account);
        } catch (error) {}
        if (!newaddress) {
          this.$message.error(`${this.$t("messages.pleaseaddress")}`);
          return;
        }

        if (revenue_address != waddress) {
          this.$message.error(`${this.$t("mymanageMining.pleasetoyaddr")}`);

          return;
        }
      }
      this.joinPool();
    },
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.onJoinPool();
        }
      });
    },
    loadData() {
      this.loading = true;
      let tabledata = {
        miner_addr: this.from.miner_addr,
      };

      ajax
        .postJson("/platform/my/getminerdetail", tabledata)
        .then((response) => {
          let item = response.result || {};
          let miner_addr = item.miner_addr;
          let revenue_address = item.revenue_address;
          if (miner_addr && revenue_address) {
            let joinOk = item.addpool == 1;
            this.from = {
              miner_addr,
              revenue_address,
              neWaddress: "",
              joinOk,
              isok: true,
            };
          } else {
            this.from = {
              miner_addr: "",
              revenue_address: "",
              neWaddress: "",
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
