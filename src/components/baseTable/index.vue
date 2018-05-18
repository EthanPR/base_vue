<style lang="less">
    .search-content {
        padding: 0 60px;
        min-height: 64px;
        line-height: 50px;
        overflow-y: auto;
        margin-bottom: 10px;
    }

    .table-head {
        padding: 0 60px;
        background-color: #f0f0f0;
    }

    .table-content {
        background-color: #f0f0f0;
    }

    .table-footer {
        padding: 19px 60px;
    }

    .table-box {
        height: 100%;
        width: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .ivu-table {
        overflow-y: auto;
        overflow-x: hidden;
    }

    .ivu-table-body {
        overflow-x: hidden;
    }

    .search-btn {
        float: left;
    }
</style>

<template lang="html">
    <div class="container">
        <Layout>
            <Header class="table-head">
                <Row>
                    <Col span="20">
                    <slot name="searchBox"></slot>
                    <div class="search-btn">
                        <Button style="margin: 0 10px" type="primary" @click="searchHandle" icon="ios-search">搜索</Button>
                        <Button type="primary" :icon="searchIcon" @click="showMore">高级搜索</Button>
                    </div>
                    </Col>
                    <Col span="4" style="text-align: right">
                    <Button type="info" @click="refresh">刷新</Button>
                    <Button type="success" @click="handleAdd">添加</Button>
                    </Col>
                </Row>
            </Header>
            <Content class="table-content">
                <div class="search-content" v-show="showSearchMore">
                    <slot name="searchMoreBox"></slot>
                    <div class="search-btn">
                        <Button style="margin: 0 10px" type="primary" @click="searchHandle" icon="ios-search">搜索</Button>
                    </div>
                </div>
                <Table @on-selection-change="onSelect" class="table-box" :loading="loading" border :columns="columns" :data="tableData"></Table>
            </Content>
            <Footer class="table-footer">
                <Row>
                    <Col span="6">
                    <Button type="error" @click="handleRemove({}, 'more')">批量删除</Button>
                    </Col>
                    <Col span="18" style="text-align:right">
                    <!-- <Page placement="top" :current="pageCurrent" @on-change="changePage" :page-size="20" @on-page-size-change="sizeChange" :total="pageTotal" size="small" show-elevator show-sizer show-total></Page> -->
                    <paginarion :pageInfo.sync="pageInfo" @pageChange="getTableData"></paginarion>
                    </Col>
                </Row>
            </Footer>
            <Modal v-model="dialogVisibility" :title="dialogTitle">
                <slot name="dialog"></slot>
                <div slot="footer">
                    <Button type="default" @click="dialogVisibility=false">Cancel</Button>
                    <Button type="primary" @click="dialogCommit">submit</Button>
                </div>
            </Modal>
        </Layout>
    </div>
</template>

<script>
    import arrUtil from '@/util/unique.js'
    import paginarion from './../pagination';
    export default {
        components: {
            paginarion
        },
        props: ['cols', "searchData", "api", "editInfo", "idField"],
        data() {
            return {
                searchIcon: 'android-arrow-dropdown',
                showSearchMore: false,
                dialogVisibility: false,
                loading: true,
                columns: this.cols,
                tableData: [],
                checkIds: [],
                handleType: '',
                searchInfo: this.searchData,
                pageInfo: {
                    cur: 1,
                    total: 0,
                    size: 20
                },
                apis: this.api,
                dialogTitle:''
            }
        },
        methods: {
            showMore() {
                this.showSearchMore = !this.showSearchMore;
                if (this.searchIcon == 'android-arrow-dropup') {
                    this.searchIcon = 'android-arrow-dropdown'
                } else {
                    this.searchIcon = 'android-arrow-dropup'
                }
            },
            handleRemove(params, type) {
                let resultArr = []
                if (type == 'one') {
                    resultArr.push(params.row.id)
                } else {
                    resultArr = arrUtil.unique(this.checkIds);
                }
                this.$Modal.confirm({
                    title: '提示',
                    content: '删除之后数据不可恢复，你确认要删除吗？',
                    onOk: () => {
                        this.$http.post({
                            url: this.apis.remove,
                            params: {
                                ids: resultArr
                            },
                            success: res => {
                                this.loading = true;
                                this.getTableData();
                                this.$Message.success('删除成功！');
                            }
                        })
                    },
                    onCancel: () => {
                        this.$Message.info('取消删除');
                    }
                });

            },
            getTableData() {
                let params = {};
                let api = '';

                if (JSON.stringify(this.searchInfo) != '{}') {
                    api = this.apis['search'];
                    params = this.searchInfo;
                } else {
                    api = this.apis.list;
                    params = {
                        size: this.pageInfo.size,
                        page: this.pageInfo.cur
                    }
                }
                this.loading = true;
                this.$http.get({
                    url: api,
                    params,
                    success: res => {
                        this.tableData = res.list;
                        this.loading = false;
                        this.pageInfo.total = res.total;
                    }
                });
            },
            refresh() {
                this.searchInfo = {};
                this.loading = true;
                this.getTableData();
            },
            afterAdd(param){
                if (!param.needNew) {
                    this.dialogTitle = "添加";
                    this.dialogVisibility = true;
                    this.handleType = 'save';
                }else{
                    this.$router.push({
                        path: param.path,
                        query: param.query
                    })
                }
            },
            handleAdd() {
                this.$emit('handleAdd')
            },
            handleEdit(param) {
                let payload = param;
                if (!payload.needNew) {
                    this.dialogTitle = "编辑";
                    this.handleType = "update";
                    this.dialogVisibility = true;
                }else{
                    this.$router.push({
                        path: param.path,
                        query: param.query
                    })
                }
            },
            dialogCommit() {
                let param = {
                    // ok: true
                }
                this.$emit("beforeCommit", param)
                if (param.ok) {
                    let api = '';
                    let params = this.editInfo;
                    this.$http.post({
                        url: this.api[this.handleType],
                        params,
                        success: res => {
                            this.dialogVisibility = false;
                            this.loading = true;
                            this.$Message.success('操作成功！');
                            this.getTableData();
                        }
                    })
                }
            },
            onSelect(collection) {
                collection.map(res => {
                    this.checkIds.push(res.id);
                })
            },
            // 搜索
            searchHandle() {
                this.loading = true;
                this.getTableData();
            },
        },
        mounted() {
            console.log(this.apis);
            this.getTableData();
        }
    }
</script>
