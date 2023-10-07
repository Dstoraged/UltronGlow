<template>
  <el-dialog :title="$t('storageNode.selectSP')" :visible.sync="dialogVisible"
   width="95%;" style="text-align:left;"
   class="ie-dialog-select"
   >
    <h-tbale
      @colClick="colClick"
      :heard-all-hid="true"
      :show-page="true"
      :table-heard="tableHeard"
      :table-data="tableData"
      :show-right-tools="true"
      right-btn-col-width="180px"
      @inint-ok="loadTable"
      @load="loadTable"
      :phone-lable-width="$i18n.locale == 'en' ? '92pt' : '60pt'"
      ref="hTable"
    >
      <div slot="rightCol" slot-scope="scope" style="text-align: center">
        <el-button
          v-if="nowAddr != scope.data.hash"
          size="mini"
          type="primary"
          @click="onSelect(scope.data)"
          icon="el-icon-check"
          >{{$t("storageNode.select")}}</el-button
        >
      </div>
    </h-tbale>
  </el-dialog>
</template>
<script >
import { setPageQuery } from "@/utils/table";
import HTbale from "@/components/modules/HTbale.vue";
import utils from "@/utils/utils.js";
import * as api from "@/api/api";
export default {
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
      dialogVisible: false,

      tableHeard: [
        {
          title: "storagePool.storagePoolAddress",
          name: "hash",
          type: "address",
          minWidth: "100px",
          format: true,
        },
         
        {
          title: "storagespace.storagefactor",
          name: "storageRatio",
          valMap: (val) => {
            return `${val || 0}`;
          },
          minWidth: "100px",
        },
        {
          title: "storagePool.rate",
          name: "feeRate",
          valMap: (val) => {
            return `${val || 0} %`;
          },
          minWidth: "100px",
        },
        {
          name: "entrustRate",
          title: "storagePool.SPRewardRatio",
          valMap: (val) => {
            return `${val || 0} %`;
          },
          minWidth: "100px",
        },
        {
          name: "totalCapacity",
          title: "storagePool.maxSpace",
          valMap: (val) => {
            return `${utils.bytesToSize(val)}`;
          },
          minWidth: "100px",
        },
        {
          name: "usedCapacity",
          title: "storagePool.usedSpace",
          valMap: (val) => {
            return `${utils.bytesToSize(val)}`;
          },
          minWidth: "100px",
        },
      ],
      tableData: [],
    };
  },
  methods: {
    loadTable(query, current) {
      if (!query && this.$refs.hTable) {
        query = this.$refs.hTable.tableQuery;
      }

      let redata = {
        current: current || query.pageNum || 1,
        size: query.pageSize,
        status: 1,
      };

      query.loadingShow();
      api
        .postJson("/spPool/getStoragePoolList", redata)
        .then((response) => {
          query.loadingHide();
          let tableData = response.result.records || [];
          this.tableData = tableData;
          setPageQuery(query, response.result);
        })
        .catch((err) => {
          query.table_loading = false;
          console.log("error", err);
        });
    },
    onSelect(row) {
      this.$emit("select", row,this.tableHeard);
    },
    colClick(obj) {
      console.log("colClick", obj);
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(newVal) {
        this.dialogVisible = newVal;
      },
    },
    dialogVisible(newVal) {
      this.$emit("input", newVal);
      this.$emit("change", newVal);
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
</style>