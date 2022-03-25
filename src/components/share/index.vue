<template>
    <div class="main">
        <myHeader @home="home"></myHeader>
        <el-dialog
                title="请输入提取码"
                :visible.sync="dialogVisible"
                width="30%">
            <el-input v-model="extractionCode"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="getSharedFile">确 定</el-button>
              </span>
        </el-dialog>
        <div v-if="record !== null && record !== undefined">
            <table class="share">
                <tr>
                    <td>
                        <div style="position: relative;width: 900px;height: 770px;float: left">
                            <div style="padding-top: 20px;padding-left: 20px">
                                <img v-if="typeCode === '1'" :src="file.thumbnailName" style="width: 30px;height: 30px">
                                <img v-else-if="typeCode === '4'" :src="file.url" style="width: 30px;height: 30px">
                                <span style="font-size: large;position: relative;top: -10px;padding-left: 20px">{{file.fileName}}</span>
                            </div>
                            <div style="margin-left: 20px">
                                <i class="el-icon-time"></i>
                                <span>{{record.createdDate}}</span>
                                <span style="margin-left: 30px">过期时间: {{record.remainTime}} 天后</span>
                            </div>
                            <el-divider></el-divider>
                            <div v-if="typeCode === '1'" style="width: 600px;height: 700px;">
                                <VideoPlayer :options="videoOptions" class="video"></VideoPlayer>
                            </div>
                            <div v-else-if="typeCode === '4'">
                                <el-image
                                        class="image"
                                        :src="file.url"/>
                            </div>
                        </div>
                    </td>
                    <td style="position: relative">
                        <div style="float: right;background-color: #f7f7f7;position: absolute;top: 0px;left: 40px;">
                            <img :src="record.avater.url" style="width: 80px;height: 80px">
                            <p style="text-align: center;font-size: large">{{userInfo.username}}</p>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
        <Footer class="layout-footer-center">edit by LuJunjie@2022</Footer>
    </div>
</template>

<script>
    import myHeader from '../common/header'
    import VideoPlayer from '../common/VideoPlayer'

    export default {
        name: 'sharePage',
        data () {
            return {
                typeCode: null,
                shareId: null,
                userInfo: null,
                file: null,
                record: null,
                extractionCode: '',
                urlList: [],
                dialogVisible: false,
                haveExtractionCode: false,
                videoOptions: {
                    autoplay: false, // 自动播放
                    controls: true, // 用户可以与之交互的控件
                    loop: true, // 视频一结束就重新开始
                    muted: false, // 默认情况下将使所有音频静音
                    aspectRatio: '16:9', // 显示比率
                    fullscreen: {
                        options: {navigationUI: 'hide'}
                    },
                    sources: [
                        {
                            src: null,
                            type: 'video/mp4'
                        }
                    ]
                }
            }
        },
        components: {
            myHeader,
            VideoPlayer
        },
        created () {
            this.shareId = this.$route.query.id
            this.typeCode = this.$route.query.typeCode
            if (localStorage.getItem(this.shareId) !== null && localStorage.getItem(this.shareId) !== undefined) {
                this.extractionCode = localStorage.getItem(this.shareId)
                this.getSharedFile()
            } else {
                this.dialogVisible = true
            }
            console.log(this.haveExtractionCode)
            // this.videoOptions.sources[0].src = this.$route.query.fileUrl
        },
        methods: {
            home () {
                this.$router.push('/homePage')
            },
            async getSharedFile () {
                await this.get('/file/showSharedFile', {'id': this.shareId, 'extractionCode': this.extractionCode}).then(res => {
                    this.$message.success('验证成功')
                    this.dialogVisible = false
                    this.$route.query.extractionCode = this.extractionCode
                    localStorage.setItem(this.shareId, this.extractionCode)
                    let data = res.data.data
                    console.log(data)
                    this.videoOptions.sources[0].src = data.file.url
                    this.file = data.file
                    if (this.typeCode === '4') {
                        console.log(this.file)
                        this.urlList.push(this.file.url)
                    }
                    this.record = data
                    this.userInfo = data.user
                }).catch(() => {
                    setTimeout(() => {
                        this.home()
                    }, 2000)
                })
            }
        }
    }
</script>

<style scoped>
    .main {
        height: 100%;
        background-color: #f7f7f7;
    }

    /deep/ .vjs-big-play-button {
        top: 50%;
        left: 45%;
    }

    .share {
        width: 900px;
        height: 770px;
        margin: auto;
        background-color: white;
    }

    .video {
        width: 800px;
        position: absolute;
        top: 20%;
        left: 5%;
        z-index: 1000;
    }

    .layout-footer-center {
        margin-top: -10px;
        text-align: center;
        position: fixed;
        bottom: 0;
        left: 50em;
    }

    .image {
        transform: scale(1) rotate(0deg);
        margin: auto;
        position: absolute;
        top: 20%;
        left: 5%;
        height: 500px;
        width: 800px;
        z-index: 999
    }
</style>
