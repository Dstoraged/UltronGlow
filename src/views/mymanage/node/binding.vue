<template>
  <div>
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body">
          <h4 class="mt-0 header-title" style="text-align: left">
            {{ $t(title) }}
          </h4>
          <div style="width: 100%; text-align: center; padding-bottom: 20px">
            <el-form :model="from" ref="form" label-width="200px"
              style="max-width: 550px; margin: 0px auto; text-align: left">
              <el-form-item :label="$t('node.address')">
                {{ from.node_address }}
              </el-form-item>
              <div v-if="upAddr">
                <el-form-item :label="$t('mymanageMining.revenuesaddress')">
                  {{ from.revenue_address }}
                </el-form-item>
                <el-form-item :rules="rules" required :label="$t('mymanageMining.newaddress')" prop="neWaddress">
                  <el-input v-model="from.neWaddress" />
                </el-form-item>
              </div>
              <el-form-item v-else :label="$t('mymanageMining.revenuesaddress')" prop="revenue_address" :rules="rules"
                required>
                <el-input v-model="from.revenue_address" />
                <!--
                <template slot="label">
                  {{ $t("mymanageMining.revenuesaddress") }}
                  <el-tooltip
                    class="item"
                    :content="$t('messages.upwallet')"
                    placement="top-start"
                  >
                    <i class="el-icon-warning" style="color: orange"> </i>
                  </el-tooltip>
                </template>
               
                {{ $store.getters.accounty }}
                 -->
                <!-- <el-input v-model="form.data2.earnings"> </el-input>-->
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="onSubmit" v-loading="loading" :disabled="loading || !from.isok">{{
                    $t("messages.binding")
                }}</el-button>
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
import { ethers } from "ethers";
import * as api from "@/api/api";
export default {
  props: {
    title: {
      type: String,
      default: "binding.bindaddr",
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
        node_address: "",
        revenue_address: "",
        neWaddress: "",
        isok: false,
      },
      manage_address: "",
      rules: [
        {
          validator: (rule, value, callback) => {
            if (utils.isEmpty(value)) {
              callback(new Error(_this_.$t("messages.pleaseaddress")));
              return;
            }
            let isAddress = webSdk.sdkUtils.verifyAddress(value);
            if (isAddress) {
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
    // this.from.node_address = this.$route.params.id;
    let idL = this.$route.params.id;
    let ids = idL.split("_");
    this.from.node_address = ids[0];
    this.manage_address = ids[1];

    if (!this.from.node_address) {
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
      let contractAddr = "ux0000000000000000000000000000000000000000";
      let signaddr = "ux0000000000000000000000000000000000000000";
      let nodeAdd = this.from.node_address;
      let revenueAddr = this.upAddr
        ? this.from.neWaddress
        : this.from.revenue_address;
      try {
        revenueAddr = webSdk.sdkUtils.getAddress(revenueAddr);
      } catch (error) {
        console.log(error);
      }
      let setData = {
        title: `${this.$t(this.title)}`,
        context: `${this.$t("node.address")}:${nodeAdd}<br/>`,
        request: null,
        closebtnshow: false,
        success(response) {
          fun(response);
        },
      };
      let request = null;
      if (this.upAddr) {
        request = sdk.sendTransactionTo(
          webSdk.typeJson.rebind,
          {
            addr1: nodeAdd,
            type: 0,
            contractAddr,
            signaddr,
            revenueAddr,
          },
          setData
        );
      } else {
        request = sdk.sendTransactionTo(
          webSdk.typeJson.Bind,
          {
            addr1: nodeAdd,
            type: 0,
            contractAddr,
            signaddr,
            revenueAddr,
          },
          setData
        );
      }

      setData.request = request;

      this.$store.dispatch("setNotification", setData);
    },

    toPoolOk() {
      this.$store.dispatch("setWinStatus", false);
      let message = this.upAddr
        ? `${this.$t("messages.newaddress")}：${this.from.neWaddress}`
        : `${this.$t("coins.success")}`;
      //let title = this.$t(this.title);
      let title = this.upAddr
        ? this.$t("mymanageMining.transferaddress")
        : this.$t("coins.success");

      if (this.upAddr) {
        this.$alert(message, title, {
          confirmButtonText: this.$t("messages.confirm"),
          showClose: false,
          closeOnPressEscape: false,
          closeOnHashChange: false,
          center: true,
          callback: () => {
            //this.exit();
          },
        });
      } else {
        this.$notify({
          title,
          message,
          type: "success",
        });
      }
      // console.log("title="+title+"  message="+message)

      this.toNodes();
    },
    toNodes() {
      helper.goUrl(this, "MymanageNode", "");
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        }
        let sdk = this.$store.getters.getsdk || null;

        /* 2022-09-30
          if (this.upAddr) {
            let waddress = "";
            let revenue_address = "";
            try {
              revenue_address = webSdk.sdkUtils.getAddress(
                this.from.revenue_address
              );
              waddress = webSdk.sdkUtils.getAddress(this.$store.getters.account);
            } catch (error) {
              console.log(error);
            }
            if (revenue_address != waddress) {
              this.$message.error(`${this.$t("mymanageMining.pleasetoyaddr")}`);
              return;
            }
          }
          */

        // 2022-09-03 manage_address         
        let waddress = "";
        let maddress = "";
        try {
          maddress = webSdk.sdkUtils.getAddress(this.manage_address);
          waddress = webSdk.sdkUtils.getAddress(this.$store.getters.account);
        } catch (error) {
          console.log(error);
        }
        console.log(maddress, waddress);
        if (maddress != waddress) {
          this.$message.error(`${this.$t("mymanageMining.pleasetoymangeaddr")}`);
          return;
        }
        ////////////////////////////////////////////////

        /*
        this.toData(sdk, () => {
          this.toPoolOk();
        });
*/
        this.revenueAddressOk(() => {
          this.toData(sdk, () => {
            this.toPoolOk();
          });
        });
      });
    },

    revenueAddressOk(fun) {
      this.loading = true;
      let reAddress = this.upAddr
        ? this.from.neWaddress
        : this.from.revenue_address;
      // : this.$store.getters.account; //2022-09-30
      reAddress = webSdk.sdkUtils.hashToNX(reAddress);
      api
        .postJson("/platform/node/getcadnodeByRev", {
          revenue_address: reAddress,
        })
        .then((response) => {
          this.loading = false;
          let binNumber = response.result;
          //console.log("revenue_address="+reAddress,"binNumber="+binNumber)
          if (binNumber > 0) {
            this.$message.error(`${this.$t("messages.addressused")}`);
            return;
          }
          fun();
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },

    loadData() {
      this.loading = true;
      let tabledata = {
        node_address: this.from.node_address,
      };
      api
        .postJson("/platform/node/getcadnode", tabledata)
        .then((response) => {
          let item = response.result || {};
          let node_address = item.node_address;
          let revenue_address = item.revenue_address;
          if (utils.isEmpty(revenue_address)) {
            revenue_address = this.$store.getters.account
          }
          if (node_address) {
            this.from = {
              node_address,
              revenue_address,
              neWaddress: "",
              isok: !(utils.isEmpty(revenue_address) && this.upAddr),
            };
          } else {
            this.from = {
              node_address: "",
              revenue_address: "",
              neWaddress: "",
              isok: false,
            };
          }

          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
</style>
