<template>
    <div class="container">
        <Upload :on-progress="onUploading" ref="upload" :with-credentials="true" multiple :show-upload-list="false" :default-file-list="defaultList" type="drag" :action="baseUrl+uploadUrl" :before-upload="beforeUpload" :on-success="onSuccess">
            <div style="padding: 20px 0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>点击此处或将文件拖拽到此处上传</p>
            </div>
        </Upload>
        <div class="default-list" v-for="(item, index) in defaultList" :key="index">
            <p class="list-item" v-if="item.status === 'finished'">
                <Icon type="document-text"></Icon>
                <span>{{item.name}}</span>
                <Icon @click.native="onRemove(index)" class="delete" type="trash-a"></Icon>
            </p>
            <Progress :stroke-width="2" v-if="item.showProgress" :percent="percentage" hide-info></Progress>
        </div>

    </div>
</template>

<script>
    export default {
        // /uploadFile
        props: ["uploadUrl"],
        data() {
            return {
                baseUrl: BASE_URL,
                defaultList:[],
                percentage: 0
            }
        },
        methods: {
            // 文件上传前的钩子，可用于限制上传类型
            beforeUpload() {

            },
            // 上传时的钩子
            onUploading(){
                var timer = setInterval(() => {
                    if (this.percentage <= 100) {
                        this.percentage += Math.random()*5+1;
                    }else{
                        this.percentage = 100;
                        clearInterval(timer);
                    }
                }, 10)
            },
            // 文件上传成功时的钩子
            onSuccess(res, file, fileList){
                if (res.code == 200) {
                    this.defaultList = fileList;
                    this.percentage = 0;
                }else{
                    this.$Message.error(file.name + ' 上传失败！');
                }

            },
            onRemove(item){
                console.log(item);
            }
        },
        mounted(){

        }
    }
</script>

<style scoped>
    .container {
        width: 50%;
    }
    .default-list{
        padding: 5px;
    }
    .list-item{
        font-size: 14px;
        cursor: pointer;
        height: 25px;
        line-height: 25px;
        border: 1px solid #ccc;
        padding-left: 5px;
    }
    .list-item:hover{
        border: 1px solid blueviolet;
    }
    .list-item:hover span{
        color: blueviolet;
    }
    .list-item i{
        margin-right: 5px;
    }
    .delete{
        float: right;
        color: rgb(196, 36, 36);
        line-height: 25px;
    }
</style>
