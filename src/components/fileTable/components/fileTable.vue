<template>
    <div style="float: left">
        <upload :typeCode="typeCode"></upload>
        <!--        <video v-show = "isPlay === 1"></video>-->
        <div class='mask' v-if='isPlay == 1' @click='masksCloseFun'></div>
        <div class="videomasks" v-if="isPlay == 1">
            <VideoPlayer :options="videoOptions" class="video"></VideoPlayer>
        </div>

        <el-table
                :data="tableData"
                height="500px"
                :highlight-current-row="true"
                style="width: 90%"
                @row-click="toDetail"
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
                              @click="setSrc(scope.row.url, scope.row.typeCode)"
                    >
                    </el-image>
                    <el-image-viewer
                            v-if="showViewer === 1"
                            style="transform: scale(1) rotate(0deg); margin: auto; max-height: 70%; max-width: 70%;"
                            :on-close="closeViewer"
                            :url-list="srcList"/>
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
                    prop="modifiedDate"
                    label="修改时间"
                    width="250px">
                <template slot-scope="scope">
                    <span v-if="isHover === 0">{{scope.row.modifiedDate}}</span>
                    <
<!--                    <el-popover-->
<!--                            placement="top-start"-->
<!--                            title="标题"-->
<!--                            width="200"-->
<!--                            trigger="hover"-->
<!--                            content="scope">-->
<!--                        <el-button   size="mini"-->
<!--                                     type="text" slot="reference">{{scope.row.modifiedDate}}</el-button>-->
<!--                    </el-popover>-->
                </template>
            </el-table-column>
            <el-table-column
                    prop="size"
                    label="大小"
                    width="250px">
            </el-table-column>
        </el-table>
    </div>
</template>

<style scoped lang="less">
    /deep/ .el-image-viewer__wrapper {
        height: 50%;
    }

    .video {
        width: 75%;
        height: 50%;
        position: absolute;
        top: 10%;
        left: 12%;
        z-index: 1000;
    }

    .mask {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 999;
        background-color: #000000;
        opacity: .6;
    }

    /deep/ .vjs-big-play-button {
        margin: auto;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
    }
</style>

<script>
    import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
    import upload from '../../common/upload'
    import VideoPlayer from '../../common/VideoPlayer'
    import video from '../../common/video'

    export default {
        name: 'fileTable',
        props: ['tableData', 'typeCode'],
        data () {
            return {
                srcList: [],
                showViewer: 0,
                isPlay: 0,
                isPop: true,
                isHover: 0,
                videoState: false,
                videoOptions: {
                    autoplay: '', // 自动播放
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
            VideoPlayer,
            video
        },
        updated () {
            console.log(this.tableData)
        },
        methods: {
            ok () {
                this.$Message.info('点击了确定')
            },
            cancel () {
                this.$Message.info('点击了取消')
            },
            setSrc (url, typeCode) {
                if (typeCode === 1) {
                    this.isPlay = 1
                    this.showViewer = 0
                    this.videoOptions.sources[0].src = url
                } else {
                    this.srcList = []
                    this.srcList.push(url)
                    this.showViewer = 1
                }
            },
            closeViewer () {
                this.showViewer = 0
            },
            masksCloseFun () {
                this.isPlay = 0
            },
            toDetail (row) {
                this.$emit('toDetail', row)
            },
            play (url) {
                this.videoOptions.sources[0].src = url
                this.isPlay = 1
            }
        }
    }
</script>
