<template>
    <stwtpg :title="$t('Transactions.stchpg')" :is-manage="true" 
    back="/mymanage/storageServicenode"
    toType="stchpg"
    />
</template>
<script>
import stwtpg from "./stwtpg.vue"
export default {
    components:{stwtpg}
}
</script>