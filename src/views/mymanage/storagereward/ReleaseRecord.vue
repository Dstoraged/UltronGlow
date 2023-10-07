<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
          <span>{{ $t(title) }} </span>
        </h4>
        <p class="sub-title" style="width: 100%; text-align: left">
          {{ $t("ftable.totalnumberrelease", [total]) }}
        </p>

        <div class="table-responsive" style="min-height: 200px">
          <table class="table table-hover mb-0">
            <thead>
              <tr style="background-color: #f8fafd">
                <th scope="col" style="min-width: 80px" type="expand">
                  {{ $t("ftable.order") }}
                </th>
                <th scope="col" style="min-width: 150px">
                  {{ $t("storagereward.deviceaddress") }}
                </th>
                <th scope="col" style="min-width: 120px">
                  {{ $t("storagereward.rewardtype") }}
                </th>
                <th scope="col" style="min-width: 120px">
                  {{ $t("storagereward.blockNumber") }}
                </th>
                <th scope="col" style="min-width: 120px">
                  {{ $t("storagereward.reward") }}
                </th>
                <th scope="col" style="min-width: 120px">
                  {{ $t("storagereward.totalAmount") }}
                </th>
                <th scope="col" style="min-width: 120px">
                  {{ $t("storagereward.leftAmount") }}
                </th>
                <th scope="col" style="min-width: 120px">
                  {{ $t("storagereward.unlocktime") }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in RewardList" :key="index">
                <td>{{ item.ranking }}</td>
                <td :title="item.address">
                  <a href="javascript:;" @click="toMinerView(item)">
                    <span style="color: #2ebac6">{{
                      getAddrFormat(item.address, 10)
                    }}</span>
                  </a>
                </td>
                <td>{{ $t(item.typename) }}</td>
                <td>{{ item.blockNumber }}</td>
                <td>{{ item.totalAmount }}</td>
                <td>{{ item.LockAmount }}</td>
                <td>{{ item.leftAmount }}</td>
                <td>
                  <span>{{ item.lockingTime }} {{ $t("lock.day") }}</span>
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
                  class
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
                  class
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
                  @click="getStorageRewardList(1)"
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
                  @click="getStorageRewardList(page - 1)"
                >
                  <i class="mdi mdi-chevron-left"></i>
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
                  @click="getStorageRewardList(page + 1)"
                >
                  <i class="mdi mdi-chevron-right"></i>
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
                  @click="getStorageRewardList(totalPages)"
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
  name: "ReleaseRecord",
  components: {},
  props: {
    type: {
      type: [String, Number],
      default: 0,
    },
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    const types = {
      1: "storagereward.type1",
      2: "storagereward.type2",
      3: "storagereward.type3",
      4: "storagereward.type4",
      5: "storagereward.type5",
      6: "storagereward.type6",
      7: "storagereward.type7",
      8: "storagereward.type8",
      9: "storagereward.type9",
      10: "storagereward.type10",
    };
    return {
      pageSize: 10,
      page: 1,
      total: 0,
      totalPages: 0,
      RewardList: [],
      loadText: this.$t("comm.clickLoad"),
      searchInput: null,
      types,
    };
  },

  created() {
    if (localStorage.getItem("detail")) {
      if (typeof localStorage.getItem("currentPage") !== "undefined") {
        this.page = Number(localStorage.getItem("currentPage"));
      }
      if (typeof localStorage.getItem("pageSize") !== "undefined") {
        this.pageSize = Number(localStorage.getItem("pageSize"));
      }
      localStorage.removeItem("detail");
    }

    this.getStorageRewardList(this.page);
  },

  mounted() {},
  methods: {
    toRelease(data) {
      if (data.address) {
        helper.goPathUrl(
          this,
          "mymanage/releaseList",
          `${data.address}_${this.type}`
        );
      }
    },

    formatTime(time) {
      return helper.formatTimimg(time);
    },
    getAddrFormat(data, number) {
      return helper.getAddrFormat(data, number);
    },
    goToUrl(name, params) {
      console.log("params=" + params);
      helper.goPathUrl(this, name, params);
    },

    toMinerView(data) {
      if (data.address) {
        helper.goPathUrl(this, "MinerView", `${data.address}`);
      }
    },

    handleSizeChange() {
      var val = $("#selectPage").val();
      this.pageSize = val;
      console.log(val);
      this.getStorageRewardList(1);
      localStorage.setItem("pageSize", val);
    },

    handleCurrentChange(val) {
      this.page = val;
      console.log("current page:" + this.page);
      this.getStorageRewardList(this.page);
      localStorage.setItem("currentPage", val);
    },

    getStorageRewardList(page) {
      if (page < 1 || (this.totalPages > 0 && page > this.totalPages)) {
        return;
      }
      showLoading();
      this.total = 0;
      this.page = page;
      localStorage.setItem("currentPage", page);
      var param = {
        current: this.page,
        size: this.pageSize,
        address: this.searchInput,
        type: this.type,
      };
      api
        .postJson("/platform/lockUtgMinerInfo", param)
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
              temp = {
                ranking: index + 1 + parseInt(rand),
                type: item.type,
                typename: this.types[item.type],
                address: item.address,
                revenue_address: item.revenue_address,
                ntype: item.ntype,
                blockNumber: item.blockNumber,
                pledge_amount:
                  helper
                    .getDataFormat(item.pledge_amount, 18, 10000)
                    .toFixed(4) + " UTG",
                LockAmount: `${utils.clearZero(
                  (item.totalAmount || 0) - (item.releaseamount || 0)
                )} UTG`,
                lockNumber: item.lockNumber,
                leftAmount: `${utils.clearZero(item.releaseamount)} UTG`,
                totalAmount: `${utils.clearZero(item.totalAmount)} UTG`,
                lockingTime: utils.lockingTime(
                  item.startTime,
                  item.avgBlockTime,
                  item.unLockNumber,
                  item.releaseHeigth
                ),
              };
              newData.push(temp);
            });
            this.RewardList = newData;
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
  watch: {
    "$store.getters.account": function () {
      this.getStorageRewardList(1);
    },
  },
};
</script>
<style lang="scss" scoped></style>
