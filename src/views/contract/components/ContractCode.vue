<template>
  <div>
    <!--
    <ContractVerify :contract="contract" v-if="total <= 0" />
-->

    <div class="container-fluid" style="margin-top: 10px" v-if="total <= 0">
      <p style="margin: 8px 0px; text-align: left">
        <i class="fa fa-info-circle text-secondary mr-1"></i>
        <span>{{ $t("contracts.contractadminmsg") }}</span>
        <span style="color: #3498db;font-weight: 600;" class="cursor" @click="goToUrl('VerifyContract', contract)">{{
          $t("contracts.contractverified")
        }}</span>
        <span>{{ $t("contracts.contractselfmsg") }}</span>
      </p>
      <textarea v-model="contractcodes" spellcheck="false" class="area-content"
        style="height: 300px; padding: 1px 1px; display: flex" readonly></textarea>
    </div>

    <div class="container-fluid" v-show="total > 0" style="margin-top: 10px">
      <h6 style="text-align: left">
        <i class="fa fa-check-circle text-success mr-1"></i>
        <span>{{ $t("contracts.contractverify") }}</span>
      </h6>
      <div class="row">
        <div class="col-md-6">
          <div class="card viewcard">
            <div class="card-body viewcardbody">
              <VTable :table-heard="tableLeftHeard" :datas="contractInfo" title-width="110px" id="tableLeftHeardid">
              </VTable>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card viewcard">
            <div class="card-body viewcardbody">
              <VTable :table-heard="tableRightHeard" :datas="contractInfo" title-width="110px" id="tableRightHeardid">
              </VTable>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid" v-show="total > 0">
      <h6 style="text-align: left">
        <i class="fa fa-file-code text-secondary mr-1"></i>
        {{ $t("contracts.contractcode") }}
      </h6>

      <div class="row" style="margin-top: 10px" v-for="(item, index) in codeList" :key="index">
        <div class="col-md-9 col-sm-12">
          <p class="sub-title" style="margin: 8px 0px; text-align: left">
            File {{ index + 1 }} of {{ total }} : {{ item.filename }}
          </p>
        </div>

        <div class="col-md-3 col-sm-12" style="text-align: right; padding: 6px">
          <a type="button" class="btn-sm" :title="$t('contracts.copysourcecode')" @click="btnCopySourcecode(item.id)"><i
              class="fa fa-copy" aria-hidden="true"></i></a>
          <!--<a type="button" class="btn-sm "><i class="fa fa-arrows-alt" aria-hidden="true"></i></a>  -->
        </div>

        <ContractTextarea :areaText="item.sourcecode" :ids="item.id" :id="'sourcecode' + item.id"></ContractTextarea>
      </div>

      <div class="row" style="margin-top: 10px" v-if="contractabi != ''">
        <div class="col-md-9 col-sm-12">
          <h6 style="margin: 8px 0px; text-align: left">
            <i class="fa fa-tasks text-secondary mr-1"></i>{{ $t("contracts.ContractABI") }}
          </h6>
        </div>

        <div class="col-md-3 col-sm-12" style="text-align: right; padding: 6px">
          <a type="button" class="btn-sm" :title="$t('contracts.copyabi')" @click="btnCopyabi"><i class="fa fa-copy"
              aria-hidden="true"></i></a>
        </div>
        <textarea v-model="contractabi" spellcheck="false" id="txtAbi" class="area-content"
          style="height: 300px; padding: 1px 1px; display: flex" readonly></textarea>
      </div>

      <div class="row" style="margin-top: 10px" v-if="contractbin != ''">
        <div class="col-md-9 col-sm-12">
          <h6 style="margin: 8px 0px; text-align: left">
            <i class="fa fa-code text-secondary mr-1"></i>{{ $t("contracts.Contractbin") }}
          </h6>
        </div>
        <textarea v-model="contractbin" spellcheck="false" class="area-content"
          style="height: 300px; padding: 1px 1px; display: flex" readonly></textarea>
      </div>
    </div>
  </div>
