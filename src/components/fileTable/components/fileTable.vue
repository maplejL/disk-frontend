<template>
    <div>
        <div v-if="typeCode === 0">
            <ul class="infinite-list" v-infinite-scroll="load" style="overflow:auto">
                <li v-for="i in count" class="infinite-list-item" :key="i">{{ i }}</li>
            </ul>
        </div>
        <div style="float: left;width: 100%;" v-if="typeCode !== 0">
            <div style="display: inline;width: 200px;float: left">
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
                                       @click="deleteFile">批量删除
                            </el-button>
                        </td>
                    </tr>
                </table>
            </div>
            <div style="display: inline;float: right;margin-right: 100px;">
                <el-input placeholder="请输入内容"
                          v-model="searchInput"
                          class="input-with-select"
                          maxlength="20"
                          size="medium"
                          @input="watchInput"
                          @focus="watchInput"
                          >
                    <i slot="suffix" style="position:relative;top: 8px;cursor: pointer;right: 10px" @click="doSearch">|&nbsp;搜索</i>

                </el-input>
            </div>
            <!--        <video v-show = "isPlay === 1"></video>-->
            <div class='mask' v-if='isPlay == 1' @click='masksCloseFun'></div>
            <div class="videomasks" v-if="isPlay == 1 && typeCode === 1">
                <VideoPlayer :options="videoOptions" class="video"></VideoPlayer>
            </div>

            <el-table
                    :data="tableData"
                    height="500px"
                    :highlight-current-row="true"
                    style="width: 90%;"
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
                    <template slot-scope="scope" v-if="scope.row.typeCode !== 2">
                        <el-image v-if="scope.row.typeCode === 4 "
                                  :src="scope.row.url"
                                  @click="setSrc(scope.row.url, scope.row.typeCode)"
                                  style="height: 50px;cursor: pointer;"
                                  fit="scale-down"
                        >
                        </el-image>
                        <el-image v-else-if="scope.row.typeCode === 1"
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
                                <i class="el-icon-check"/>
                            </button>
                            <button class="refactor" @click="refactorId = null">
                                <i class="el-icon-close"/>
                            </button>
                        </div>
                        <div v-else>
                            <el-tooltip class="item" style="cursor: pointer" effect="dark" content="点击预览此文件" placement="top-start">
                                <span @click="setSrc(scope, scope.row.url, scope.row.typeCode)">
                                    {{scope.row.fileName}}
                                </span>
                            </el-tooltip>
                        </div>
<!--                        <span v-else class="tooltip" data-tooltip="123"-->
<!--                              @click="setSrc(scope.row.url, scope.row.typeCode)"-->
<!--                        >-->
<!--                            {{scope.row.fileName}}-->
<!--                        </span>-->
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
                            <i class="el-icon-download" @click="download(scope.row.id)" v-bind:title="down"></i>
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

    /deep/ .is-scrolling-left {
        overflow-x: hidden;
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

    .tooltip:hover{
        cursor:pointer;
    }
    .tooltip:hover:before{
        content:attr(data-tooltip);
        background:#d9444a;
        color:#fff;
        padding:.8em 1em;
        position:absolute;
        left:100%;
        top:-70%;
        margin-left:14px;
        white-spack:pre;
    }
    .tooltip:hover:after{
        content:" ";
        position:absolute;
        left:80%;
        width:0;
        height:0;
        /*border-right:8px solid #d9444a;*/
        /*border-top:8px solid transpatrnt;*/
        /*border-bottom:8px solid transparent;*/
    }

    /deep/ .el-input__inner {
        border-radius: 20px
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
                searchInput: '',
                isSelect: 0,
                hoverId: null,
                hoverData: null,
                refactorId: null,
                deleteOne: 0,
                audioSrc: '',
                audioName: 'unknown',
                audioArtist: 'unknown',
                refactorData: null,
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
            doSearch () {
                this.$emit('doSearch', this.searchInput)
            },
            watchInput (val) {
                if (val.length === 20) {
                    console.log(val.length)
                    this.$message.info('输入框字数限制为20字')
                }
            },
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
            download (id) {
                this.$confirm('确定下载此文件吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.get('/file/download', {
                        id: id
                    }).then(res => {
                        console.log(res)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消下载'
                    })
                })
            },
            ok () {
                this.$Message.info('点击了确定')
            },
            cancel () {
                this.$Message.info('点击了取消')
            },
            setSrc (scope, url, typeCode) {
                if (typeCode === 1) {
                    this.isPlay = 1
                    this.showViewer = 0
                    this.videoOptions.sources[0].src = url
                } else if (typeCode === 4) {
                    this.srcList = []
                    this.srcList.push(url)
                    this.showViewer = 1
                } else if (typeCode === 2) {
                    this.$message.success('正在打开文档')
                    setTimeout(() => {
                        this.get('/file/preview', {
                            'url': url
                        })
                    }, 1000)
                } else {
                    this.$emit('setAudio', scope.row)
                }
            },
            closeViewer () {
                this.showViewer = 0
            },
            masksCloseFun () {
                this.isPlay = 0
            },
            toDetail (row) {
                this.$emit('setAudio', row)
                this.$emit('toDetail', row)
            },
            play (url) {
                this.videoOptions.sources[0].src = url
                this.isPlay = 1
            }
        }
    }
</script>
