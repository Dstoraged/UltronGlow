<template>
    <div>
        <div class="container-fluid">
            <div class="card" style="margin-top: 40px">
                <div class="card-body">
                    <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
                        {{ $t("storagerental.rentalcfgtitle") }}
                    </h4>
                    <el-form :model="form" label-width="200px"
                        style="max-width: 520px; margin: 0px auto; text-align: left">
                        <el-form-item :label="$t('storagerental.renthash')" prop="rent_hash">{{ form.rent_hash }}
                        </el-form-item>

                        <el-form-item :label="$t('storagerental.deviceaddress')" prop="device_address">{{
                                form.device_address
                        }}
                        </el-form-item>
                        <!--
                        <el-form-item :label="$t('storagerental.rentaladdress')" prop="rent_address">{{
                                form.rent_address
                        }}
                        </el-form-item>
                        -->

                        <el-form-item :label="$t('storagerental.revenueaddress')" prop="revenue_address">
                            <span style="float: left">{{ form.revenue_address }}</span>
                        </el-form-item>

                        <el-form-item :label="$t('storagerental.rentalcontent')" prop="rent_content">
                            <el-input type="textarea" v-model="form.rent_content" :autosize="{ minRows: 2, maxRows: 6 }"
                                maxlength="500">
                            </el-input>
                        </el-form-item>
                        <el-form-item :label="$t('storagerental.rentalpic')" prop="imageUrl">
                            <div class="uploadInput" @click="fileClick">
                                <input class="input" type="file" style="display:none;" id="chooseFile"
                                    accept=".jpg, .jpeg, .png, .JPG, .JPEG, .PNG, .bmp, .BMP" @change="inputChange" />
                                <img v-if="form.imageUrl" :src="form.imageUrl"
                                    style="width:60px;height:60px;border:1px dashed ">
                                <i v-else class="el-icon-plus"></i>
                                <div slot="tip" class="el-upload__tip">{{ $t('storagerental.picsizemsg') }}</div>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">{{
                                    $t("storagerental.rentalconfig")
                            }}</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import * as api from "@/api/api";
import utils from "@/utils/utils";
import * as helper from "@/utils/helper";
import webSdk from "@/utils/webSdk.js";
import ajax from "@/utils/ajax";
export default {
    name: "RentalConfig",
    components: {},
    data() {
        return {
            btnShow: false,
            loading: false,
            form: {
                rent_hash: "",
                rent_address: "",
                device_address: "",
                rent_space: 0,
                rent_price: 0.0,
                rent_time: 1,
                revenue_address: "",
                rent_content: "",
                imageUrl: "",
                signRaw: null,
            },
            formType: "edit",
            rules: {},
            picFile: null,
        };
    },

    created() {
        this.form.revenue_address = this.$store.getters.account;
        this.form.rent_hash = this.$route.params.id;
        this.loadData();
    },
    mounted() { },
    activated() {
        this.loadData();
    },
    methods: {
        fileClick() {
            document.getElementById("chooseFile").click();
        },

        async inputChange(e) {
            if (e.target.files.length === 0) {
                return
            }
            const file = e.target.files[0]
            this.picFile = e.target.files[0]
            const isJPG = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
            const isLt2k = file.size / 1024 <= 2;
            if (!isJPG) {
                this.$message.warning(this.$t('storagerental.uploadpicfilemsg'));
                return false;
            }
            if (!isLt2k) {
                this.$message.warning(this.$t('storagerental.uploadpicsizemsg'));
                return false;
            }
            var _this = this;
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.addEventListener('load', function () {
                _this.form.imageUrl = reader.result
            })
            /*
            reader.onload = (data) => {
                _this.form.imageUrl  = data.target.result; 
            };   
            */        
            e.target.value = '';
        },

        onSubmit() {
            let param = new FormData();
            param.append('file', this.picFile, this.picFile.name);
            param.append('revenue_address', this.form.revenue_address);
            param.append('rent_content', this.form.rent_content);
            param.append('signRaw', this.form.signRaw);
            api.postForm('/platform/rentConfig', param)
                .then(response => {
                    console.log(response.data);
                })
        },

        /*
        getRentalSign(address, amount) {
            const bprovider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = bprovider.getSigner();
            return new Promise((resolve, reject) => {
                let msg = address + amount
                const signature = await signer.signMessage(msg);
            })
        },
        */

        loadData() {
            api
                .post("/platform/getStorageRentInfo", {
                    rent_hash: this.form.rent_hash,
                })
                .then((response) => {
                    let result = response.result || {};
                    this.form.rent_address = result.rentAddr;
                    this.form.device_address = result.deviceAddr;
                })
                .catch((error) => {
                    console.error(error);
                });

        },
    },

};
</script>
<style lang="scss" scoped>
.cursor {
    cursor: pointer;
}

.content {
    text-align: center;
    background-color: #fff;
    border-radius: 20px;
    width: 600px;
    height: 450px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.bg-purple {
    background: #343638;
}
</style>
  