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
              style="max-width: 500px; margin: 0px auto; text-align: left"
            >
              <el-form-item
                class="phone_form_input_label"
                :label="$t('storagepledge.deviceaddress')"
              >
                <span class="pc_show_context">
                  {{ from.node_address }}
                </span>
                <el-popover
                  class="phone_show_context"
                  placement="bottom"
                  trigger="hover"
                  :content="from.node_address"
                >
                  <span slot="reference" class="phone_show_context">
                    {{ getAddrFormat(from.node_address, 15) }}
                  </span>
                </el-popover>
              </el-form-item>
              <el-form-item
                class="phone_form_input_label"
                :label="$t('mymanageMining.revenuesaddress')"
              >
                <span class="pc_show_context">
                  {{ from.revenue_address }}
                </span>
                <el-popover
                  class="phone_show_context"
                  placement="bottom"
                  trigger="hover"
                  :content="from.revenue_address"
                >
                  <span slot="reference" class="phone_show_context">
                    {{ getAddrFormat(from.revenue_address, 15) }}
                  </span>
                </el-popover>
              </el-form-item>
              <el-form-item label-width="0px" style="text-align: center">
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
  </div>
</template>
<script>
import * as helper from "@/utils/helper";
import webSdk from "@/utils/webSdk.js";
import * as api from "@/api/api";
import utils from "@/utils/utils";
export default {
  props: {
    title: {
      type: String,
      default: "messages.bindinglift",
    },
  },
  data() {
    return {
      loading: false,
      nodeItem: {},
      from: {
        node_address: "",
        revenue_address: "",
        isok: false,
      },
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
    getAddrFormat(val, num = 9) {
      if (val && val.length <= num) {
        return val;
      }
      return helper.getAddrFormat(val, num);
    },
    onCopy() {
      this.$message({
        showClose: true,
        type: "success",
        message: this.$t("utilsmsg.copyok"),
      });
    },

    toData(sdk, fun) {
      let nodeAdd = this.from.node_address;

      let setData = {
        title: `${this.$t(this.title)}`,
        context: `${this.$t("storagepledge.deviceaddress")}:${nodeAdd}`,
        request: null,
        closebtnshow: false,
        success(response) {
          fun(response);
        },
      };
      let request = sdk.sendTransactionTo(
        webSdk.typeJson.unbind,
        {
          addr1: nodeAdd,
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

      //this.goTheUrl("StoragePledge");
      this.goTheUrl("StorageServiceNode");
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
        /* let waddress = "";
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
        }*/
        this.toData(sdk, () => {
          this.toPoolOk();
        });
      });
    },
    loadData() {
      this.loading = true;
      /*
      let tabledata = {
        node_address: this.from.node_address,
      };
    */
      let param = {
        device_addr: this.from.node_address,
      };
      api
        //.postJson("/platform/node/getcadnode", tabledata)
        .post("/platform/getStorageSpaceInfo", param)
        .then((response) => {
          let item = response.result || {};
          //let node_address = item.node_address;
          // let revenue_address = item.revenue_address;
          let node_address = item.deviceAddr;
          let revenue_address = item.revenueAddr;
          this.nodeItem = item;
          if (node_address) {
            this.from = {
              node_address,
              revenue_address,
              isok: true,
            };
          } else {
            this.from = {
              node_address: "",
              revenue_address: "",
              isok: false,
            };
          }

          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
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
