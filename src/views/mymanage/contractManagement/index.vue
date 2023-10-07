<template>
  <div>
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body" v-loading="contract.loading">
          <div
            v-if="contract.options.length == 0"
            style="color: orange; min-height: 400px"
          >
            {{ $t("contract.notPermission") }}
          </div>

          <div v-if="contract.action">
            <div :class="'cell_table'" style="text-align: left">
              <el-form ref="form" label-width="auto" size="mini">
                <el-form-item :label="$t('contract.contract')">
                  <el-select
                    v-model="contract.action"
                    style="width: 90%; max-width: 320px"
                  >
                    <el-option
                      v-for="(item, cd) in contract.options"
                      :key="cd"
                      :value="item.contract"
                      :label="item.name"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item :label="$t('contract.contractAddress')">
                  {{ contract.action }}
                </el-form-item>
              </el-form>
            </div>
            <manage-view
              :contract-addr="contract.action"
              :datas="datas"
              v-if="isMainOwner"
              @upDatas="ownerManageData"
            />
          </div>
        </div>
      </div>
      <manage-table
        :datas="datas"
        :contract-addr="contract.action"
        v-if="isMainOwner"
        @upDatas="ownerManageData"
      />
    </div>
  </div>
</template>
<script>
import manageTable from "@/views/mymanage/contractManagement/manageTable.vue";
import manage from "@/views/mymanage/contractManagement/manage.vue";
import webSdk from "@/utils/webSdk";
import * as api from "@/api/api";
export default {
  name: "contractManagement",
  components: { ManageView: manage, ManageTable: manageTable },
  data() {
    let datas = {};
    webSdk.ownerConfig.forEach((item) => {
      datas[item.name] = "";
    });
    return {
      setTime: null,
      contract: {
        loading: false,
        options: [],
        action: "",
      },
      componentMap: {
        manageTable,
      },

      datas,
    };
  },

  mounted() {
    this.loadTypes();
    this.setTime = setInterval(() => {
      this.ownerManageData();
    }, 15000);
  },
  beforeDestroy() {
    this.setTime && clearInterval(this.setTime);
  },
  methods: {
    loadTypes() {
      if (!this.$store.getters.account) return;

      this.contract.loading = true;
      api
        .post("/platform/getLockupContracts", {
          address: this.$store.getters.account,
        })
        .then((response) => {
          let options = response.result || [];

          let action = options.length > 0 ? options[0].contract : "";
          this.contract.options = options;
          this.contract.action = action;
          this.ownerManageData();
          this.contract.loading = false;
        })
        .catch((err) => {
          this.contract.loading = false;
          console.error(err);
        });
    },
    ownerManageData() {
      let sdk = this.$store.getters.getsdk || null;
      if (sdk && this.contract.action) {
        console.log("-----------------");
        sdk.ownerManageData(this.contract.action, this.datas);
      } else {
        Object.assign(this.$data.datas, this.$options.data().datas);
      }
    },
  },
  computed: {
    isMainOwner() {
      let account = this.$store.getters.account || "";
      if (!account) {
        return false;
      }
      account = account.toLocaleLowerCase();
      return account == this.datas.owner;
    },
  },
  watch: {
    "$store.getters.getsdk": function () {
      this.loadTypes();
    },
    "$store.getters.account": function () {
      this.loadTypes();
    },
    "contract.action": function () {
      this.ownerManageData();
    },
  },
};
</script>

<style>
.cell_table {
  margin: 0px auto;
  text-align: left;
}
@media (min-width: 970px) {
  .cell_table .el-form-item {
    display: inline-block;
  }
}
@media (max-width: 970px) {
  .cell_table {
    max-width: 450px;
  }
}
</style>
