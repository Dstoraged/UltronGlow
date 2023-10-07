<template>
  <div>
    <div class="container-fluid">
      <div class="card" style="margin-top: 30px; margin-bottom: 5px">
        <div class="card-body" style="text-align: left">
          <h4 class="mt-0 header-title">{{ $t("accounts.info") }}</h4>
          <div class="row">
            <div class="col-md-6">
              <div class="card" style="margin-top: 5px; margin-bottom: 0px">
                <div
                  class="card-body"
                  style="text-align: left; margin-bottom: 0px"
                >
                  <h4 class="mt-0 header-title">
                    {{ $t("accountdetail.Overview") }}
                  </h4>
                  <VTable :table-heard="leftTbHeard" :datas="accInfo">
                    <template slot="avl_left_first_balance">{{
                      "UTG "
                    }}</template>

                    <template slot="table_cell_tokenHoldings">
                      <el-popover
                        placement="bottom"
                        trigger="click"
                        :width="350"
                      >
                        <el-input
                          v-model="tokens.filterInput"
                          :placeholder="$t('accountdetail.searchToken')"
                          class="tokens_input"
                          clearable
                        />
                        <div style="height: 20px"></div>
                        <van-cell-group
                          style="
                            max-height: 350px;
                            padding: 0px 10px;
                            overflow-y: auto;
                          "
                          v-loading="tokens.loading"
                        >
                          <div
                            v-for="(item, cd) in tokenOptions"
                            :key="cd"
                            :class="item.isTitle ? '' : 'tokens_item'"
                            @click="colClickToken(item)"
                          >
                            <div v-if="item.isTitle" class="tokens_title">
                              {{ $t(tokens.types[item.name]) }}
                            </div>
                            <van-cell
                              v-else
                              :value="decimalNum(item.balance)"
                              class="hover_ee"
                            >
                              <template slot="label">{{
                                item.symbol
                              }}</template>
                              <template slot="title">{{ item.name }}</template>
                            </van-cell>
                          </div>
                        </van-cell-group>

                        <div
                          style="
                            width: 100%;
                            padding: 5px 20px 5px;
                            border-radius: 5px;
                            border: 1px solid rgba(0, 0, 0, 0.125);
                          "
                          slot="reference"
                          class="hover_ee"
                        >
                          <span style="float: left; line-height: 25px"
                            >({{ tokenNumber }}
                            {{ $t("accountdetail.tokens") }})</span
                          ><span
                            style="float: right; line-height: 25px"
                            class="el-icon-arrow-down e"
                          ></span>
                          <div style="clear: both"></div>
                        </div>
                      </el-popover>
                    </template>
                    <template slot="table_cell_accaddr" slot-scope="scope">
                      <span style="color: #25838b">{{ scope.accaddr }}</span>
                      <span style="margin-left: 10px">
                        <img
                          src="@/assets/images/copy.png"
                          class="cursor"
                          style="width: 16px; height: 16px"
                          :title="$t('accounts.copy')"
                          @click="handleCopy(scope.accaddr)"
                        />
                      </span>
                      <span style="margin-left: 10px">
                        <img
                          class="cursor"
                          style="width: 16px; height: 16px"
                          src="@/assets/images/recode.png"
                          :title="$t('accounts.QRcode')"
                          @click="handleDialog()"
                        />
                      </span>
                      <span v-if="showicon">
                        <span style="margin-left: 10px" v-if="isminer == 1">
                          <img
                            class="cursor"
                            style="width: 16px; height: 16px"
                            src="@/assets/images/ico_jiedian.png"
                            :title="$t('accounts.nodeAddress')"
                            @click="goToUrl('NodeView', accAddr)"
                          />
                        </span>
                        <span style="margin-left: 10px" v-if="isstorage == 1">
                          <img
                            class="cursor"
                            style="width: 16px; height: 16px"
                            :title="$t('accounts.storagenodeAddress')"
                            src="@/assets/images/ico_shebei.png"
                            @click="goToUrl('StorageDetail', accAddr)"
                          />
                        </span>
                        <span style="margin-left: 10px" v-if="isrevenue == 1">
                          <img
                            style="width: 16px; height: 16px"
                            :title="$t('accounts.profitAddress')"
                            src="@/assets/images/ico_shouyi.png"
                          />
                        </span>
                        <span style="margin-left: 10px" v-if="iscontract == 1">
                          <img
                            class="cursor"
                            style="width: 16px; height: 16px"
                            :title="$t('accounts.contractAddress')"
                            src="@/assets/images/ico_heyue.png"
                            @click="goToUrl('ContractInfo', accAddr)"
                          />
                        </span>
                      </span>
                    </template>
                  </VTable>
                </div>
              </div>
            </div>
            <div class="col-md-6" v-if="false">
              <div class="card" style="margin-top: 5px; margin-bottom: 0px">
                <div
                  class="card-body"
                  style="text-align: left; margin-bottom: 0px"
                >
                  <h4 class="mt-0 header-title">
                    {{ $t("accountdetail.MoreInfo") }}
                  </h4>
                  <VTable :table-heard="rightTbHeard" :datas="accInfo">
                  </VTable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body" style="margin: 20px 4px; padding: 0px">
          <div class="col-md-7" style="margin: 0px; padding: 0px">
            <ul
              class="nav nav-pills nav-justified"
              role="tablist"
              style="
                font-size: 11pt;
                font-weight: bold;
                margin: 0px;
                padding: 0px;
              "
            >
              <li class="nav-item waves-effect waves-light">
                <a
                  class="nav-link active"
                  data-toggle="tab"
                  href="#lock-nodeaward"
                  role="tab"
                  aria-selected="true"
                  @click="handleNavLink($event)"
                >
                  <span class="d-none d-md-block">{{ $t("home.tran") }}</span>
                  <span class="d-block d-md-none">{{ $t("home.tran") }}</span>
                </a>
              </li>
              <li class="nav-item waves-effect waves-light">
                <a
                  class="nav-link"
                  data-toggle="tab"
                  href="#lock-nodeLock"
                  role="tab"
                  @click="handleNavLink($event)"
                >
                  <span class="d-none d-md-block">
                    {{ $t("accounts.balanceHistory") }}
                  </span>
                  <span class="d-block d-md-none">
                    {{ $t("accounts.balanceHistory") }}
                  </span>
                </a>
              </li>

              <li
                class="nav-item waves-effect waves-light"
                v-show="tokens.tabShow[0]"
              >
                <a
                  class="nav-link"
                  data-toggle="tab"
                  href="#tab_urc20"
                  role="tab"
                  @click="handleNavLink($event)"
                  ref="URC20"
                >
                  <span class="d-none d-md-block">
                    {{ $t("accountdetail.toeknTransfers", ["URC20"]) }}
                  </span>
                  <span class="d-block d-md-none"
                    >{{ $t("accountdetail.toeknTransfers", ["URC20"]) }}
                  </span>
                </a>
              </li>
              <li
                class="nav-item waves-effect waves-light"
                v-show="tokens.tabShow[1]"
              >
                <a
                  class="nav-link"
                  data-toggle="tab"
                  href="#tab_urc721"
                  role="tab"
                  @click="handleNavLink($event)"
                  ref="URC721"
                >
                  <span class="d-none d-md-block"
                    >{{ $t("accountdetail.toeknTransfers", ["URC721"]) }}
                  </span>
                  <span class="d-block d-md-none">
                    {{ $t("accountdetail.toeknTransfers", ["URC721"]) }}</span
                  >
                </a>
              </li>
              <li
                class="nav-item waves-effect waves-light"
                v-show="tokens.tabShow[2]"
              >
                <a
                  class="nav-link"
                  data-toggle="tab"
                  href="#tab_urc1155"
                  role="tab"
                  @click="handleNavLink($event)"
                  ref="URC1155"
                >
                  <span class="d-none d-md-block">
                    {{ $t("accountdetail.toeknTransfers", ["URC1155"]) }}
                  </span>
                  <span class="d-block d-md-none">
                    {{ $t("accountdetail.toeknTransfers", ["URC1155"]) }}
                  </span>
                </a>
              </li>
            </ul>
          </div>
          <!-- Tab panes -->
          <div
            class="tab-content"
            style="border-top: solid 1px #f0f0f0; margin-top: 20px"
          >
            <div
              class="tab-pane active p-3"
              id="lock-nodeaward"
              role="tabpanel"
            >
              <TransactionsList :accAddr="accAddr" :tranType="tranType" />
            </div>
            <div class="tab-pane p-3" id="lock-nodeLock" role="tabpanel">
              <BalanceHistory :accAddr="accAddr" v-if="isLabelFlag" />
            </div>
            <div class="tab-pane p-3" id="tab_urc20" role="tabpanel">
              <transactions-tokens
                :accAddr="accAddr"
                :token-type="0"
                :table-id="'transferTokens20t'"
                @tabSwhitch="tabSwhitch"
              />
            </div>
            <div class="tab-pane p-3" id="tab_urc721" role="tabpanel">
              <transactions-tokens
                :accAddr="accAddr"
                :token-type="1"
                :table-id="'transferTokens721t'"
                @tabSwhitch="tabSwhitch"
              />
            </div>
            <div class="tab-pane p-3" id="tab_urc1155" role="tabpanel">
              <transactions-tokens
                :accAddr="accAddr"
                :token-type="2"
                :table-id="'transferTokens1155t'"
                @tabSwhitch="tabSwhitch"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="recodeDialogVisible"
      class="register-limit-dialog"
      width="260px"
      height="80px"
      center
    >
      <div
        slot="footer"
        class="dialog-footer"
        style="margin-top: -100px; margin-bottom: 0px"
      >
        <div class="title">{{ $t("accounts.scanReCode") }}</div>
        <div ref="qrCodeUrl" class="qrcode"></div>
        <div class="acc-addr">{{ accAddr }}</div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import * as api from "@/api/api";
