<template>
  <div>
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
              style="max-width: 550px; margin: 0px auto; text-align: left"
            >
              <el-form-item
                class="phone_form_input_label"
                :label="$t('storagepledge.deviceaddress')"
              >
                <span class="pc_show_context">{{ from.node_address }}</span>
                <el-popover
                  placement="bottom"
                  trigger="hover"
                  :content="from.node_address"
                >
                  <span class="phone_show_context" slot="reference">{{
                    getAddrFormat(from.node_address, 15)
                  }}</span>
                </el-popover>
              </el-form-item>
              <div v-if="upAddr">
                <el-form-item
                  class="phone_form_input_label"
                  :label="$t('mymanageMining.revenuesaddress')"
                >
                  <span class="pc_show_context">{{
                    from.revenue_address
                  }}</span>
                  <el-popover
                    placement="bottom"
                    trigger="hover"
                    :content="from.revenue_address"
                  >
                    <span class="phone_show_context" slot="reference">{{
                      getAddrFormat(from.revenue_address, 15)
                    }}</span>
                  </el-popover>
                </el-form-item>
                <el-form-item
                  class="phone_form_input"
                  :rules="rules"
                  required
                  :label="$t('mymanageMining.newaddress')"
                  prop="neWaddress"
                >
                  <el-input v-model="from.neWaddress" />
                </el-form-item>
              </div>
              <el-form-item
                v-else
                :label="$t('mymanageMining.revenuesaddress')"
              >
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
  </div>
</template>
<script>
import * as helper from "@/utils/helper";
import utils from "@/utils/utils";
import webSdk from "@/utils/webSdk.js";
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
      nodeItem:{},
      from: {
        node_address: "",
        revenue_address: "",
        neWaddress: "",
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
              valL = webSdk.sdkUtils.getAddress(value);
            } catch (error) {
              console.log(error);
            }
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
    this.from.node_address = this.$route.params.id;
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
        context: `${this.$t("storagepledge.deviceaddress")}:${nodeAdd}<br/>`,
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
            type: 1,
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
            type: 1,
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
            this.exit();
          },
        });
      } else {
        this.$notify({
          title,
          message,
          type: "success",
        });
      }

      this.toNodes();
    },
    toNodes() {
      helper.goUrl(this, "StoragePledge", "");
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        }
        let reObj = utils.walletSelect({
          _this_: this,
          addr: this.nodeItem.managerAddr,
        });
        if (!reObj) return;
        let { sdk } = reObj;
        /*  let sdk = this.$store.getters.getsdk || null;
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
        }*/

        this.toData(sdk, () => {
          this.toPoolOk();
        });
      });
    },

    loadData() {
      this.loading = true;
      let param = {
        device_addr: this.from.node_address,
      };
      api
        // .postJson("/platform/node/getcadnode", tabledata)
        .post("/platform/getStorageSpaceInfo", param)
        .then((response) => {
          let item = response.result || {};
          let node_address = item.deviceAddr;
          let revenue_address = item.revenueAddr;
          this.nodeItem=item;
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
