<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <div class="row" style="padding: 6px; text-align: left">
          <div class="col-md-4">
            <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
              {{ $t("accounts.addr") }}
            </h4>
            <p class="sub-title" style="width: 100%; text-align: left">
              {{ $t("accounts.currentAddrNumber", [total]) }}
            </p>
          </div>
          <div class="col-md-4">
            <div class="input-group" style="margin: 0 auto">
              <input type="text" class="form-control" :placeholder="$t('accounts.addrSearch')" id="demo"
                v-model="searchInput" @keyup.enter="tableInit(null, 1)" style="border-right: 0px; width: 60%" />
              <div class="input-group-append">
                <button class="btn btn-block waves-effect waves-light" type="button" @click="tableInit(null, 1)"
                  style="background-color: #d4d4d4">
                  {{ $t("comm.search") }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <h-tbale ref="htable" :table-heard="tableHeard" :table-data="tableData" :show-right-tools="false"
          :showSubtitle="false" :up-load-time="30000" table-id="ViewAccountsTableId" @inint-ok="tableInit"
          @load="loadTable" @colClick="colClick">
          <template slot="table_cell_address" slot-scope="scope">
            <el-popover placement="bottom" width="380" trigger="hover" :content="scope.data.address">
              <span slot="reference" style="color: #00caca;" class="cursor span_address"
                @click="goToUrl('AccountDetail', scope.data.address)">
                {{ getAddrMinFormat(scope.data.address, 10) }}
              </span>
            </el-popover>
            <span v-if="showicon">
              <img src="@/assets/images/ico_jiedian.png" class="cursor" loading="lazy" style="margin-right: 5px;"
                :title="$t('accounts.nodeAddress')" @click="goToUrl('NodeView', scope.data.address)"
                v-if="scope.data.isminer==1">
              <img src="@/assets/images/ico_shebei.png" class="cursor" loading="lazy" style="margin-right: 5px;"
                :title="$t('accounts.storagenodeAddress')" @click="goToUrl('StorageDetail', scope.data.address)"
                v-if="scope.data.isstorage==1">
              <img src="@/assets/images/ico_shouyi.png" class="cursor" loading="lazy" style="margin-right: 5px;"
                :title="$t('accounts.profitAddress')" @click="goToUrl('AccountDetail', scope.data.address)"
                v-if="scope.data.isrevenue==1">
              <img src="@/assets/images/ico_heyue.png" class="cursor" loading="lazy" style="margin-right: 5px;"
                :title="$t('accounts.contractAddress')" @click="goToUrl('ContractInfo', scope.data.address)"
                v-if="scope.data.iscontract==1">
            </span>
          </template>

          <el-button slot="table_cell_haslock" slot-scope="scope" size="mini" type="text"
            :disabled="!scope.data.haslock" @click="goToUrl(scope.data.address, 'lock')" color="red">{{ $t("comm.check")
            }}</el-button>
        </h-tbale>

        <div class="row" style="text-align: left" v-if="showicon">
          <span style="margin-left: 10px;margin-right: 10px;">{{ $t("accounts.diagram") }}:</span>
          <span><img src="@/assets/images/ico_jiedian.png" loading="lazy"
              style="margin-left: 5px;margin-right: 10px;" />{{ $t('accounts.nodeAddress') }}</span>
          <span><img src="@/assets/images/ico_shebei.png" loading="lazy"
              style="margin-left: 10px;margin-right: 10px;">{{ $t('accounts.storagenodeAddress') }}</span>
          <span><img src="@/assets/images/ico_shouyi.png" loading="lazy"
              style="margin-left: 10px;margin-right: 10px;">{{ $t('accounts.profitAddress') }}</span>
          <span><img src="@/assets/images/ico_heyue.png" loading="lazy" style="margin-left: 10px;margin-right: 10px;">{{
              $t('accounts.contractAddress')
          }}</span>
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
import HTbale from "@/components/modules/HTbale.vue";
import { setPageQuery } from "@/utils/table.js";

export default {
  name: "ViewAccounts",
  components: { HTbale },
  props: {},
  data() {
    let _this_ = this;
    return {
      tableHeard: [
        {
          title: "accounts.addr",
          name: "address",
          format: true,
          popover: true,
          isClick: true,
        },
        {
          title: "accounts.balance",
          name: "balance",
          valMap(val) {
            return (
              utils.weedZero(helper.getDataFormat(val, 18, 10000), 8) + " UTG"
            );
          },
        },
        {
          title: "accounts.market",
          name: "proportion",
          valMap(val, item) {
            return (
              utils.weedZero(
                (helper.getDataFormat(item.balance, 18, 10000) / 105000000) *
                100,
                8
              ) + " %"
            );
          },
        },
        {
          title: "accounts.tranTotal",
          name: "toCount",
        },
        {
          title: "lock.lock",
          name: "haslock",
        },
      ],
      tableData: [],
      total: 0,
      searchInput: null,
      showicon: window.$url.showAccountIcon
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

      var param = {
        current: query.pageNum,
        size: query.pageSize,
      };

      if (this.searchInput !== "" && this.searchInput != null) {
        param.address = this.searchInput;
      }
      //query.loadingShow();
      query.loadingShow(param, pageNum);
      this.searchInput = param.address;

      api
        .postJson("/platform/getAddressList", param)
        .then((response) => {
          query.table_loading = false;

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }
          let re = response.result || {};
          this.tableData = re.records || [];
          this.total = response.result.total;

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
        case "address":
          this.goToUrl("AccountDetail", row.address);
          break;
      }
    },

    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },

    getAddrFormat(data, number) {
      return helper.getAddrFormat(data, number);
    },

    getAddrMinFormat(data, number) {
      if (utils.isMobile() || this.getMinScreen())
        return helper.getAddrFormat(data, 10);
      else
        return helper.getAddrFormat(data, 13);
    },

    getMinScreen() {
      let screenWidth = document.body.clientWidth;
      if (screenWidth < 768) {
        return true;
      }
      return false;
    }
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}

@media (min-width: 769px) {
  .span_address {   
    width: 220px;
    text-align: left;
    display: inline-block;
  }
}

@media (max-width: 768px) {
  .span_address {
    width: 170px;
    text-align: left;
    display: inline-block;
  }
}

</style>
