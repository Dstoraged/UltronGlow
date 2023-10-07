<template>
  <div>
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body">
          <h4 class="mt-0 header-title" style="text-align: left">
            {{ $t("mymanage.blockreward") }}
          </h4>
          <div class="row">
            <div class="col-md-7">
              <div class="card" style="margin-top: 5px">
                <div class="card-body" style="text-align: left">
                  <h4 class="mt-0 header-title">
                    {{ $t("mymanage.blockTotalutg", [nodeinfo.totalamount]) }}
                  </h4>
                  <div class="table-responsive" style="min-height: 100px">
                    <table class="table table-hover mb-0">
                      <tbody>
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
                          <td></td>
                          <td></td>
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
          </div>
        </div>
      </div>
    </div>

    <ReleaseRecord :type="type" :title="tableTitle" ref="refRecord" />
  </div>
</template>
<script>
import ReleaseRecord from "./ReleaseRecord.vue";
import utils from "@/utils/utils";
import * as api from "@/api/api";
export default {
  name: "NodeDetail",
  components: {
    ReleaseRecord,
  },
  data() {
    return {
      type: 1,
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
          datas.totalamount = `${utils.clearZero(datas.totalamount)}`;
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
      this.$refs.refRecord.lockUtgMiners(1);
    },
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
</style>
