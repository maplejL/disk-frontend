<template>
    <div class="content">
        <h4>文件详情</h4>
        <div v-if="showDetail">
            <el-image :src="data.thumbnailName || data.url" style="margin-top: 10px" @click="play"></el-image>
            <span style="font-size: 14px">{{data.fileName}}</span>
            <table style="margin-top: 10px;line-height: 20px">
                <tr>
                    <td width="70px">创建时间</td>
                    <td>{{data.createdDate}}</td>
                </tr>
                <tr>
                    <td width="70px">更新时间</td>
                    <td>{{data.modifiedDate}}</td>
                </tr>
                <tr>
                    <td width="70px">文件格式</td>
                    <td>{{data.modifiedDate}}</td>
                </tr>
            </table>
        </div>
        <div v-else style="position: relative">
            <img src="../../../../static/image/img.png"
                 style="width: 60px;height: 60px; position: absolute;left: 100px;top: 200px">
            <span style="position: absolute;left: 80px;top: 280px">选中文件，查看详情</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'fileDetail',
        props: ['data'],
        data () {
            return {
                showDetail: false
            }
        },
        methods: {
            play () {
                this.$emit('play', this.data.url)
                // this.$refs.fileTable.play()
            }
        }
    }
</script>

<style scoped lang="less">
    .content {
        padding: 10px;
    }
</style>
