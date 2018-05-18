<template>
    <div class="container">
        <UploadFile :uploadUrl="'uploadFile'"></UploadFile>
    </div>
</template>

<script>
    import UploadFile from '@/components/uploadFile'
    export default {
        components:{UploadFile}
    }
</script>

<style scoped>
    .container{
        width: 600px;
    }
</style>
