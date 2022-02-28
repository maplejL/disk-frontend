<template>
    <div class="layout">
        <Layout>
            <Header>
                <Menu mode="horizontal" theme="dark" active-name="1">
                    <div>
                        <img src="static/image/logo.png"
                             style="height: 60px;width: 200px;float: left;cursor: pointer"
                             @click="home"
                        >
                    </div>
                    <div class="layout-nav">
                        <MenuItem name="1">
                            <Icon type="ios-navigate"></Icon>
                            <span v-if="userInfo === null" @click="doLogin">登录</span>
                            <el-dropdown v-else>
                                  <span class="el-dropdown-link" style="color: white">
                                    欢迎, {{userInfo === null?'1':userInfo.username}}<i
                                          class="el-icon-arrow-down el-icon--right"></i>
                                  </span>
                                <el-dropdown-menu slot="dropdown">
                                    <span><b>个人设置</b></span>
                                    <el-divider></el-divider>
                                    <el-dropdown-item icon="el-icon-circle-plus" @click.native="showPersonInfo = true">
                                        个人信息
                                    </el-dropdown-item>
                                    <el-dropdown-item icon="el-icon-circle-plus-outline"
                                                      @click.native="isUpdatePass = true">修改密码
                                    </el-dropdown-item>
                                    <el-dropdown-item icon="el-icon-check" @click.native="doLogout">退出登录
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </MenuItem>
                        <MenuItem name="2">
                            <Icon type="ios-keypad"></Icon>
                            item 2
                        </MenuItem>
                        <MenuItem name="3" @click.native="toChat">
                            <el-badge :value="tempChatsCount" class="item">
                                <span style="width: 50%;color: white;" v-show="tempChatsCount === 0">聊天</span>
                                <el-dropdown trigger="hover" v-show="tempChatsCount !== 0">
                                    <span class="el-dropdown-link" style="color: white">
                                    聊天<i class="el-icon-arrow-down el-icon--right"></i>
                                  </span>
                                    <el-dropdown-menu slot="dropdown"
                                                      divided="true"
                                                      style="width: 300px; position:absolute; left: 1420px"
                                    >
                                        <el-dropdown-item v-for="(item, index) in tempChats" :key="index">
                                            <span style="float: left;width: auto;word-break: normal">{{item.content}}</span>
                                            <br/>
                                            <span style="float: left">{{item.conversationName}}</span>
                                            <span style="float: right">
                                                {{item.modifiedDate}}
                                            </span>
                                            <br/>
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </el-badge>
                        </MenuItem>
                    </div>
                </Menu>
            </Header>
            <chat v-show="ischat===1" :userInfo="userInfo" :contentData="friendsData"
                  :conversations="conversations" :newChatRecord="newChatRecord" ref="chat"></chat>
            <Layout v-show="ischat === 0" :style="{padding: '0 20px'}">
                <Breadcrumb :style="{margin: '16px 0'}">
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>List</Breadcrumb.Item>
                    <Breadcrumb.Item>App</Breadcrumb.Item>
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
                                        <i class="el-icon-folder-opened"></i>
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
                                        <i class="el-icon-share"></i>
                                        我的分享
                                    </template>
                                    <MenuItem name="分享记录">分享记录</MenuItem>
                                    <MenuItem name="我的消息">我的消息</MenuItem>
                                </Submenu>
                                <Submenu name="回收站">
                                    <template slot="title">
                                        <i class="el-icon-delete"></i>
                                        回收站
                                    </template>
                                    <MenuItem name="已删除文件" @click.native="getDelete">已删除文件</MenuItem>
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
                                  @refreshData="loadFile"
                                  v-show="showRubbish === 0"
                                  @loadFile="loadFile"></file>
                            <rubbish v-show="showRubbish === 1"
                                     :tableData="deleteFiles"
                                     @changeRubbishPage="changeRubbishPage"
                                     :total="totalDelete"
                                     :pageSize="pageSize"
                            ></rubbish>
                        </Content>
                    </Layout>
                </Content>
                <el-dialog v-if="userInfo !== null" :visible.sync="showPersonInfo">
                    <el-descriptions class="margin-top" title="个人信息" :column="1" border>
                        <el-descriptions-item :span="3">
                            <template slot="label" style="width: 50px">
                                <i class="el-icon-user"></i>
                                用户名
                            </template>
                            {{userInfo.username}}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template slot="label">
                                <i class="el-icon-mobile-phone"></i>
                                手机号
                            </template>
                            {{userInfo.phone}}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template slot="label">
                                <i class="el-icon-location-outline"></i>
                                居住地
                            </template>
                            {{userInfo.city}}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template slot="label">
                                <i class="el-icon-tickets"></i>
                                备注
                            </template>
                            <el-tag size="small">学校</el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template slot="label">
                                <i class="el-icon-office-building"></i>
                                联系地址
                            </template>
                            {{userInfo.address}}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template slot="label">
                                <i class="el-icon-office-building"></i>
                                性别
                            </template>
                            {{userInfo.sex === 1? '男':'女'}}
                        </el-descriptions-item>
                    </el-descriptions>
                </el-dialog>
                <el-dialog title="修改密码" :visible.sync="isUpdatePass">
                    <!--                    <el-form :model="userInfo">-->
                    <!--                        <el-form-item label="原密码">-->
                    <!--                            <el-input placeholder="请输入密码" v-model="password" show-password></el-input>-->
                    <!--                        </el-form-item>-->
                    <!--                    </el-form>-->
                    <el-form :model="info">
                        <el-form-item label="原密码" label-width="120px">
                            <el-input placeholder="请输入原密码" v-model="oldPassword" show-password
                                      style="width: 300px"></el-input>
                        </el-form-item>
                        <el-form-item label="新密码" label-width="120px" prop="newPassword">
                            <el-input placeholder="请输入新密码" v-model="info.newPassword" show-password
                                      style="width: 300px"></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" label-width="120px" prop="checkPassword">
                            <el-input placeholder="请确认密码" v-model="info.checkPassword" show-password
                                      style="width: 300px"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="isUpdatePass = false">取 消</el-button>
                        <el-button type="primary" @click="updatePassword()">确 定</el-button>
                    </div>
                </el-dialog>
            </Layout>
            <Footer class="layout-footer-center">2011-2016 &copy; TalkingData</Footer>
        </Layout>
    </div>