import TransactionsList from "./components/TransactionsList.vue";
import BalanceHistory from "./components/BalanceHistory.vue";
import VTable from "@/components/modules/VTable.vue";
import { Message } from "element-ui";
import * as helper from "@/utils/helper";
import utils from "@/utils/utils";
import QRCode from "qrcodejs2";
import TransactionsTokens from "./components/TransactionsTokens.vue";
export default {
  name: "BlockDetail",
  components: {
    TransactionsList,
    BalanceHistory,
    VTable,
    TransactionsTokens,
  },
  props: {
    setId: {
      type: String,
      default: "",
    },
  },
  data() {
    let _this_ = this;
    return {
      isminer: 0,
      isstorage: 0,
      isrevenue: 0,
      iscontract: 0,
      leftTbHeard: [
        {
          title: "accounts.addr",
          name: "accaddr",
          popover: true,
          phoneFormat: true,
        },
        {
          title: "accounts.block",
          name: "blockNumber",
          valMap(val) {
            return `${_this_.$t("accounts.lastUpdateBlock")} ${val}`;
          },
        },
        {
          title: "accounts.tran",
          name: "transactionCount",
          valMap(val) {
            return `${_this_.$t("accounts.totalTran", [val])}`;
          },
        },
        {
          title: "accounts.balance",
          name: "balance",
          valMap(val) {
            return `${val} UTG`;
          },
        },
        {
          title: "accountdetail.tokenHoldings",
          name: "tokenHoldings",
        },
      ],
      rightTbHeard: [
        {
          title: "accounts.tran",
          name: "transactionCount",
          valMap(val) {
            return `${_this_.$t("accounts.totalTran", [val])}`;
          },
        },
        {
          title: "accounts.balance",
          name: "balance",
          valMap(val) {
            return `${val} UTG`;
          },
        },
      ],

      accAddr: "",
      recodeDialogVisible: false,
      accInfo: {
        accaddr: "",
        balance: "",
        blockNumber: 0,
        transactionCount: 0,
      },
      tranType: 0,
      isLabelFlag: false,
      showicon: window.$url.showAccountIcon,
      tokens: {
        tokensMap: {},
        list: [],
        filterInput: "",
        filter: "",
        filterTime: null,
        loading: false,
        types: {
          0: "token.title20",
          1: "token.title721",
          2: "token.title1155",
        },
        tabShow: { 0: false, 1: false, 2: false },
        tabs: {
          0: "URC20",
          1: "URC721",
          2: "URC1155",
        },
      },
    };
  },
  mounted() {
    let reId = this.setId || this.$route.params.id || "";
    let reids = reId.split("_");
    this.accAddr = reids.length > 0 ? reids[0] : "";
    this.accInfo.accaddr = reids.length > 0 ? reids[0] : "";
    if (reids.length > 1) {
      let key = reids[1];
      this.tokens.tabShow[key] = true;
      let tabStr = this.tokens.tabs[key] || "";
      if (this.$refs[tabStr]) {
        this.$refs[tabStr].click();
      }
    }

    this.getAccountsInfo();
    this.getTokensInfo();
    // alert(this.accAddr)
    sessionStorage.setItem("detail", true);

    this.creatQrCode(this.accAddr);
  },

  methods: {
    tabSwhitch(cd, status) {
      this.tokens.tabShow[cd] = status;
    },
    decimalNum(val) {
      if (!val) return 0;
      return utils.clearZero(val, 6);
    },
    colClickToken(row) {
      if (row.isTitle) return;
      this.goToUrl("token", row.contract + "_" + row.type);
    },
    clears() {
      if (this.tokens.filterTime) {
        window.clearTimeout(this.tokens.filterTime);
        this.tokens.filterTime = null;
      }
    },
    handleDialog() {
      this.recodeDialogVisible = true;
    },
    getDataFormat(data, pow = 18, decimal = 10000) {
      return helper.getDataFormat(data, pow, decimal);
    },
    formatTime(time) {
      return helper.formatTimimg(time);
    },

    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },
    getAddrFormat(data, number) {
      return helper.getAddrFormat(data, number);
    },

    handleNavLink(event) {
      $(".nav-link").removeClass("active");

      event.currentTarget.className = "nav-link active";

      if (event.currentTarget.hash == "#lock-nodeLock") {
        this.isLabelFlag = true;
      }
    },
    getTokensInfo() {
      var param = {
        address: this.accAddr,
      };
      this.tokens.loading = true;

      api
        .post("/platform/getAddressTokenList", param)
        .then((response) => {
          this.tokens.loading = false;
          let data = response.result || [];

          this.tokens.list = data;
        })
        .catch((error) => {
          this.tokens.loading = false;
          this.tokens.list = [];
          console.error(error);
        });
    },

    getAccountsInfo() {
      var param = {
        addressHash: this.accAddr,
      };
      api
        .postJson("/platform/getAddressInfoByAddressHash", param)
        .then((response) => {
          let data = response.result.records[0];
          this.accInfo.balance =
            data.balance === null
              ? 0
              : utils.weedZero(
                  helper.getDataFormat(data.balance, 18, 10000),
                  8
                );

          this.accInfo.blockNumber = data.blockNumber;
          this.accInfo.transactionCount = data.transactionCount;
          this.accInfo.accaddr = this.accAddr;
          this.isminer = data.isminer || 0;
          this.isstorage = data.isstorage || 0;
          this.isrevenue = data.isrevenue || 0;
          this.iscontract = data.iscontract || 0;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    handleCopy(data) {
      //alert(data);
      this.copy(this.accAddr);
    },
    copy(data) {
      var that = this;
      const url = data;
      const oInput = document.createElement("input");
      oInput.value = url;
      document.body.appendChild(oInput);
      oInput.select();
      document.execCommand("Copy");
      Message({
        message: that.$t("accounts.copySuccess"),
        type: "success",
      });
      oInput.remove();
    },
    creatQrCode(text) {
      new QRCode(this.$refs.qrCodeUrl, {
        text: text,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
    },
  },
  destroyed() {
    this.clears();
  },
  computed: {
    tokenOptions() {
      let reTokens = [];
      let tokensMap = {};
      let filter = (this.tokens.filter || "").toLowerCase();
      this.tokens.list.forEach((item) => {
        let name = (item.name || "").toLowerCase();
        let label = (item.label || "").toLowerCase();
        if (!filter || name.includes(filter) || label.includes(filter)) {
          if (!tokensMap[item.type]) {
            tokensMap[item.type] = [];
          }
          tokensMap[item.type].push(item);
        }
      });
      for (let key in tokensMap) {
        reTokens.push({ name: key, isTitle: true });
        reTokens.push(...tokensMap[key]);
      }
      return reTokens;
    },
    tokenNumber() {
      let num = this.tokens.list.length;
      if (num > 10) {
        return "> 10";
      } else {
        return `${num}`;
      }
    },
  },
  watch: {
    "tokens.filterInput": function (newVal) {
      this.clears();
      this.tokens.filterTime = setTimeout(() => {
        this.tokens.filter = newVal;
      }, 800);
    },
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}

.dialog-footer .title {
  margin: 16px 0px;
  text-align: center;
}

.dialog-footer .acc-addr {
  word-wrap: break-word;
  text-align: center;
  margin: 16px 0px;
  line-height: 24px;
}

.hover_ee:hover {
  background: #eee;
  cursor: pointer;
}

.tokens_title {
  --bs-bg-opacity: 1;
  background-color: #f8f9fa;
  border-radius: 5px;
  padding: 5px;
  border-bottom: solid 1px #ccc;
  font-weight: 500 !important;
  box-sizing: border-box;
}

.tokens_item {
  border-bottom: solid 1px #eee;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 10px 0px;
}
.tokens_item .van-cell {
  padding: 5px;
  line-height: 15px;
  border-radius: 5px;
  font-size: 12px;
}
.tokens_item .van-cell .van-cell__title {
  font-weight: 600;
}
.tokens_item .van-cell__label {
  margin-top: 0px;
}
</style>
<style>
.tokens_input .el-input__inner {
  --bs-bg-opacity: 1;
  background-color: rgba(248, 249, 250, 1) !important;
  display: block;
  width: 100%;
  padding: 0.3rem 0.6rem;
  font-size: 0.9062rem;
  font-weight: 400;
  line-height: 1.5;
  background-clip: padding-box;
  appearance: none;
  border-radius: 0.5rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
</style>
