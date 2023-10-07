<template>
  <div>
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body">
          <h4 class="mt-0 header-title" style="text-align: left">
            {{ $t("mymanage.BandwidthReward") }}
          </h4>
          <div class="row">
            <div class="col-md-7">
              <div class="card" style="margin-top: 5px">
                <div class="card-body" style="text-align: left">
                  <h4 class="mt-0 header-title">
                    {{ $t("mymanage.revenuesaddress") }}
                    <span style="color: #2ebac6">{{
                      this.$store.getters.account
                    }}</span>
                  </h4>
                  <div class="table-responsive">
                    <table class="table table-hover mb-0">
                      <tbody>
                        <tr>
                          <td style="min-width: 100px">
                            {{ $t("mymanage.BandwidthReward") }}
                          </td>
                          <td>{{ nodeinfo.totalamount }}</td>
                        </tr>
                        <tr>
                          <td style="min-width: 100px">
                            {{ $t("lock.LockedReward") }}
                          </td>
                          <td>{{ nodeinfo.leftamount }}</td>
                        </tr>
                        <tr>
                          <td style="min-width: 100px">
                            {{ $t("lock.ReleasedReward") }}
                          </td>
                          <td>{{ nodeinfo.releaseamount }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-5" v-if="false">
              <div class="card" style="margin-top: 5px">
                <div class="card-body" style="text-align: left">
                  <h4 class="mt-0 header-title"></h4>
                  <div class="table-responsive">
                    <table class="table table-hover mb-0">
                      <tbody>
                        <tr>
                          <td style="min-width: 100px">
                            {{ $t("lock.ReleasedReward") }}
                          </td>
                          <td>{{ nodeinfo.releaseamount }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ReleaseRecord :type="type" :title="tableTitle" />
  </div>
</template>
<script>
import ReleaseRecord from "@/views/mymanage/blockreward/ReleaseRecord.vue";
import utils from "@/utils/utils";
import * as api from "@/api/api";
export default {
  name: "NodeDetail",
  components: {
    ReleaseRecord,
  },
  data() {
    return {
      type: 9,
      title: "mymanage.BandwidthReward",
      tableTitle: "mymanage.releaserecord",
      nodeinfo: {},
    };
  },
  created() {
    this.loadDatas();
  },
  methods: {
    loadDatas() {
      let param = {
        type: this.type,
        revenueAddress: this.$store.getters.account,
      };
      api
        .postJson("/platform/lockSummaryByRevAddress", param)
        .then((response) => {
          let datas = response.result || {};
          datas.totalamount = `${utils.clearZero(datas.totalamount)}  UTG`;
          datas.releaseamount = `${utils.clearZero(datas.releaseamount)} UTG`;
          datas.leftamount = `${utils.clearZero(datas.leftamount)} UTG`;
          this.nodeinfo = datas;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  watch: {
    "$store.getters.account": function () {
      this.loadDatas();
    },
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
</style>
