<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <div class="row" style="padding: 6px; text-align: left">
          <div class="col-md-4">
            <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
              {{ $t("storagepledge.title") }}
            </h4>
            <p class="sub-title" style="width: 100%; text-align: left">
              {{ $t("storagepledge.totalnumber", [total]) }}
            </p>
          </div>
          <div class="col-md-4">
            <div class="input-group" style="margin: 0 auto">
              <input
                type="text"
                class="form-control"
                :placeholder="$t('storagepledge.searchAddress')"
                id="demo"
                v-model="searchInput"
                @keyup.enter="tableInit(null, 1)"
                style="border-right: 0px; width: 60%"
              />
              <div class="input-group-append">
                <button
                  class="btn btn-block waves-effect waves-light"
                  type="button"
                  @click="tableInit(null, 1)"
                  style="background-color: #d4d4d4"
                >
                  {{ $t("comm.search") }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <h-tbale
          ref="htable"
          :show-subtitle="false"
          :table-id="tableId+this.$store.getters.account"
          :table-heard="tableHeard"
          :table-data="tableData"
          :show-right-tools="false"
          @inint-ok="tableInit"
          @load="loadTable"
          @colClick="colClick"
        >
          <template slot="rightCol" slot-scope="scope">
            <el-dropdown trigger="click" v-if="scope.type == 'pc'">
              <el-button size="mini" type="default" icon="el-icon-menu">
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="false">
                  <el-button
                    style="width: 100%"
                    type="default"
                    size="mini"
                    @click="goToUrlPledge(scope.data)"
                    >{{ $t("storagepledge.manage") }}</el-button
                  >
                </el-dropdown-item>
                <el-dropdown-item v-if="scope.data.table_btn_binding">
                  <el-button
                    style="width: 100%"
                    type="default"
                    size="mini"
                    @click="binding(scope.data)"
                    >{{ $t("binding.bindaddr") }}</el-button
                  >
                </el-dropdown-item>
                <el-dropdown-item v-if="scope.data.table_btn_upbinding">
                  <el-button
                    style="width: 100%"
                    type="default"
                    size="mini"
                    @click="upBinding(scope.data)"
                    >{{ $t("mymanageMining.transferaddress") }}</el-button
                  >
                </el-dropdown-item>
                <el-dropdown-item v-if="scope.data.table_btn_bindinglift">
                  <el-button
                    style="width: 100%"
                    type="default"
                    size="mini"
                    @click="bindinglift(scope.data)"
                  >
                    <span style="color: red">
                      {{ $t("messages.bindinglift") }}
                    </span>
                  </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <div v-else>
              <el-button
                v-if="scope.data.table_btn_binding"
                type="text"
                @click="binding(scope.data)"
                >{{ $t("binding.bindaddr") }}</el-button
              >

              <el-button
                v-if="scope.data.table_btn_upbinding"
                type="text"
                @click="upBinding(scope.data)"
                >{{ $t("mymanageMining.transferaddress") }}</el-button
              >
              <el-button
                type="text"
                style="color: red"
                @click="bindinglift(scope.data)"
                v-if="scope.data.table_btn_bindinglift"
              >
                <span style="color: red">
                  {{ $t("messages.bindinglift") }}
                </span>
              </el-button>
            </div>
          </template>
        </h-tbale>
      </div>
    </div>
  </div>
</template>
<script>
import { Message } from "element-ui";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import webSdk from "@/utils/webSdk.js";
import utils from "@/utils/utils";
import HTbale from "@/components/modules/HTbale.vue";
import { setPageQuery } from "@/utils/table.js";
export default {
  name: "StoragePledge",
  components: { HTbale },
  props: {},
  data() {
    const renttypes = {
      stRent: "storagepledge.renttype0",
      stReNew: "storagepledge.renttype1",
    };
    let _this_ = this;
    const types = {
      "-1": "storagerental.status7",
      0: "storagerental.status0",
      1: "storagerental.status1",
      2: "storagerental.status2",
      3: "storagerental.status3",
      4: "storagerental.status4",
      5: "storagerental.status5",
      6: "storagerental.status6",
      7: "storagerental.status8",
    };

    return {
      tableId: "StoragePledge",
      tableHeard: [
        {
          title: "storagepledge.renthash",
          name: "rentHash",
          format: true,
          popover: true,
          minWidth: "180px",
          more: true,
        },
        {
          title: "storagepledge.rentaladdress",
          name: "rent_addr",
          format: true,
          popover: true,
          minWidth: "180px",
        },
        {
          title: "storagepledge.deviceaddress",
          name: "deviceAddr",
          format: true,
          popover: true,
          isClick: true,
          minWidth: "180px",
        },
        {
          title: "storagepledge.revenuesaddress",
          name: "revenue_addr",
          format: true,
          popover: true,
          minWidth: "180px",
          more: true,
        },
        {
          title: "storagepledge.rentspace",
          name: "rentSpace",
          minWidth: "140px",
          more: true,
          valMap(val, item) {
            return utils.bytesToSize(item.reqSpace);
          },
        },
        {
          title: "storagepledge.rentalprice",
          name: "rentPrice",
          minWidth: "150px",
          valMap(val) {
            return `${utils.CutZero(
              helper
                .getDataFormatDecimal(
                  val,
                  18,
                  _this_.rdecimal,
                  _this_.rent_decimal
                )
                .toFixed(_this_.rent_decimal)
            )}${_this_.$t("storagerental.priceunit")}`;
          },
        },
        {
          title: "storagepledge.rentalduration",
          name: "rentTime",
          minWidth: "120px",
          valMap(val) {
            if (utils.isEmpty(val)) {
              return "";
            }
            return `${val} ${_this_.$t("storagerental.timeunit")}`;
          },
        },

        {
          title: "storagerental.leasestatus",
          name: "rent_status",
          valMap(val) {
            return _this_.$t(_this_.types[val]);
          },
          minWidth: "95px",
        },
        {
          title: "storagepledge.renttype",
          name: "reqType",
          valMap(val) {
            return _this_.$t(_this_.renttypes[val]);
          },
          minWidth: "85px",
        },
      ],
      tableData: [],
      address: "",
      total: 0,
      searchInput: null,
      types,
      renttypes,
      rent_decimal: 4,
      rdecimal: 10000,
      loadDataOk: false,
    };
  },

  methods: {
    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    loadTable(query, toTop = true, pageNum) {
      if (!this.loadDataOk) {
        this.loadData();
        return;
      }

      if (!this.$store.getters.account) return;
      if (!query && this.$refs.htable) {
        query = this.$refs.htable.tableQuery;
      }
      if (!query) return;
      query.pageNum = pageNum || query.pageNum;

      var params = {
        current: query.pageNum,
        size: query.pageSize,
        pledge_addr: webSdk.sdkUtils.splitAddress(
          this.$store.getters.account,
          false
        ),
        req_types: ["stRent", "stReNew"],
      };
      if (this.searchInput !== "" && this.searchInput != null) {
        params.device_addr = this.searchInput;
      }

      //query.loadingShow();
      query.loadingShow(params,  query.pageNum);
      

      api
        .postJson("/platform/getStorageRequestList", params)
        .then((response) => {
          query.loadingHide();

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }
          let re = response.result || {};
          let tableData = re.records || [];

          tableData.forEach((item) => {
            item.table_btn_binding = utils.isEmpty(item.revenue_addr);
            item.table_btn_upbinding = !utils.isEmpty(item.revenue_addr);
            item.table_btn_bindinglift = !utils.isEmpty(item.revenue_addr);
          });
          this.tableData = tableData;
          setPageQuery(query, re);
          this.total = re.total || 0;
          if (toTop && this.tableData.length > 0) {
            query.toTop();
          }
        })
        .catch(() => {
          query.loadingHide();
        });
    },
    colClick(data) {
      let col = data.col || {};
      let row = data.row || {};
      switch (col.name) {
        case "rentHash":
          this.goToUrl("mymanage/rentdetail", row.rentHash);
          break;
        case "blockNumber":
          this.goToUrl("BlockDetail", row.blockNumber);
          break;
        case "deviceAddr":
          this.goToUrl("StorageDetail", row.deviceAddr);
          break;
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
    goToUrlPledge(data) {
      console.log("params=" + data.deviceAddr);
      window.open(data.deviceAddr, "_blank");
    },
    binding(data) {
      if (data.deviceAddr) {
        helper.goPathUrl(this, "mymanage/StorageBinding", data.deviceAddr);
      }
    },
    upBinding(data) {
      if (data.deviceAddr) {
        helper.goPathUrl(this, "mymanage/StorageUpBinding", data.deviceAddr);
      }
    },
    bindinglift(data) {
      if (data.deviceAddr) {
        helper.goPathUrl(this, "mymanage/StorageBindingLift", data.deviceAddr);
      }
    },

    seachData() {
      this.tableInit(null, 1);
    },

    loadData() {
      api
        .postJson("/platform/getStorageBasicSet", {})
        .then((response) => {
          if (!this.loadDataOk) {
            let result = response.result;
            this.rent_decimal = Number(result["10"] || 4);
            this.switchDecimal(this.rent_decimal);
            this.loadDataOk = true;
            this.tableInit();
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },

    switchDecimal(val) {
      switch (val) {
        case 0:
          this.rdecimal = 1;
          break;
        case 1:
          this.rdecimal = 1;
          break;
        case 2:
          this.rdecimal = 100;
          break;
        case 3:
          this.rdecimal = 1000;
          break;
        case 4:
          this.rdecimal = 10000;
          break;
        case 5:
          this.rdecimal = 100000;
          break;
        case 6:
          this.rdecimal = 1000000;
          break;
        case 7:
          this.rdecimal = 10000000;
          break;
        case 8:
          this.rdecimal = 100000000;
          break;
        case 9:
          this.rdecimal = 1000000000;
          break;
        case 10:
          this.rdecimal = 10000000000;
          break;
        default:
          this.rdecimal = 10000;
      }
    },
  },

  watch: {
    "$store.getters.account": function () {
      this.tableInit(null, 1);
    },
  },
};
</script>
<style lang="scss" scoped></style>
