<template>
  <div>
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body">
          <h4 class="mt-0 header-title" style="text-align: left">
            {{ $t("storagemining.storageDetails") }}
          </h4>
          <div class="row">
            <div class="col-md-7">
              <div class="card" style="margin-top: 5px">
                <div class="card-body" style="text-align: left">
                  <h4 class="mt-0 header-title"></h4>
                  <div class="table-responsive">
                    <table class="table table-hover mb-0">
                      <tbody>
                        <tr>
                          <td style="min-width: 100px">
                            {{ $t("storagemining.Minersaddress") }}
                          </td>
                          <td>
                            <span style="color: #2ebac6">
                              {{ nodeinfo.miner_addr }}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td tyle="min-width: 100px;">
                            {{ $t("storagemining.revenueaddress") }}
                          </td>
                          <td>{{ nodeinfo.revenue_address }}</td>
                        </tr>
                        <!--
                        <tr>
                          <td tyle="min-width: 100px;">
                            {{ $t("storagemining.minerstatus") }}
                          </td>
                          <td>{{ $t(nodeinfo.minerstatus) }}</td>
                        </tr>
                        
                        <tr>
                          <td tyle="min-width: 100px;">
                            {{ $t("storagemining.bandwidth") }}
                          </td>
                          <td>{{ nodeinfo.bandwidth }}</td>
                        </tr>
                        -->
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-5">
              <div class="card" style="margin-top: 5px">
                <div class="card-body" style="text-align: left">
                  <h4 class="mt-0 header-title"></h4>
                  <div class="table-responsive">
                    <table class="table table-hover mb-0">
                      <tbody>
                        <!--
                        <tr>
                          <td tyle="min-width: 100px;">
                            {{ $t("storagemining.pledgequantity") }}
                          </td>
                          <td>{{ nodeinfo.pledgequantity }}</td>
                        </tr>
                        -->
                        <tr>
                          <td tyle="min-width: 100px;">
                            {{ $t("storagemining.miningearnings") }}
                          </td>
                          <td>{{ nodeinfo.miningearnings }}</td>
                        </tr>
                        <tr>
                          <td tyle="min-width: 100px;">
                            {{ $t("storagemining.lockquantity") }}
                          </td>
                          <td>{{ nodeinfo.lockquantity }}</td>
                        </tr>
                        <tr>
                          <td tyle="min-width: 100px;">
                            {{ $t("storagemining.releasedquantity") }}
                          </td>
                          <td>{{ nodeinfo.releasedquantity }}</td>
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

    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body" style="margin: 20px 4px; padding: 0px">
          <div class="col-md-4" style="margin: 0px; padding: 0px">
            <ul
              class="nav nav-pills nav-justified"
              role="tablist"
              style="
                font-size: 11pt;
                font-weight: bold;
                margin: 0px;
                padding: 0px;
              "
            >
              <li class="nav-item waves-effect waves-light">
                <a
                  class="nav-link active"
                  data-toggle="tab"
                  href="#storage-reward"
                  role="tab"
                  aria-selected="true"
                  @click="handleNavLink($event)"
                >
                  <span class="d-none d-md-block">
                    {{ $t("storagemining.storagereward") }}
                  </span>
                  <span class="d-block d-md-none">
                    {{ $t("storagemining.storagereward") }}
                  </span>
                </a>
              </li>
              <li class="nav-item waves-effect waves-light">
                <a
                  class="nav-link"
                  data-toggle="tab"
                  href="#storage-freed"
                  role="tab"
                  @click="handleNavLink($event)"
                >
                  <span class="d-none d-md-block">
                    {{ $t("storagemining.storagerelease") }}
                  </span>
                  <span class="d-block d-md-none">
                    {{ $t("storagemining.storagerelease") }}
                  </span>
                </a>
              </li>
            </ul>
          </div>
          <!-- Tab panes -->
          <div
            class="tab-content"
            style="border-top: solid 1px #f0f0f0; margin-top: 20px"
          >
            <div
              class="tab-pane active p-3"
              id="storage-reward"
              role="tabpanel"
            >
              <StorageRewards :node_type="type" :node_addr="minerAddr" />
            </div>
            <div class="tab-pane p-3" id="storage-freed" role="tabpanel">
              <RewardRelease :node_type="typer" :node_addr="minerAddr" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body">
          <h4></h4>
          <LogTable :param="getParamOne" />
        </div>
      </div>
    </div>
    -->
  </div>
</template>
<script>
import LogTable from "@/views/mymanage/mininglog/LogTable.vue";
import StorageRewards from "./StorageReward.vue";
import RewardRelease from "./RewardRelease.vue";
import utils from "@/utils/utils";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
export default {
  name: "NodeDetail",
  components: {
    LogTable,
    StorageRewards,
    RewardRelease,
  },
  data() {
    const types = {
      1: "lock.state21",
      2: "lock.state22",
      3: "lock.state23",
    };
    return {
      minerAddr: "",
      type: 0,
      typer: 0,
      nodeinfo: {},
      logparam: {},
      loadText: this.$t("comm.clickLoad"),
      fblock: "",
      lblock: "",
      searchInput: null,
      types,
    };
  },

  created() {
    let idL = this.$route.params.id;
    let ids = idL.split("_");
    this.minerAddr = ids[0];
    this.type = parseInt(ids[1]);
    this.typer = parseInt(ids[1]) + 1;
    if (!this.minerAddr) {
      return;
    }
    console.log("minerAddr=" + this.minerAddr);
    this.getMinerDetail();
    sessionStorage.setItem("MinerView", true);
  },

  methods: {
    getAddrFormat(data, number = 15) {
      return helper.getAddrFormat(data, number);
    },
    handleNavLink(event) {
      $(".nav-link").removeClass("active");
      console.log(event.target.tagName);
      event.currentTarget.className = "nav-link active";
    },

    getMinerDetail() {
      let param = {
        miner_addr: this.minerAddr,
      };
      api
        .postJson("/platform/my/getminerdetail", param)
        .then((response) => {
          let item = response.result || {};
          this.nodeinfo = {
            miner_addr: item.miner_addr,
            revenue_address: item.revenue_address,
            minerstatus: this.types[item.miner_status],
            bandwidth: utils.bytesToSize(item.bandwidth || 0),
            pledgequantity: utils.clearZero(item.pledge_amount, 4) + " UTG",
            miningearnings: utils.clearZero(item.revenue_amount, 4) + " UTG",
            lockquantity:
              utils.clearZero(item.lock_amount - item.release_amount, 4) +
              " UTG",
            releasedquantity: utils.clearZero(item.release_amount, 4) + " UTG",
          };
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },

  computed: {
    getParamOne() {
      return {
        revenue_address: "",
        miner_addr: this.minerAddr,
        isLike: false,
      };
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
