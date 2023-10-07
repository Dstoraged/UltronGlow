<template>
    <el-popover placement="bottom" :width="400" trigger="click">
        <template #reference>
            <el-button icon="el-icon-tickets" circle size="mini" v-show="dataItem"></el-button>
        </template>
        <h-tbale v-if="dataItem" ref="htable" :show-subtitle="false" :table-heard="heards" :table-data="datas"
            :show-right-tools="false" :show-order="false" :show-page-tools="false">

        </h-tbale>
    </el-popover>
</template>
<script>
import HTbale from "./HTbale.vue"
export default {
    components: { HTbale },
    props: {
        heards: {
            type: Array,
            default() {
                return []
            }
        },
        dataItem: {
            type: Object,
            default() {
                return null
            }
        }
    },
    computed: {
        datas() {
            if (this.dataItem) {
                return [this.dataItem]
            }
            return []
        }
    }
};

</script>