<template>
    <div>
        <h-tbale ref="pledgeDestroyhtable" :table-heard="tableHeardPledge" :table-data="pledgetableData"
            :show-right-tools="false" :showSubtitle="true" :up-load-time="30000" table-id="pledgeDestroyTableid"
            @inint-ok="pledgeDestroytableInit" @load="loadpledgeDestroyTable" @colClick="colClick">
            <span slot="top_subtitle" class="phone_font_12">
                {{ $t("lock.currentPledgeNumber", [total]) }}
            </span>
        </h-tbale>
    </div>
</template>
<script>
import { Message } from "element-ui";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";

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
            tableHeardPledge: [              
                {
                    title: "node.manageaddress",
                    name: "manage_address",
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
                    title: "node.pledgeNumber",
                    name: "pledge_number",
                    more: true,
                },                             
                {
                    title: "lockdestroy.burningamount",
                    name: "pledge_amount",
                    valMap(val) {
                        return helper.getDataFormat(val, 18, 10000).toFixed(4) + " UTG";
                    },
                },              
            ],
            pledgetableData: [],
            total: 0,
        };
    },

    methods: {
        pledgeDestroytableInit(query, pageNum) {
            this.loadpledgeDestroyTable(query, false, pageNum);
        },
        loadpledgeDestroyTable(query, toTop = true, pageNum) {
            if (!query && this.$refs.pledgeDestroyhtable) {
                query = this.$refs.pledgeDestroyhtable.tableQuery;
            }
            if (!query) return;
            query.pageNum = pageNum || query.pageNum;

            //query.loadingShow();
            if (query.pageSize == 0) query.pageSize = 10;
            var param = {
                current: query.pageNum,
                size: query.pageSize,
                unpledge_type:1
            };

            query.loadingShow(param, pageNum);

            api
                .postJson("/platform/getNodePledgeList", param)
                .then((response) => {
                    query.table_loading = false;

                    if (response.statusCode !== 0) {
                        Message.error(response.message);
                    }
                    let re = response.result || {};
                    this.pledgetableData = re.records || [];
                    if (response.result != null) this.total = response.result.total;

                    setPageQuery(query, re);
                    if (toTop && this.pledgetableData.length > 0) {
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
