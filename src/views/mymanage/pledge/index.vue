<template>
  <div style="text-align: left">
    <el-form
      :model="form"
      :rules="rules"
      ref="ruleForm"
      label-width="150px"
      class="demo-ruleForm"
    >
      <el-form-item :label="$t('pledge.mineraddr')">
        {{ address }}
      </el-form-item>
      <el-form-item :label="$t(subtitle)" prop="MB">
        <f-number
          :min="0"
          v-model="form.MB"
          step="0.00000001"
          units="TB"
          style="width: calc(100% - 70px)"
        />
        <!--
        <el-button
          type="text"
          style="vertical-align: top"
          :disabled="!form.MB"
          v-loading="testNetworkLd"
          @click="testNetwork"
          element-loading-spinner="el-icon-loading"
        >
          {{ $t("pledge.andwidthtest") }}
        </el-button>
        -->
      </el-form-item>
      <el-form-item :label="$t('mymanage.estimate')">
        <span v-loading="utgLoading"> {{ getutgnum }}{{ " UTG" }} </span>
      </el-form-item>
      <!--
      <el-form-item :label="$t('pledge.operator')" prop="operator">       
        <el-select v-model="form.operator" style="width: calc(100% - 70px)">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
       
      </el-form-item>
       -->
    </el-form>
    <div class="action_sub_div">
      <el-button
        type="primary"
        :disabled="utgLoading"
        @click="onsub"
        element-loading-spinner="el-icon-loading"
        >{{ $t("pledge.pledge") }}</el-button
      >
      <el-button
        v-if="showjump"
        type="text"
        @click="jump"
        element-loading-spinner="el-icon-loading"
        >{{ $t("pledge.jump") }}</el-button
      >
    </div>
  </div>
</template>
<script>
import fNumber from "@/components/modules/fNumber.vue";
import { Decimal } from "decimal.js";
import webSdk from "@/utils/webSdk.js";
import utils from "@/utils/utils.js";
import * as api from "@/api/api";
export default {
  components: { fNumber },
  props: {
    title: {
      type: String,
      default: "pledge.bandwidthpledge",
    },
    subtitle: {
      type: String,
      default: "pledge.allege",
    },
    btntitle: {
      type: String,
      default: "pledge.pledge",
    },
    showjump: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      mbpsMin: null,
      testNetworkLd: false,
      utgLoading: false,
      setTime: null,
      utgnum: 0,
      form: {
        MB: "",
        operator: "1",
      },
      options: [],
      rules: {
        //MB: [{ required: true, trigger: "input,blur" }],
        MB: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error(this.$t("messages.inputvaluemin")));
                return;
              }
              let smbpsMin = Number(
                this.scientificToNumber(this.mbpsMin / (1024 * 1024), 8)
              );
              console.log("value=" + value + " smbpsMin=" + smbpsMin);
              if (value < smbpsMin) {
                console.log("error");
                callback(new Error(this.$t("messages.inputvaluemin")));
                return;
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        operator: [{ required: true, trigger: "change" }],
      },
    };
  },
  created() {
    this.storageToUtg();
    this.getOperator();
  },
  methods: {
    scientificToNumber(inputNumber, decimal) {
      if (isNaN(inputNumber)) {
        return inputNumber;
      }
      inputNumber = "" + inputNumber;
      inputNumber = parseFloat(inputNumber);
      let eformat = inputNumber.toExponential();
      let tmpArray = eformat.match(/\d(?:\.(\d*))?e([+-]\d+)/);
      let number = inputNumber.toFixed(
        Math.max(0, (tmpArray[1] || "").length - tmpArray[2])
      );
      return this.formatDecimal(number, decimal);
    },

    formatDecimal(num, decimal) {
      num = num.toString();
      let index = num.indexOf(".");
      if (index !== -1) {
        num = num.substring(0, decimal + index + 1);
      } else {
        num = num.substring(0);
      }
      return parseFloat(num).toFixed(decimal);
    },

    jump() {
      this.$emit("jump");
    },
    testNetwork() {
      window.open(window.$url.OPEN_URL, "_blank");
      return;
      this.testNetworkLd = true;
      setTimeout(() => {
        this.$message({
          message: this.$t("pledge.successfultest"),
          type: "success",
        });
        this.testNetworkLd = false;
      }, 1500);
    },
    onsub() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let mbps = new Decimal((this.form.MB || 0) * 1024 * 1024);
          if (mbps < 1) {
            return;
          }
          if (mbps < this.mbpsMin) {
            return;
          }
          /*
          if (mbps.isZero()) {
            return;
          }
          */
          let jsonL = {
            addr1: this.address,
            operator: this.form.operator,
            //mbps: mbps.toFixed(0),
            mbps: Math.floor(mbps),
          };
          this.$emit("sendTransactionTo", webSdk.typeJson.flwreq, jsonL);
        }
      });
    },
    getOperator() {
      api
        .postJson("/platform/getOperatorConfig", {})
        .then((response) => {
          let options = response.result || [];
          options.forEach((item) => {
            item.value = item.id;
            item.label = item.operator_name;
          });
          this.options = options;
        })
        .catch((err) => {});
    },
    storageToUtg(timeout = 800) {
      this.utgLoading = true;
      this.utgnum = "0";
      if (this.setTime) {
        clearTimeout(this.setTime);
      }
      let mbps = (this.form.MB || 0) * 1024 * 1024;
      if (mbps <= 0) {
        this.utgLoading = false;
        return;
      }
      if (mbps < this.mbpsMin) {
        this.utgLoading = false;
        return;
      }
      console.log(this.form.MB, mbps, this.mbpsMin);
      this.setTime = setTimeout(() => {
        api
          .postJson("/platform/bandWidthToUtg", {
            bandWidth: mbps - this.mbpsMin,
          })
          .then((response) => {
            this.utgLoading = false;

            try {
              this.utgnum = parseFloat(response.result.utg).toFixed(8); //utils.clearZero(response.result.utg);
              //console.log(this.form.MB,mbps,this.mbpsMin,response.result.utg, this.utgnum)
            } catch (error) {}
          })
          .catch((err) => {
            this.$message.error(
              `${this.$t("mymanage.estimate")} ${this.$t("coins.error")}`
            );
            this.utgLoading = false;
          });
      }, timeout);
    },
    getMbpsMin() {
      this.mbpsMin = null;
      api
        .postJson("/platform/my/getminerdetail", { miner_addr: this.address })
        .then((response) => {
          let result = response.result || {};
          this.mbpsMin = result.bandwidth || 0;
          let rmbpsMin = this.mbpsMin / (1024 * 1024);
          if (this.form.MB <= rmbpsMin) {
            //this.form.MB=(this.mbpsMin+1)+""
            this.form.MB = rmbpsMin + "";
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },

  beforeDestroy() {
    if (this.setTime) {
      clearTimeout(this.setTime);
    }
  },
  computed: {
    getutgnum() {
      let dnuml = new Decimal(this.utgnum || 0);
      return dnuml.toFixed(8);
    },
  },
  watch: {
    "form.MB": function () {
      this.storageToUtg();

      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.validate(() => {});
      }
    },
    address: {
      immediate: true,
      handler: function () {
        this.getMbpsMin();
      },
    },
  },
};
</script>
<style scoped>
.action_sub_div {
  text-align: center;
}
</style>