</template>
<script>
import { Message } from "element-ui";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import { showLoading, hideLoading } from "@/utils/loading";
import ContractTextarea from "./ContractTextarea.vue";
import ContractVerify from "./ContractVerify.vue";
import VTable from "@/components/modules/VTable.vue";
export default {
  name: "ContractTran",
  components: {
    ContractTextarea,
    VTable,
    ContractVerify,
  },
  props: {
    contract: {
      type: String,
      default: "",
    },
    contractname: {
      type: String,
      default: "",
    },
    contractcode: {
      type: String,
      default: "",
    },
    accInfo: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      areaText: "",
      codeList: [],
      total: 0,
      contractabi: "",
      contractbin: "",
      contractInfo: {},
      tableLeftHeard: [
        { title: "contracts.contractnames", name: "contractnames" },
        { title: "contracts.compilerversion", name: "compilerversion" },
      ],

      tableRightHeard: [
        { title: "contracts.optimizationenabled", name: "optimizationenabled" },
        { title: "contracts.othersettings", name: "othersettings" },
      ],

      contractcodes: "",
      contractnames: ""
    };
  },
  created() {
    this.contractInfo = this.accInfo;
    this.contractcodes = this.contractcode;
    this.contractnames = this.contractname;
    if (this.contractnames != '')
      this.getContractSources(1);
    else
      this.getContractInfo();
  },
  watch: {
    contractname(val) {
      this.contractnames = val;

      if (this.contractnames != '')
        this.getContractSources(1);
      else
        this.getContractInfo();
    },
    contractcode(val) {
      this.contractcodes = val;
    },
    accInfo(val) {
      this.contractInfo = val;
    },
  },
  methods: {
    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },

    loadContract(val) {
      this.contractname = val;
      this.contractabi = "";
      this.contractbin = "";
      this.$parent.getContractInfo();
      this.getContractSources(1);
    },

    btnCopySourcecode(id) {
      var copyCode = document.getElementById("sourcecode" + id).children[1];
      /* Select the text field */
      copyCode.select();
      copyCode.setSelectionRange(0, 99999); /* For mobile devices */
      /* Copy the text inside the text field */
      document.execCommand("copy");
      /* Alert the copied text */
      Message.info("Copied source code to clipboard");
    },
    btnCopyabi() {
      /* Get the text field */
      var copyAbi = document.getElementById("txtAbi");
      /* Select the text field */
      copyAbi.select();
      copyAbi.setSelectionRange(0, 99999); /* For mobile devices */
      /* Copy the text inside the text field */
      document.execCommand("copy");
      /* Alert the copied text */
      Message.info("Copied ABI to clipboard");
    },

    getContractInfo() {
      const param = {
        contract: this.contract,
      };
      api
        .post("/platform/getContractInfo", param)
        .then((response) => {
          if (response.result == null) {
            Message.error(response.message);
          } else {
            this.contractInfo = response.result;
            this.contractInfo.balance =
              helper
                .getDataFormat(response.result.balance, 18, 10000)
                .toFixed(4) + " UTG";
            this.ownerflag =
              this.contractInfo.admin1 != null && this.contractInfo.admin1 != "";
            this.contractInfo.contractname =
              this.contractInfo.contractname === null ||
                typeof this.contractInfo.contractname == "undefined"
                ? this.contractInfo.name
                : this.contractInfo.contractname;

            this.contractInfo.contractnames = this.contractInfo.contractname;
            this.contractInfo.compilerversion = this.contractInfo.vername;
            this.contractInfo.optimizationenabled = "No with 200 runs";
            this.contractInfo.othersettings = "default evmVersion";
            this.contractcodes = this.contractInfo.input;
            this.contractnames = this.contractInfo.contractname;
          }

          this.getContractSources(1);
        })
        .catch((error) => {
          Message.error(error.message);
        });
    },


    getContractSources() {
      showLoading();
      const param = {
        contract: this.contract,
      };
      api
        .post("/platform/getContractSources", param)
        .then((response) => {
          if (response.statusCode !== 0) {
            Message.error(response.message);
            hideLoading();
          } else {
            if (response.result === null || response.result.total === 0) {
              this.loadText = "";
              hideLoading();
              return;
            }
            var data = response.result;
            this.total = data.length;
            const newData = [];
            let temp = {};
            data.forEach((item, index) => {
              temp = {
                id: item.id,
                contract: item.contract,
                filename: item.filename,
                sourcecode: item.sourcecode,
                ord: item.ord,
                abi: item.abi,
                bin: item.bin,
              };

              if (this.contractabi == "") {
                this.contractabi = this.getJson(
                  JSON.parse(item.abi),
                  1,
                  this.contractnames
                );
                // console.log("contractabi:" + this.contractabi)
              }
              if (this.contractbin == "") {
                this.contractbin = this.getJson(
                  JSON.parse(item.bin),
                  0,
                  this.contractnames
                );
              }

              newData.push(temp);
            });
            this.codeList = newData;
            this.$parent.contracttotal = this.total;
            /*
              data.forEach((obj) => {
                if (this.contractabi == "") {
                  this.contractabi = this.getJson(
                    JSON.parse(obj.abi),
                    1,
                    this.contractname
                  );
                  console.log("contractabi:"+this.contractabi,obj.abi)
                }
                if (this.contractbin == "") {
                  this.contractbin = this.getJson(
                    JSON.parse(obj.bin),
                    0,
                    this.contractname
                  );
                }
              });
              */
            hideLoading();
          }
        })
        .catch((error) => {
          console.error(error);
          Message.error(error.ErrMsg);
          hideLoading();
        });
    },

    getJson(myJson, flag, key) {
      let str = "";
      for (var p in myJson) {
        // console.log("p:" + p, "key:" + key);
        if (p == key) {
          //console.log("p:" + p, "key:" + key);
          //console.log("myJson:" + JSON.stringify(myJson[p]));
          if (flag == 1) str = JSON.stringify(myJson[p]);
          else str = myJson[p];
          break;
        }
      }
      return str;
    },

    uploadCode(event) {
      const selectedFile = event.target.files[0];
      const name = selectedFile.name;
      const size = selectedFile.size;
      const reader = new FileReader();
      reader.readAsText(selectedFile);
      reader.onload = (e) => {
        //console.log(e.target.result);
        this.areaText = reader.result;
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}

.edit-container {
  height: 400px;
  padding: 1px 1px;
}

.edit {
  display: flex;
  height: 400px;
}

.leftBox {
  width: 40px;
  height: 100%;
  text-align: left;
}

.area-content {
  border: 1px solid #eaeaea;
  outline: none;
  float: left;
  width: 100%;
  height: 100%;
  resize: none;
  background: rgb(250, 250, 250);
  line-height: 20px;
  font-size: 12px;
  padding: 10px 8px;
  font-family: inherit;
}

#leftNum {
  float: left;
  width: 3%;
  height: 100%;
  outline: none;
  resize: none;
  overflow-y: hidden;
  overflow-x: hidden;
  border: 0;
  background: rgb(240, 240, 240);
  color: #999;
  text-align: right;
  padding: 12px 4px;
  line-height: 20px;
  font-size: 12px;
  font-weight: bold;
}

@media (min-width: 751px) {
  .viewheader {
    text-align: left;
  }

  .viewcard {
    margin-top: 5px;
  }

  .viewcardbody {
    text-align: left;
  }
}

@media (max-width: 750px) {
  .viewheader {
    text-align: left;
    border-bottom: #dddddd solid 2px;
    line-height: 30px;
    margin-bottom: 20px;
  }

  .viewcard {
    margin-top: 5px;
    border: none;
    box-shadow: none;
  }

  .viewcardbody {
    text-align: left;
    margin: 0px;
    padding: 0px;
  }
}
</style>
