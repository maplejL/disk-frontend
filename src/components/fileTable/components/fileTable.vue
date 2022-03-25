<template>
    <div>
<!--        <div v-if="typeCode === 0">-->
<!--            <ul class="infinite-list" v-infinite-scroll="load" style="overflow:auto">-->
<!--                <li v-for="i in count" class="infinite-list-item" :key="i">{{ i }}</li>-->
<!--            </ul>-->
<!--        </div>-->
        <div>
            <el-dialog
                    title="请选择分享方式"
                    :visible.sync="chooseShare">
                <el-form>
                    <el-form-item>
                        <el-radio v-model="radio" label="1">生成链接</el-radio>
                        <el-radio v-model="radio" label="2">与好友共享</el-radio>
                    </el-form-item>
                    <el-form-item label="有效时间">
                        <el-select v-model="validityPeriod" >
                            <el-option label="请选择" value=""></el-option>
                            <el-option v-for="item in validityPeriods" :key="item.id" :label="item.value" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="handleCloseShare">取 消</el-button>
                    <el-button type="primary" @click="handleShare">确 定</el-button>
                </span>
            </el-dialog>
        </div>
        <div class="link">
            <el-dialog title="分享文件链接创建成功" :visible.sync="generateLink" width="600px;height: 500px">
                <div style="width: 400px;height: 500px;float: left">
                    <el-input v-model="linkUrl">
                    </el-input>
                    <p style="margin-top: 20px">
                        提取码: {{extractionCode}}
                    </p>
                </div>
                <div style="width: 300px;float: right">
                    <img :src="qrcodeUrl" style="width: 200px;height: 200px;margin-left: 50px">
                    <p style="text-align: center">扫码即可获取文件，无需提取码</p>
                </div>
            </el-dialog>
        </div>
        <div>
            <el-dialog
                    title="好友共享"
                    :visible.sync="dialogVisible" style="height: 700px">
                <el-transfer
                        v-show="friendList !== null"
                        filterable
                        :filter-method="filterMethod"
                        filter-placeholder="请输入搜索内容"
                        :titles="['好友列表','已选择']"
                        v-model="chosenFriends"
                        :data="friendList">
                    <el-button class="transfer-footer" slot="right-footer"
                               style="float: right;margin-top: 4px" size="small"
                               @click="doShare">分享</el-button>
                </el-transfer>
            </el-dialog>
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
                                style="transform: scale(1) rotate(0deg); margin: auto; max-height: 80%; max-width: 80%;"
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
                            <i class="el-icon-share" v-bind:title="share" @click="chooseShareMethod(scope.row.id)"></i>
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

    /deep/ .el-transfer {
        width: 600px;
        margin: auto;
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

    /deep/ .link .el-dialog__body {
        height: 300px;
    }

</style>

<script>
    import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
    import upload from '../../common/upload'
    import VideoPlayer from '../../common/VideoPlayer'
    import video from '../../common/video'

    export default {
        name: 'fileTable',
        props: ['tableData', 'typeCode', 'userInfo'],
        data () {
            return {
                srcList: [],
                validityPeriod: '',
                validityPeriods: [{
                    value: '永久有效',
                    id: '1'
                }, {
                    value: '30天',
                    id: '2'
                }, {
                    value: '7天',
                    id: '3'
                }, {
                    value: '1天',
                    id: '4'
                }],
                showViewer: 0,
                dialogVisible: false,
                isPlay: 0,
                isPop: true,
                isHover: 0,
                share: '分享',
                down: '下载',
                radio: '1',
                count: 0,
                extractionCode: '',
                more: '更多',
                videoState: false,
                chooseShare: false,
                generateLink: false,
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
                chosenFriends: [],
                linkUrl: '',
                qrcodeUrl: '',
                friendList: [],
                imrUrl: '',
                friends: null,
                chosenFileId: null,
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
            handleCloseShare () {
                this.chooseShare = false
                this.radio = '1'
            },
            handleShare () {
                this.chooseShare = false
                if (this.radio === '2') {
                    this.getFriends()
                } else {
                    let valid = 0
                    switch (this.validityPeriod) {
                    case '1天':
                        valid = 1
                        break
                    case '7天':
                        valid = 7
                        break
                    case '30天':
                        valid = 30
                        break
                    }
                    this.get('/file/generateQRCode', {'fileId': this.chosenFileId, 'valid': valid}).then(res => {
                        this.qrcodeUrl = 'data:image/png;base64,' + res.data.data.encode
                        this.linkUrl = res.data.data.url
                        this.extractionCode = res.data.data.extractionCode
                        this.generateLink = true
                    })
                }
            },
            chooseShareMethod (fileId) {
                this.chooseShare = true
                this.chosenFileId = fileId
            },
            getFriends () {
                this.get('/user/getFriends', {
                    'id': this.userInfo.id
                }).then(res => {
                    this.friendList = []
                    let data = res.data.data
                    data.forEach((item, index) => {
                        this.friendList.push({
                            label: item.username,
                            key: index
                        })
                    })
                    this.friends = data
                    this.dialogVisible = true
                })
            },
            doShare () {
                let chosenUserIds = []
                this.chosenFriends.forEach((item, index) => {
                    let username = this.friendList[item].label
                    this.friends.forEach((item, index) => {
                        if (item.username === username) {
                            chosenUserIds.push(item.id)
                        }
                    })
                })
                this.get('/file/share', {
                    'fileId': this.chosenFileId,
                    'userIds': JSON.stringify(chosenUserIds)
                }).then(res => {
                    this.$message.success('分享成功')
                    this.dialogVisible = false
                })
            },
            filterMethod (query, item) {
                console.log(query, item)
                return item.label.indexOf(query) > -1
            },
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
