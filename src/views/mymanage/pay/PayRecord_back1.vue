<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
          <span>{{ $t("mymanage.payrecord") }} </span>
        </h4>
        <p class="sub-title" style="width: 100%; text-align: left">
          {{ $t("ftable.totalnumber", [total]) }}
        </p>

        <div class="table-responsive" style="min-height: 200px">
          <table class="table table-hover mb-0">
            <thead>
              <tr style="background-color: #f8fafd">
                <th scope="col" style="min-width: 80px">
                  {{ $t("ftable.order") }}
                </th>
                <th scope="col" style="min-width: 150px">
                  {{ $t("mymanage.trans_hash") }}
                </th>
                <th scope="col" style="min-width: 150px">
                  {{ $t("mymanage.address") }}
                </th>
                <th scope="col" style="min-width: 120px">
                  {{ $t("mymanage.blockheight") }}
                </th>
                <th scope="col" style="min-width: 120px">
                  {{ $t("mymanage.payfulnum") }}
                </th>
                <th scope="col" style="min-width: 120px">
                  {{ $t("mymanage.utgnumber") }}
                </th>
                <th scope="col" style="min-width: 120px">
                  {{ $t("mymanage.TxnFee") }}
                </th>
                <th scope="col" style="min-width: 160px">
                  {{ $t("mymanage.payTime") }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in tranList" :key="index">
                <td>{{ item.ranking }}</td>
                <td>
                  <!--
                   <span style="color: #2ebac6">{{
                      getAddrFormat(item.hash, 12)
                    }}</span>
                  -->
                  <a
                    href="javascript:;"
                    @click="goToUrl('TxnsInfo', item.hash)"
                  >
                    <span style="color: #2ebac6">
                      {{ getAddrFormat(item.hash, 12) }}
                    </span>
                  </a>
                </td>
                <td>
                  <a
                    href="javascript:;"
                    @click="goToUrl('AccountDetail', item.fromAddr)"
                    ><span style="color: #2ebac6">{{
                      getAddrFormat(item.fromAddr, 12)
                    }}</span></a
                  >
                </td>
                <td>{{ item.blockNumber }}</td>
                <td>{{ item.param4 }}</td>
                <td>{{ item.param3 }}</td>
                <td>{{ item.handFee }}</td>
                <td>{{ item.timeStamp }}</td>
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
                  @click="getTxRecord(1)"
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
                  @click="getTxRecord(page - 1)"
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
                  @click="getTxRecord(page + 1)"
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
                  @click="getTxRecord(totalPages)"
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
  name: "BlockReward",
  components: {},
  props: {
    param: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      pageSize: 10,
      page: 1,
      total: 0,
      totalPages: 0,
      tranList: [],
      loadText: this.$t("comm.clickLoad"),
      fblock: "",
      lblock: "",
      searchInput: null,
    };
  },
  mounted() {
    this.getTxRecord(this.page);
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

    handleSizeChange() {
      var val = $("#selectPage").val();
      this.pageSize = val;
      console.log(val);
      this.getTxRecord(1);
    },

    handleCurrentChange(val) {
      this.page = val;
      console.log("current page:" + this.page);
      this.getTxRecord(this.page);
    },

    getTxRecord(page) {
      if (page < 1 || (this.totalPages > 0 && page > this.totalPages)) {
        return;
      }
      showLoading();
      this.total = 0;
      this.page = page;
      var params = {
        current: this.page,
        size: this.pageSize,
        fromAddr: this.$store.getters.account,
        txType: "CandReq",
      };
      console.log("this.param:" + this.param.txType);

      Object.assign(params, this.param);
      api
        .postJson("/platform/getTxRecord", params)
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

            const newData = [];
            const rand = (this.page - 1) * this.pageSize;
            data.forEach((item, index) => {
              item.ranking = index + 1 + rand;
              let time = "";
              try {
                time = helper.formatTime(item.timeStamp / 1000);
              } catch (error) {
                console.log(error);
              }
              item.timeStamp = time;
              //item.param4 = item.param4; //utils.clearZero(item.param4);
              //item.param4 = helper.getDataFormat(item.param4, 18, 10000).toFixed(0)+" SRT"
              item.param3 = utils.isEmpty(item.param3)
                ? ""
                : `${utils.clearZero(item.param3)} UTG`;

              item.param4 = utils.isEmpty(item.param4)
                ? ""
                : `${utils.clearZero(item.param4)} SRT`;

              item.handFee =
                utils.weedZero(
                  helper.getDataFormat(item.gasUsed * item.gasPrice, 18, 10000),
                  8
                ) + " UTG";
              newData.push(item);
            });
            this.tranList = newData;
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
