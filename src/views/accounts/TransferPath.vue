<template>
    <div>
        <div class="container-fluid">
            <div class="card" style="margin-top: 40px">
                <div class="card-body">
                    <div class="row" style="text-align: left; margin: 0px; padding: 0px">
                        <div class="col-md-2" style="padding: 0px; margin: 0px">
                            <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
                                {{ $t("transferpath.title") }}
                            </h4>
                        </div>
                    </div>

                    <div class="row" style="padding: 6px; text-align: left">
                        <div class="col-md-6">
                            <div class="input-group mb-3">
                                <input type="text" class="form-control" v-model="saddress" @keyup.enter="searchPath"
                                    :placeholder="$t('transferpath.sourceaddress')">
                                <span style="margin-left:5px;margin-right:5px; margin-top:5px;"><img
                                        src="@/assets/images/icon_to.png" height="21" width="21" /></span>
                                <input type="text" class="form-control" v-model="daddress" @keyup.enter="searchPath"
                                    :placeholder="$t('transferpath.destinationaddress')">
                            </div>
                        </div>

                        <div class="col-md-6" v-if="false">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">{{ $t("transferpath.sourceaddress") }}</span>
                                </div>
                                <input type="text" class="form-control" v-model="saddress" @keyup.enter="searchPath">
                            </div>
                        </div>

                        <div class="col-md-6" v-if="false">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">{{ $t("transferpath.destinationaddress") }}</span>
                                </div>
                                <input type="text" class="form-control" v-model="daddress" @keyup.enter="searchPath">
                            </div>
                        </div>

                        <div class="col-md-3">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend" v-if="false">
                                    <span class="input-group-text">{{ $t("transferpath.blocknumber") }}</span>
                                </div>

                                <select class="form-control" name="selectday" v-model="selectday" id="selectday"
                                    @change="handleDayChange()">
                                    <option value="1">{{ $t("transferpath.selday1") }}</option>
                                    <option value="7" selected> {{ $t("transferpath.selday2") }}</option>
                                    <option value="15">{{ $t("transferpath.selday3") }}</option>
                                    <option value="30">{{ $t("transferpath.selday4") }}</option>
                                    <option value="90">{{ $t("transferpath.selday5") }}</option>
                                    <option value="180">{{ $t("transferpath.selday6") }}</option>
                                    <option value="365">{{ $t("transferpath.selday7") }}</option>
                                    <option value="-1">{{ $t("transferpath.selday8") }}</option>
                                </select>

                                <input type="text" class="form-control" v-model="blockday" @keyup.enter="searchPath"
                                    v-if="bkday" :placeholder="$t('transferpath.days')">
                            </div>
                        </div>
                        <div class="col-md-1">
                            <button class="btn btn-block waves-effect waves-light" type="button" @click="searchPath"
                                style="background-color: #d4d4d4">
                                {{ $t("comm.search") }}
                            </button>
                        </div>
                    </div>

                    <div class="row" style="padding: 6px; text-align: left">
                        <div id="atlasChart"></div>
                    </div>
                </div>
            </div>
        </div>
        <TransferRecord ref="traRecord" />
    </div>
</template>
<script>
import { Message } from "element-ui";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import * as echarts from "echarts"
import utils from "@/utils/utils";
import TransferRecord from "./components/TransferRecord.vue"

