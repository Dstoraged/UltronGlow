<template>
  <div>
    <h-tbale ref="htable" :table-id="'RentalRecord' + address" :table-heard="tableHeard" :table-data="tableData"
      @inint-ok="tableInit" @load="loadTable" @colClick="colClick">
      <template slot="table_cell_rentStatus" slot-scope="scope">
        <span>{{ getStatus(scope.data.rentStatus) }}</span>
        <!--
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
      -->
      </template>
    </h-tbale>
  </div>
</template>
<script>
import { Message } from "element-ui";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import utils from "@/utils/utils";
import HTbale from "@/components/modules/HTbale.vue";
import { setPageQuery } from "@/utils/table.js";
export default {
  name: "RentalRecord",
  components: { HTbale },
  props: {
    address: {
      type: String,
      default: "",
    },

    rent_decimal: {
      type:Number,
      default: 4,
    },
    rdecimal: {
      type: Number,
      default: 10000,
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
          more: true,
        },
        {
          title: "storagerental.rentaladdress",
          name: "rentAddr",
          format: true,
          popover: true,
          isClick: true,
        },
        {
          title: "storagerental.applytime",
          name: "instime",
          type: "time",
          more: true,
        },
        {
          title: "storagerental.blockheight",
          name: "rentNumber",
          more: true,
        },
        {
          title: "storagerental.rentspace",
          name: "rentSpace",
          valMap(val) {
            return utils.bytesToSize(val);
          },
        },
        {
          title: "storagerental.pledgeamount",
          name: "pledgeAmount",
          valMap(val) {
            return `${utils.clearZero(val)} UTG`;
          },
        },
        {
          title: "storagerental.rentalprice",
          name: "rentPrice",
          valMap(val) {
            let valL = utils.CutZero(
              helper
                .getDataFormatDecimal(
                  val,
                  18,
                  _this_.rdecimal,
                  _this_.rent_decimal
                )
                .toFixed(_this_.rent_decimal)
            );
            return `${valL} ${_this_.$t("storagerental.priceunit")}`;
          },
        },
        {
          title: "storagerental.rentalduration",
          name: "rentTime",
          valMap(val) {
            return `${val} ${_this_.$t("storagerental.timeunit")}`;
          },
          more: true,
        },
        {
          title: "storagerental.totalrent",
          name: "rentAmount",
          valMap(val) {
            return `${helper.getDataFormat(val, 18, 10000).toFixed(4)}   SRT`;
          },
          more: true,
        },

        /*
        {
          title: "market.timespacecur",
          name: "vaildStatus",
          valMap(val) {            
            if (val==0) {
              return _this_.$t("comm.success");
            }else{
              return _this_.$t("comm.fail");
            };
          },
          more: true,
        },
        */

        {
          title: "storagerental.leasestatus",
          name: "rentStatus",
          valMap(val) {
            let status = _this_.types[val];
            if (status) {
              return _this_.$t(status);
            }
            return "";
          },
        },
      ],
      tableData: [],

      loadSetOk: false,
      searchInput: null,
      types,
      /*
      rent_decimal: 4,
      rdecimal: 10000,
*/
      shareItem: {
        img: "",
        url: "",
        isConfig: true,
        loading: false,
      },
    };
  },
  watch: {
    address: {
      immediate: true,
      handler(id) {
        console.log(id);
        this.tableInit(null, 1);
      },
    },
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
    loadTable(query, toTop = true, pageNum) {

      /*
      if (!this.loadSetOk) {
        this.loadData();
        return;
      }
      */

      if (!query && this.$refs.htable) {
        query = this.$refs.htable.tableQuery;
      }
      if (!query) return;
      query.pageNum = pageNum || query.pageNum;
      var param = {
        current: query.pageNum,
        size: query.pageSize,
        device_addr: this.address,
      };

      // query.loadingShow();
      query.loadingShow(param, pageNum);

      api
        .postJson("/platform/getStorageRentList", param)
        .then((response) => {
          query.loadingHide();

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }
          let re = response.result || {};
          this.tableData = re.records || [];

          setPageQuery(query, re);
          if (toTop && this.tableData.length > 0) {
            query.toTop();
          }
        })
        .catch((error) => {
          query.loadingHide(JSON.stringify(error).includes("timeout") ? 1 : 2);
        });
    },
    colClick(data) {
      let col = data.col || {};
      let row = data.row || {};
      switch (col.name) {
        case "rentHash":
          this.goToUrl("TxnsInfo", row.rentHash);
          break;
        case "rentAddr":
          this.goToUrl("AccountDetail", row.rentAddr);
          break;
      }
    },
    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },

    loadData() {
      api
        .postJson("/platform/getStorageBasicSet", {})
        .then((response) => {
          let result = response.result;
          this.rent_decimal = Number(result["10"] || 4);
          this.switchDecimal(this.rent_decimal);
          if (!this.loadSetOk) {
            this.loadSetOk = true;
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
    address: function () {
      this.tableInit(null, 1);
    },
  },
};
</script>
<style lang="scss" scoped>

</style>
