<template>
  <div class="card" style="margin-top: 40px">
    <div
      class="card-body"
      style="min-height: 400px; text-align: center; padding-top: 30px"
    >
      <img src="@/assets/images/wallet404.png" />
      <div>
        <el-button
          @click="initNetwork"
          :disabled="initBtnLoading"
          v-loading="initBtnLoading"
          type="primary"
          >{{ $t("mymanage.connecttowallet") }}</el-button
        >
      </div>
      <div style="color: red; font-size: 12px; padding: 5px">
        {{ $t("mymanage.notconnectedwallet") }}
      </div>
    </div>
  </div>
</template>
<script>
import webSdk from "@/utils/webSdk.js";
import BassContract from "@/utils/BassContract.js";
export default {
  name: "InitNetwork",
  components: {},
  data() {
    return {
      sdk: null,
      initBtnLoading: true,
      netId: window.$url.netId,
    };
  },
  created() {
    if (this.$store.getters.getsdk) {
      this.initSdk();
    } else {
      this.initNetwork();
    }
  },

  methods: {
    initSdk(isup = false) {
      if (webSdk.sdkUtils.netWorkOk()) {
        let sdk =
          this.$store.getters.getsdk || new webSdk.sdk(new BassContract());
        let account = webSdk.sdkUtils.getSelectAddress();
        if (account) {
          account = webSdk.sdkUtils.hashToNX(account);
          this.$store
            .dispatch("setAccount", { _this_: this, account, isup })
            .then(() => {
              this.sdk = sdk;
            })
            .catch((err) => {
              console.log(err);
              this.sdk = null;
              this.$store.dispatch("setSdk", null);
              this.initBtnLoading = false;
            });
          this.$store.dispatch("setSdk", sdk);
        } else {
          this.sdk = null;
          this.initBtnLoading = false;
        }
      } else {
        this.initBtnLoading = false;
      }

      if (this.$store.getters.account) {
        this.form.address = this.$store.getters.account;
        this.loadData();
      }
    },

    initNetwork() {
      this.initBtnLoading = true;
      let netIdInt = parseInt(this.netId, 16);
      webSdk.sdkUtils
        .getEnable(() => {
          this.initBtnLoading = false;
        })
        .then(() => {
          webSdk.sdkUtils.networkChanged((network) => {
            if (netIdInt == network) {
              this.initSdk();
            } else {
              this.initBtnLoading = false;
              this.sdk = null;
              this.$store.dispatch("setSdk", null);
            }
          });
          webSdk.sdkUtils.accountsChanged((address) => {
            if (webSdk.sdkUtils.netWorkOk()) {
              this.initSdk(true);
            } else {
              this.sdk = null;
              this.$store.dispatch("setSdk", null);
            }
            console.log(address);
          });

          this.initSdk();
        })
        .catch((err) => {
          console.log(err);
          this.initBtnLoading = false;
          this.$store.dispatch("setSdk", null);
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
