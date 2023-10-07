<template>
  <div>
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body">
          <h4 class="mt-0 header-title" style="text-align: left">
            {{ $t("node.nodeDetails") }}
          </h4>
          <div class="row">
            <div class="col-md-7">
              <div class="card viewcard">
                <div class="card-body viewcardbody">
                  <h4 class="mt-0 header-title"></h4>
                  <div class="table-responsive">
                    <VTable
                      :table-heard="tableLeftHeard"
                      :datas="nodeinfo"
                      title-width="110px"
                      id="tableLeftHeardid"
                    >
                    </VTable>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-5">
              <div class="card viewcard">
                <div class="card-body viewcardbody">
                  <h4 class="mt-0 header-title"></h4>
                  <div class="table-responsive">
                    <VTable
                      :table-heard="tableRightHeard"
                      :datas="nodeinfo"
                      title-width="110px"
                      id="tableRightHeardid"
                    >
                      <template slot="avl_left_rate">
                        <el-popover
                          placement="top-start"
                          width="300"
                          trigger="hover"
                          :content="$t('node.ratedescribe')"
                        >
                          <el-button
                            slot="reference"
                            type="text"
                            style="color: #333"
                            ><i class="mdi dripicons-information"></i
                          ></el-button>
                        </el-popover>
                      </template>
                    </VTable>
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
          <div class="col-md-12" style="margin: 0px; padding: 0px">
            <ul
              class="nav nav-pills nav-justified phone_nav_overflow-x"
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
                  href="#awards-detail"
                  role="tab"
                  aria-selected="true"
                  @click="handleNavLink($event)"
                >
                  <span class="d-none d-md-block">
                    {{ $t("rewards.RewardDetails") }}
                  </span>
                  <span class="d-block d-md-none">
                    {{ $t("rewards.RewardDetails") }}
                  </span>
                </a>
              </li>

              <li class="nav-item waves-effect waves-light">
                <a
                  class="nav-link"
                  data-toggle="tab"
                  href="#lock-nodeaward"
                  role="tab"
                  aria-selected="true"
                  @click="handleNavLink($event)"
                >
                  <span class="d-none d-md-block">
                    {{ $t("lock.nodeaward") }}
                  </span>
                  <span class="d-block d-md-none">
                    {{ $t("lock.nodeaward") }}
                  </span>
                </a>
              </li>

              <li class="nav-item waves-effect waves-light">
                <a
                  class="nav-link"
                  data-toggle="tab"
                  href="#lock-releasedrecord"
                  role="tab"
                  @click="handleNavLink($event)"
                >
                  <span class="d-none d-md-block">
                    {{ $t("lock.releasedrecord") }}
                  </span>
                  <span class="d-block d-md-none">
                    {{ $t("lock.releasedrecord") }}
                  </span>
                </a>
              </li>

              <li class="nav-item waves-effect waves-light" v-if="type == 3">
                <a
                  class="nav-link"
                  data-toggle="tab"
                  href="#lock-nodeLock"
                  role="tab"
                  @click="handleNavLink($event)"
                >
                  <span class="d-none d-md-block">
                    {{ $t("lock.nodeLock") }}
                  </span>
                  <span class="d-block d-md-none">
                    {{ $t("lock.nodeLock") }}
                  </span>
                </a>
              </li>
              <li class="nav-item waves-effect waves-light">
                <a
                  class="nav-link"
                  data-toggle="tab"
                  href="#lock-nodeblock"
                  role="tab"
                  @click="handleNavLink($event)"
                >
                  <span class="d-none d-md-block">
                    {{ $t("lock.blockrecord") }}
                  </span>
                  <span class="d-block d-md-none">
                    {{ $t("lock.blockrecord") }}
                  </span>
                </a>
              </li>
              <li class="nav-item waves-effect waves-light">
                <a
                  class="nav-link"
                  data-toggle="tab"
                  href="#lock-absentblock"
                  role="tab"
                  @click="handleNavLink($event)"
                >
                  <span class="d-none d-md-block">
                    {{ $t("absent.absentRecord") }}
                  </span>
                  <span class="d-block d-md-none">
                    {{ $t("absent.absentRecord") }}
                  </span>
                </a>
              </li>

              <li class="nav-item waves-effect waves-light" v-if="true">
                <a
                  class="nav-link"
                  data-toggle="tab"
                  href="#lock-pledgeRecord"
                  role="tab"
                  @click="handleNavLink($event)"
                >
                  <span class="d-none d-md-block">
                    {{ $t("node.pledgerecord") }}
                  </span>
                  <span class="d-block d-md-none">
                    {{ $t("node.pledgerecord") }}
                  </span>
                </a>
              </li>

              <li class="nav-item waves-effect waves-light" v-if="true">
                <a
                  class="nav-link"
                  data-toggle="tab"
                  href="#lock-pledgeReward"
                  role="tab"
                  @click="handleNavLink($event)"
                >
                  <span class="d-none d-md-block">
                    {{ $t("node.pledgeReward") }}
                  </span>
                  <span class="d-block d-md-none">
                    {{ $t("node.pledgeReward") }}
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
            <div class="tab-pane active" id="awards-detail" role="tabpanel">
              <awardsDetail
                :p-params="{ nodeAddress: address, nodeType: 'PoS' }"
              />
            </div>

            <div class="tab-pane" id="lock-nodeaward" role="tabpanel">
              <LockNodeaward :node_type="1" :node_addr="address" />
            </div>
            <div class="tab-pane" id="lock-releasedrecord" role="tabpanel">
              <LockNodeRelease :node_type="2" :node_addr="address" />
            </div>
            <div
              class="tab-pane"
              id="lock-nodeLock"
              role="tabpanel"
              v-if="type == 3"
            >
              <LockNodeLock :node_type="3" :node_addr="address" />
            </div>
            <div class="tab-pane" id="lock-nodeblock" role="tabpanel">
              <LockNodeBlock :node_addr="address" />
            </div>
            <div class="tab-pane" id="lock-absentblock" role="tabpanel">
              <LockAbsentBock :node_addr="address" />
            </div>

            <div
              class="tab-pane"
              id="lock-pledgeRecord"
              role="tabpanel"
              v-if="true"
            >
              <PledgeRecord :node_addr="address" />
            </div>
            <div
              class="tab-pane"
              id="lock-pledgeReward"
              role="tabpanel"
              v-if="true"
            >
              <PledgeReward :node_addr="address" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import LockNodeaward from "./components/LockNodeaward.vue";
