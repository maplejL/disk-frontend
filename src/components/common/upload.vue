<template>
    <div>
        <el-upload
                class="upload"
                :http-request="upload"
                action="string"
                :show-file-list="false">
            <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
    </div>
</template>

<script>
    export default {
        name: 'upload',
        props: ['typeCode'],
        methods: {
            upload (val) {
                console.log(val)
                let formData = new FormData()
                formData.append('file', val.file)
                formData.append('typeCode', this.typeCode)
                formData.append('targetFilePath', 'C:\\Users\\user\\Videos\\Captures')
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
                this.post('/file/upload', formData, config)
            }
        }
    }
</script>

<style scoped>
    .upload {
        margin-bottom: 20px;
    }
</style>
