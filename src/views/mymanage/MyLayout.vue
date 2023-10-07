<template>
  <div>
    <div v-if="!sdkIsok" class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div
          class="card-body"
          style="min-height: 300px; text-align: center; padding-top: 30px"
        >
          <img
            src="@/assets/images/wallet404.png"
            style="width: 100%; max-width: 634px; max-height: 257px"
          />
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
    </div>
    <div v-else>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import BassContract from "@/utils/BassContract.js";
import webSdk from "@/utils/webSdk.js";
export default {
  props: {},
  data() {
    return {
      sdk: null,
      initBtnLoading: false,
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
              this.sdk = null;
              this.$store.dispatch("setSdk", null);
              this.initBtnLoading = false;
              console.log(err);
            });
          this.$store.dispatch("setSdk", sdk);
        } else {
          this.sdk = null;
          this.initBtnLoading = false;
        }
      } else {
        this.initBtnLoading = false;
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
              let path = this.$route.path || "";
              if (path.indexOf("mymanage") > -1) {
                this.initSdk();
              }
            } else {
              this.initBtnLoading = false;
              this.sdk = null;
              this.$store.dispatch("setSdk", null);
            }
          });
          webSdk.sdkUtils.accountsChanged((address) => {
            if (webSdk.sdkUtils.netWorkOk()) {
              let path = this.$route.path || "";
              if (path.indexOf("mymanage") > -1) {
                this.initSdk(true);
              }
            } else {
              this.sdk = null;
              this.$store.dispatch("setSdk", null);
            }
            console.log("account_address:" + address);
          });

          this.initSdk();
        })
        .catch((err) => {
          this.initBtnLoading = false;
          this.$store.dispatch("setSdk", null);
          console.log(err);
        });
    },
  },

  computed: {
    sdkIsok() {
      return !!this.$store.getters.account;
    },
  },
};
</script>
