<template>
    <div>
        <el-upload v-if="isAvater === false"
                class="upload"
                :http-request="upload"
                action="string"
                :show-file-list="false">
            <el-button size="small" type="primary">{{textList[typeCode-1]}}</el-button>
        </el-upload>
    </div>
</template>

<script>
    export default {
        name: 'upload',
        props: ['typeCode', 'avater', 'userId'],
        data () {
            return {
                textList: ['上传视频', '上传文档', '上传音乐', '上传图片'],
                isAvater: false
            }
        },
        watch: {
            avater: {
                handler (newV, oldV) {
                    console.log(newV, oldV)
                    // if (val !== null) {
                    //     this.isAvater = true
                    //     console.log('32121')
                    // }
                }
            },
            deep: true
        },
        methods: {
            async upload (val) {
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
                await this.post('/file/upload', formData, config)
                this.$emit('refreshData')
            }
        }
    }
</script>

<style scoped>
    .upload {
        margin-bottom: 20px;
    }
</style>
