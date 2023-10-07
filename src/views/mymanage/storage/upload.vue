<template>
  <div>
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body">
          <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
            {{ $t("storagerental.rentalcfgtitle") }}
          </h4>
          <el-form 
           @submit.native.prevent
          style="margin: 0px auto; max-width: 600px" :model="ruleForm" status-icon :rules="rules"
            ref="ruleForm" label-width="0px" class="demo-ruleForm" v-loading="revenue_loading || loading">
            <el-form-item :label="$t('storagerental.renthash')" label-width="200px">
              <el-popover placement="bottom" trigger="hover" :content="rent_hash">
                <div class="overflow" slot="reference" style="text-algin: left">                  
                  {{ getAddrFormat(rent_hash, 20) }}
                </div>
              </el-popover>
            </el-form-item>
            <el-form-item :label="$t('storagerental.deviceaddress')" label-width="200px">
              <el-popover placement="bottom" trigger="hover" :content="deviceAddr">
                <div class="overflow" slot="reference" style="text-algin: left">
                  {{ getAddrFormat(deviceAddr, 20) }}                 
                </div>
              </el-popover>
            </el-form-item>

            <el-form-item prop="img" :class="ruleForm.img.length > 0 ? 'hide_img' : ''">
              <van-uploader accept="image/*" ref="vanUploader" v-model="ruleForm.img" :multiple="false"
                :max-size="maxSize" preview-size="150" :upload-text="$t('market.clickUpload')" :preview-image="true"
                :preview-full-image="false" @click-preview="chooseFile" @oversize="oversize" :max-count="2">
                <template slot="preview-cover">
                  <div class="preview-cover van-ellipsis"></div>
                </template>
              </van-uploader>
            </el-form-item>

            <el-form-item :label="$t('market.linkAddress')" prop="url" label-width="200px">
              <el-input :placeholder="$t('market.linkAddress')" v-model="ruleForm.url"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')" v-loading="butLoading" :disabled="butLoading">{{
                  $t("rPassword.confirmModification")
              }}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import utils from "@/utils/utils";
