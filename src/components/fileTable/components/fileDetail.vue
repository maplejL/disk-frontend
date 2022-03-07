<template>
    <div class="content">
        <h4>文件详情</h4>
        <div v-if="showDetail">
            <el-image v-if="typeCode === 1 || typeCode === 4" :src="data.thumbnailName || data.url" style="margin-top: 10px" @click="play"></el-image>
            <div v-if="typeCode === 3">
                <aplayer :music="{
                    title: audioName,
                    artist: audioArtist,
                    src: audioSrc,
                    pic: 'https://moeplayer.b0.upaiyun.com/aplayer/secretbase.jpg'
                  }"
                />
            </div>
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
                    <td>{{data.typeName}}</td>
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
    import aplayer from 'vue-aplayer'
    export default {
        name: 'fileDetail',
        props: ['data', 'typeCode', 'audioName', 'audioArtist', 'audioSrc'],
        data () {
            return {
                showDetail: false
            }
        },
        mounted () {
            console.log(this.audioSrc, this.audioName, this.audioArtist)
        },
        components: {
            aplayer
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
