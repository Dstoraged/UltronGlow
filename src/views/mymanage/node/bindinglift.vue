<template>
  <div>
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body">
          <h4 class="mt-0 header-title" style="text-align: left">
            {{ $t(title) }}
          </h4>
          <div style="width: 100%; text-align: center; padding-bottom: 20px">
            <el-form :model="from" ref="form" label-width="120px"
              style="max-width: 500px; margin: 0px auto; text-align: left">
              <el-form-item :label="$t('node.address')">
                {{ from.node_address }}
              </el-form-item>
              <el-form-item :label="$t('mymanageMining.revenuesaddress')">
                {{ from.revenue_address }}
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit" v-loading="loading" :disabled="loading || !from.isok">{{
                $t("messages.unbinding") }}</el-button>
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
      from: {
        node_address: "",
        revenue_address: "",
        isok: false,        
      },
      manage_address: "",
    };
  },
  created() {
    //this.from.node_address = this.$route.params.id;   
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
      let nodeAdd = this.from.node_address;

      let setData = {
        title: `${this.$t(this.title)}`,
        context: `${this.$t("node.address")}:${nodeAdd}`,
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
          type: 0,
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

      this.goTheUrl("MymanageNode");
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        }
        let sdk = this.$store.getters.getsdk || null;
        /* 2022-09-30
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
        if (maddress != waddress) {
          this.$message.error(`${this.$t("mymanageMining.pleasetoymangeaddr")}`);
          return;
        }
        ////////////////////////////////////////////////


        this.toData(sdk, () => {
          this.toPoolOk();
        });
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