import * as helper from "@/utils/helper";
import webSdk from "@/utils/webSdk.js";
import * as api from "@/api/api";
import { Dialog } from "vant";
export default {
  data() {
    return {
      loading: false,
      revenue_loading: "",
      butLoading: false,
      rent_hash: "",
      deviceAddr: "",
      rent_address: "",      
      revenue_address: "",
      upMaxSize: window.$url.upMaxSize || 1,
      ruleForm: {
        img: [
          /*  {
            file: {},
            status: "",
            message: "",
            content: "",
          },*/
        ],
        url: "",
      },
      rules: {},
    };
  },
  created() {   
    let idL = this.$route.params.id;
    let ids = idL.split("_");
    this.rent_hash = ids[0];
    this.deviceAddr = ids[1];

    this.loadRevenue();
    this.showPopover();
  },
  methods: {
    getAddrFormat(val, num = 8) {
      return helper.getAddrFormat(val, num);
    },

    oversize() {
      this.$toast.fail(`${this.$t("market.imagecannot", [this.upMaxSize])}`);
    },
    chooseFile() {
      this.$refs.vanUploader.chooseFile();
    },
    showPopover() {
      this.loading = true;
      if (utils.isEmpty(this.rent_hash)) {
        return;
      }

      var param = {
        rent_hash: this.rent_hash,
      };     
      api
        .post("/platform/getStorageRentInfo", param)
        .then((re) => {
          this.loading = false;
          let result = re.result || {};
          this.rent_hash = result.rentHash || "";
          this.rent_address = result.rentAddr;         
          let img = result.attachPic || "";
          let url = result.attachText || "";
          let imgs = [];
          if (img) {
            imgs.push({
              file: {},
              status: "",
              message: "",
              content: img,
            });
          }
          this.ruleForm.img = imgs;
          this.ruleForm.url = url;
        })
        .catch((err) => {
          console.log("error", err);
        });
    },

    loadRevenue() {
      this.revenue_loading = true;
      let addr = this.deviceAddr;
      if (!addr) {
        return;
      }

      addr = webSdk.sdkUtils.hashToUX(addr);    
      api
        .postJson("/platform/my/getminerdetail", { miner_addr: addr })
        .then((re) => {
          re = re.result || {};
          this.revenue_address = re.revenue_address;
          this.revenue_loading = false;
        })
        .catch(() => {
          this.revenue_address = "";
        });
    },

    getFrom() {
      /*
      if (utils.isEmpty(this.revenue_address)) {
        Dialog.alert({
          message: `${this.$t("messages.pleaserevenueaccount")} : ${this.revenue_address
            }`,
          theme: "round-button",
          confirmButtonText: this.$t("table.confirm"),
        }).then(() => { });
        return false;
      }
      */

      let address = webSdk.sdkUtils.getSelectAddress();
      if (utils.isEmpty(address)) {
        return false;
      }
      let revenue_address = this.revenue_address;
      let device_addr = this.deviceAddr;
      try {
        revenue_address = webSdk.sdkUtils.hashToUX(revenue_address, true);
        address = webSdk.sdkUtils.hashToUX(address, true);
        device_addr = webSdk.sdkUtils.hashToUX(device_addr, true);
      } catch (error) { } 
      if (revenue_address != address && device_addr != address) {
        Dialog.alert({
          message: `${this.$t("messages.pleaseDevOrRevenue")} : ${this.revenue_address
            }`,
          theme: "round-button",
          confirmButtonText: this.$t("table.confirm"),
        }).then(() => { });
        return false;
      }

      address = webSdk.sdkUtils.hashToUX(this.revenue_address, false, true);
      return address;
    },
    submitForm() {     
      let sdk = this.$store.getters.getsdk || null;
      if (!sdk) return;
      let address = this.getFrom();
      if (!address) return;

      let img =
        this.ruleForm.img.length > 0 ? this.ruleForm.img[0].content || "" : "";
      let url = this.ruleForm.url || "";
      img = img.trim();
      url = url.trim();    
      let item = {
        rent_hash: this.rent_hash,
        pic: img,
        text: url,
        address,
        sign: "",
      };
      this.baseSigin(item, sdk);
    },
    baseSigin(item, sdk) {
      let str = `${item.rent_hash}&${item.text}&${item.pic}`;

      this.loading = true;
      let setData = {
        title: `${this.$t("market.requestSignature")}`,
        status: 3,
        //  context: ``,
        request: sdk.personalSign(str, item.address),
        closebtnshow: false,
        success: (re) => {
          item.sign = re.sign;
          this.loading = false;
          this.$store.dispatch("setWinStatus", false);
          this.subAjax(item);
        },
        err: (err) => {
          console.log("err", err);
          this.loading = false;
        },
      };
      this.$store.dispatch("setNotification", setData);
    },
    subAjax(item) {
      console.log(JSON.stringify(item));
      this.butLoading = true;     
      api
        .post("/platform/updateStorageRentAttach", item)
        .then((re) => {
          this.butLoading = false;
          if (re.statusCode === 0) {
            this.$notify.success(this.$t("market.savingSucceeded"));
            this.$router.push("/mymanage/revenuerental");
          } else {
            this.butLoading = false;
            this.$notify.error({
              message: re.result || "ERROR",
            });
          }
        })
        .catch((err) => {
          this.butLoading = false;
          this.$notify.error({
            message: err || "ERROR",
          });
        });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
  computed: {
    maxSize() {
      return parseInt(this.upMaxSize) * 1024;
    },
  },
  watch: {
    "ruleForm.img": function (newVals) {
      if (newVals.length > 0) {
        let fileItem = newVals[newVals.length - 1];
        if (
          fileItem &&
          fileItem.file &&
          !fileItem.file.type.includes("image")
        ) {
          newVals.splice(newVals.length - 1, 1);
        }
      }

      if (newVals.length > 1) {
        newVals.splice(0, newVals.length - 1);
      }
    },
    /*
    "$store.getters.deviceAddr": function () {
      this.loadRevenue();
    },
    */
  },
};
</script>
<style>
.hide_img .van-uploader__upload {
  display: none;
}
</style>