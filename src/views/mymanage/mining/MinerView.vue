<template>
  <div class="ieHome">
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body">
          <h4 class="mt-0 header-title" style="text-align: left">
            {{ $t("mymanageMining.miningparticulars") }}
          </h4>
          <div class="row">
            <div class="col-md-6">
              <div class="card" style="margin-top: 5px">
                <div class="card-body" style="text-align: left">
                  <h4 class="mt-0 header-title"></h4>
                  <div class="table-responsive">
                    <table class="table table-hover mb-0">
                      <tbody>
                        <tr>
                          <td style="min-width: 120px">
                            {{ $t("mymanageMining.miner") }}
                          </td>
                          <td>
                            <span style="color: #2ebac6">{{
                              nodeinfo.miner
                            }}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="min-width: 150px">
                            {{ $t("mymanageMining.lockamount") }}
                          </td>
                          <td>{{ nodeinfo.lockamount }}</td>
                        </tr>
                        <tr>
                          <td style="min-width: 150px">
                            {{ $t("mymanageMining.freed") }}
                          </td>
                          <td>{{ nodeinfo.freed }}</td>
                        </tr>
                        <tr>
                          <td style="min-width: 120px">
                            {{ $t("mymanageMining.payearnings") }}
                          </td>
                          <td>{{ nodeinfo.payearnings }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card" style="margin-top: 5px">
                <div class="card-body" style="text-align: left">
                  <h4 class="mt-0 header-title"></h4>
                  <div class="table-responsive">
                    <table class="table table-hover mb-0">
                      <tbody>
                        <tr>
                          <td style="min-width: 150px">
                            {{ $t("mymanageMining.minerstatus") }}
                          </td>
                          <td>{{ $t(nodeinfo.minerstatus) }}</td>
                        </tr>
                        <tr>
                          <td style="min-width: 120px">
                            {{ $t("mymanageMining.jointime") }}
                          </td>
                          <td style="min-width: 200px">
                            {{ nodeinfo.jointime }}
                          </td>
                        </tr>
                        <tr>
                          <td style="min-width: 120px">
                            {{ $t("mymanageMining.miningearnings") }}
                          </td>
                          <td>{{ nodeinfo.miningearnings }}</td>
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

    <logtable :param="getParamOne" />
  </div>
</template>
<script>
import utils from "@/utils/utils";
import * as api from "@/api/api";
import logtable from "@/views/mymanage/mininglog/LogTable.vue";
export default {
  components: { logtable },
  data() {
    return {
      address: "",

      nodeinfo: {},
    };
  },
  created() {
    this.address = this.$route.params.id;
    if (!this.address) {
      return;
    }

    this.getrowDatas();
  },
  activated() {
    this.getrowDatas();
  },
  methods: {
    getStrType(obj, map) {
      for (let key in map) {
        let str = map[key];
        obj[key] = utils.isEmpty(obj[key]) ? "" : `${obj[key]} ${str}`;
      }
    },
    getrowDatas() {
      api
        .postJson("/platform/my/getminerdetail", {
          miner_addr: this.address,
        })
        .then((response) => {
          let item = response.result || {};
          item.revenue_amount = utils.clearZero(item.revenue_amount);
          item.release_amount = utils.clearZero(item.release_amount);
          item.lock_amount = utils.clearZero(item.lock_amount);

          switch (item.miner_status + "") {
            case "1":
              item.miner_statusstr = "mymanageMining.mining";
              break;
            case "2":
              item.miner_statusstr = "mymanageMining.waitingmining";
              break;
            case "3":
              item.miner_statusstr = "mymanageMining.alreadyexits";
              break;
            default:
              item.miner_statusstr = "--";
              break;
          }
          let map = {
            lock_amount: "UTG",
            release_amount: "UTG",
            bandwidth: "MB",
            payful: "SRT",
            revenue_amount: "UTG",
            surplusful: "SRT",
          };
          this.getStrType(item, map);

          let miner_storage = item.miner_storage || 0;
          miner_storage =
            miner_storage >= 1024
              ? utils.weedZero(miner_storage / 1024, 4) + " GB"
              : `${miner_storage} MB`;
          item.miner_storage = miner_storage;

          this.nodeinfo = {
            miner: this.address,
            minerstatus: item.miner_statusstr,
            revenueamount: item.miner_storage,
            lockamount: item.lock_amount,
            freed: item.release_amount,
            payearnings: item.revenue_address,
            jointime: item.join_time,
            miningearnings: item.revenue_amount,
            theremaining: item.surplusful,
          };
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  computed: {
    getParamOne() {
      return {
        revenue_address: "",
        miner_addr: this.address,
        isLike: true,
      };
    },
  },
};
</script>
