<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 20px">
      <div class="card-body" style="width: 100%">
        <h4 class="mt-0 header-title" style="width: 100%; text-align: center">
          {{ $t("verifycontract.VerifyContractTitle") }}
        </h4>
        <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            text-align: center;
            margin-top: 40px;
          ">
          <form role="form" class="form-horizontal col-md-5" style="text-align: left" id="form">
            <div class="form-group">
              <label for="name">
                {{ $t("verifycontract.contractaddress") }}</label>
              <input type="text" class="form-control" v-model="contractaddress" />
            </div>
            <div class="form-group">
              <label for="name"> {{ $t("verifycontract.contractname") }}</label>
              <input type="text" class="form-control" v-model="contractname" />
            </div>
            <div class="form-group" v-if="false">
              <label for="pwd">{{ $t("verifycontract.compilertype") }}</label>
              <select class="form-control" v-model="compilertype">
                <option value="">
                  [{{ $t("verifycontract.pleaseselect") }}]
                </option>
                <option value="1" selected="selected">
                  Solidity (Single file)
                </option>
                <option value="2">Solidity (Multi-Part files)</option>
                <option value="3">Solidity (Standard-Json-Input)</option>
              </select>
            </div>
            <div class="form-group">
              <label for="pwd">{{
                  $t("verifycontract.compilerversion")
              }}</label>
              <select class="form-control" v-model="compilerversion">
                <option value="">
                  [{{ $t("verifycontract.pleaseselect") }}]
                </option>
                <option v-for="(item, index) in versionList" :key="index" :value="item.version">
                  {{ item.vername }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <el-upload class="upload-import" ref="uploadImport" action="" :file-list="files" :on-change="handleChange"
                :limit="20" :auto-upload="false">
                <el-button size="small" type="primary">{{
                    $t("verifycontract.selectfile")
                }}</el-button>
              </el-upload>
            </div>

            <div class="form-group">
              <div class="col-sm-offset-4 col-sm-8">
                <button class="btn btn-info" @click="verify($event)">
                  {{ $t("verifycontract.verify") }}
                </button>
              </div>
            </div>

            <div class="form-group">
              <span v-if="verifystatus == 0" style="color: #2ebac6">{{ $t("verifycontract.verifyresult") }}
                {{ $t("comm.success") }}
              </span>
              <span v-else-if="verifystatus == -1"></span>
              <span v-else style="color: #fa8072">
                {{ $t("verifycontract.verifyresult") }} {{ $t("comm.fail") }}
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Message } from "element-ui";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
export default {
  name: "ContractVerify",
  components: {},
  props: {
    contract: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      account_address: "",
      contractaddress: "",
      contractname: "",
      compilertype: "",
      compilerversion: "",
      licensetype: "",
      files: [],
      verifystatus: -1,
      verifyresult: "",
      verifymessage: "",
      versionList: [],
    };
  },
  created() {
    this.account_address = this.$store.getters.account;
    this.contractaddress = this.contract;
    this.getContractVersion();
  },

  methods: {
    formatTime(time) {
      return helper.formatTimimg(time);
    },
    getAddrFormat(data, number) {
      return helper.getAddrFormat(data, number);
    },

    goToUrl(contract, path = "ContractInfo") {
      helper.goPathUrl(this, path, contract);
    },

    getFile: function (event) {
      this.files = event.target.files;
    },

    handleChange(file, fileList) {
      this.files = fileList;
      console.log(fileList);
    },

    getContractVersion() {
      api
        .get("/platform/getContractVersions")
        .then((response) => {
          if (response.statusCode !== 0) {
            Message.error(response.message);
          } else {
            this.versionList = response.result;
          }
        })
        .catch((error) => {
          console.error(error);
          Message.error(error.ErrMsg);
        });
    },

    verify(event) {
      event.preventDefault();

      if (
        this.contractaddress == "" ||
        this.contractaddress == null ||
        this.contractaddress == "undefined"
      ) {
        this.$message.error(`${this.$t("verifycontract.contractaddress")}`);
        return;
      }

      if (
        this.contractname == "" ||
        this.contractname == null ||
        this.contractname == "undefined"
      ) {
        this.$message.error(`${this.$t("verifycontract.contractname")}`);
        return;
      }

      if (
        this.compilerversion == "" ||
        this.compilerversion == null ||
        this.compilerversion == "undefined"
      ) {
        this.$message.error(`${this.$t("verifycontract.compilerversion")}`);
        return;
      }

      let formData = new FormData();
      //formData.append("compiler", this.compilertype);
      formData.append("contract", this.contractaddress);
      formData.append("name", this.contractname);
      formData.append("version", this.compilerversion);

      /*
            for (let i = 0; i < this.files.length; i++) {
                console.log(this.files[i].name)
                formData.append("files", this.files[i]);
            }
            */
      this.files.forEach((item) => {
        formData.append("files", item.raw);
        console.log(item.raw);
      });

      const config = { headers: { "Content-Type": "multipart/form-data" } };
      api
        .postJson("/platform/verifyContractSources", formData)
        .then((response) => {
          this.verifystatus = response.statusCode;
          this.verifyresult = response.result;
          this.verifymessage = response.message;
          if (response.statusCode == 0) {
            Message.success(response.result);
            this.$parent.loadContract(this.contractname);            
          }
          else
            Message.error(response.result);
        })
        .catch((error) => {
          this.verifystatus = -1;
          this.verifyresult = error.Message;
          console.error(error.Message);
          Message.error(error.Message);                 
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
