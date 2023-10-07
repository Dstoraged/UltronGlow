<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
          {{ $t("storagespace.title") }}
        </h4>
        <p class="sub-title" style="width: 100%; text-align: left">
          {{ $t("storagespace.totalnumber", [total]) }}
        </p>
        <div></div>
        <div class="table-responsive" style="min-height: 200px">
          <table class="table table-hover mb-0">
            <thead>
              <tr style="background-color: #f8fafd">
                <th scope="col" style="min-width: 80px" type="expand">
                  {{ $t("ftable.order") }}
                </th>
                <th scope="col" style="min-width: 150px">
                  {{ $t("storagespace.revenuesaddress") }}
                </th>
                <th scope="col" style="min-width: 120px">
                  {{ $t("storagespace.totalspace") }}
                </th>
                <th scope="col" style="min-width: 150px">
                  {{ $t("storagespace.storagefactor") }}
                </th>
                <th scope="col" style="min-width: 150px">
                  {{ $t("storagespace.collecttime") }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in marketList" :key="index">
                <td>{{ item.ranking }}</td>
                <td>
                  <a
                    href="javascript:;"
                    @click="goToUrl('AccountDetail', item.revenueAddr)"
                  >
                    <span style="color: #2ebac6">{{
                      getAddrFormat(item.revenueAddr, 12)
                    }}</span>
                  </a>
                </td>
                <td>{{ item.capacity }}</td>
                <td>{{ item.ratio }}</td>
                <td>{{ item.instime }}</td>
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
                  @click="getStorageMarketList(1)"
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
                  @click="getStorageMarketList(page - 1)"
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
                  @click="getStorageMarketList(page + 1)"
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
                  @click="getStorageMarketList(totalPages)"
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
  name: "StorageSpace",
  components: {},
  props: {},
  data() {
    const types = {
      "-1": "market.status-1",
      0: "market.status0",
      1: "market.status1",
      5: "market.status5",
      6: "market.status6",
    };
    return {
      pageSize: 10,
      page: 1,
      total: 0,
      totalPages: 0,
      marketList: [],
      loadText: this.$t("comm.clickLoad"),
      searchInput: null,
      types,
    };
  },

  created() {
    if (sessionStorage.getItem("detail")) {
      if (typeof sessionStorage.getItem("currentPage") !== "undefined") {
        this.page = Number(sessionStorage.getItem("currentPage") || 1);
      }
      if (typeof sessionStorage.getItem("pageSize") !== "undefined") {
        this.pageSize = Number(sessionStorage.getItem("pageSize") || 10);
      }
      sessionStorage.removeItem("detail");
    }

    this.getStorageMarketList(this.page);

    //console.log(Math.pow(10,7)*0.1,utils.toNumber(0.1,7))
  },
  methods: {
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

    goToUrlHire(contract) {
      console.log("params=" + contract);
      if (contract) {
        helper.goPathUrl(this, "mymanage/marketrental", contract);
      }
    },

    handleSizeChange() {
      var val = $("#selectPage").val();
      this.pageSize = val;
      this.getStorageMarketList(1);
      sessionStorage.setItem("pageSize", val);
    },

    handleCurrentChange(val) {
      this.page = val;
      this.getStorageMarketList(this.page);
      sessionStorage.setItem("currentPage", val);
    },

    getStorageMarketList(page) {
      if (page < 1 || (this.totalPages > 0 && page > this.totalPages)) {
        return;
      }
      showLoading();
      this.total = 0;
      this.page = page;
      sessionStorage.setItem("currentPage", page);
      var param = {
        current: this.page,
        size: this.pageSize,
      };
      api
        .postJson("/platform/getStorageSpaceList", param)
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
            let temp = {};
            data.forEach((item, index) => {
              temp = {
                ranking: index + 1 + rand,
                deviceAddr: item.deviceAddr,
                pledgeAddr: item.pledgeAddr,
                revenueAddr: item.revenueAddr,
                pledgeStatusName: this.types[item.pledgeStatus],
                pledgeStatus: item.pledgeStatus,
                pledgeNumber: item.pledgeNumber,
                pledgeAmount:
                  helper
                    .getDataFormat(item.pledgeAmount, 18, 10000)
                    .toFixed(4) + " UTG",
                pensateAmount:
                  helper
                    .getDataFormat(item.pensateAmount, 18, 10000)
                    .toFixed(4) + " UTG",
                declareSpace: utils.bytesToSize(item.declareSpace || 0),
                freeSpace: utils.bytesToSize(item.freeSpace || 0),
                rentPrice:
                  helper.getDataFormat(item.rentPrice, 18, 10000).toFixed(0) +
                  " " +
                  this.$t("storagerental.priceunit"),
                rentNum: item.rentNum,
                totalAmount:
                  helper.getDataFormat(item.totalAmount, 18, 10000).toFixed(4) +
                  " UTG",
                storageAmount:
                  helper
                    .getDataFormat(item.storageAmount, 18, 10000)
                    .toFixed(4) + " UTG",
                rentAmount:
                  helper.getDataFormat(item.rentAmount, 18, 10000).toFixed(4) +
                  " UTG",
                validNumber: item.validNumber,
                succNumber: item.succNumber,
                failCount: item.failCount,
                instime: helper.formatTime(item.instime, 1),
                updatetime: helper.formatTime(item.updatetime, 1),
              };
              newData.push(temp);
            });
            this.marketList = newData;
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
