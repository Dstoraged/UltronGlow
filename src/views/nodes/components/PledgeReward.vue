<template>
    <div>
        <div class="row" style="padding: 6px; text-align: left;margin-top: 10px;">
            <div class="col-md-4">
                <p class="mt-0 header-title" style="width: 100%; text-align: left">
                    {{ $t("lock.currentNumber", [totalpr]) }}
                </p>
            </div>
            <div class="col-md-4">
                <div class="input-group" style="margin: 0 auto">
                    <input type="text" class="form-control" :placeholder="$t('node.pledgeAddressSearch')" id="demo"
                        v-model="searchInput" @keyup.enter="tableInitPledgeReward(null, 1)"
                        style="border-right: 0px; width: 60%" />
                    <div class="input-group-append">
                        <button class="btn btn-block waves-effect waves-light" type="button"
                            @click="tableInitPledgeReward(null, 1)" style="background-color: #d4d4d4">
                            {{ $t("comm.search") }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <h-tbale ref="htablePledgeRewardList" :table-heard="nodePledgeRewardTableHeard"
            :table-data="nodePledgeRewardtableData" :show-right-tools="false" :tableId="'PledgeRewardtableId' + node_addr"
            :showSubtitle="false" @inint-ok="tableInitPledgeReward" @load="loadTablePledgeReward">            
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
    name: "PledgeReward",
    components: { HTbale },
    props: {
        node_addr: {
            type: String,
            default: "",
        },
    },

    data() {
        let _this_ = this;       
        return {
            nodePledgeRewardTableHeard: [
                {
                    title: "node.nodeAddress",
                    name: "node_address",
                    format: true,
                    popover: true,
                    fnum: 10,
                },
                {
                    title: "node.pledgeaddress",
                    name: "pledge_address",
                    format: true,
                    popover: true,
                    fnum: 15,
                },
                {
                    title: "node.pledgeamounte",
                    name: "pledge_amount",
                    valMap(val) {
                        return helper.getDataFormat(val, 18, 10000).toFixed(4) + " UTG";
                    },
                },
                {
                    title: "ultronnodereward.reward",
                    name: "totalamount",
                    valMap(val) {
                        return `${utils.clearZero(val || 0)} UTG`;
                    },
                },
                {
                    title: "lock.freed",
                    name: "releaseamount",
                    valMap(val) {
                        return `${utils.clearZero(val)} UTG`;
                    },
                    more: true,
                },
            ],
            nodePledgeRewardtableData: [],
            totalpr: 0,           
            searchInput: "",           
        };
    },
    watch: {
        node_addr: {
            immediate: true,
            handler(id) {
                console.log(id);
                // this.tableInitnodePledgeList(null, 1);
            },
        },
    },

    methods: {
        tableInitPledgeReward(query, pageNum) {
            this.loadTablePledgeReward(query, false, pageNum);
        },
        loadTablePledgeReward(query, toTop = true, pageNum) {
           // await utils.getNowHeight();

            if (!query && this.$refs.htablePledgeRewardList) {
                query = this.$refs.htablePledgeRewardList.tableQuery;
            }
            if (!query) return;
            query.pageNum = pageNum || query.pageNum;

            if (query.pageSize == 0) query.pageSize = 10;
            
            var params = {
                current: query.pageNum,
                size: query.pageSize,
                node_address: this.node_addr
                //pledge_address:this.node_addr
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

            api
                .postJson("/platform/getPledgeRewardList", params)
                .then((response) => {
                    query.table_loading = false;

                    if (response.statusCode !== 0) {
                        Message.error(response.message);
                    }
                    let re = response.result || {};
                    this.nodePledgeRewardtableData = re.records || [];
                    if (response.result != null) this.totalpr = response.result.total;

                    setPageQuery(query, re);
                    if (toTop && this.nodePledgeRewardtableData.length > 0) {
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
       
    },
};
</script>
<style lang="scss" scoped>

</style>
  