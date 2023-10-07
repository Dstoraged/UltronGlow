<template>
    <div>
        <h-tbale ref="gasDestroyhtable" :table-heard="tableHeardGas" :table-data="gastableData" :show-right-tools="false"
            :showSubtitle="true" :up-load-time="30000" table-id="gasDestroyTableid" @inint-ok="gasDestroytableInit"
            @load="loadgasDestroyTable" @colClick="colClick">
            <span slot="top_subtitle" class="phone_font_12">
                {{ $t("Transactions.currentTranNumber", [total]) }}
            </span>           
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
    name: "TranDestroy",
    components: { HTbale },
    props: {
    },
    data() {
        let _this_ = this;
        return {
            tableHeardGas: [
                {
                    title: "block.block",
                    name: "blockNumber",
                    isClick: true,
                },
                {
                    title: "block.Age",
                    name: "timeStamp",
                    valMap(val) {
                        return `${helper.formatTimimg(val)}${_this_.$t("comm.before")}`;
                    },
                },
                {
                    title: "block.Txn",
                    name: "blockTransactionCount",
                },
                {
                    title: "block.Miner",
                    name: "minerAddress",
                    format: true,
                    popover: true,
                    isClick: true,
                },
                {
                    title: "block.GasUsed",
                    name: "gasUsed",
                    valMap(val, item) {
                        let gasUsedRate =
                            Math.floor((item.gasUsed / item.gasLimit) * 10000) / 100;
                        return `${val}(${gasUsedRate})%`;
                    },
                    more: true,
                },
                {
                    title: "block.GasLimit",
                    name: "gasLimit",
                    more: true,
                },
                {
                    title: "block.GasPrice",
                    name: "avgGasPrice",
                    valMap(val) {
                        return `${helper.getDataFormat(val, 9)} Gwei`;
                    },
                    more: true,
                },
                {
                    title: "block.reward",
                    name: "reward",
                    valMap(val, item) {
                        if (item.blockNumber >= window.$url.burntFeesNumber)
                            return helper.getDataFormat((val - item.gasUsed * item.avgGasPrice * 0.5), 18, 10000).toFixed(4) + " UTG";
                        else
                            return helper.getDataFormat(val, 18, 10000).toFixed(4) + " UTG";
                    },
                    more: true,
                },
                {
                    title: "block.BurntFees",
                    name: "gasBurnt",
                    valMap(val, item) {
                        if (item.blockNumber >= window.$url.burntFeesNumber)
                            return `${helper.getDataFormat(item.gasUsed * item.avgGasPrice * 0.5, 18, 10000)} UTG`;
                        else
                            return `0 UTG`;
                    },
                    more: true,
                },
            ],
            gastableData: [],
            total: 0,
        };
    },

    methods: {
        gasDestroytableInit(query, pageNum) {
            this.loadgasDestroyTable(query, false, pageNum);
        },
        loadgasDestroyTable(query, toTop = true, pageNum) {
            if (!query && this.$refs.gasDestroyhtable) {
                query = this.$refs.gasDestroyhtable.tableQuery;
            }
            if (!query) return;
            query.pageNum = pageNum || query.pageNum;

            //query.loadingShow();
            if (query.pageSize == 0) query.pageSize = 10;
            var param = {
                current: query.pageNum,
                size: query.pageSize,
                burned: true,
                blockNumber: window.$url.burntFeesNumber
            };

            query.loadingShow(param, pageNum);

            api
                .postJson("/platform/getBlockList", param)
                .then((response) => {
                    query.table_loading = false;

                    if (response.statusCode !== 0) {
                        Message.error(response.message);
                    }
                    let re = response.result || {};
                    this.gastableData = re.records || [];
                    if (response.result != null) this.total = response.result.total;

                    setPageQuery(query, re);
                    if (toTop && this.gastableData.length > 0) {
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
    },
};
</script>
<style lang="scss" scoped>
.cursor {
    cursor: pointer;
}
</style>
