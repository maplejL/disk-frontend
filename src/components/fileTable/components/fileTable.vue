<template>
    <div>
        <div v-if="typeCode === 0">
            <ul class="infinite-list" v-infinite-scroll="load" style="overflow:auto">
                <li v-for="i in count" class="infinite-list-item" :key="i">{{ i }}</li>
            </ul>
        </div>
        <div style="float: left" v-if="typeCode !== 0">
            <table>
                <tr>
                    <td>
                        <upload :typeCode="typeCode"
                                @refreshData="refreshData"
                        ></upload>
                    </td>
                    <td style="position: relative">
                        <el-button size="small"
                                   type="danger"
                                   style="position: absolute;top: 0px;margin-left: 15px"
                                   @click="deleteFile">批量删除</el-button>
                    </td>
                </tr>
            </table>
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
                    @cell-mouse-enter="cellMouseEnter"
                    @cell-mouse-leave="cellMouseLeave"
                    @select="selectRow"
                    @select-all="selectAll"
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
                                  style="height: 50px;cursor: pointer;"
                                  fit="scale-down"
                        >
                        </el-image>
                        <el-image v-else
                                  :src="scope.row.thumbnailName"
                                  style="height: 50px;cursor: pointer;"
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
                    <template slot-scope="scope">
                        <div v-if="scope.row.id === refactorId">
                            <el-input
                                    type="text"
                                    v-model="refactorData.fileName"
                                    style="width: 360px"
                            ></el-input>
                            <button class="refactor" @click="refactorFile">
                                <i class="el-icon-check" />
                            </button>
                            <button class="refactor" @click="refactorId = null">
                                <i class="el-icon-close" />
                            </button>
                        </div>
                        <span v-else style="cursor: pointer"
                              @click="setSrc(scope.row.url, scope.row.typeCode)"
                        >{{scope.row.fileName}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="modifiedDate"
                        label="修改时间"
                        width="150px">
                </el-table-column>
                <el-table-column width="100px">
                    <!--                <span v-show="isHover === 1">123</span>-->
                    <template slot-scope="scope">
                        <div v-show="scope.row.id === hoverId">
                            <i class="el-icon-share" v-bind:title="share"></i>
                            <i class="el-icon-download" @click="download(scope.row.url)" v-bind:title="down"></i>
                            <el-dropdown trigger="click" placement="bottom" @command="handleCommand">
                            <span class="el-dropdown-link">
                                <i class="el-icon-more" v-bind:title="more"></i>
                            </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="move">移动到</el-dropdown-item>
                                    <el-dropdown-item command="refactor">重命名</el-dropdown-item>
                                    <el-dropdown-item command="copy">复制到</el-dropdown-item>
                                    <el-dropdown-item command="delete">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                        <!--                    <el-button v-show="scope.row.hoverFlag" type="primary">123</el-button>-->
                    </template>
                </el-table-column>
                <el-table-column
                        prop="size"
                        label="大小"
                        width="250px">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<style scoped lang="less">
    /deep/ .el-image-viewer__wrapper {
        height: 50%;
    }

    /deep/ .el-icon-more {
        color: #2baee9;
        cursor: pointer;
    }

    /deep/ .el-icon-share {
        color: #2baee9;
        margin-right: 10px;
        cursor: pointer;
    }

    /deep/ .el-icon-download {
        color: #2baee9;
        margin-right: 10px;
        cursor: pointer;
    }

    .refactor {
        width: 38px;
        height: 38px;
        background-color: white;
        border: 0px;
        cursor: pointer;
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
                share: '分享',
                down: '下载',
                count: 0,
                more: '更多',
                videoState: false,
                isSelect: 0,
                hoverId: null,
                hoverData: null,
                refactorId: null,
                deleteOne: 0,
                refactorData: null,
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
                },
                selectedIds: []
            }
        },
        components: {
            upload,
            ElImageViewer,
            VideoPlayer,
            video
        },
        methods: {
            refreshData () {
                this.$emit('refreshData')
            },
            load () {
                this.count += 2
            },
            async refactorFile () {
                this.refactorId = null
                await this.put('/file/refactorFile', this.refactorData).then(res => [
                    this.loadFile()
                ])
                this.$message.success('重命名成功')
            },
            selectAll () {
                this.selectedIds = []
                for (let i = 0; i < this.tableData.length; i++) {
                    this.selectedIds.push(this.tableData[i].id)
                }
            },
            selectRow (selection) {
                // this.isSelect = 1
                console.log(selection)
                this.selectedIds = []
                for (let i = 0; i < selection.length; i++) {
                    this.selectedIds.push(selection[i].id)
                }
            },
            async cellMouseEnter (row, column, cell, event) {
                let res = await this.compare(row)
                this.hoverId = res.id
                this.hoverData = res
            },
            compare (row) {
                for (let index = 0; index < this.tableData.length; index++) {
                    const element = this.tableData[index]
                    if (element.id === row.id) {
                        return row
                    }
                }
            },
            handleCommand (command) {
                switch (command) {
                case 'delete':
                    this.deleteOne = 1
                    this.deleteFile()
                    break
                case 'refactor':
                    this.refactorId = this.hoverData.id
                    this.refactorData = this.hoverData

                    break
                }
            },
            cellMouseLeave () {
                // 移除hover的事件
                this.hoverId = null
            },
            loadFile () {
                this.$emit('loadFile')
            },
            async deleteFile () {
                let ids = []
                if (this.deleteOne === 1) {
                    ids.push(this.hoverData.id)
                } else {
                    ids = this.selectedIds
                }
                await this.myDelete('/file/deleteFile', {ids: ids})
                    .then(res => {
                        this.loadFile()
                    })
                this.$message.success('删除成功')
            },
            download (url) {
                this.get('/file/download', {
                    url: url
                }).then(res => {
                    console.log(res)
                })
            },
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
