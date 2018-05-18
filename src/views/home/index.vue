<template lang="html">
    <div class="container">
        <BaseTable ref="table" :cols="cols" @beforeCommit="beforeCommit" @handleAdd="handleAdd" :searchData="searchInfo" :api='api' :editInfo="editInfo">
            <!-- 搜索 -->
            <div slot="searchBox" class="search-box">
                <Input v-model="searchInfo.id" icon="search" placeholder="输入搜素条件..." style="width: 200px"></Input>
            </div>
            <div slot="searchMoreBox" class="search-box">
                <Input v-model="searchInfo.b" icon="search" placeholder="输入搜素条件..." style="width: 200px"></Input>
                <Input v-model="searchInfo.a" icon="search" placeholder="输入搜素条件..." style="width: 200px"></Input>
                <Input v-model="searchInfo.c" icon="search" placeholder="输入搜素条件..." style="width: 200px"></Input>
            </div>
            <div slot="dialog">
                <Form :model="editInfo" ref="formCustom" :rules="ruleCustom" label-position="right" :label-width="100">
                    <FormItem label="题目" prop="title">
                        <Input v-model="editInfo.title"></Input>
                    </FormItem>
                    <FormItem label="答案" prop="answer">
                        <Input v-model="editInfo.answer"></Input>
                    </FormItem>
                </Form>
            </div>
        </BaseTable>
    </div>
</template>

<script>
    import BaseTable from '@/components/baseTable';
    export default {
        components: {
            BaseTable
        },
        data() {
            return {
                searchInfo: {},
                editInfo: {},
                api: {
                    save: '/questionLib/save',
                    remove: '/questionLib/remove',
                    update: '/questionLib/update',
                    search: '/questionLib/search',
                    list: '/questionLib/list'
                },
                // 表单验证
                ruleCustom: {
                    title: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    answer: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                },
                cols: [{
                    type: 'selection',
                    width: 60,
                    align: 'center'
                }, {
                    title: 'ID',
                    key: 'id'
                }, {
                    title: '题目',
                    key: 'title'
                }, {
                    title: '答案',
                    key: 'answer'
                }, {
                    title: '操作',
                    key: 'action',
                    width: 150,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.handleEdit(params)
                                    }
                                }
                            }, '编辑'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.handleRemove(params)
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                }]
            }
        },
        methods: {
            beforeCommit(param) {
                this.$refs.formCustom.validate((valid) => {
                    if (valid) {
                        param.ok = true; // 允许提交
                    } else {
                        param.ok = false; // 允许提交
                    }
                });
            },
            handleEdit(param) {
                this.editInfo = param.row;
                let params = {
                    needNew: false
                }
                this.$refs.table.handleEdit(params)
            },
            handleAdd() {
                let params = {
                    needNew : false
                } //不打开新页面
                this.editInfo = {};
                this.$refs.table.afterAdd(params)
            },
            handleRemove(params) {
                this.$refs.table.handleRemove(params, 'one')
            }
        },
    }
</script>

<style lang="less" scoped>
    .search-box {
        width: auto;
        float: left;
    }
</style>
