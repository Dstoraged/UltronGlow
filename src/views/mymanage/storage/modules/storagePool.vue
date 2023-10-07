<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
          {{ btnText }}
        </h4>

        <el-form v-loading="loading || pledgeLoading" label-position="left" label-width="auto"
          style="max-width: 520px; margin: 0px auto; text-align: left" :model="form.data" :rules="form.rules"
          ref="ie_form" @submit.native.prevent="submitForm">
          <el-form-item size="mini" :label="$t('storagemining.miner')">
            {{ pledgeData.deviceAddr }}
          </el-form-item>
          <el-form-item size="mini" v-if="isUp" :label="originalLabel">
            {{ originalAddress }}
          </el-form-item>

          <el-form-item prop="new_storagePool" :label="newLabel" size="mini">
            {{ form.data.new_storagePool }}&nbsp;&nbsp;
            <el-button type="text" @click="selectWin.show = true">{{ $t("storageNode.select") }}</el-button>
          </el-form-item>
          <f-table-cels v-if="selectWin.selectItem" :notHeards="['hash']" :heards="selectWin.selectheard"
            :data-item="selectWin.selectItem"></f-table-cels>
          <div class="foot-btn" style="text-align: center">
            <el-button type="primary" @click="submitForm">
              {{ $t(btnText) }}
            </el-button>
          </div>
        </el-form>
      </div>
    </div>

    <storage-pool-list @select="onSelect" v-model="selectWin.show" v-if="selectWin.show"
      :now-addr="pledgeData.spHash"></storage-pool-list>
  </div>
</template>
<script>
import FNumber from "@/components/modules/fNumberRe.vue";
import webSdk from "@/utils/webSdk";
import utils from "@/utils/utils";
import * as api from "@/api/api";
import storagePoolList from "./storagePoolList.vue";
import fTableCels from "@/components/modules/fTableCels.vue";

export default {
  components: { FNumber, storagePoolList,fTableCels },

  data() {
    let _this_ = this;
    return {
      loading: false,
      pledgeLoading: false,
      nodeAddr: "",
      pledgeData: {},
      selectWin: {
        show: false,
        selectItem: null,
        selectheard: null,
      },
      form: {
        data: {
          new_storagePool: "",
        },
        rules: {
          new_storagePool: [
            {
              validator: (rule, value, callback) => {
                if (utils.isEmpty(value)) {
                  callback(new Error(_this_.$t("storageNode.selectSP")));
                  return;
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
        .post("/platform/getStorageSpaceInfo", { device_addr: addr })
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

      this.$router.push("/mymanage/storageServicenode");
    },
    submitForm() {
      this.$refs["ie_form"].validate((valid) => {
        if (valid) {
          let reObj = this.walletSelect();
          if (!reObj) return;
          let { sdk } = reObj;

          let title = "storagePool.bindingSP";
          let context = "";
          let device_address = this.pledgeData.deviceAddr;
          let storagePool = webSdk.sdkUtils.hashToUX(
            this.form.data.new_storagePool,
            true
          );
          let type = "setsp";
          if (this.isUp) {
            title = "storagePool.SPTransfer";
            context = `${this.$t("storagePool.newSP")} :${this.getAddrFormat(storagePool)}`;
          }
          storagePool = storagePool.toLocaleLowerCase();
          let json = {
            title,
            device_address,
            storagePool,
            context,
            type,
            sdk,
          };
          this.bind(json, () => {
            this.onOkBtn();
          });
        }
      });
    },

    bind(json, fun) {
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
          addr1: json.device_address,
          hash: json.storagePool,
        },
        setData
      );
      setData.request = request;

      this.$store.dispatch("setNotification", setData);
    },
    onSelect(row,heards) {
      this.form.data.new_storagePool = row.hash;
      this.selectWin.selectheard = heards
      this.selectWin.selectItem = row;
      this.selectWin.show = false;
      setTimeout(() => {
        this.$refs["ie_form"].validate();
      }, 800);
    },
  },
  computed: {
    originalAddress() {
      return this.pledgeData.spHash;
    },
    btnText() {
      return this.isUp ? this.$t("storagePool.SPTransfer") : this.$t("storagePool.bindingSP");
    },
    originalLabel() {
      return this.isUp ? this.$t("storagePool.originalSP") : this.$t("storagePool.originalSP");
    },
    newLabel() {
      return this.isUp ? this.$t("storagePool.newSP") : this.$t("storagePool.bindingSP");
    },
    isUp() {
      return !!this.pledgeData.spHash;
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