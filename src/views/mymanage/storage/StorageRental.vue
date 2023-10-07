<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <div class="row" style="padding: 6px; text-align: left">
          <div class="col-md-3">
            <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
              {{ $t("storagerental.title") }}
            </h4>
            <p class="sub-title" style="width: 100%; text-align: left">
              {{ $t("storagerental.totalnumber", [total]) }}
            </p>
          </div>
          <div class="col-md-9">
            <div class="input-group" style="max-width: 500px; text-align: left">
              <div class="phone_width_100 search_select_div">
                <select
                  class="search_select"
                  v-model="selStatus"
                  @change="tableInit(null, 1)"
                >
                  <option value="all" selected>
                    {{ $t("storagerental.status") }}
                  </option>
                  <option value="0">{{ $t("storagerental.status0") }}</option>
                  <option value="1">{{ $t("storagerental.status1") }}</option>
                  <option value="2">{{ $t("storagerental.status2") }}</option>
                  <option value="3">{{ $t("storagerental.status3") }}</option>
                  <option value="4">{{ $t("storagerental.status4") }}</option>
                  <option value="5">{{ $t("storagerental.status5") }}</option>
                  <option value="6">{{ $t("storagerental.status6") }}</option>
                  <option value="7">{{ $t("storagerental.status8") }}</option>
                  <option value="-1">{{ $t("storagerental.status7") }}</option>
                </select>
              </div>
              <input
                type="text"
                class="form-control"
                :placeholder="$t('storagerental.searchAddress')"
                v-model="searchInput"
                @keyup.enter="tableInit(null, 1)"
                style="border-right: 0px; min-width: 100px; height: 36px"
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
          ref="htableStorageRental"
          :show-subtitle="false"
          :table-id="'StorageRental_my'+this.$store.getters.account"
          :table-heard="tableHeard"
          :table-data="tableData"
          :show-right-tools="true"
           right-btn-col-width="120px"
          @inint-ok="tableInit"
          @load="loadTable"
          @colClick="colClick"
          :up-load-time="30000"
        >
        <template slot="table_cell_rentStatus" slot-scope="scope">
          <span>{{ getStatus(scope.data.rentStatus) }}</span>
          <el-popover placement="bottom" trigger="hover" style="margin-right: 10px" @show="showPopover(scope.data)">
            <el-button type="text" slot="reference" icon="el-icon-location-information" v-if="scope.data.rentStatus == 1">
            </el-button>
            <div style="maring: 5px; text-align: center" v-loading="shareItem.loading">
              <template v-if="shareItem.isConfig">
                <img v-show="shareItem.img" wdith="150px" height="150px" :src="shareItem.img" /><br />
                <em type="text">{{ shareItem.url }}</em>
              </template>
              <template v-else>
                <span style="color: orange">{{ $t("market.noLink") }}</span>
              </template>
            </div>
          </el-popover>
        </template>

          <template slot="rightCol" slot-scope="scope">
            <el-button
              type="text"
              :disabled="
                !(
                  scope.data.rentaltime == 1 &&
                  (scope.data.rentStatus == 1 || scope.data.rentStatus == 4) &&
                  scope.data.renewStatus != 1
                )
              "
              size="mini"
              @click="goToUrlRenewal(scope.data.rentHash)"
              class="equal-width"
              >{{ $t("storagerental.renewal") }}</el-button
            >
            <!--:disabled="!(item.lavetime<item.rentTime*0.05 && item.rentStatus==1)"    :disabled="!(item.rentalime==1 && item.rentStatus==1)"    -->
            <el-button
              type="text"
              :disabled="
                !(scope.data.rentStatus == 4 && scope.data.rescindtime == 1)
              "
              size="mini"
              @click="goToUrlRescind(scope.data)"
              class="equal-width"
              >{{ $t("storagerental.stoprenewal") }}</el-button>

             
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
import utils from "@/utils/utils";
import webSdk from "@/utils/webSdk.js";
import HTbale from "@/components/modules/HTbale.vue";
import { setPageQuery } from "@/utils/table.js";
export default {
  name: "StorageRental",
  components: { HTbale },
  props: {
    tableId: {
      type: String,
      default: "StorageRental_my",
    },
  },
  data() {
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
    let _this_ = this;
    return {
      tableHeard: [
        {
          title: "storagerental.renthash",
          name: "rentHash",
          format: true,
          popover: true,
          isClick: true,
          minWidth: "180px",
        },
        {
          title: "storagerental.deviceaddress",
          name: "deviceAddr",
          format: true,
          popover: true,
          isClick: true,
          minWidth: "180px",
        },
        {
          title: "storagerental.applytime",
          name: "instime",
          type: "time",
          minWidth: "160px",
          more: true,
        },
        {
          title: "storagerental.rentspace",
          name: "rentSpace",
          minWidth: "110px",
          valMap(val) {
            return `${utils.bytesToSize(val)}`;
          },
        },
         {
          title: "storagerental.pledgeamount",
          name: "pledgeAmount",
          minWidth: "110px",
          valMap(val) {
             return `${utils.clearZero(val)} UTG`;
          },
        },
        {
          title: "storagerental.rentalprice",
          name: "rentPrice",
          minWidth: "140px",
          more: true,
          valMap(val, item) {
            return `${utils.CutZero(
              helper
                .getDataFormatDecimal(
                  val,
                  18,
                  _this_.rdecimal,
                  _this_.rent_decimal
                )
                .toFixed(_this_.rent_decimal)
            )} ${_this_.$t("storagerental.priceunit")}`;
          },
        },
        {
          title: "storagerental.rentalduration",
          name: "rentTime",

          minWidth: "120px",
          valMap(val) {
            return `${val || 0}${_this_.$t("storagerental.timeunit")}`;
          },
        },
        {
          title: "storagerental.totalrent",
          name: "rentAmount",
          minWidth: "100px",
          valMap(val) {
            return `${helper.getDataFormat(val, 18, 10000).toFixed(4)} SRT`;
          },
          more: true,
        },
        /* {
          title: "storagerental.blockheight",
          name: "rentNumber",
          minWidth: "120px",
          more: true,
        },
        {
          title: "storagerental.lavetime",
          name: "lavetime",
           minWidth: "120px",
          more: true,
        },*/
        {
          title: "storagerental.leasestatus",
          name: "rentStatus",
          minWidth: "130px",
          valMap(val) {
            return `${_this_.$t(_this_.types[val] || "")}`;
          },
        },
      ],
      tableData: [],

      rentaddress: "",
      rent_Hash: "",
      total: 0,
      searchInput: null,
      types,
      selStatus: "all",
      rent_decimal: 4,
      rdecimal: 10000,
      loadDataOk: false,
      shareItem: {
        img: "",
        url: "",
        isConfig: true,
        loading: false,
      },
    };
  },

  methods: {
    showPopover(data) {
      this.shareItem.loading = true;
      api
        .post("/platform/getStorageRentInfo", { rent_hash: data.rentHash })
        .then((re) => {
          this.shareItem.loading = false;
          let result = re.result || {};
          let img = result.attachPic;
          let url = result.attachText;
          this.shareItem.isConfig = !(utils.isEmpty(img) && utils.isEmpty(url));
          this.shareItem.img = img;
          this.shareItem.url = url;
          if(!this.shareItem.isConfig){
            this.getStorageinfo(data);
          }
        })
        .catch((err) => {
          console.log("error", err);
        });
    },

    getStorageinfo(data){
      let param = {
        device_addr: data.deviceAddr,
      };
      api
        .post("/platform/getStorageSpaceInfo", param)
        .then((re) => {
          this.shareItem.loading = false;
          let result = re.result || {};         
          let img = result.attachPic;
          let url = result.attachText;
          this.shareItem.isConfig = !(utils.isEmpty(img) && utils.isEmpty(url));
          this.shareItem.img = img;
          this.shareItem.url = url;
        })
        .catch((err) => {
          console.log("error", err);
        });
    },


    getStatus(val) {
      let status = this.types[val];
      if (status) {
        return this.$t(status);
      }
      return "";
    },

    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    async loadTable(query, toTop = true, pageNum) {
      if (!this.loadDataOk) {
        this.loadData();
        return;
      }

      if (!this.$store.getters.account) return;
      if (!query && this.$refs.htableStorageRental) {
        query = this.$refs.htableStorageRental.tableQuery;
      }
      if (!query) return;
      query.pageNum = pageNum || query.pageNum;

      var params = {
        current: query.pageNum,
        size: query.pageSize,
        rent_addr: this.$store.getters.account,
      };
      if (this.searchInput !== "" && this.searchInput != null) {
        params.device_addr = this.searchInput;
      }
      if (
        this.selStatus != "all" &&
        this.selStatus != null &&
        this.selStatus != "undefined"
      ) {
        params.status = this.selStatus;
      }

      //  query.loadingShow();      
      query.loadingShow(params, query.pageNum);      

      await utils.getNowHeight();
      api
        .postJson("/platform/getStorageRentList", params)
        .then((response) => {
          query.loadingHide();

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }
          let re = response.result || {};
          let tableData = re.records || [];

          tableData.forEach((item) => {
            item.rentaltime = utils.rentalTime(
              item.rentNumber,
              item.rentTime,
              item.renewTime,
              item.renewNumber
            );
            item.rescindtime = utils.rescindTime(
              item.rentNumber,
              item.rentTime,
              item.renewTime,
              item.renewNumber
            );
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
          this.goToUrl("storagedetail", row.deviceAddr);
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
      helper.goPathUrl(this, name, params);
    },

    goToUrlConfig(data){
      //helper.goPathUrl(this, "mymanage/config", data.rentHash);

      helper.goPathUrl(this,  "mymanage/config", `${data.rentHash}_${data.deviceAddr}`);
    },

    goToUrlRenewal(renthash) {
      // console.log("params=" + renthash);
      if (renthash) {
        helper.goPathUrl(this, "mymanage/renew", renthash);
      }
    },
    goToUrlRescind(data) {
      this.rentaddress = data.rentAddr;
      this.rent_Hash = data.rentHash;
      this.rentTimeCheck(() => {
        let rentHash = data.rentHash;
        let sdk = this.$store.getters.getsdk || null;
        if (sdk) {
          let _this_ = this;
          let setData = {
            title: `${this.$t("storagerental.relievetitle")}`,
            context: `${this.$t("storagerental.renthash")} : ${rentHash}`,
            request: null,
            closebtnshow: false,
            success() {
              if (_this_.$refs.RentalList) {
                _this_.$refs.RentalList.getRentalList(1);
              }
              _this_.$notify({
                title: _this_.$t("loadingSubPan.finish"),
                message: _this_.$t("messages.rescindgok"),
                type: "success",
              });
            },
            err() {
              _this_.$message.error("failed");
            },
          };
          let request = sdk.sendTransactionTo(
            webSdk.typeJson.stRescind,
            {
              addr1: data.deviceAddr,
              renthash: data.rentHash,
            },
            setData
          );
          setData.request = request;

          this.$store.dispatch("setNotification", setData);
        }
      });
    },

    rentTimeCheck(fun) {
      this.loading = true;
      let rentaddress = this.rentaddress.toLowerCase();
      let renewaladdress = this.$store.getters.account.toLowerCase();
      //console.log(rentaddress,renewaladdress)
      api
        .post("/platform/getStorageRentInfo ", {
          rent_hash: this.rent_Hash,
        })
        .then((response) => {
          this.loading = false;
          let result = response.result || {};
          let failCount = result.failCount;
          if (failCount < result.rentTime * 0.1) {
            this.$message.error(`${this.$t("messages.rentFailTime")}`);
            return;
          }

          if (rentaddress != renewaladdress) {
            this.$message.error(`${this.$t("messages.rentRelieveAddr")}`);
            return;
          }
          fun();
        })
        .catch((err) => {
          this.loading = false;
        });
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
<style lang="scss" scoped>
.search_select_div {
  display: inline-block;
}

.search_select {
  height: 36px;
  width: 100%;
  border: 1px solid #23cbe0;
  border-radius: 3px;
  padding-left: 20px;
}

@media (max-width: 550px) {
  .phone_width_100 {
    width: 100%;
    border-right: 3px !important;

    margin-bottom: 5px;
  }
}
</style>
