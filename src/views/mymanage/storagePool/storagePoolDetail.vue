<template>
  <div>
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body">
          <h4 class="mt-0 header-title" style="text-align: left">
            {{ $t("storagePool.storagePoolDetails") }}
          </h4>
          <div class="row">
            <div class="col-md-6" v-for="(item, cd) in heads" :key="`cd_${cd}`">
              <div class="card" style="margin-top: 5px">
                <div class="card-body" style="text-align: left">
                  <h4 class="mt-0 header-title"></h4>
                  <div class="table-responsive">
                    <table class="table table-hover mb-0 phone-table-ie">
                      <tbody>
                        <tr
                          v-for="(itemt, cdt) in item || []"
                          :key="`cdt_${cdt}`"
                        >
                          <td style="min-width: 130px">
                            {{ $t(itemt.title) }}
                            <template v-if="itemt.name == 'feeRate'">
                              <div class="btn-group">
                                <el-popover
                                  placement="top-start"
                                  width="300"
                                  trigger="hover"
                                  :content="$t('storagePool.ratesMessage')"
                                >
                                  <el-button
                                    slot="reference"
                                    class="btn btn-sm btn-block"
                                    style="
                                      padding: 1px;
                                      border-radius: 4px;
                                      margin-left: 0px;
                                      height: 19px;
                                    "
                                    ><i class="mdi dripicons-information"></i
                                  ></el-button>
                                </el-popover>
                              </div>
                            </template>
                            <template v-else-if="itemt.name == 'entrustRate'">
                              <div class="btn-group">
                                <el-popover
                                  placement="top-start"
                                  width="300"
                                  trigger="hover"
                                  :content="$t('storagePool.ratioMessage')"
                                >
                                  <el-button
                                    slot="reference"
                                    class="btn btn-sm btn-block"
                                    style="
                                      padding: 1px;
                                      border-radius: 4px;
                                      margin-left: 0px;
                                      height: 19px;
                                    "
                                    ><i class="mdi dripicons-information"></i
                                  ></el-button>
                                </el-popover>
                              </div>
                            </template>
                          </td>
                          <td style="min-width: 125px">
                            <div
                              :style="{
                                display: 'inline-block',
                                color: itemt.isClick ? '#2ebac6' : '',
                              }"
                              @click="itemt.isClick ? onClick(itemt) : void 0"
                            >
                              <template v-if="itemt.popover">
                                <span style="text-align: left">
                                  <span class="pc_show_context">
                                    {{ datas[itemt.name] }}
                                  </span>
                                  <el-popover
                                    class="phone_show_context"
                                    placement="bottom"
                                    trigger="hover"
                                    :content="datas[itemt.name]"
                                  >
                                    <span
                                      slot="reference"
                                      class="phone_show_context"
                                    >
                                      {{ getAddrFormat(datas[itemt.name], 6) }}
                                    </span>
                                  </el-popover>
                                </span>
                              </template>
                              <template v-else-if="itemt.isHtml">
                                <div v-html="itemVal(itemt)"></div>
                              </template>
                              <template v-else> {{ itemVal(itemt) }}</template>
                            </div>
                          </td>
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
              <li
                class="nav-item waves-effect waves-light"
                v-for="(item, cd) in tabs.titles"
                :key="cd"
              >
                <a
                  :class="[
                    'nav-link',
                    item.name == tabs.active ? 'active' : '',
                  ]"
                  data-toggle="tab"
                  role="tab"
                  @click="tabs.active = item.name"
                >
                  <span class="d-md-block">
                    {{ $t(item.title) }}
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
            <div class="tab-pane active">
              <component
                :is="tabs.components[tabs.active]"
                :sp-addr="datas.spAddr"
                :address="hash"
                :p-params="{ nodeAddress: datas.spAddr, nodeType: 'SP' }"
              ></component>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import utils from "@/utils/utils";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import awards from "./modules/awards.vue";
