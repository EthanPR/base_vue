<template>
    <Page placement="top" :current="pageInfo.cur"
        :page-size="pageInfo.size"
        :total="pageInfo.total"
        @on-change="onChange"
        @on-page-size-change="changeSize"
        :page-size-opts="defaultOpt"
        size="small" show-elevator show-sizer show-total></Page>
</template>

<script>
    export default {
        props:["pageInfo"],
        data() {
            return {
                defaultOpt: [10, 20, 50, 100]
            }
        },
        methods: {
            changeSize(size){
                this.change(this.pageInfo.cur,size)
            },
            onChange(page){
                this.change(page,this.pageInfo.size)
            },
            change(page,size){
                let pageInfo_new = this.pageInfo;
                pageInfo_new.cur = page;
                pageInfo_new.size = size;
                this.$emit("pageChange",pageInfo_new)
                this.$emit("update:pageInfo",pageInfo_new)
            }
        },
    }
</script>

<style scoped>

</style>
