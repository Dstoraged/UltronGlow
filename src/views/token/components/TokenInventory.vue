<template>
    <div class="container-fluid">
        <p class="sub-title" style="width: 100%; text-align: left;margin-top: 10px;margin-bottom: 15px;"> {{
                $t("tokenInventory.currentNumber", [total])
        }} </p>
        <div class="row" style="margin: 0px; padding: 0px;">
            <div class="col col-md-2 col-sm-1" v-for="(item, index) in tableData" :key="index"
                style="margin: 0px; padding: 8px; ">
                <div class="nft-block-wrapper"
                    style="border: #F0F0F0 solid 1px; border-radius: 6px; margin: 0px; padding: 10px; ">
                    <a href="" target="_parent">
                        <span class="db-text">
                            <img class="db-img" src="@/assets/images/nft-placeholder.svg"></span>
                    </a>
                    <div class="font-size-1 text-secondary text-truncate mb-1">Token ID: <a href="javascript:void(0);"
                            @click="goToTokenIdUrl('tokenid', item.tokenid)" target="_parent" data-toggle="tooltip"
                            :data-original-title="item.tokenid" :title="item.tokenid">{{ beautySub(item.tokenid + '', 10)
                            }}</a></div>
                    <div class="font-size-1 text-secondary text-truncate" data-toggle="tooltip" v-if="type == 1" :title="item.owner"
                        :data-original-title="item.owner">Owner: {{ beautySub(item.owner ||'', 10) }}
                        <!--
                        <a href="javascript:void(0);"
                            @click="goToTokenUrl('token', item.owner)" target="_parent">{{ beautySub(item.owner ||'', 10)
                            }}</a>
                        -->
                    </div>

                </div>
            </div>
        </div>

        <div class="row" style="margin-top: 20px">
            <div class="col-md-5 col-sm-12" style="font-size: 9pt; margin: 0px; padding-left: 10px">
                <ul class="pagination" style="justify-content: left; font-size: 9pt">
                    <li class="page-item">
                        <a style="
                    padding: 10px;
                    border: none;
                    border-radius: 6px;
                    display: block;
                  ">{{ $t("pagination.show") }}</a>
                    </li>
                    <li class="page-item">
                        <div class="col-sm-12" style="margin: 0px; padding: 0px">
                            <select class="custom-select" v-model="pageSize" style="font-size: 12px"
                                @change="handleSizeChange()" id="selectPage">
                                <option selected="selected" value="18">18</option>
                                <option value="24">24</option>
                                <option value="30">30</option>
                                <option value="36">36</option>
                                <option value="48">48</option>
                                <option value="54">54</option>
                                <option value="60">60</option>
                            </select>
                        </div>
                    </li>
                    <li class="page-item">
                        <a style="
                    padding: 10px;
                    border: none;
                    border-radius: 6px;
                    display: block;
                  ">{{ $t("pagination.redord") }}</a>
                    </li>
                </ul>
            </div>
            <div class="col-md-7 col-sm-12 justify-content-end" style="font-size: 9pt; margin: 0px; padding-left: 10px">
                <ul class="pagination fyright">
                    <li class="page-item">
                        <a class="page-link" href="javascript:;" style="
                    padding: 10px;
                    margin: 4px;
                    border: none;
                    background-color: #eaf8f9;
                    border-radius: 6px;
                    color: #41c0cb;
                    font-size: 9pt;
                  " @click="getTokenInventoryList(1)">{{ $t("pagination.first") }}</a>
                    </li>
                    <li class="page-item">
                        <a class="page-link" href="javascript:;" style="
                    padding: 10px;
                    margin: 4px;
                    border: none;
                    background-color: #eaf8f9;
                    border-radius: 6px;
                    color: #41c0cb;
                  " @click="getTokenInventoryList(page - 1)"><i class="mdi mdi-chevron-left"></i></a>
                    </li>
                    <li class="page-item">
                        <a class="page-link" href="javascript:;" style="
                    padding: 10px;
                    margin: 4px;
                    border: none;
                    background-color: #eaf8f9;
                    border-radius: 6px;
                    color: #757575;
                  ">
                            <span>
                                {{
                                        $t("pagination.pages", {
                                            curPage: page,
                                            totalPage: totalPages,
                                        })
                                }}
                            </span>
                        </a>
                    </li>
                    <li class="page-item">
                        <a class="page-link" href="javascript:;" style="
                    padding: 10px;
                    margin: 4px;
                    border: none;
                    background-color: #eaf8f9;
                    border-radius: 6px;
                    color: #41c0cb;
                  " @click="getTokenInventoryList(page + 1)"><i class="mdi mdi-chevron-right"></i></a>
                    </li>
                    <li class="page-item">
                        <a class="page-link" href="javascript:;" style="
                    padding: 10px;
                    margin: 4px;
                    border: none;
                    background-color: #eaf8f9;
                    border-radius: 6px;
                    color: #41c0cb;
                  " @click="getTokenInventoryList(totalPages)">{{ $t("pagination.last") }}</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import * as api from '@/api/api'
