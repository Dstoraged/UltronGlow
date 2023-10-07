<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 30px">
      <div class="card-body">
        <div class="row" style="padding: 6px; text-align: left">
          <div class="col-md-4">
            <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
              <span>{{ $t("node.pledgerecord") }}</span>
            </h4>
            <p class="sub-title" style="width: 100%; text-align: left">
              {{ $t("lock.currentPledgeNumber", [totalp]) }}
            </p>
          </div>
          <div class="col-md-4">
            <div class="input-group" style="margin: 0 auto">
              <input type="text" class="form-control" :placeholder="$t('node.pledgeAddressSearch')" id="demo"
                v-model="searchInput" @keyup.enter="tableInitnodePledgeList(null, 1)"
                style="border-right: 0px; width: 60%" />
              <div class="input-group-append">
                <button class="btn btn-block waves-effect waves-light" type="button"
                  @click="tableInitnodePledgeList(null, 1)" style="background-color: #d4d4d4">
                  {{ $t("comm.search") }}
                </button>
              </div>

              <div class="btn-group" v-if="isMobile">
                <button class="btn btn-secondary btn-sm btn-block" style="
                    padding: 1px;
                    border-radius: 4px;
                    margin-left: 6px;
                    height: 35px;
                    width: 25px;
                  " @click="btnPopover">
                  <i class="mdi mdi-filter"></i>
                </button>
                <div id="lvMobile" style="
                    display: none;
                    position: absolute;
                    z-index: 999999;
                    right: 0;
                    top: 30px;
                    width: 300px;
                    background-color: #ffffff;
                    border: #ececec solid 1px;
                    padding: 15px;
                    border-radius: 4px;
                    -webkit-box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
                    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
                    border-top: #23cbe0 solid 2px;
                  ">
                  <div>
                    <div class="form-group row">
                      <div class="col-sm-4">
                        {{ $t("market.pledgestatus") }}
                      </div>
                      <div class="col-sm-8">
                        <select class="form-control" name="selectStatus" v-model="selStatus" id="selectStatus"
                          @change="handleStatusChange()">
                          <option value="all" selected>{{ $t("node.plestatus") }}</option>
                          <option value="0">{{ $t("node.plestatus0") }}</option>
                          <option value="1">{{ $t("node.plestatus1") }}</option>
                        </select>
                      </div>
                    </div>
                    <div class="popover-footer" style="text-align: center">
                      <button type="button" class="btn btn-primary btn-sm" @click="btnFilter">
                        <i class="fa fa-filter"></i>{{ $t("comm.filter") }}
                      </button>
                      <button type="button" class="btn btn-primary btn-sm" @click="btnClear">
                        <i class="fa fa-eraser"></i>{{ $t("comm.clear") }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <h-tbale ref="htableNodePledgeList" :table-heard="nodePledgeListTableHeard"
          :table-data="nodePledgeListtableData" :show-right-tools="false" :tableId="'NodepledgeTrans'                      +                      node_addr"
          :showSubtitle="false" @inint-ok="tableInitnodePledgeList" @load="loadTablenodePledgeList"
          @colClick="colClick">
          <template slot="table_cell_pledge_status" slot-scope="scope">
            <span v-if="scope.data.pledge_status == 1" style="color:  #2ebac6">
              {{ $t(plestauts[scope.data.pledge_status]) }}
            </span>
            <span v-else style="color: #B6B6B4">
              {{ $t(plestauts[scope.data.pledge_status]) }}
            </span>
          </template>

          <template slot="table_cell_unpledge_type" slot-scope="scope">
            <span v-if="scope.data.unpledge_type == 1">
              {{ $t("node.exitpledgetype1") }}
            </span>
            <span v-else-if="scope.data.unpledge_type == null">
            </span>
            <span v-else>
              {{ $t("node.exitpledgetype0") }}
            </span>
          </template>


          <div class="btn-group" slot="table_title_right_pledge_status" slot-scope="scope" v-if="scope.type == 'pc'">
            <button class="btn btn-secondary btn-sm btn-block" style="
                padding: 1px;
                border-radius: 4px;
                margin-left: 6px;
                height: 19px;
              " @click="btnPlegdeStatusPopover(scope.type)" id="BtnStatusPopover">
              <i class="mdi mdi-filter"></i>
            </button>
            <div :id="`lvPlegdeStatus_${scope.type}`" style="
                display: none;
                position: absolute;
                z-index: 999999;
                right: 0;
                top: 30px;
                width: 200px;
                background-color: #ffffff;
                border: #ececec solid 1px;
                padding: 15px;
                border-radius: 4px;
                -webkit-box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
                box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
                border-top: #23cbe0 solid 2px;
              ">
              <div>
                <div class="form-group row">
                  <div class="col-sm-12">
                    <select class="form-control" name="selectStatus" v-model="selStatus" id="selectStatus"
                      @change="handleStatusChange()">
                      <option value="all" selected>{{ $t("node.plestatus") }}</option>
                      <option value="0">{{ $t("node.plestatus0") }}</option>
                      <option value="1">{{ $t("node.plestatus1") }}</option>
                    </select>
                  </div>
                </div>
                <div class="popover-footer" style="text-align: center">
                  <button type="button" class="btn btn-primary btn-sm" @click="bntPlegdeStatusFilter(scope.type)">
                    <i class="fa fa-filter"></i>{{ $t("comm.filter") }}
                  </button>
                  <button type="button" class="btn btn-primary btn-sm" @click="bntPlegdeStatusClear(scope.type)">
                    <i class="fa fa-eraser"></i>{{ $t("comm.clear") }}
                  </button>
                </div>
              </div>
            </div>
          </div>

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
import HTbale from "@/components/modules/HTbale.vue";
import { setPageQuery } from "@/utils/table.js";
export default {
  name: "NodepledgeTrans",
  components: { HTbale },
  props: {},

  data() {
    let _this_ = this;
    const plestauts = {
      0: "node.plestatus0",
      1: "node.plestatus1",
    };
    return {
      nodePledgeListTableHeard: [
        {
          title: "node.pledgeahash",
          name: "pledge_hash",
          format: true,
          popover: true,
          fnum: 12,
        },
        {
          title: "node.address",
          name: "node_address",
          format: true,
          popover: true,
          fnum: 12,
        },
        {
          title: "node.pledgeaddress",
          name: "pledge_address",
          format: true,
          popover: true,
          fnum: 12,
        },
        {
          title: "node.pledgeamounte",
          name: "pledge_amount",
          valMap(val) {
            return helper.getDataFormat(val, 18, 10000).toFixed(4) + " UTG";
          },
        },
        {
          title: "node.shareradio",
          name: "ratio",
          valMap(val) {
            if (val != null) {
              if (val > 0)
                return (val * 100).toFixed(2) + "%";
              else
                return "<0.01%";
            } else {
              return "";
            }
          },
          more: true,
        },
        {
          title: "node.pledgeNumber",
          name: "pledge_number",
          more: true,
        },
        {
          title: "node.pledgestatus",
          name: "pledge_status",
          more: true,
        },
        {
          title: "node.exitpledgeheight",
          name: "unpledge_number",
          more: true,
        },
        /*
        {
          title: "node.exitpledgetype",
          name: "unpledge_type",
          more: true,
        },
*/
        {
          title: "node.pledgetime",
          name: "pledge_time",
          valMap(val) {
            return helper.formatTime(val, 1);
          },
          more: true,
        },
      ],
      nodePledgeListtableData: [],
      totalp: 0,
      node_addr: "",
      plestauts,
      selStatus: "all",
      searchInput: "",
      isMobile: utils.isMobile(),
    };
  },

  created() {
    this.node_addr = this.$route.params.id;
  },

  methods: {
    tableInitnodePledgeList(query, pageNum) {
      this.loadTablenodePledgeList(query, false, pageNum);
    },
    async loadTablenodePledgeList(query, toTop = true, pageNum) {
      await utils.getNowHeight();

      if (!query && this.$refs.htableNodePledgeList) {
        query = this.$refs.htableNodePledgeList.tableQuery;
      }
      if (!query) return;
      query.pageNum = pageNum || query.pageNum;

      var params = {
        current: query.pageNum,
        size: query.pageSize,
        node_address: this.node_addr
      };

      if (this.searchInput !== "" && this.searchInput != null) {
        params.pledge_address = this.searchInput;
      }

      if (
        this.selStatus != "all" &&
        this.selStatus != null &&
        this.selStatus != "undefined"
      ) {
        params.pledge_status = this.selStatus;
      }

      query.loadingShow(params, pageNum);
      this.node_addr = params.node_address;

      api
        .postJson("/platform/getNodePledgeList", params)
        .then((response) => {
          query.table_loading = false;

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }
          let re = response.result || {};
          this.nodePledgeListtableData = re.records || [];
          if (response.result != null) this.totalp = response.result.total;

          setPageQuery(query, re);
          if (toTop && this.nodePledgeListtableData.length > 0) {
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
    },

    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },

    handleStatusChange() {
      var val = $("#selectStatus").val();
      this.selStatus = val;
      sessionStorage.setItem("selStatus", val);
    },

    btnPopover() {
      $("#lvMobile").toggle();
    },

    btnFilter() {
      $("#lvMobile").toggle();
      this.tableInitnodePledgeList(null, 1);
    },

    btnClear() {
      $("#lvMobile").toggle();
      this.selStatus = "all";
      this.tableInitnodePledgeList(null, 1);
    },

    btnPlegdeStatusPopover(type) {
      var dv = "lvPlegdeStatus_" + type;
      $("#" + dv).toggle();
    },

    bntPlegdeStatusFilter(type) {
      var dv = "lvPlegdeStatus_" + type;
      $("#" + dv).toggle();
      this.tableInitnodePledgeList(null, 1);
    },

    bntPlegdeStatusClear(type) {
      var dv = "lvPlegdeStatus_" + type;
      $("#" + dv).toggle();
      this.selStatus = "all";
      this.tableInitnodePledgeList(null, 1);
    },

  },
};
</script>
<style lang="scss" scoped>
.span_tooltip {
  display: none;
}

.cursor {
  cursor: pointer;
}

a:hover .span_tooltip {
  border: 1px solid;
  display: block;
  position: absolute;
  background: #ffffff;
  border-color: "#019858";
  width: 270px;
  height: 40px;
  margin: 4px 0 0 10px;
  padding: 8px;
}
</style>