import pledgeRewards from "./modules/pledgeRewards.vue";
import records from "./modules/records.vue";
import releases from "./modules/releases.vue";
import storageNodes from "./modules/storageNodes.vue";
import awardsDetail from "@/views/locks/awards.vue";
export default {
  name: "StorageDetail",
  components: {},
  props: {},
  data() {
    let _this_ = this;
    return {
      sessionKey: "storagePoolDetail",
      hash: "",
      storageid: "",
      heads: [
        [
          {
            name: "hash",
            title: "storagePool.storagePoolAddress",
            popover: true,
            isClick: true,
          },
          {
            name: "revenueAddr",
            title: "lock.Revenueaddress",
            popover: true,
            isClick: true,
          },
          {
            name: "instime",
            title: "storagePool.activeTime",
            valMap(val) {
              if (utils.isEmpty(val)) return "";
              return helper.formatTime(val, 1);
            },
          },
          {
            title: "storagePool.activeStatus",
            name: "activeStatus",
            isHtml: true,
            valMap(val) {
              switch (`${val}`) {
                case "0":
                  return `<span style='color:#555'>${_this_.$t(
                    "market.status7"
                  )}</span>`;
                case "1":
                  return `<span class='text-green'>${_this_.$t(
                    "market.status0"
                  )}</span>`;
                case "2":
                  return `<span style='color:#aaa'>${_this_.$t(
                    "comm.exited"
                  )}</span>`;
              }
            },
          },
          {
            name: "pledgeAmount",
            title: "storagerental.pledgeamount",
            valMap(val) {
              return utils.clearZero(val || 0) + " UTG";
            },
          },
          {
            name: "entrustRate",
            title: "storagePool.SPRewardRatio",
            valMap(val) {
              return `${val || 0} %`;
            },
          },
          {
            name: "feeRate",
            title: "storagePool.commission",
            valMap(val) {
              return `${val || 0} %`;
            },
          },
          {
            name: "spAmount",
            title: "storagePool.total",
            valMap(val) {
              return `${utils.clearZero(val)} UTG`;
            },
          },
        ],
        [
          {
            name: "managerAddr",
            title: "storagePool.adminAddress",
            popover: true,
            isClick: true,
          },
          { name: "activeHeight", title: "storagePool.activeHeight" },
          {
            name: "totalCapacity",
            title: "storagePool.maxSpace",
            valMap(val) {
              return utils.bytesToSize(val || 0);
            },
          },
          {
            name: "usedCapacity",
            title: "storagePool.usedSpace",
            valMap(val) {
              return utils.bytesToSize(val || 0);
            },
          },
          {
            name: "totalCapacity",
            title: "storagePool.freeSpace",
            valMap(val) {
              return utils.bytesToSize(val || 0);
            },
          },
          { name: "storageRatio", title: "market.storagefactor" },
          {
            title: "storagePool.lockAmount",
            name: "spAmount",

            valMap(val, item) {
              let num = utils.clearZero(
                utils.uumbersHandle([val || 0, item.spRelease || 0], ["-"], 18)
              );
              return `${num || 0} UTG`;
            },
          },
          {
            title: "storagePool.releaseAmount",
            name: "spRelease",
            valMap(val) {
              return utils.clearZero(val || 0) + " UTG";
            },
          },
        ],
      ],
      datas: {},

      tabs: {
        active: "node",
        titles: [
          { name: "node", title: "node.storageNode" },
          { name: "award", title: "lock.rewardAmount" },
          { name: "awardsDetail", title: "rewards.RewardDetails" },
          { name: "release", title: "ftable.releaserecord" },
          { name: "record", title: "storageNode.pledgeRecord" },
          { name: "pledge", title: "storageNode.pledgeReward" },
        ],
        components: {
          awardsDetail,
          award: awards,
          pledge: pledgeRewards,
          node: storageNodes,
          record: records,
          release: releases,
        },
      },
    };
  },
  created() {
    let idL = this.$route.params.id;
    let ids = idL.split("_");
    if ((ids.length = 2)) {
      this.hash = ids[0];
      this.storageid = ids[1];
    } else {
      this.hash = ids;
    }
    this.tabs.active = sessionStorage.getItem(this.sessionKey) || "node";

    this.loadData();
  },

  methods: {
    pledgeStatusSpan(val) {
      return utils.getPledgeStatus(val).span;
    },
    getAddrFormat(data, number = 15) {
      return helper.getAddrFormat(data, number);
    },
    loadData() {
      if (!this.hash) return;
      api
        .postJson(`/spPool/getStoragePoolInfo/${this.hash}`, {})
        .then((response) => {
          this.datas = response.result || {};
        })
        .catch((error) => {
          console.error(error);
        });
    },
    itemVal(item) {
      let valL = this.datas[item.name];
      if (item.valMap) {
        return item.valMap(valL, this.datas);
      }
      return valL;
    },
    onClick(item) {
      console.log(item);
    },
  },
  watch: {
    "tabs.active": function (newVal) {
      sessionStorage.setItem(this.sessionKey, newVal);
    },
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}

@media (max-width: 768px) {
  .phone_nav_overflow-x {
    width: 100%;
    overflow-x: auto;
    display: grid;
    grid-template-columns: repeat(5, minmax(200px, auto));
    text-align: center;
  }
}
</style>