export default {
    name: "TransferPath",
    components: { TransferRecord },
    props: {},
    data() {
        let _this_ = this;
        return {
            saddress: "",
            daddress: "",
            blocknumber: "",
            option: {},
            nodes: [],
            links: [],
            selectday: 1,
            //startblock: window.$url.dayOneNumber || 8640,
            blockday: 1,
            bkday: false,
        };
    },

    methods: {
        handleDayChange() {
            var val = $("#selectday").val();
            if (val == "-1") {
                this.bkday = true;
                this.blockday = 0;
            } else {
                this.blockday = val;
                this.bkday = false;
            }
            this.selectday = val;
            //sessionStorage.setItem("selectDay", val);
        },

        async searchPath() {
            this.nodes = [];
            this.links = [];
            this.$refs.traRecord.loadData("-1", "-1");
            //sessionStorage.setItem("saddress", this.saddress);
            //sessionStorage.setItem("daddress", this.daddress);
            await utils.getNowHeight();
            var _saddress = this.saddress.toLowerCase();
            var _daddress = this.daddress.toLowerCase()
            var param = {
                from: _saddress,
                to: _daddress,
            };

            if (this.blockday != 0) {
                param.startblock = utils.curBlockNumber() - ((window.$url.dayOneNumber || 8640) * this.blockday);
            }

            api
                .postJson("/platform/getTransferPath", param)
                .then((response) => {
                    if (response.statusCode !== 0) {
                        Message.error(response.message);
                    }
                    let data = response.result || [];
                    if (data.length > 0) {
                        let fnode = {
                            name: _saddress,
                            des: _saddress,
                            symbolSize: 30,
                            itemStyle: {
                                normal: {
                                    color: 'blue'
                                }
                            },
                            category: 0,
                        };
                        this.nodes.push(fnode);

                        let tnode = {
                            name: _daddress,
                            des: _daddress,
                            symbolSize: 30,
                            itemStyle: {
                                normal: {
                                    color: 'purple'
                                }
                            },
                            category: 2,
                        };
                        this.nodes.push(tnode);
                    }


                    for (var i = 0; i < data.length; i++) {
                        let jsons = data[i];
                        let address = jsons.address;
                        let paths = jsons.paths;
                        let txcount = jsons.txcount;
                        if (!this.uniqueNodes(address)) {
                            let cnode = {
                                name: address,
                                des: address,
                                symbolSize: 30,
                                itemStyle: {
                                    normal: {
                                        color: 'green'
                                    }
                                },
                                category: 1,
                            };
                            this.nodes.push(cnode);
                        }

                        if (_saddress !== address) {
                            let link = {
                                source: _saddress,
                                target: address,
                                name: txcount,// `${this.$t("transferpath.tranTotal", [txcount])}`,
                                lineStyle: {
                                    width: 2,
                                    curveness: 0.2
                                }
                            }
                            if (i == 0) link.lineStyle.curveness = 0;
                            /*
                            if (this.uniqueLinks(_saddress, address))
                                link.lineStyle.curveness = 0.2;
                            else
                                link.lineStyle.curveness = 0;
                                */

                            this.links.push(link);
                        }
                        if (paths && paths.length > 0) {
                            this.findNodes(paths, address)
                        }
                    }

                    this.setNodesPosition();

                    this.drawGraph();
                })
                .catch((error) => {
                });

        },

        findNodes(json, _address) {
            for (var i = 0; i < json.length; i++) {
                let caddress = json[i].address;
                let cpaths = json[i].paths;
                let ctxcount = json[i].txcount;
                if (!this.uniqueNodes(caddress)) {
                    let cnode = {
                        name: caddress,
                        des: caddress,
                        symbolSize: 30,
                        itemStyle: {
                            normal: {
                                color: 'green'
                            }
                        },
                        category: 1,
                    };
                    this.nodes.push(cnode);
                }
                if (_address !== caddress) {
                    let clink = {
                        source: _address,
                        target: caddress,
                        name: ctxcount,//`${this.$t("transferpath.tranTotal", [ctxcount])}`,
                        lineStyle: {
                            width: 2,
                            curveness: -0.3
                        }
                    }
                    /*
                    if (this.uniqueLinks(_address, caddress))
                        clink.lineStyle.curveness = -0.3;
                    else
                        clink.lineStyle.curveness = 0;
                    */
                    if (!this.uniqueLinks(_address, caddress)) {
                        this.links.push(clink);
                    }
                }

                if (cpaths && cpaths.length > 0) {
                    this.findNodes(cpaths, caddress)
                }
            }
        },

        uniqueNodes(key) {
            var repeat = false;
            for (var pos = 0; pos < this.nodes.length; pos++) {
                var item = this.nodes[pos];
                if (item.name == key) {
                    repeat = true;
                    break;
                }
            }
            return repeat;
        },

        uniqueLinks(_source, _target) {
            var repeatk = false;
            for (var k = 0; k < this.links.length; k++) {
                var link = this.links[k];
                if (link.source == _source && link.target == _target) {
                    repeatk = true;
                    break;
                }
            }
            return repeatk;
        },

        setNodesPosition() {
            var size = 600 / (this.nodes.length - 2);
            var px = size;
            for (var pos = 0; pos < this.nodes.length; pos++) {
                this.nodes[pos].y = 450;
                if (this.nodes[pos].category == 1) {
                    this.nodes[pos].x = px;
                    px += size;
                }
                if (this.nodes[pos].category == 0) this.nodes[pos].x = 0;

                if (this.nodes[pos].category == 2) {
                    if (this.nodes.length <= 2)
                        this.nodes[pos].x = 100;
                    else
                        this.nodes[pos].x = 800;
                }
            }
        },



        drawGraph() {
            var myChart = echarts.init(document.getElementById('atlasChart'));
            console.log(JSON.stringify(this.nodes))
            console.log(JSON.stringify(this.links))
            myChart.setOption({
                tooltip: {
                    formatter: function (params) {
                        return params.data.type
                    }
                },
                animationDurationUpdate: 1500,
                animationEasingUpdate: 'quinticInOut',
                series: [
                    {
                        type: 'graph',//'graph',
                        layout: 'none',//'force',
                        edgeSymbol: ["circle", "arrow"],
                        symbolSize: 20,
                        roam: true,
                        legendHoverLink: true,
                        hoverAnimation: true,
                        draggable: true,
                        label: {
                            show: false,
                            textStyle: {
                                fontSize: 15
                            },
                            position: "bottom",
                            distance: 5,
                            fontSize: 18,
                            align: "center",
                        },
                        /*
                        force: {
                            initlayout:'circular',
                            repulsion: [-10, 2000],
                            gravity: 0.03,
                            edgeLength: 120,
                            layoutAnimation: true,
                        },
                        */

                        edgeLabel: {
                            normal: {
                                color: '#a4e0df',
                                show: true,
                                formatter: function (x) {
                                    return x.data.name;
                                }
                            }
                        },

                        itemStyle: {
                            normal: {
                                color: function (params) {
                                    return 'dark'
                                }
                            },
                        },
                        data: this.nodes,
                        links: this.links,
                        lineStyle: {
                            opacity: 0.9,
                            width: 2,
                            curveness: 0.2,
                            normal: {
                                width: 2,
                                color: '#a4e0df'
                            }
                        }
                    }
                ]
            })
            let _this = this
            myChart.on('click', function (params) {
                if (params.dataType === 'edge') {
                    _this.$refs.traRecord.loadData(params.data.source, params.data.target);
                }
            });
            window.onresize = function () {
                myChart.resize();
            }
        },

    },
};
</script>
<style lang="scss" scoped>
.cursor {
    cursor: pointer;
}

#atlasChart {
    width: 100%;
    height: 400px;
    background-color: '#fff';
    margin: auto;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
}


.tool_box {
    padding: 15px;
    color: #333;

    .tool_title {
        width: 400px;
        font-size: 32px;
        display: flex;
        align-items: top;

        .tool_title_tag {
            span {
                color: #fff;
                font-size: 22px;
                padding: 4px 8px;
                background: #03BA82;
                border-radius: 0px 8px 0px 8px;
                margin-right: 10px;
            }
        }

        .tool_titles {
            width: 90%;
            white-space: pre-wrap;
            line-height: 35px;
        }
    }

    .tool_site {
        margin: 22px 0px 50px 0px;
        font-size: 22px;
    }

    .tool_btn {
        outline: none;
        font-size: 24px;
        width: 100%;
        padding: 18px 0;
        color: #fff;
        background: #03ba82;
        border: 0;
        border-radius: 50px;
    }
}
</style>
