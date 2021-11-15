<template>
    <div>
        <upload :typeCode="typeCode"></upload>
        <div v-show = "isPlay === 1">
            <VideoPlayer :options="videoOptions" class="video"></VideoPlayer>
        </div>
        <el-table
                :data="tableData"
                height="700"
                style="width: 80%"
                >
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column width="70px" v-viewer.static="{inline: true}">
                <template slot-scope="scope">
                    <el-image v-if="scope.row.typeCode !== 1"
                              :src="scope.row.url"
                              @click="setSrc(scope.row.url, scope.row.typeCode)"
                              style="height: 50px"
                              fit="scale-down"
                              >
                    </el-image>
                    <el-image v-else
                              :src="scope.row.thumbnailName"
                              style="height: 50px"
                              @click="setSrc(scope.row.thumbnailName, scope.row.typeCode)"
                              >
                    </el-image>
                    <el-image-viewer
                            v-if="showViewer === 1"
                            style="transform: scale(1) rotate(0deg); margin: auto; max-height: 70%; max-width: 70%;"
                            :on-close="closeViewer"
                            :url-list="srcList" />
                </template>
            </el-table-column>
            <el-table-column
                    label="文件名"
                    prop="fileName"
                    width="500px"
                    :show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column
                    prop="createdDate"
                    label="修改时间"
                    width="200px">
            </el-table-column>
            <el-table-column
                    prop="size"
                    label="大小"
                    width="200px">
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                    layout="prev, pager, next"
                    :total="50"
                    :page-size="5">
            </el-pagination>
        </div>
    </div>
</template>

<style scoped lang="less">
    /deep/ .el-image-viewer__wrapper {
        height: 50%;
    }
    .video {
        width: 70%;
        height: 50%;
        position: absolute;
        top: 20%;
        z-index: 99;
    }
</style>

<script>
    import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
    import upload from './upload'
    import VideoPlayer from './VideoPlayer'
    export default {
        name: 'fileTable',
        props: ['tableData', 'typeCode'],
        data () {
            return {
                srcList: [],
                showViewer: 0,
                isPlay: 0,
                videoOptions: {
                    autoplay: 'muted', // 自动播放
                    controls: true, // 用户可以与之交互的控件
                    loop: true, // 视频一结束就重新开始
                    muted: false, // 默认情况下将使所有音频静音
                    aspectRatio: '16:9', // 显示比率
                    fullscreen: {
                        options: {navigationUI: 'hide'}
                    },
                    sources: [
                        {
                            src: 'https://disk-1305749742.cos-website.ap-shanghai.myqcloud.com/mall/33981636516863112.mp4',
                            type: 'video/mp4'
                        }
                    ]
                }
            }
        },
        components: {
            upload,
            ElImageViewer,
            VideoPlayer
        },
        methods: {
            setSrc (url, typeCode) {
                this.srcList = []
                this.srcList.push(url)
                this.showViewer = 1
                if (typeCode === 1) {
                    this.isPlay = 1
                    this.showViewer = 0
                    console.log(this.isPlay)
                }
            },
            closeViewer () {
                this.showViewer = 0
            }
        }
    }
</script>
