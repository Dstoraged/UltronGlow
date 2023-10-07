<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body" style="padding: 20px">
        <div class="row" style="margin-top: 0px">
          <div class="col-md-4">
            <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
              {{ $t("mymanage.minersmanagement") }}
            </h4>
            <p class="sub-title" style="width: 100%; text-align: left">
              {{ $t("storagemining.currentlyminer", [total]) }}
            </p>
          </div>
          <div class="col-md-8">
            <button
              class="btn btn-info btn-mini waves-effect waves-light"
              style="width: 100px; float: right"
              type="button"
              @click="add"
            >
              {{ $t("mymanageMining.add") }}
            </button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead>
              <tr style="background-color: #f8fafd">
                <th scope="col" style="min-width: 80px">
                  {{ $t("ftable.order") }}
                </th>
                <th scope="col" style="min-width: 150px">
                  {{ $t("mymanageMining.mineraddr") }}
                </th>
                <th scope="col" style="min-width: 150px">
                  {{ $t("mymanageMining.revenuesaddress") }}
                </th>
                <th scope="col" style="min-width: 130px">
                  {{ $t("mymanageMining.pledgeamount") }}
                </th>
                <th scope="col" style="min-width: 130px">
                  {{ $t("mymanageMining.bandwidth") }}
                </th>
                <th scope="col" style="min-width: 130px">
                  {{ $t("mymanageMining.minermode") }}
                </th>
                <th scope="col" style="min-width: 150px">
                  {{ $t("mymanageMining.miningearnings") }}
                </th>
                <th scope="col" style="min-width: 150px">
                  {{ $t("mymanageMining.minerstatus") }}
                </th>
                <th scope="col" style="min-width: 120px">
                  {{ $t("mymanageMining.join") }}
                </th>
                <th scope="col" width="120">{{ $t("node.operation") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in minerList" :key="index">
                <td>{{ item.ranking }}</td>
                <td>
                  <span
                    class="cursor"
                    style="color: #2ebac6; margin-left: 5px"
                    @click="tolog(item)"
                    >{{ getAddrFormat(item.miner_addr, 8) }}</span
                  >
                </td>
                <td>
                  <span
                    class="cursor"
                    style="color: #2ebac6; margin-left: 5px"
                    @click="goToUrl('AccountDetail', item.revenue_address)"
                    >{{ getAddrFormat(item.revenue_address, 8) }}</span
                  >
                </td>
                <td>{{ item.pledge_amount }}</td>
                <td>
                  <span
                    class="cursor"
                    style="color: #2ebac6; margin-left: 5px"
                    @click="storageList(item)"
                    >{{ item.bandwidth }}</span
                  >
                </td>
                <td>{{ $t(item.miner_modestr) }}</td>
                <td>{{ item.revenue_amount }}</td>
                <td>{{ $t(item.miner_statusstr) }}</td>
                <td>{{ $t(item.addpoolstr) }}</td>
                <td width="120">
                  <template>
                    <el-dropdown trigger="click">
                      <el-button size="mini" type="default" icon="el-icon-menu">
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-if="item.table_btn_binding">
                          <el-button
                            style="width: 100%"
                            type="default"
                            size="mini"
                            @click="binding(item)"
                            >{{ $t("binding.bindaddr") }}</el-button
                          >
                        </el-dropdown-item>

                        <el-dropdown-item v-if="item.table_btn_add">
                          <el-button
                            style="width: 100%"
                            type="default"
                            size="mini"
                            @click="bandwidth(item)"
                            >{{
                              $t("mymanageMining.adjustbandwidth")
                            }}</el-button
                          >
                        </el-dropdown-item>
                        <el-dropdown-item v-if="item.table_btn_up">
                          <el-button
                            style="width: 100%"
                            type="default"
                            size="mini"
                            @click="uppledge(item)"
                            >{{
                              $t("mymanageMining.transferaddress")
                            }}</el-button
                          >
                        </el-dropdown-item>
                        <el-dropdown-item v-if="item.table_btn_bindinglift">
                          <el-button
                            style="width: 100%"
                            type="default"
                            size="mini"
                            @click="bindinglift(item)"
                          >
                            <span style="color: red">
                              {{ $t("messages.bindinglift") }}
                            </span>
                          </el-button>
                        </el-dropdown-item>

                        <el-dropdown-item v-if="item.table_btn_in && false">
                          <el-button
                            style="width: 100%"
                            type="default"
                            size="mini"
                            @click="join(item)"
                            >{{ $t("mymanageMining.join") }}</el-button
                          >
                        </el-dropdown-item>
                        <el-dropdown-item v-if="item.table_btn_quit">
                          <el-button
                            style="width: 100%"
                            type="default"
                            size="mini"
                            @click="quit(item)"
                          >
                            <span style="color: red">
                              {{ $t("mymanageMining.quit") }}
                            </span>
                          </el-button>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
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
                  @click="getStorageMinerlist(1)"
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
                  @click="getStorageMinerlist(page - 1)"
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
                  <span>{{
                    $t("pagination.pages", {
                      curPage: page,
                      totalPage: totalPages,
                    })
                  }}</span>
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
                  @click="getStorageMinerlist(page + 1)"
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
                  @click="getStorageMinerlist(totalPages)"
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
import utils from "@/utils/utils";
import { Message } from "element-ui";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import webSdk from "@/utils/webSdk.js";
import { showLoading, hideLoading } from "@/utils/loading";
export default {
  name: "StorageNode",
  components: {},
  props: {},
  data() {
    return {
      pageSize: 10,
      page: 1,
      total: 0,
      totalPages: 0,
      minerList: [],
      loadText: this.$t("comm.clickLoad"),
      searchInput: null,
    };
  },

  created() {
    this.getStorageMinerlist(1);
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
      this.getStorageMinerlist(1);
    },

    handleCurrentChange(val) {
      this.page = val;
      console.log("current page:" + this.page);
      this.getStorageMinerlist(this.page);
    },

    getStorageMinerlist(page) {
      if (page < 1 || (this.totalPages > 0 && page > this.totalPages)) {
        return;
      }
      showLoading();
      this.total = 0;
      this.page = page;
      var param = {
        current: this.page,
        size: this.pageSize,
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

            const newData = [];
            const rand = (this.page - 1) * this.pageSize;
            // let temp = {};
            data.forEach((item, index) => {
              (item.ranking = index + 1 + rand),
                (item.revenue_amount = utils.isEmpty(item.revenue_amount)
                  ? "0.0000 UTG"
                  : `${utils.clearZero(item.revenue_amount)} UTG`);
              item.pledge_amount = utils.isEmpty(item.pledge_amount)
                ? "0.0000 UTG"
                : `${utils.clearZero(item.pledge_amount, 4)} UTG`;

              item.bandwidth = utils.isEmpty(item.bandwidth)
                ? ""
                : utils.bytesToSize(item.bandwidth);

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

              switch (item.miner_mode + "") {
                case "1":
                  item.miner_modestr = "mymanageMining.storagemining";
                  break;
                case "2":
                  item.miner_modestr = "mymanageMining.bandwidthmining";
                  break;

                default:
                  item.miner_modestr = "";
                  break;
              }

              let addpool = item.addpool;
              let isRevenue = !utils.isEmpty(item.revenue_address);
              item.addpoolstr =
                addpool == 1
                  ? "mymanageMining.havejoined"
                  : "mymanageMining.nottojoin";
              item.table_btn_add = true;
              //item.table_btn_quit = item.miner_status == 1;
              // item.table_btn_in = addpool != 1;
              //item.table_btn_bindinglift = true;
              //item.table_btn_up = true;
              item.table_more = false;
              item.table_btn_quit = item.miner_status == 1 && isRevenue;
              item.table_btn_in = addpool != 1 && isRevenue;
              item.table_btn_bindinglift = isRevenue;
              item.table_btn_up = isRevenue;
              item.table_btn_binding = !isRevenue;
              newData.push(item);
            });
            this.minerList = newData;
            hideLoading();
          }
        })
        .catch((error) => {
          console.error(error);
          Message.error(error.ErrMsg);
          hideLoading();
        });
    },

    add() {
      helper.goUrl(this, "Mymanagebinding", "");
    },
    bandwidth(data) {
      if (data.miner_addr) {
        helper.goPathUrl(this, "mymanage/bandwidth", data.miner_addr);
      }
    },

    bindinglift(data) {
      if (data.miner_addr) {
        helper.goPathUrl(this, "mymanage/bindinglift", data.miner_addr);
      }
    },
    uppledge(data) {
      if (data.miner_addr && data.revenue_address) {
        helper.goPathUrl(this, "mymanage/uppledge", data.miner_addr);
      }
    },
    join(data) {
      if (data.miner_addr) {
        helper.goPathUrl(this, "mymanage/join", data.miner_addr);
      }
    },
    tolog(data) {
      if (data.miner_addr) {
        helper.goPathUrl(this, "mymanage/minerview", data.miner_addr);
      }
    },
    storageList(data) {
      if (data.miner_addr) {
        helper.goPathUrl(this, "mymanage/storageList", data.miner_addr);
      }
    },

    quit(data) {
      let sdk = this.$store.getters.getsdk || null;
      let addres = data.miner_addr;
      if (utils.isEmpty(addres)) {
        return;
      }
      let revenue = "";
      let select = webSdk.sdkUtils.getSelectAddress();
      try {
        revenue = webSdk.sdkUtils.getAddress(data.revenue_address);
        select = webSdk.sdkUtils.getAddress(select);
      } catch (error) {
        console.log(error);
      }

      if (select != revenue) {
        this.$message.error(`${this.$t("mymanageMining.pleasetoyaddr")}`);
        return;
      }

      if (sdk) {
        let _this_ = this;
        let setData = {
          title: `${this.$t("mymanageMining.quit")}`,
          context: `${this.$t(
            "mymanageMining.mineraddr"
          )}：${helper.getAddrFormat(addres, 10)}`,
          closebtnshow: false,
          request: null,
          success() {
            _this_.$refs.ftables.getAddrList();
          },
        };
        let request = sdk.sendTransactionTo(
          webSdk.typeJson.flwexit,
          {
            addr1: addres,
          },
          setData
        );
        setData.request = request;

        this.$store.dispatch("setNotification", setData);
      }
    },

    btnTypes(data = {}, types) {
      let status = data.miner_status + "" || "";

      return types.includes(status);
    },

    binding(data) {
      if (data.miner_addr) {
        helper.goPathUrl(this, "mymanage/bindingRevenue", data.miner_addr);
      }
    },
  },
  computed: {
    getParamOne() {
      let address = this.$store.getters.account;
      return { revenue_address: address };
    },
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
</style>
