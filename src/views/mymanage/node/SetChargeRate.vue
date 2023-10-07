<template>
    <div>
        <div class="container-fluid">
            <div class="card" style="margin-top: 40px">
                <div class="card-body">
                    <h4 class="mt-0 header-title" style="text-align: left">
                        {{ $t(title) }}
                    </h4>
                    <div style="width: 100%; text-align: center; padding-bottom: 20px">
                        <el-form :model="from" ref="form" label-width="200px"
                            style="max-width: 550px; margin: 0px auto; text-align: left">
                            <el-form-item :label="$t('node.address')">
                                {{ from.node_address }}
                            </el-form-item>
                            <el-form-item :label="$t('mymanageNode.chargerate')" prop="chargerate"
                                class="phone_form_input">
                                <f-number style="float: left" :min="minrate" :max="maxrate" v-model="from.chargerate"
                                    :step="steps" :units="`${$t('mymanageNode.chargeunit')}`">
                                </f-number>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onSubmit">{{
                                        $t("mymanageNode.SetFeerate")
                                }}</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import * as helper from "@/utils/helper";
import utils from "@/utils/utils";
import webSdk from "@/utils/webSdk.js";
import * as api from "@/api/api";
import FNumber from "@/components/modules/fNumberRe.vue";
export default {
    name: "SetChargeRate",
    components: {
        FNumber,
    },
    props: {
        title: {
            type: String,
            default: "mymanageNode.SetFeerate",
        },
    },
    data() {
        let _this_ = this;
        return {
            loading: false,
            steps: "0.01",
            minrate: 0.01,
            maxrate: 100,
            from: {
                node_address: "",
                chargerate: 100,
                isok: false,
            },
            manage_address: "",
            rules: {
                chargerate: [
                    {
                        required: false,
                        trigger: "change",
                        message: this.$t("mymanageNode.chargerate"),
                    },
                ],
            },
        };
    },
    created() {
        // this.from.node_address = this.$route.params.id;
        let idL = this.$route.params.id;
        let ids = idL.split("_");
        this.from.node_address = ids[0];
        this.manage_address = ids[1];
    },
    methods: {
        goTheUrl(name) {
            helper.goTheUrl(this, name);
        },
        getAddrFormat(addr, num = 10) {
            return helper.getAddrFormat(addr, num);
        },
        onCopy() {
            this.$message({
                showClose: true,
                type: "success",
                message: this.$t("utilsmsg.copyok"),
            });
        },

        toNodes() {
            helper.goUrl(this, "MymanageNode", "");
        },

        onSubmit() {
            this.$refs.form.validate((valid) => {
                if (!valid) {
                    return;
                }
                if (this.from.chargerate <= 0) {
                    return;
                }
                let sdk = this.$store.getters.getsdk || null;
                let waddress = "";
                let maddress = "";
                try {
                    maddress = webSdk.sdkUtils.getAddress(this.manage_address);
                    waddress = webSdk.sdkUtils.getAddress(this.$store.getters.account);
                } catch (error) {
                    console.log(error);
                }

                if (maddress != waddress) {
                    this.$message.error(`${this.$t("mymanageMining.pleasetoymangeaddr")}`);
                    return;
                }

                if (sdk) {
                    let _this_ = this;
                    let setData = {
                        title: `${this.$t(this.title)}`,
                        context: `${this.$t("node.address")}:${this.from.node_address}<br/>`,
                        request: null,
                        closebtnshow: false,
                        success() {
                            _this_.$notify({
                                title: _this_.$t("loadingSubPan.finish"),
                                message: _this_.$t("messages.setfeerateok"),
                                type: "success",
                            });
                            _this_.toNodes();
                        },
                        err() {
                            _this_.$message.error("failed");
                        },
                    };

                    let request = sdk.sendTransactionTo(
                        webSdk.typeJson.candcharate,
                        {
                            addr1: this.from.node_address,
                            charate: this.from.chargerate * 100,
                        },
                        setData
                    );
                    setData.request = request;

                    this.$store.dispatch("setNotification", setData);
                }

            });
        },

    },
};
</script>
<style lang="scss" scoped>
.cursor {
    cursor: pointer;
}
</style>
  