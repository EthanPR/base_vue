<template>
    <div>
        <div class="img-box" @click="fileUpload">
            <img class="avatar-img" v-if="src" id="myImage" :src="src">
            <Icon class="add-icon" v-if="showAdd" size="50" type="camera"></Icon>
            <input v-show="false" type="file" id="file" name="file" @change="upload">
            <Progress v-if="showPro" class="progress" hide-info :percent="percentNum" :status="proStatus"></Progress>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['model', "functionName", "uploadUrl"],
        data() {
            return {
                src: this.model,
                picValue: '',
                baseUrl: BASE_URL,
                path:'',
                percentNum:0,
                showPro: false,
                showAdd: true,
                proStatus: 'active'
            }
        },
        methods: {
            fileUpload() {
                const fileText = document.getElementById('file');
                fileText.click()
            },
            upload(e) {
                const _self = this;
                let files = e.target.files || e.dataTransfer.files;
                if (!files.length) return;
                this.showPro = true;
                this.showAdd = false;
                this.picValue = files[0];
                this.imgPreview(this.picValue);
            },
            convertBase64UrlToBlob(urlData) {
                var bytes = window.atob(urlData.split(',')[1]); //去掉url的头，并转换为byte
                //处理异常,将ascii码小于0的转换为大于0
                var ab = new ArrayBuffer(bytes.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < bytes.length; i++) {
                    ia[i] = bytes.charCodeAt(i);
                }
                return new Blob([ab], {
                    type: 'image/png'
                });
            },
            postImg(file, name) {
                //这里写接口
                let param = new FormData() // 创建form对象
                param.append('file', this.convertBase64UrlToBlob(file), name) // 通过append向form对象添加
                param.append('isFile', true) // 通过append向form对象添加
                param.append('module', this.functionName) // 通过append向form对象添加

                this.$http.post({
                    url: this.uploadUrl,
                    params: param,
                    isFile: true,
                    success: res => {
                        if (res.path) {
                            this.percentNum = 100;
                            this.$emit("update:model", res.path);
                            setTimeout(() => {
                                this.showPro = false;
                            }, 500);
                        }else{
                            this.proStatus = 'wrong';
                        }
                        this.showAdd = false;
                    }
                })

            },
            imgPreview(file) {
                const _self = this;
                let Orientation;
                EXIF.getData(file, function() {
                    Orientation = EXIF.getTag(this, "Orientation");
                });
                if (!file || !window.FileReader) return;
                if (/^image/.test(file.type)) {
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onloadend = function() {
                        let result = this.result;
                        let img = new Image();
                        img.src = result;
                        //判断图片是否大于100K,是就直接上传，反之压缩图片
                        if (this.result.length <= (100 * 1024)) {
                            _self.src = this.result;
                            _self.postImg(this.result, file.name);
                        } else {
                            img.onload = function() {
                                let data = _self.compress(img, Orientation);
                                _self.src = data;
                                _self.postImg(data, file.name);
                            }
                        }
                    }
                }
            },
            rotateImg(img, direction, canvas) {
                //最小与最大旋转方向，图片旋转4次后回到原方向
                const min_step = 0;
                const max_step = 3;
                if (img == null) return;
                //img的高度和宽度不能在img元素隐藏后获取，否则会出错
                let height = img.height;
                let width = img.width;
                let step = 2;
                if (step == null) {
                    step = min_step;
                }
                if (direction == "right") {
                    step++;
                    //旋转到原位置，即超过最大值
                    step > max_step && (step = min_step);
                } else {
                    step--;
                    step < min_step && (step = max_step);
                }
                //旋转角度以弧度值为参数
                let degree = step * 90 * Math.PI / 180;
                let ctx = canvas.getContext("2d");
                switch (step) {
                    case 0:
                        canvas.width = width;
                        canvas.height = height;
                        ctx.drawImage(img, 0, 0);
                        break;
                    case 1:
                        canvas.width = height;
                        canvas.height = width;
                        ctx.rotate(degree);
                        ctx.drawImage(img, 0, -height);
                        break;
                    case 2:
                        canvas.width = width;
                        canvas.height = height;
                        ctx.rotate(degree);
                        ctx.drawImage(img, -width, -height);
                        break;
                    case 3:
                        canvas.width = height;
                        canvas.height = width;
                        ctx.rotate(degree);
                        ctx.drawImage(img, -width, 0);
                        break;
                }
            },
            compress(img, Orientation) {
                const _self = this;
                let canvas = document.createElement("canvas");
                let ctx = canvas.getContext("2d");
                //瓦片canvas
                let tCanvas = document.createElement("canvas");
                let tctx = tCanvas.getContext("2d");
                let initSize = img.src.length;
                let width = img.width;
                let height = img.height;
                let ratio = 1;
                canvas.width = width;
                canvas.height = height;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, width, height);
                //修复ios上传图片的时候 被旋转的问题
                if (Orientation != "" && Orientation != 1) {
                    switch (Orientation) {
                        case 6: //需要顺时针（向左）90度旋转
                            this.rotateImg(img, "left", canvas);
                            break;
                        case 8: //需要逆时针（向右）90度旋转
                            this.rotateImg(img, "right", canvas);
                            break;
                        case 3: //需要180度旋转
                            this.rotateImg(img, "right", canvas); //转两次
                            this.rotateImg(img, "right", canvas);
                            break;
                    }
                }
                //进行最小压缩
                let ndata = canvas.toDataURL("image / jpeg", 0.1);
                tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
                return ndata;
            },
        },
        watch:{
            model(newVal, oldVal){
                if (newVal) {
                    this.src = this.baseUrl + '/attach/thum/' + this.model;
                    this.showAdd = false;
                }else{
                    this.src = '';
                    this.showAdd = true;
                }
            }
        },
        created(){
            if (this.model) {
                this.src = this.baseUrl + '/attach/thum/'+ this.model;
                this.showAdd = false;
            }else{
                    this.src = null;
                    this.showAdd = true;
                }
        }
    }
</script>

<style scoped>
    .avatar-img {
        width: 178px;
        height: 178px;
        border:none;
        border-radius: 5px;
        cursor: pointer;
    }
    .img-box{
        width: 178px;
        height: 178px;
        border-radius: 5px;
        border: 1px dashed #d9d9d9;
        position: relative;
        cursor: pointer;
    }
    .progress{
        position: absolute;
        top: 50%;
        margin-top: -15px;
        width: 80%;
        left: 50%;
        margin-left: -40%;
    }
    .add-icon{
        position: absolute;
        top: 50%;
        margin-top: -25px;
        left: 50%;
        margin-left: -10%;
        cursor: pointer;
    }
</style>
