<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <div class="row" style="padding: 6px; text-align: left">
          <div class="col-md-4">
            <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
              {{ $t("storagemining.miner") }}
            </h4>
            <p class="sub-title" style="width: 100%; text-align: left">
              {{ $t("storagemining.currentlyminer", [total]) }}
            </p>
          </div>
          <div class="col-md-4">
            <div class="input-group" style="margin: 0 auto">
              <input
                type="text"
                class="form-control"
                :placeholder="$t('storagemining.minersearch')"
                id="demo"
                v-model="searchInput"
                @keyup.enter="seachData(1)"
                style="border-right: 0px; width: 60%"
              />
              <div class="input-group-append">
                <button
                  class="btn btn-block waves-effect waves-light"
                  type="button"
                  @click="seachData(1)"
                  style="background-color: #d4d4d4"
                >
                  {{ $t("comm.search") }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="table-responsive" style="min-height: 200px">
          <table class="table table-hover mb-0">
            <thead>
              <tr style="background-color: #f8fafd">
                <th scope="col" style="min-width: 80px">
                  {{ $t("ftable.order") }}
                </th>
                <th scope="col" style="min-width: 150px">
                  {{ $t("storagemining.Minersaddress") }}
                </th>
                <th scope="col" style="min-width: 150px">
                  {{ $t("storagemining.revenueaddress") }}
                </th>
                <th scope="col" style="min-width: 120px">
                  {{ $t("storagemining.bandwidth") }}
                </th>
                <th scope="col" style="min-width: 150px">
                  {{ $t("storagemining.pledgequantity") }}
                </th>
                <th scope="col" style="min-width: 150px">
                  {{ $t("storagemining.miningearnings") }}
                </th>

                <th scope="col" style="min-width: 150px">
                  {{ $t("storagemining.lockquantity") }}
                </th>
                <th scope="col" style="min-width: 200px">
                  {{ $t("storagemining.releasedquantity") }}
                </th>
                <th scope="col" style="min-width: 100px">
                  {{ $t("storagemining.minerstatus") }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in extractList" :key="index">
                <td>{{ item.ranking }}</td>
                <td>
                  <span
                    style="color: #4a7bd3; cursor: pointer"
                    @click="toMinerView(item, 1)"
                    >{{ getAddrFormat(item.minerAddr, 8) }}</span
                  >
                </td>
                <td>{{ getAddrFormat(item.revenueAddress, 8) }}</td>
                <td>{{ item.bandwidth }}</td>
                <td>{{ item.pledgeAmount }}</td>
                <td>{{ item.revenueAmount }}</td>

                <td>{{ item.lockAmount }}</td>
                <td>{{ item.releaseAmount }}</td>
                <td>
                  <span v-if="item.minerStatus == '1'">
                    {{ $t("lock.state21") }}
                  </span>
                  <span v-else-if="item.minerStatus == '2'">
                    {{ $t("lock.state22") }}
                  </span>
                  <span v-else-if="item.minerStatus == '3'">
                    {{ $t("lock.state23") }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="row" style="margin-top: 20px">
          <div
            class="col-md-5 col-sm-12"
            style="font-size: 9pt; margin: 0px; padding-left: 10px"
          >
            <ul
              class="pagination"
              style="justify-content: left; font-size: 9pt"
            >
              <li class="page-item">
                <a
                  style="
                    padding: 10px;
                    border: none;
                    border-radius: 6px;
                    display: block;
                  "
                  >{{ $t("pagination.show") }}</a
                >
              </li>
              <li class="page-item">
                <div class="col-sm-12" style="margin: 0px; padding: 0px">
                  <select
                    class="custom-select"
                    v-model="pageSize"
                    style="font-size: 12px"
                    @change="handleSizeChange()"
                    id="selectPage"
                  >
                    <option selected="selected" value="10">10</option>
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="50">50</option>
                  </select>
                </div>
              </li>
              <li class="page-item">
                <a
                  style="
                    padding: 10px;
                    border: none;
                    border-radius: 6px;
                    display: block;
                  "
                  >{{ $t("pagination.redord") }}</a
                >
              </li>
            </ul>
          </div>
          <div
            class="col-md-7 col-sm-12 justify-content-end"
            style="font-size: 9pt; margin: 0px; padding-left: 10px"
          >
            <ul class="pagination fyright">
              <li class="page-item">
                <a
                  class="page-link"
                  href="javascript:;"
                  style="
                    padding: 10px;
                    margin: 4px;
                    border: none;
                    background-color: #eaf8f9;
                    border-radius: 6px;
                    color: #41c0cb;
                    font-size: 9pt;
                  "
                  @click="getstorageMinerlist(1)"
                  >{{ $t("pagination.first") }}</a
                >
              </li>
              <li class="page-item">
                <a
                  class="page-link"
                  href="javascript:;"
                  style="
                    padding: 10px;
                    margin: 4px;
                    border: none;
                    background-color: #eaf8f9;
                    border-radius: 6px;
                    color: #41c0cb;
                  "
                  @click="getstorageMinerlist(page - 1)"
                  ><i class="mdi mdi-chevron-left"></i
                ></a>
              </li>
              <li class="page-item">
                <a
                  class="page-link"
                  href="javascript:;"
                  style="
                    padding: 10px;
                    margin: 4px;
                    border: none;
                    background-color: #eaf8f9;
                    border-radius: 6px;
                    color: #757575;
                  "
                >
                  <span>
                    {{
                      $t("pagination.pages", {
                        curPage: page,
                        totalPage: totalPages,
                      })
                    }}
                  </span>
                </a>
              </li>
              <li class="page-item">
                <a
                  class="page-link"
                  href="javascript:;"
                  style="
                    padding: 10px;
                    margin: 4px;
                    border: none;
                    background-color: #eaf8f9;
                    border-radius: 6px;
                    color: #41c0cb;
                  "
                  @click="getstorageMinerlist(page + 1)"
                  ><i class="mdi mdi-chevron-right"></i
                ></a>
              </li>
              <li class="page-item">
                <a
                  class="page-link"
                  href="javascript:;"
                  style="
                    padding: 10px;
                    margin: 4px;
                    border: none;
                    background-color: #eaf8f9;
                    border-radius: 6px;
                    color: #41c0cb;
                  "
                  @click="getstorageMinerlist(totalPages)"
                  >{{ $t("pagination.last") }}</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Message } from "element-ui";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import utils from "@/utils/utils";
import { showLoading, hideLoading } from "@/utils/loading";
export default {
  name: "MinerVier",
  components: {},
  props: {},
  data() {
    return {
      pageSize: 10,
      page: 1,
      total: 0,
      totalPages: 0,
      extractList: [],
      loadText: this.$t("comm.clickLoad"),
      searchInput: null,
    };
  },

  created() {
    this.searchInput = this.$route.params.id || "";
    this.getstorageMinerlist(this.page);
  },

  methods: {
    getAddrFormat(data, number) {
      return helper.getAddrFormat(data, number);
    },
    goToUrl(contract) {
      helper.goPathUrl(this, "AccountDetail", contract);
    },
    toMinerView(data, type) {
      if (data.node_address) {
        helper.goPathUrl(this, "NodeView", `${data.node_address}_${type + 1}`);
      }
    },
    toRelease(data) {
      if (data.minerAddr) {
        helper.goPathUrl(this, "MinerView", `${data.minerAddr}`);
      }
    },

    handleSizeChange() {
      var val = $("#selectPage").val();
      this.pageSize = val;
      console.log(val);
      this.getstorageMinerlist(1);
    },

    handleCurrentChange(val) {
      this.page = val;
      console.log("current page:" + this.page);
      this.getstorageMinerlist(this.page);
    },

    seachData() {
      this.extractList = [];
      this.getstorageMinerlist(1);
    },

    async getstorageMinerlist(page) {
      await utils.getNowHeight();
      if (page < 1 || (this.totalPages > 0 && page > this.totalPages)) {
        return;
      }
      showLoading();
      this.total = 0;
      this.page = page;
      var param = {
        current: this.page,
        size: this.pageSize,
        type: 1,
        address: this.searchInput,
      };
      api
        .postJson("/platform/storage/getstorageMinerlist", param)
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
            var data = response.result.records;
            if (data.length < this.total) {
              this.loadText = this.$t("comm.bottomLine");
            }
            this.total = response.result.total;
            this.totalPages = response.result.pages;
            const rand = (this.page - 1) * this.pageSize;
            const newData = [];
            var temp = {};
            data.forEach((item, index) => {
              let minerstorage = utils.bytesToSize(item.minerstorage || 0);
              let bandwidth = utils.bytesToSize(item.bandwidth || 0);
              temp = {
                ranking: index + 1 + rand,
                pledgeAmount: utils.clearZero(item.pledge_amount, 4) + " UTG",
                minerAddr: item.miner_addr,
                revenueAddress: item.revenue_address,
                surplusful: item.surplusful,
                minerStatus: item.miner_status,
                bandwidth,
                minerstorage,
                revenueAmount: utils.clearZero(item.revenue_amount, 4) + " UTG",
                lockAmount: utils.clearZero(item.lock_amount, 4) + " UTG",
                releaseAmount: utils.clearZero(item.release_amount, 4) + " UTG",
                drawAmount: item.draw_amount,
                joinTime: item.join_time,
              };
              newData.push(temp);
            });
            this.extractList = newData;
            hideLoading();
          }
        })
        .catch((error) => {
          console.error(error);
          Message.error(error.ErrMsg);
          hideLoading();
        });
    },
  },
};
</script>
<style lang="scss" scoped></style>
