<template>
  <div>
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body">
          <h4 class="mt-0 header-title">
            {{ $t("storagemining.miningview") }}
          </h4>
          <el-form ref="form" :model="form" label-width="150px">
            <el-form-item
              :label="$t('storagemining.trans_hash')"
              v-if="false"
              >{{ form.trans_hash }}</el-form-item
            >
            <el-form-item :label="$t('storagemining.report_time')">{{
              form.report_time
            }}</el-form-item>
            <el-form-item :label="$t('storagemining.en_address')">{{
              form.en_address
            }}</el-form-item>
            <el-form-item :label="$t('storagemining.storage_value')">
              {{ form.storage_value }}
              <template>
                <span v-if="form.storage_value">MB</span>
              </template>
            </el-form-item>
            <el-form-item :label="$t('storagemining.router_ipaddr')">{{
              form.router_ipaddr
            }}</el-form-item>
            <el-form-item :label="$t('storagemining.from_addr')">{{
              form.from_addr
            }}</el-form-item>
            <el-form-item :label="$t('storagemining.to_addr')">{{
              form.to_addr
            }}</el-form-item>
            <el-form-item :label="$t('storagemining.router_ipaddr')">{{
              form.router_ipaddr
            }}</el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
export default {
  name: "MiningView",
  data() {
    return {
      hash: "",
      form: {},
      loadText: this.$t("comm.clickLoad"),
    };
  },
  created() {
    this.hash = this.$route.params.id || "";
    let that = this;
    this.getutgCltDetail();
    setTimeout(function () {
      that.getutgCltDetail();
    }, 60000);
  },
  mounted() {},
  methods: {
    getAddrFormat(data, number) {
      return helper.getAddrFormat(data, number);
    },

    getutgCltDetail() {
      var that = this;
      api
        .postJson("/platform/storage/utgCltDetail", { hash: that.hash })
        .then((response) => {
          if (response.statusCode !== 0) {
            that.$message({
              type: "error",
              message: response.message,
            });
          } else {
            if (response.result === null || response.result.total === 0) {
              that.loadText = "";
              return;
            }
            var data = response.result;
            that.form = data;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
.is_activity {
  background: rgba(249, 250, 252, 1);
  color: #2d353b;
}
</style>
