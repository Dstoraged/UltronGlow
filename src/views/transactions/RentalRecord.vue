<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
          {{ $t("storagepledge.renttitle") }}
        </h4>
        <p class="sub-title" style="width: 100%; text-align: left">
          {{ $t("storagepledge.totalnumber", [totalr]) }}
        </p>
        <div class="table-responsive" style="min-height: 200px">
          <table class="table table-hover mb-0">
            <thead>
              <tr style="background-color: #f8fafd">
                <th scope="col" style="min-width: 80px">
                  {{ $t("ftable.order") }}
                </th>
                <th scope="col" style="min-width: 150px">
                  {{ $t("storagepledge.renthash") }}
                </th>
                <th scope="col" style="min-width: 150px">
                  {{ $t("storagepledge.rentaladdress") }}
                </th>
                <th scope="col" style="min-width: 150px">
                  {{ $t("storagepledge.deviceaddress") }}
                </th>
                <th scope="col" style="min-width: 120px">
                  {{ $t("storagepledge.rentspace") }}
                </th>
                <th scope="col" style="min-width: 180px">
                  {{ $t("storagepledge.rentalprice") }}
                </th>
                <th scope="col" style="min-width: 150px">
                  {{ $t("storagepledge.rentalduration") }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in rentalList" :key="index">
                <td>{{ item.ranking }}</td>
                <td>
                  <span style="color: #2ebac6">{{
                    getAddrFormat(item.rentHash, 10)
                  }}</span>
                </td>
                <td>
                  <span style="color: #2ebac6">{{
                    getAddrFormat(item.rentAddr, 10)
                  }}</span>
                </td>
                <td>
                  <span style="color: #2ebac6">{{
                    getAddrFormat(item.deviceAddr, 10)
                  }}</span>
                </td>
                <td>{{ item.rentSpace }}</td>
                <td>{{ item.rentPrice }}</td>
                <td>{{ item.rentTime }}</td>
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
                    v-model="pageSizer"
                    style="font-size: 12px"
                    @change="handleSizeChanger()"
                    id="selectPager"
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
                  @click="getRentalList(1)"
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
                  @click="getRentalList(pager - 1)"
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
                        curPage: pager,
                        totalPage: totalPager,
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
                  @click="getRentalList(pager + 1)"
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
                  @click="getRentalList(totalPager)"
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
  name: "RentalRecord",
  components: {},
  props: {
    txHash: {
      type: String,
      default: "",
    },
  },
  data() {
    const types = {
      "-1": "market.status-1",
      0: "market.status0",
      1: "market.status1",
      5: "market.status5",
      6: "market.status6",
    };
    const renttypes = {
      stRent: "storagepledge.renttype0",
      stReNew: "storagepledge.renttype1",
    };

    return {
      address: "",
      pageSizer: 10,
      pager: 1,
      totalr: 0,
      totalPager: 0,
      rentalList: [],
      loadText: this.$t("comm.clickLoad"),
      searchInput: null,
      types,
      renttypes,
    };
  },
  created() {
    this.getRentalList(1);
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

    handleSizeChanger() {
      var val = $("#selectPager").val();
      this.pageSizer = val;
      console.log(val);
      this.getRentalList(1);
    },

    handleCurrentChange(val) {
      this.pager = val;
      console.log("current page:" + this.pager);
      this.getRentalList(this.pager);
    },

    getRentalList(page) {
      if (page < 1 || (this.totalPager > 0 && page > this.totalPager)) {
        return;
      }
      showLoading();
      this.totalr = 0;
      this.pager = page;
      var param = {
        current: this.pager,
        size: this.pageSizer,
        txhash: this.txHash,
      };
      this.rentalList = [];
      api
        .postJson("/platform/getTransactionRentList", param)
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
            if (data.length < this.totalr) {
              this.loadText = this.$t("comm.bottomLine");
            }
            this.totalr = response.result.total;
            this.totalPager = response.result.pages;
            const rand = (this.pager - 1) * this.pageSizer;
            const newData = [];
            let temp = {};
            data.forEach((item, index) => {
              temp = {
                ranking: index + 1 + rand,
                rentHash: item.rentHash,
                deviceAddr: item.deviceAddr,
                rentAddr: item.rentAddr,
                rentSpace: utils.bytesToSize(item.rentSpace),
                rentPrice:
                  helper.getDataFormat(item.rentPrice, 18, 10000).toFixed(4) +
                  " " +
                  this.$t("storagerental.priceunit"),
                rentTime:
                  item.rentTime === null
                    ? ""
                    : item.rentTime + " " + this.$t("storagerental.timeunit"),
                rentNumber: item.reqNumber,
                rentAmount:
                  helper.getDataFormat(item.rentAmount, 18, 10000).toFixed(0) +
                  " SRT",

                //renttype: this.renttypes[item.reqType],
                recevAmount:
                  helper.getDataFormat(item.recevAmount, 18, 10000).toFixed(4) +
                  " UTG",
                validNumber: item.validNumber,
                succNumber: item.succNumber,
                failCount: item.failCount,
                revenueAddr: item.revenue_addr,
              };
              newData.push(temp);
            });
            this.rentalList = newData;
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
      this.getStoragePledgeList(1);
    },
  },
};
</script>
<style lang="scss" scoped></style>