import * as helper from '@/utils/helper'
import utils from "@/utils/utils";
import { showLoading, hideLoading } from '@/utils/loading';
export default {
    name: "TokenInventory",
    components: {},
    props: {
        contract: {
            type: String,
            default: "",
        },
        type: {
            type: Number,
            default: 0,
        },
        tokenid: {
            type: Number,
            default: null,
        },
    },
    data() {
        return {
            currentDate: new Date(),
            pageSize: 18,
            page: 1,
            total: 0,
            totalPages: 0,
            tableData: [],
        };
    },
    mounted() {
        this.getTokenInventoryList(this.page);
    },
    methods: {
        goToTokenIdUrl(name, val) {
            let params = this.contract + "_" + this.type + "_" + val
            helper.goPathUrl(this, name, params);
        },

        goToTokenUrl(name, val) {
            let params = this.contract + "_" + this.type+ "_" +val
            helper.goPathUrl(this, name, params);
        },

        handleSizeChange() {
            var val = $("#selectPage").val();
            this.pageSize = val;
            this.getTokenInventoryList(1);
        },

        handleCurrentChange(val) {
            this.page = val;
            this.getTokenInventoryList(this.page);
        },


        getTokenInventoryList(page) {
            if (page < 1 || (this.totalPages > 0 && page > this.totalPages)) {
                return;
            }
            showLoading();
            this.total = 0;
            this.page = page;

            var param = {
                current: this.page,
                size: this.pageSize,
                address: this.contract,
            };
            if (this.tokenid) param.tokenid = this.tokenid;
            api
                .postJson("/platform/getTokenInventoryList", param)
                .then((response) => {
                    if (response.statusCode !== 0) {
                        Message.error(response.message);
                        hideLoading();
                    } else {
                        if (response.result === null || response.result.total === 0) {
                            this.loadText = "";
                            hideLoading();
                            return;
                        }
                        var data = response.result.records;
                        if (data.length < this.total) {
                            this.loadText = this.$t("comm.bottomLine");
                        }
                        this.total = response.result.total;
                        this.totalPages = response.result.pages;
                        const rand = (this.page - 1) * this.pageSize;
                        const newData = [];
                        let temp = {};
                        data.forEach((item, index) => {
                            temp = {
                                ranking: index + 1 + rand,
                                tokenid: item.tokenid,
                                owner: item.owner,
                            };
                            newData.push(temp);
                        });
                        this.tableData = newData;
                        hideLoading();
                    }
                })
                .catch((error) => {
                    console.error(error);
                    Message.error(error.ErrMsg);
                    hideLoading();
                });
        },

        beautySub(str, len) {
            if(str=='') return str;
            var reg = /[\u4e00-\u9fa5]/g, slice = str.substring(0, len),
                cCharNum = (~~(slice.match(reg) && slice.match(reg).length)),
                realen = slice.length * 2 - cCharNum - 1;
            return str.substr(0, realen) + (realen < str.length ? "..." : "");
        },

    }
}
</script>
<style lang="scss" scoped>
.cursor {
    pointer-events: auto;
    cursor: pointer;
}

.db-text {
    position: relative;
    height: 180px;
    max-width: 180px;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    text-align: center;
    transition: all .2s;
    border-radius: .35rem;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: .75rem;
    background-color: rgba(119, 131, 143, .1) !important;
}

.db-img {
    width: 64px;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    margin-left: auto;
    margin-right: auto;
    border-radius: .35rem;
    vertical-align: middle;
}

a {
    color: #007bff;
}

/*
.nft-block {
    position: relative;
    height: 180px;
    max-width: 180px;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    text-align: center;
    transition: all .2s;
    border-radius: .35rem;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: .75rem;
}

.bg-soft-secondary {
    background-color: rgba(119, 131, 143, .1) !important;
}

.nft-block-wrapper {
    display: block;
    border: 1px solid #e7eaf3;
    border-radius: .5rem;
    padding: .55rem;
    width: 200px;
    margin-bottom: 0px;
    height: 260px;
}

.time {
    font-size: 13px;
    color: #999;
}

.bottom {
    margin-top: 13px;
    line-height: 12px;
}

.button {
    padding: 0;
    float: right;
}

.nft-block-img {
    width: 100%;
    display: block;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}
*/
</style>
