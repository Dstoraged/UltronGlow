<template>
  <div>
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body">
          <h4 class="mt-0 header-title" style="text-align: left">
            {{ $t("token.tokens") }} {{accInfo.name}}
          </h4>
          <div class="row">
            <div class="col-md-7">
              <div class="card" style="margin-top: 5px">
                <div class="card-body" style="text-align: left">
                  <h4 class="mt-0 header-title" style="text-align: left">
                    {{ $t("token.overview") }} 
                  </h4>
                  <VTable :table-heard="tableLeftHeard" :datas="accInfo" title-width="110px" id="tableLeftHeardid">
                  </VTable>
                </div>
              </div>
            </div>
            <div class="col-md-5">
              <div class="card" style="margin-top: 5px">
                <div class="card-body" style="text-align: left">
                  <h4 class="mt-0 header-title" style="text-align: left">
                    {{ $t("token.profilesummary") }}
                  </h4>
                  <VTable :table-heard="tableRightHeard" :datas="accInfo" title-width="110px" id="tableRightHeardid">
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
            <ul class="nav nav-pills nav-justified phone_nav_overflow-x" role="tablist" style="
                font-size: 11pt;
                font-weight: bold;
                margin: 0px;
                padding: 0px;
              ">
              <li class="nav-item waves-effect waves-light">
                <a class="nav-link active" data-toggle="tab" href="#lock-transfers" role="tab" aria-selected="true"
                  @click="handleNavLink($event)">
                  <span class="d-none d-md-block">{{
                      $t("token.transfers")
                  }}</span>
                  <span class="d-block d-md-none">{{
                      $t("token.transfers")
                  }}</span>
                </a>
              </li>             

              <li class="nav-item waves-effect waves-light" v-if="false">
                <a class="nav-link" data-toggle="tab" href="#token-inventory" role="tab" aria-selected="true"
                  @click="handleNavLink($event)">
                  <span class="d-none d-md-block">{{ $t("tokenInventory.inventory") }}</span>
                  <span class="d-block d-md-none">{{ $t("tokenInventory.inventory") }}</span>
                </a>
              </li>

              <li class="nav-item waves-effect waves-light">
                <a class="nav-link" data-toggle="tab" href="#lock-contract" role="tab" @click="handleNavLink($event)">
                  <span class="d-none d-md-block" style="margin-right:10px;">{{
                      $t("contracts.contract")
                  }}
                    <i class="fa fa-check-circle check-text-success"
                      style=" position:relative; top:-6px;   font-size: 8pt;" v-if="contracttotal > 0"></i>
                  </span>
                  <span class="d-block d-md-none">{{
                      $t("contracts.contract")
                  }}
                    <i class="fa fa-check-circle check-text-success"
                      style=" position:relative; top:-6px;   font-size: 8pt;" v-if="contracttotal > 0"></i>
                  </span>
                </a>
              </li>
            </ul>
          </div>
          <!-- Tab panes -->
          <div class="tab-content" style="border-top: solid 1px #f0f0f0; margin-top: 20px">
            <div class="tab-pane active" id="lock-transfers" role="tabpanel">
            ------------
              <TokenTran :contract="accAddr" :type="type" :tokenid="tokenId"/>
            </div> 

            <div class="tab-pane" id="token-inventory" role="tabpanel" style="margin: 0px; padding: 0px" v-if="false">
              <TokenInventory :contract="accAddr" :type="type" :tokenid="tokenId"/>
            </div>

            <div class="tab-pane" id="lock-contract" role="tabpanel">
              <ContractCode :contract="accAddr" :contractname="contractname" :accInfo="contractInfo"
                :contractcode="contractcode" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TokenTran from "./components/TokenTran.vue";
import TokenHolder from "./components/TokenHolder.vue";
import ContractTran from "@/views/contract/components/ContractTran.vue";
import ContractCode from "@/views/contract/components/ContractCode.vue";
import TokenInventory from "./components/TokenInventory.vue";
import { Message } from "element-ui";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import { setValue, getValue } from "@/utils/auth";
import VTable from "@/components/modules/VTable.vue";
export default {
  name: "NodeDetail",
  components: {
    TokenTran,
    TokenHolder,
    VTable,
    ContractTran,
    ContractCode,
    TokenInventory
  },
  data() {
    let _this_ = this;
    return {
      accAddr: null,
      typetitle: "URC20",
      type: 0,
      accInfo: {},
      totalsupply: 0,
      contracttotal: 0,
      tableLeftHeard: [       
        { title: "tokentransfers.tokenid", name: "tokenId" ,
         valMap(val) {
            return `${_this_.tokenId}`;           
          }, 
        },
       
         { title: "token.transfers", name: "trancount",
          valMap(val) {
            return `${_this_.trancount}`;           
          }, 
        },         
             
      ],

      tableRightHeard: [
        { title: "token.tokens", name: "name" },
        {
          title: "token.contract",
          name: "contract",
          popover: true,
          format: true,
          phoneFormat: true,
        },       
      ],
      contractname: "",
      contractcode: "",
      contractInfo: {},
      trancount:0,
      tokenId:null,
    };
  },
  created() {
    //this.accAddr = this.$route.params.id; 
    this.tokenId=-1; 
    let idL = this.$route.params.id;
    let ids = idL.split("_");
    this.accAddr = ids[0];   
    this.type = Number(ids[1]);
    this.tokenId =Number(ids[2]);
    this.getTokensInfo();
    localStorage.setItem("detail", true);
  },

 
    methods: {
      getAddrFormat(data, number = 15) {
        return helper.getAddrFormat(data, number);
      },
      handleNavLink(event) {
        $(".nav-link").removeClass("active");
        console.log(event.target.tagName);
        event.currentTarget.className = "nav-link active";
      },

      setTransfers(val) {        
        this.trancount = val;
      },

      getTokensInfo() {
        const param = {
          address: this.accAddr,
        };
        api
          .postJson("/platform/getTokensDescription", param)
          .then((response) => {
            if (response.result == null) {
              Message.error(response.message);
            } else {
              this.accInfo = response.result;
              this.totalsupply = this.accInfo.totalSupply;
              this.contractname = this.accInfo.name
              this.accInfo.totalSupply = helper
                .getDataFormat(
                  this.accInfo.totalSupply,
                  this.accInfo.decimals,
                  10000
                )
                .toFixed(0);

              this.accInfo.balance =
                helper.getDataFormat(this.accInfo.balance, 18, 10000).toFixed(4) +
                " UTG";

              this.accInfo.trancount = 0;
            }
          })
          .catch((error) => {
            Message.error(error.message);
          });
      },
    },
  };
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}

.phone_nav_overflow-x {
  width: 100%;
  overflow-x: auto;
  display: grid;
  grid-template-columns: repeat(5, minmax(150px, auto));
  text-align: center;
}
</style>
