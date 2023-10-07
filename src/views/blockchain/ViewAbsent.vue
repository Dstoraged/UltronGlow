<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <div class="row" style="padding: 6px; text-align: left">
          <div class="col-md-4">
            <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
              {{ $t("absent.absentRecord") }}
            </h4>
            <p class="sub-title" style="width: 100%; text-align: left">
              {{ $t("absent.currentAbsentNumber", [total]) }}
            </p>
          </div>
          <div class="col-md-4">
            <div class="input-group" style="margin: 0 auto">
              <input
                type="text"
                class="form-control"
                :placeholder="$t('block.blockSearch')"
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

              <div class="btn-group" v-if="isMobile">
                <button
                  class="btn btn-secondary btn-sm btn-block"
                  style="
                    padding: 1px;
                    border-radius: 4px;
                    margin-left: 6px;
                    height: 35px;
                    width: 25px;
                  "
                  @click="btnPopover"
                >
                  <i class="mdi mdi-filter"></i>
                </button>
                <div
                  id="lvblockNumber"
                  style="
                    display: none;
                    position: absolute;
                    z-index: 999999;
                    right: 0;
                    top: 30px;
                    width: 250px;
                    background-color: #ffffff;
                    border: #ececec solid 1px;
                    padding: 15px;
                    border-radius: 4px;
                    -webkit-box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
                    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
                    border-top: #23cbe0 solid 2px;
                  "
                >
                  <div>
                    <div class="form-group row">
                      <div class="col-sm-4">
                        {{ $t("absent.blockNumber") }}
                      </div>
                      <div class="col-sm-8">
                        <input
                          type="text"
                          class="form-control"
                          id="blocknumber"
                          v-model="blocknumber"
                          style="width: 100%"
                        />
                      </div>
                    </div>
                    <div class="popover-footer" style="text-align: center">
                      <button
                        type="button"
                        class="btn btn-primary btn-sm"
                        @click="btnFilter"
                      >
                        <i class="fa fa-filter"></i>{{ $t("comm.filter") }}
                      </button>
                      <button
                        type="button"
                        class="btn btn-primary btn-sm"
                        @click="btnClear"
                      >
                        <i class="fa fa-eraser"></i>{{ $t("comm.clear") }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h-tbale
          ref="htable"
          :table-heard="tableHeard"
          :table-data="tableData"
          :show-right-tools="false"
          tableId="ViewAbsent"
          :showSubtitle="false"
          @inint-ok="tableInit"
          @load="loadTable"
          @colClick="colClick"
        >
          <template slot="table_cell_type" slot-scope="scope">
            <span v-if="scope.data.type == 1">{{
              $t("absent.absentType1")
            }}</span>
            <span v-else-if="scope.data.type == 2">{{
              $t("absent.absentType2")
            }}</span>
          </template>
          <div
            class="btn-group"
            slot="table_title_right_blockNumber"
            slot-scope="scope"
            v-if="scope.type == 'pc'"
          >
            <button
              class="btn btn-secondary btn-sm btn-block"
              style="
                padding: 1px;
                border-radius: 4px;
                margin-left: 6px;
                height: 19px;
              "
              @click="btnBlockNumberPopover(scope.type)"
            >
              <i class="mdi mdi-filter"></i>
            </button>
            <div
              :id="`lvblockNumber_${scope.type}`"
              style="
                display: none;
                position: absolute;
                z-index: 999999;
                right: 0;
                top: 30px;
                width: 180px;
                background-color: #ffffff;
                border: #ececec solid 1px;
                padding: 15px;
                border-radius: 4px;
                -webkit-box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
                box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
                border-top: #23cbe0 solid 2px;
              "
            >
              <div>
                <div class="form-group row">
                  <div class="col-sm-12">
                    <input
                      type="text"
                      class="form-control"
                      id="blocknumber"
                      v-model="blocknumber"
                      style="width: 100%"
                    />
                  </div>
                </div>
                <div class="popover-footer" style="text-align: center">
                  <button
                    type="button"
                    class="btn btn-primary btn-sm"
                    @click="bntBlockNumberFilter(scope.type)"
                  >
                    <i class="fa fa-filter"></i>{{ $t("comm.filter") }}
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary btn-sm"
                    @click="bntBlockNumberClear(scope.type)"
                  >
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
  name: "ViewAbsent",
  components: { HTbale },
  props: {},
  data() {
    let _this_ = this;
    return {
      tableHeard: [
        {
          title: "absent.address",
          name: "address",
          format: true,
          popover: true,
        },
        {
          title: "absent.blockNumber",
          name: "blockNumber",
        },
        {
          title: "absent.punishScore",
          name: "fractions",
        },
        {
          title: "absent.punishCause",
          name: "type",
        },
        {
          title: "absent.punishTime",
          name: "timeStamp",
        },
      ],
      tableData: [],
      total: 0,
      searchInput: null,
      blocknumber: "",

      isMobile: utils.isMobile(),
    };
  },

  methods: {
    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    loadTable(query, toTop = true, pageNum) {
      if (!query && this.$refs.htable) {
        query = this.$refs.htable.tableQuery;
      }
      if (!query) return;
      query.pageNum = pageNum || query.pageNum;
      if (query.pageSize == 0) query.pageSize = 10;
      //query.loadingShow();

      var param = {
        current: query.pageNum,
        size: query.pageSize,
      };

      if (this.searchInput !== "" && this.searchInput != null) {
        param.address = this.searchInput;
      }
      if (
        this.blocknumber != "" &&
        this.blocknumber != null &&
        this.blocknumber != "undefined"
      ) {
        param.blockNumber = this.blocknumber;
      }

      query.loadingShow(param, pageNum);
      this.searchInput = param.address;
      this.blocknumber = param.blockNumber;

      api
        .postJson("/platform/utg/getPunished", param)
        .then((response) => {
          query.table_loading = false;

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }
          let re = response.result || {};
          this.tableData = re.records || [];
          if (response.result != null) this.total = response.result.total;

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
        case "blockNumber":
          this.goToUrl("BlockDetail", row.blockNumber);
          break;
        case "minerAddress":
          this.goToUrl("AccountDetail", row.minerAddress);
          break;
      }
    },

    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },

    btnPopover() {
      $("#lvblockNumber").toggle();
    },

    btnFilter() {
      $("#lvblockNumber").toggle();
      this.tableInit(null, 1);
    },

    btnClear() {
      $("#lvblockNumber").toggle();
      this.blocknumber = "";
      this.tableInit(null, 1);
    },

    btnBlockNumberPopover(type) {
      var dv = "lvblockNumber_" + type;
      $("#" + dv).toggle();
    },

    bntBlockNumberFilter(type) {
      var dv = "lvblockNumber_" + type;
      $("#" + dv).toggle();
      this.tableInit(null, 1);
    },

    bntBlockNumberClear(type) {
      var dv = "lvblockNumber_" + type;
      $("#" + dv).toggle();
      this.blocknumber = "";
      this.tableInit(null, 1);
    },
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
</style>