import LockNodeLock from "./components/LockNodeLock.vue";
import LockNodeBlock from "./components/LockNodeBlock.vue";
import LockAbsentBock from "./components/LockAbsentBock.vue";
import LockNodeRelease from "./components/LockNodeRelease.vue";
import PledgeRecord from "./components/PledgeRecord.vue";
import PledgeReward from "./components/PledgeReward.vue";
import awardsDetail from "@/views/locks/awards.vue";
import VTable from "@/components/modules/VTable.vue";
import utils from "@/utils/utils";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
export default {
  name: "NodeDetail",
  components: {
    awardsDetail,
    LockNodeaward,
    LockNodeLock,
    LockNodeBlock,
    LockAbsentBock,
    LockNodeRelease,
    PledgeRecord,
    PledgeReward,
    VTable,
  },
  props: {},
  data() {
    const types = {
      0: "node.unknownType",
      1: "node.candidateNode",
      2: "node.witnessNode",
      3: "node.signoutNode",
    };
    return {
      tableLeftHeard: [
        {
          title: "lock.minerAddress",
          name: "node_address",
          popover: true,
          format: true,
          phoneFormat: true,
        },
        {
          title: "node.manageaddress",
          name: "manage_address",
          popover: true,
          format: true,
          phoneFormat: true,
        },
        {
          title: "lock.revenuesaddress",
          name: "revenue_address",
          popover: true,
          format: true,
          phoneFormat: true,
        },
        { title: "lock.nodeLock", name: "pledgelockamounts" },
        { title: "lock.nodeFreed", name: "pledgereleaseamount" },
        { title: "node.Lastpledgetime", name: "join_time" },
      ],

      tableRightHeard: [
        { title: "node.nodetype", name: "type", valT: true },
        { title: "node.activeheight", name: "blocknumber" },
        { title: "lock.totalPledgeAmount", name: "total_amount" },
        { title: "lock.nodeawardtotal", name: "lockamount" },
        { title: "lock.nodeawardlock", name: "totalAmount" },
        { title: "lock.ReleasedReward", name: "releaseamount" },
        { title: "node.chargerate", name: "rate" },
      ],
      address: "",
      type: 0,
      nodeinfo: {},
      types,
      getNowHeight: {
        sync: true,
        fun: utils.getNowHeight,
      },
    };
  },
  created() {
    let idL = this.$route.params.id;
    let ids = idL.split("_");
    this.address = ids[0];
    this.type = ids[1] - 1;
    //console.log("type=" + this.type, "address=" + this.address);
    sessionStorage.setItem("detail", true);
  },
  mounted() {
    this.getNodeInfo();
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

    getNodeInfo() {
      let param = {
        node_address: this.address,
        version: 2,
      };
      api
        .postJson("/platform/node/getcadnode", param)
        .then((response) => {
          let result = response.result || {};
          result.totalAmount = `${utils.clearZero(
            result.lockamount - result.releaseamount
          )} UTG`;
          result.lockamount = `${utils.clearZero(result.lockamount)} UTG`;
          result.releaseamount = `${utils.clearZero(result.releaseamount)} UTG`;
          result.pledge_amount = `${utils.clearZero(result.pledge_amount)} UTG`;
          result.total_amount = `${utils.clearZero(result.total_amount)} UTG`;
          result.exitlockamount = `${utils.clearZero(
            result.exitlockamount - result.exitreleaseamount
          )} UTG`;
          result.exitreleaseamount = `${utils.clearZero(
            result.exitreleaseamount
          )} UTG`;
          result.type = this.types[result.node_type || 0];
          result.revenue_address = result.revenue_address || "--";
          result.rate = result.rate ? result.rate / 100 + "%" : "";

          result.pledgelockamounts = `${utils.clearZero(
            result.pledgelockamount - result.pledgereleaseamount
          )} UTG`;
          result.pledgereleaseamount = `${utils.clearZero(
            result.pledgereleaseamount
          )} UTG`;

          this.nodeinfo = result;
          this.nodeinfo.node_address = this.address;
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

.phone_nav_overflow-x {
  width: 100%;
  overflow-x: auto;
  display: grid;
  grid-template-columns: repeat(7, minmax(160px, auto));
  text-align: center;
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
