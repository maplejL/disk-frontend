<template>
    <div class="layout">
        <Layout>
            <Header>
                <Menu mode="horizontal" theme="dark" active-name="1">
                    <div>
                        <img src="static/image/logo.png" style="height: 60px;width: 200px;float: left">
                    </div>
                    <div class="layout-nav">
                        <MenuItem name="1" @click.native="doLogin">
                            <Icon type="ios-navigate"></Icon>
                            登录
                        </MenuItem>
                        <MenuItem name="2">
                            <Icon type="ios-keypad"></Icon>
                            item 2
                        </MenuItem>
                        <MenuItem name="3" @click.native="toChat">
                            <Icon type="ios-analytics"></Icon>
                            聊天
                        </MenuItem>
                        <MenuItem name="4">
                            <Icon type="ios-paper"></Icon>
                            Item 4
                        </MenuItem>
                    </div>
                </Menu>
            </Header>
            <jw-chat v-show="ischat === 1"></jw-chat>
            <Layout v-show="ischat === 0" :style="{padding: '0 20px'}">
                <Breadcrumb :style="{margin: '16px 0'}">
                    <Breadcrumb.Item :style="{width: '50px'}">首页</Breadcrumb.Item>
                </Breadcrumb>
                <Content :style="{padding: '24px 0', minHeight: '280px', background: '#fff'}">
                    <Layout v-model="name">
                        <Sider hide-trigger :style="{background: '#fff'}">
                            <Menu :active-name="typeName" theme="light" width="auto" :open-names="['全部文件']" id="menu"
                                  @on-select="changeType" :accordion="true" @on-open-change="parentTag"
                                  ref="typeName"
                            >
                                <Submenu name="全部文件">
                                    <template slot="title">
                                        <Icon type="ios-navigate"></Icon>
                                        全部文件
                                    </template>
                                    <MenuItem name="全部">全部</MenuItem>
                                    <MenuItem name="视频">视频</MenuItem>
                                    <MenuItem name="文档">文档</MenuItem>
                                    <MenuItem name="音乐">音乐</MenuItem>
                                    <MenuItem name="图片">图片</MenuItem>
                                </Submenu>
                                <Submenu name="我的分享">
                                    <template slot="title">
                                        <Icon type="ios-keypad"></Icon>
                                        我的分享
                                    </template>
                                    <MenuItem name="分享记录">分享记录</MenuItem>
                                    <MenuItem name="我的消息">我的消息</MenuItem>
                                </Submenu>
                                <Submenu name="回收站">
                                    <template slot="title">
                                        <Icon type="ios-analytics"></Icon>
                                        回收站
                                    </template>
                                    <MenuItem name="已删除文件">已删除文件</MenuItem>
                                    <!--                                    <MenuItem name="3-2">Option 2</MenuItem>-->
                                </Submenu>
                            </Menu>
                        </Sider>
                        <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
                            <file ref="files"
                                  :fileList="fileList"
                                  :typeCode="typeCode"
                                  :total="totalFiles"
                                  @changePage="changePage"
                                  @loadFile="loadFile"></file>
                            <rubbish></rubbish>
                        </Content>
                    </Layout>
                </Content>
            </Layout>
            <Footer class="layout-footer-center">2011-2016 &copy; TalkingData</Footer>
        </Layout>
    </div>
</template>
<style>
    @import "index.css";
</style>
<script>
    import file from '../fileTable/index'
    import jwChat from '../jwChat/jwChat'
    export default {
        name: 'homePage',
        data () {
            return {
                ischat: 0,
                name: '',
                breadcrumb: ['主页'],
                typeName: null,
                fileList: [],
                pageSize: 5,
                pageNo: 0,
                typeCode: 1,
                totalFiles: 0,
                breads: ['首页'],
                stompClient: '',
                timer: '',
                shopId: '1',
                foldersList: []
            }
        },
        components: {
            file,
            jwChat
        },
        created () {
            this.$nextTick(() => {
                if (this.$route.query.typeName) {
                    this.typeName = this.$route.query.typeName
                    this.$refs.typeName.updateActiveName()
                }
            })
            // this.getPublicKey()
            // this.loadFile()
        },
        mounted () {
            if (localStorage.getItem('token')) {
                this.initWebSocket()
            }
            setTimeout(() => {
                this.websocketclose()
            }, 3000)
        },
        // watch: {
        //     $route: {
        //         handler (val) {
        //             this.typeName = val.query.typeName
        //             this.loadPicture()
        //         }
        //     }
        // },
        methods: {
            toChat () {
                this.ischat = 1
                console.log(this.ischat)
            },
            initWebSocket: function () {
                // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
                this.websock = new WebSocket('ws://localhost:9999/websocket/1')
                this.websock.onopen = this.websocketonopen
                this.websock.onerror = this.websocketonerror
                this.websock.onmessage = this.websocketonmessage
                this.websock.onclose = this.websocketclose
            },
            websocketonopen: function () {
                console.log('WebSocket连接成功')
            },
            websocketonerror: function (e) {
                console.log('WebSocket连接发生错误')
            },
            websocketonmessage: function (e) {
                var da = JSON.parse(e.data)
                console.log(da)
                this.message = da
            },
            websocketclose: function (e) {
                console.log('connection closed (' + e.code + ')')
            },
            changePage (pageSize, pageNo) {
                this.pageSize = pageSize
                this.pageNo = pageNo
                this.loadFile()
            },
            doLogin () {
                this.$router.push({
                    name: 'login',
                    params: {
                        publicKey: this.publicKey
                    }
                })
            },
            showName (name) {
                console.log(name)
            },
            changeType (e) {
                this.$route.query.typeName = e
                this.typeName = e
                switch (this.typeName) {
                case '全部':
                    this.typeCode = 0
                    this.getFolders()
                    break
                case '视频':
                    this.typeCode = 1
                    break
                case '文档':
                    this.typeCode = 2
                    break
                case '音乐':
                    this.typeCode = 3
                    break
                case '图片':
                    this.typeCode = 4
                    break
                }
                this.loadFile()
            },
            async getFolders () {
                let res = await this.get('/folders/getFolders')
                this.foldersList = res.data.data
                this.foldersList.forEach(item => {
                    console.log(item)
                })
            },
            parentTag (e) {
                console.log(e[0])
            },
            loadFile () {
                this.post('/file/getPage', {
                    pageSize: this.pageSize,
                    pageNo: this.pageNo,
                    typeCode: this.typeCode
                }).then((res) => {
                    console.log(res)
                    this.fileList = res.data.files
                    this.fileList.forEach(item => {
                        item.createdDate = this.$moment(item.createdDate).format('YYYY-MM-DD HH:mm:ss')
                        item.modifiedDate = this.$moment(item.modifiedDate).format('YYYY-MM-DD HH:mm:ss')
                    })
                    this.totalFiles = res.data.total
                })
            }
        }
    }
</script>
