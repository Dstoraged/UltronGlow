<template>
    <div>
        <h-tbale ref="htablePoTS" :table-id="'PoTSRewards' + revenueAddr" :show-subtitle="true"
            :table-heard="tableHeardPoTS" :table-data="tableDataPoTS" @inint-ok="PoTStableInit" @load="loadPoTSTable">
            <span slot="top_subtitle" class="phone_font_12">
                {{
        $t("storagereward.currentTotal", [
            totals,
            statsTotals.totalAmounts,
            statsTotals.releaseamounts,
        ])
                }}</span>
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
    name: "PoTSRewards",
    components: { HTbale },
    props: {
        revenueAddr: {
            type: [String],
            default: "",
        },
        type: {
            type: Number,
            default: 0,
        },
        devflag: {
            type: Number,
            default: 0,
        },
        tableId: {
            type: String,
            default: "PoTSRewards",
        },
    },
    data() {
        let _this_ = this;
        return {
            tableHeardPoTS: [
                {
                    title:
                    _this_.devflag === 0
                            ? "storagereward.deviceaddress"
                            : "storagereward.revenuesaddress",
                    name: "address",
                    format: true,
                    popover: true,
                    minWidth: "120px",
                    valMap(val, data) {
                        //console.log(_this_.devflag,val)
                        if (_this_.devflag === 0)
                            return val
                        else
                            return data.revenue_address;
                    },                    
                },
                {
                    title: "storagereward.blockNumber",
                    name: "blockNumber",
                    minWidth: "82px",
                    more: true,
                },
                {
                    title: "storagereward.reward",
                    name: "totalAmount",
                    minWidth: "90px",

                    valMap(val) {
                        return `${utils.clearZero(val)} UTG`;
                    },
                },

                {
                    title: "storagereward.totalAmount",
                    name: "LockAmount",
                    valMap(val, item) {
                        return `${utils.clearZero(
                            (item.totalAmount || 0) - (item.releaseamount || 0)
                        )} UTG`;
                    },
                    minWidth: "110px",
                },
                {
                    title: "storagereward.leftAmount",
                    name: "releaseamount",
                    more: true,
                    valMap(val) {
                        return `${utils.clearZero(val)} UTG`;
                    },
                    minWidth: "130px",
                },
                /*
                 {
                   title: "lock.burningamount",
                   name: "burntamount",
                   valMap(val, item) {
                     if(item.totalAmount>0)
                       return `${utils.clearZero(val,5)} UTG (${utils.weedZero(((val ||0)/item.totalAmount) * 100,2)}%)`;
                     else
                       return `${utils.clearZero(val)} UTG (0%)`;
                   },
                   more: true,
                 },
         */
                {
                    title: "lock.burningamount",
                    name: "burntamount",
                    minWidth: "120px",
                    valMap(val) {
                        return `${utils.clearZero(val)} UTG`;
                    },
                    more: true,
                },

                {
                    title: "storagereward.unlocktime",
                    name: "lockingTime",
                    minWidth: "160px",
                    valMap(val, item) {
                        return `${utils.lockingTime(
                            item.startTime,
                            item.avgBlockTime,
                            item.unLockNumber,
                            item.releaseHeigth
                        )}${_this_.$t("lock.day")}`;
                    },
                },
            ],
            tableDataPoTS: [],

            pageSizes: 10,
            pages: 1,
            totals: 0,
            totalPages: 0,
            StoragespacerewardsList: [],
            loadText: this.$t("comm.clickLoad"),
            searchInput: null,
            statsTotals: {
                totalAmounts: "--",
                releaseamounts: "--",
            },
        };
    },
    watch: {
        revenueAddr: {
            immediate: true,
            handler(id) {
                console.log(id);
                this.loadPoTSTable(null, 1);
            },
        },
    },
    methods: {
        PoTStableInit(query, pageNum) {
            this.loadPoTSTable(query, false, pageNum);
        },
        async loadPoTSTable(query, toTop = true, pageNum) {
            if (!query && this.$refs.htablePoTS) {
                query = this.$refs.htablePoTS.tableQuery;
            }
            if (!query) return;
            this.getStorageRewardStat();
            query.pageNum = pageNum || query.pageNum;

            var params = {
                current: query.pageNum,
                size: query.pageSize,
                revenueAddress: null,
                address: null,
                type: this.type,
            };
            if (this.devflag === 0) {
                params.revenueAddress = this.revenueAddr;
            } else {
                params.address = this.revenueAddr;
            }

            //query.loadingShow();
            query.loadingShow(params, pageNum);

            await utils.getNowHeight();
            api
                .postJson("/platform/lockUtgMinerInfo", params)
                .then((response) => {
                    query.loadingHide();

                    if (response.statusCode !== 0) {
                        Message.error(response.message);
                    }
                    let re = response.result || {};
                    this.tableDataPoTS = re.records || [];

                    setPageQuery(query, re);
                    this.totals = re.total || 0;
                    if (toTop && this.tableDataPoTS.length > 0) {
                        query.toTop();
                    }
                })
                .catch((error) => {
                    query.loadingHide(JSON.stringify(error).includes("timeout") ? 1 : 2);
                });
        },

        formatTime(time) {
            return helper.formatTimimg(time);
        },
        getAddrFormat(data, number) {
            return helper.getAddrFormat(data, number);
        },
        goToUrl(name, params) {
            helper.goPathUrl(this, name, params);
        },

        toMinerView(data) {
            if (data.address) {
                helper.goPathUrl(this, "MinerView", `${data.address}`);
            }
        },

        seachData() {
            this.PoTStableInit(null, 1);
        },

        getStorageRewardStat() {
            var params = {
                revenueAddress: null,
                address: null,
                type: this.type, //5,
            };
            if (this.devflag === 0) {
                params.revenueAddress = this.revenueAddr;
            } else {
                params.address = this.revenueAddr;
            }
            api
                .postJson("/platform/getStorageRewardStat", params)
                .then((response) => {
                    let result = response.result || {};
                    this.statsTotals.totalAmounts = `${utils.clearZero(
                        result.totalAmount
                    )} UTG`;
                    this.statsTotals.releaseamounts = `${utils.clearZero(
                        result.releaseamount
                    )} UTG`;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
    },
};
</script>
<style lang="scss" scoped>
@media (max-width: 700px) {
    .phone_font_12 {
        font-size: 12px;
        font-weight: 400;
    }
}
</style>
  