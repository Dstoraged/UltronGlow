<template>
  <el-dialog
    :title="$t('nodeMove.selectPoS')"
    :visible.sync="dialogVisible"
    class="ie-dialog-select text-left"
  >
    <div>
      <div class="text-center">
        <el-input
          :placeholder="$t('node.nodeSearch')"
          v-model="searchs.data.node_address"
          @keyup.enter="tableInit(null, 1)"
          style="max-width: 350px"
          class="ma-xs"
        >
          <el-button
            slot="append"
            @click="loadTable(null, true, 1)"
            style="background-color: #d4d4d4"
          >
            {{ $t("comm.search") }}
          </el-button>
        </el-input>
      </div>
    </div>
    <h-tbale
      ref="htable"
      :show-subtitle="false"
      :table-heard="tableHeard"
      :table-data="tableData"
      :show-right-tools="true"
      :show-order="false"
      @inint-ok="tableInit"
      @load="loadTable"
    >
    <div class="btn-group" slot="table_title_right_rate" >
        <el-popover
          placement="top-start"          
          width="300"
          trigger="hover"
          :content="$t('node.ratedescribe')">          
          <el-button slot="reference" class="btn  btn-sm btn-block" style="
                padding: 1px;
                border-radius: 4px;
                margin-left: 0px;
                height: 19px;"><i class="mdi dripicons-information" ></i></el-button>
        </el-popover>
      </div>
      <template slot="rightCol" slot-scope="scope">
        <el-button
          :disabled="scope.data.node_address == nowAddr"
          size="mini"
          type="primary"
          @click="onSub(scope.data)"
          >{{ $t("nodeMove.select") }}</el-button
        >
      </template>
    </h-tbale>
    <!--<span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{$t("comm.cancelButtonText")}}</el-button>
      <el-button :disabled="!select" type="primary" @click="onSub"
        >{{$t("comm.confirmButtonText")}}</el-button
      >
    </span>-->
  </el-dialog>
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
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    nowAddr: {
      type: String,
      default: "",
    },
  },
  data() {
    let _this_ = this;

    return {
      select: null,
      dialogVisible: false,
      searchs: {
        data: {
          node_address: "",
          activeStatus: "",
        },
        win: {
          activeStatus: false,
        },
      },
      tableHeard: [
        /* {
          title: "nodeMove.select",
          name: "select",
          width: "80px",
        },*/

        {
          title: "node.nodeAddress",
          name: "node_address",
          format: true,
          popover: true,
          fnum: 6,
          minWidth: "110px",
        },

        {
          title: "node.nodetype",
          name: "node_type",
          more: true,
          minWidth: "120px",
          //   isHtml:true,
          valMap(val) {
            switch (val) {
              case 1:
                return _this_.$t("node.candidateNode");

              case 2:
                return _this_.$t("node.witnessNode");
            }
          },
        },
        {
          title: "node.chargerate",
          name: "rate",
          
          titleright:{
            popover:true,
            btnIcon:"mdi dripicons-information",
            msg:"node.ratedescribe"
          },
          valMap(val) {
            if (val)
              return val/100 + "%";
            else
              return "0 %";
          },
          more: true,
        },

       
      ],
      tableData: [],
      total: 0,
    };
  },

  methods: {
    pledgeNum(item) {
      let reNum = utils.uumbersHandle(
        [item.pledgeAmount, item.havAmount],
        ["-"],
        18
      );

      return `${utils.clearZero(reNum) || 0} UTG`;
    },
    pledgeStatusSpan(val) {
      return utils.getPledgeStatus(val).span;
    },
    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    loadTable(query, toTop = true, pageNum) {
      if (!this.$store.getters.account) return;
      if (!query && this.$refs.htable) {
        query = this.$refs.htable.tableQuery;
      }
      if (!query) return;
      query.pageNum = pageNum || query.pageNum;

      var params = {
        current: query.pageNum,
        size: query.pageSize,
        types: [1, 2],
      };
      Object.assign(params, this.searchs.data);

      //query.loadingShow();
      query.loadingShow(params, query.pageNum);

      api
        .postJson("/platform/node/getcadnodelist", params)
        .then((response) => {
          query.loadingHide();

          this.select = null;

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }
          let re = response.result || {};
          let tableData = re.records || [];

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
    onSub(item) {
      this.$emit("onSub", item || this.select,this.tableHeard);
    },
  },

  watch: {
    "$store.getters.account": function () {
      this.tableInit(null, 1);
    },
    dialogVisible(newVal) {
      this.$emit("input", newVal);
      this.$emit("change", newVal);
    },
    value: {
      immediate: true,
      handler(newVal) {
        this.dialogVisible = !!newVal;
      },
    },
  },
};
</script>
<style lang="scss" >
.ie-dialog-select {
  .el-dialog {
    width: 95%;
    max-width: 1100px;
    .el-dialog__body {
      padding: 0px 20px;
    }
  }
}
</style>