</template>
<style scoped lang="less">
    @import "index.css";
</style>
<script>
    import file from '../fileTable/index'
    import JSEncrypt from 'jsencrypt'
    import rubbish from '../rubbish/index'
    import chat from '../chat/index'

    export default {
        name: 'homePage',
        data () {
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'))
                } else if (value !== this.info.password) {
                    this.$message('两次输入密码不一致!')
                } else {
                    callback()
                }
            }
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
                foldersList: [],
                conversations: [],
                userInfo: null,
                isUpdatePass: false,
                showPersonInfo: false,
                showRubbish: 0,
                deleteFiles: null,
                oldPassword: '',
                friendsData: null,
                totalDelete: 0,
                tempChats: null,
                tempChatsCount: 0,
                newChatRecord: null,
                info: {
                    newPassword: '',
                    checkPassword: ''
                },
                rules: {
                    newPassword: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                        // { pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,30}$/, message: '密码为数字，小写字母，大写字母，特殊符号 至少包含三种，长度为 8 - 30位，密码不能包含 用户名，公司名称(lidian), 公司域名(rekoon) （判断的时候不区分大小写)' }
                    ],
                    checkPassword: [
                        {required: true, validator: validatePass2, trigger: 'blur'}
                    ]
                }
            }
        },
        components: {
            rubbish,
            file,
            chat
        },
        created () {
            this.$nextTick(() => {
                if (this.$route.query.typeName) {
                    this.typeName = this.$route.query.typeName
                    this.$refs.typeName.updateActiveName()
                }
            })

            // this.initWebSocket()
            // this.getPublicKey()
            // this.loadFile()
        },
        mounted () {
            this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
            if (this.userInfo !== null) {
                console.log(this.userInfo)
                this.initWebSocket()
            }
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
            home () {
                this.ischat = 0
            },
            changeRubbishPage (val) {
                this.pageNo = val
                this.getDelete()
            },
            getDelete () {
                this.showRubbish = 1
                this.post('/file/getDeleteFiles', {
                    pageSize: this.pageSize,
                    pageNo: this.pageNo
                }).then(res => {
                    this.deleteFiles = res.data.data.files
                    this.deleteFiles.forEach(item => {
                        item.createdDate = this.$moment(item.createdDate).format('YYYY-MM-DD HH:mm:ss')
                        item.modifiedDate = this.$moment(item.modifiedDate).format('YYYY-MM-DD HH:mm:ss')
                    })
                    this.totalDelete = res.data.data.total
                })
            },
            async toChat () {
                this.ischat = 1
                let res = await this.get('/user/getFriends', {
                    id: this.userInfo.id
                })
                let conversations = await this.get('/conversation/conversations', {
                    id: this.userInfo.id
                })
                this.friendsData = res.data.data
                console.log(conversations.data.data)
                this.conversations = conversations.data.data
            },
            doLogout () {
                this.get('/user/logout', {
                    'id': this.userInfo.id
                }).then(res => {
                    this.$message.success('退出成功')
                    localStorage.removeItem('userInfo')
                    localStorage.removeItem('token')
                    this.userInfo = null
                    this.websocketclose()
                    this.$route.push({path: '/'})
                })
            },
            initWebSocket: function () {
                let userInfo = JSON.parse(localStorage.getItem('userInfo'))
                // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
                this.websock = new WebSocket('ws://localhost:9999/websocket/' + userInfo.id)
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
            async websocketonmessage (e) {
                console.log(e)
                let data = await JSON.parse(e.data)
                if (data && data.tempChat) {
                    this.tempChats = await data.tempChat
                    console.log(this.tempChats)
                    if (this.tempChats.length > 0) {
                        this.tempChats.forEach(item => {
                            item.createdDate = this.$moment(item.createdDate).format('YYYY-MM-DD HH:mm:ss')
                            item.modifiedDate = this.$moment(item.modifiedDate).format('YYYY-MM-DD HH:mm:ss')
                        })
                    }
                }
                if (this.tempChats.length) {
                    this.$message.info('您有未读聊天!')
                    this.tempChatsCount = this.tempChats.length
                }
                console.log(data)
                if (data.newChatRecord !== null) {
                    this.newChatRecord = data.newChatRecord
                    console.log(this.newChatRecord)
                }
                // var da = JSON.parse(e.data)
            },
            websocketclose: function (e) {
                console.log('connection closed')
            },
            updatePassword () {
                if (this.info.newPassword === this.info.checkPassword) {
                    let encryptor = new JSEncrypt()
                    encryptor.setPublicKey(this.global.publicKey)
                    let data = {
                        'id': this.userInfo.id,
                        'newPassword': encryptor.encrypt(this.info.newPassword)
                    }
                    console.log(data)
                    this.axios.put('/user/update', data).then(res => {
                        this.$message.success('修改成功')
                        setTimeout(() => {
                            this.isUpdatePass = false
                        }, 2000)
                    })
                }
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
                this.showRubbish = 0
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
            loadFile (val) {
                if (val !== null) {
                    this.pageNo = val
                }
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
