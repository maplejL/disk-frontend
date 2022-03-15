<template>
    <div class="layout">
        <Layout>
            <chat v-show="ischat===1" :userInfo="userInfo" :contentData="friendsData"
                  :conversations="conversations" :newChatRecord="newChatRecord" :chosenTempChat="chosenTempChat" ref="chat"></chat>
            <Layout v-show="ischat === 0" :style="{padding: '0 20px'}">
<!--                <Breadcrumb :style="{margin: '16px 0'}">-->
<!--                    <Breadcrumb.Item>Home</Breadcrumb.Item>-->
<!--                    <Breadcrumb.Item>List</Breadcrumb.Item>-->
<!--                    <Breadcrumb.Item>App</Breadcrumb.Item>-->
<!--                </Breadcrumb>-->
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
                                    <Submenu name="共享文件">
                                        <template slot="title">
                                            共享文件
                                        </template>
                                        <MenuItem name="共享视频">视频</MenuItem>
                                        <MenuItem name="共享文档">文档</MenuItem>
                                        <MenuItem name="共享音乐">音乐</MenuItem>
                                        <MenuItem name="共享图片">图片</MenuItem>
                                    </Submenu>
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
                                  @doSearch="doSearch"
                                  v-show="showRubbish === 0"
                                  :userInfo="userInfo"
                                  @loadFile="loadFile"></file>
                            <rubbish v-show="showRubbish === 1"
                                     :tableData="deleteFiles"
                                     @changeRubbishPage="changeRubbishPage"
                                     :total="totalDelete"
                                     :pageSize="pageSize"
                                     @refreshRubbish="refreshRubbish"
                            ></rubbish>
                        </Content>
                    </Layout>
                </Content>
                <el-dialog v-if="userInfo !== null" :visible.sync="showPersonInfo" style="z-index: 9999">
                    <el-descriptions class="margin-top" title="个人信息" :column="1" border>
                        <el-descriptions-item :span="3">
                            <template slot="label" style="width: 50px">
                                <i class="el-icon-user"></i>
                                用户名
                            </template>
                            <span v-show="refactorUsername === false" style="margin-top: 10px">{{userInfo.username}}</span>
                            <div v-show="refactorUsername === true" style="display: inline;width: 450px">
                                <el-input
                                        type="text"
                                        v-model="userInfo.username"
                                        style="width: 360px"
                                ></el-input>
                                <button class="refactor" @click="refactorUser('name')">
                                    <i class="el-icon-check"/>
                                </button>
                                <button class="refactor" @click="refactorUsername = false">
                                    <i class="el-icon-close"/>
                                </button>
                            </div>
                            <div style="float: right;display: inline;">
                                <el-button type="primary" size="small"  @click="refactor('name')">修改</el-button>
                            </div>
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template slot="label">
                                <i class="el-icon-mobile-phone"></i>
                                手机号
                            </template>
                            <span v-show="refactorUserPhone === false" style="margin-top: 10px">{{userInfo.phone}}</span>
                            <div v-show="refactorUserPhone === true" style="display: inline;width: 450px">
                                <el-input
                                        type="text"
                                        v-model="userInfo.phone"
                                        style="width: 360px"
                                ></el-input>
                                <button class="refactor" @click="refactorUser('phone')">
                                    <i class="el-icon-check"/>
                                </button>
                                <button class="refactor" @click="refactorUserPhone = false">
                                    <i class="el-icon-close"/>
                                </button>
                            </div>
                            <div style="float: right;display: inline;">
                                <el-button type="primary" size="small"  @click="refactor('phone')">修改</el-button>
                            </div>
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template slot="label">
                                <i class="el-icon-location-outline"></i>
                                居住地
                            </template>
                            <span v-show="refactorUserCity === false" style="margin-top: 10px">{{userInfo.city}}</span>
                            <div v-show="refactorUserCity === true" style="display: inline;width: 450px">
                                <el-input
                                        type="text"
                                        v-model="userInfo.city"
                                        style="width: 360px"
                                ></el-input>
                                <button class="refactor" @click="refactorUser('city')">
                                    <i class="el-icon-check"/>
                                </button>
                                <button class="refactor" @click="refactorUserCity = false">
                                    <i class="el-icon-close"/>
                                </button>
                            </div>
                            <div style="float: right;display: inline;">
                                <el-button type="primary" size="small"  @click="refactor('city')">修改</el-button>
                            </div>
                        </el-descriptions-item>
<!--                        <el-descriptions-item>-->
<!--                            <template slot="label">-->
<!--                                <i class="el-icon-tickets"></i>-->
<!--                                备注-->
<!--                            </template>-->
<!--                            <el-tag size="small">学校</el-tag>-->
<!--                        </el-descriptions-item>-->
                        <el-descriptions-item>
                            <template slot="label">
                                <i class="el-icon-office-building"></i>
                                联系地址
                            </template>
                            <span v-show="refactorUserAddress === false" style="margin-top: 10px">{{userInfo.address}}</span>
                            <div v-show="refactorUserAddress === true" style="display: inline;width: 450px">
                                <el-input
                                        type="text"
                                        v-model="userInfo.address"
                                        style="width: 360px"
                                ></el-input>
                                <button class="refactor" @click="refactorUser('address')">
                                    <i class="el-icon-check"/>
                                </button>
                                <button class="refactor" @click="refactorUserAddress = false">
                                    <i class="el-icon-close"/>
                                </button>
                            </div>
                            <div style="float: right;display: inline;">
                                <el-button type="primary" size="small"  @click="refactor('address')">修改</el-button>
                            </div>
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template slot="label">
                                <i class="el-icon-office-building"></i>
                                性别
                            </template>

<!--                            {{userInfo.sex === 1? '男':'女'}}-->
                            <span v-show="refactorUserSex === false" style="margin-top: 10px">{{userInfo.sex === 1? '男':'女'}}</span>
                            <div v-show="refactorUserSex === true" style="display: inline;width: 450px">
                                <el-radio v-model="userInfo.sex" label=1>男</el-radio>
                                <el-radio v-model="userInfo.sex" label=2>女</el-radio>
                                <button class="refactor" @click="refactorUser('sex')">
                                    <i class="el-icon-check"/>
                                </button>
                                <button class="refactor" @click="refactorUserSex = false">
                                    <i class="el-icon-close"/>
                                </button>
                            </div>
                            <div style="float: right;display: inline;">
                                <el-button type="primary" size="small"  @click="refactor('sex')">修改</el-button>
                            </div>
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template slot="label">
                                <i class="el-icon-picture"></i>
                                头像
                            </template><!--                            <upload :avater="avater"></upload>-->
                            <el-upload
                                    class="avatar-uploader"
                                    action="string"
                                    :show-file-list="false"
                                    :http-request="uploadAvater">
                                <img style="height: 50px;width: 50px" :src="userInfo.avaterUrl" class="avatar">
                                <i class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
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
            <Footer class="layout-footer-center">edit by LuJunjie@2022</Footer>
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
    import upload from '../common/upload'

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
                avater: false,
                avaterUrl: '',
                typeName: null,
                fileList: [],
                pageSize: 5,
                chosenTempChat: null,
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
                refactorUsername: false,
                refactorUserPhone: false,
                refactorUserCity: false,
                refactorUserAddress: false,
                refactorUserSex: false,
                showRubbish: 0,
                deleteFiles: null,
                oldPassword: '',
                friendsData: null,
                totalDelete: 0,
                tempChats: null,
                tempChatsCount: 0,
                input: null,
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
            chat,
            upload
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
                this.avaterUrl = this.userInfo.avaterUrl
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
            refreshRubbish () {
                this.getDelete()
            },
            doSearch (pageNo, pageSize, input) {
                this.loadFile(pageNo, pageSize, input)
            },
            refactorUser (type) {
                this.post('/user/refactor', this.userInfo).then(res => {
                    this.refactor(type)
                    this.userInfo = res.data.data
                    localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
                })
            },
            refactor (type) {
                if (type === 'name') {
                    this.refactorUsername = !this.refactorUsername
                } else if (type === 'phone') {
                    this.refactorUserPhone = !this.refactorUserPhone
                } else if (type === 'city') {
                    this.refactorUserCity = !this.refactorUserCity
                } else if (type === 'address') {
                    this.refactorUserAddress = !this.refactorUserAddress
                } else if (type === 'sex') {
                    this.refactorUserSex = !this.refactorUserSex
                }
                console.log(this.refactorUsername)
            },
            clickTempChat (val) {
                console.log(val)
                this.chosenTempChat = val
                this.toChat()
                this.get('/chatRecord/deleteTempChat', {
                    'id': val.id,
                    'userId': this.userInfo.id
                }).then(res => {
                    this.tempChats.splice(this.tempChats.indexOf(val), 1)
                    this.tempChatsCount--
                })
            },
            async uploadAvater (val) {
                console.log(val)
                let formData = new FormData()
                formData.append('file', val.file)
                formData.append('userId', this.userInfo.id)
                formData.append('targetFilePath', 'C:\\Users\\user\\Videos\\Captures')
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
                await this.post('/file/uploadAvater', formData, config).then(res => {
                    this.userInfo.avaterUrl = res.data.data.url
                    this.userInfo.avaterId = res.data.data.id
                    this.userInfo.avaterType = res.data.data.typeName
                    localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
                })
                // this.$emit('refreshData')
            },
            personInfo () {
                this.showPersonInfo = true
                this.avater = true
            },
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
                console.log(conversations)
                this.conversations = conversations.data.data
            },
            async doLogout () {
                this.get('/user/logout', {
                    'id': this.userInfo.id
                }).then(res => {
                    this.$message.success('退出成功')
                    localStorage.removeItem('userInfo')
                    localStorage.removeItem('token')
                    this.userInfo = null
                    this.websocketclose()
                    if (this.ischat === 1) {
                        this.ischat = 0
                    }
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
                if (e.data === '您有新的分享文件') {
                    this.$message.info(e.data)
                    return
                }
                let data = await JSON.parse(e.data)
                if (data && data.tempChat) {
                    this.tempChats = await data.tempChat
                    this.$message.info('您有未读聊天!')
                    this.tempChatsCount = this.tempChats.length
                    console.log(this.tempChats)
                    if (this.tempChats.length > 0) {
                        this.tempChats.forEach(item => {
                            item.createdDate = this.$moment(item.createdDate).format('YYYY-MM-DD HH:mm:ss')
                            item.modifiedDate = this.$moment(item.modifiedDate).format('YYYY-MM-DD HH:mm:ss')
                        })
                    }
                }
                console.log(data)
                if (data.newChatRecord !== null && data.newChatRecord !== undefined) {
                    this.newChatRecord = data.newChatRecord
                }
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
                        this.isUpdatePass = false
                        setTimeout(() => {
                            this.get('/user/logout', {
                                'id': this.userInfo.id
                            }).then(res => {
                                this.$message.info('请重新登录')
                                localStorage.removeItem('userInfo')
                                localStorage.removeItem('token')
                                this.userInfo = null
                                this.websocketclose()
                                this.$router.push('/login')
                            })
                        }, 1000)
                    })
                } else {
                    this.$message.error('两次输入的密码不一致')
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
                let isShare = 0
                console.log(e)
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
                case '共享视频':
                    this.typeCode = 1
                    isShare = 1
                    break
                case '共享文档':
                    this.typeCode = 2
                    isShare = 1
                    break
                case '共享音乐':
                    this.typeCode = 3
                    isShare = 1
                    break
                case '共享图片':
                    this.typeCode = 4
                    isShare = 1
                    break
                }
                if (isShare === 0) {
                    this.loadFile()
                } else {
                    this.loadSharedFile()
                }
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
            loadFile (pageNo, pageSize, input) {
                if (pageNo !== null && pageNo !== undefined) {
                    this.pageNo = pageNo
                }
                console.log(pageSize)
                if (pageSize !== null && pageSize !== undefined) {
                    this.pageSize = pageSize
                }
                let params = {}
                params.pageSize = this.pageSize
                params.pageNo = this.pageNo
                params.typeCode = this.typeCode
                if (input !== null || input !== undefined) {
                    params.input = input
                } else {
                    params.input = null
                }
                console.log(params)
                this.post('/file/getPage', {
                    'pageSize': params.pageSize,
                    'pageNo': params.pageNo,
                    'typeCode': params.typeCode,
                    'input': params.input
                }).then((res) => {
                    console.log(res)
                    this.fileList = res.data.files
                    this.fileList.forEach(item => {
                        item.createdDate = this.$moment(item.createdDate).format('YYYY-MM-DD HH:mm:ss')
                        item.modifiedDate = this.$moment(item.modifiedDate).format('YYYY-MM-DD HH:mm:ss')
                    })
                    this.totalFiles = res.data.total
                })
            },
            loadSharedFile (pageNo, pageSize, input) {
                if (pageNo !== null && pageNo !== undefined) {
                    this.pageNo = pageNo
                }
                console.log(pageSize)
                if (pageSize !== null && pageSize !== undefined) {
                    this.pageSize = pageSize
                }
                let params = {}
                params.pageSize = this.pageSize
                params.pageNo = this.pageNo
                params.typeCode = this.typeCode
                if (input !== null || input !== undefined) {
                    params.input = input
                } else {
                    params.input = null
                }
                console.log(params)
                this.post('/file/getShareFiles', {
                    'pageSize': params.pageSize,
                    'pageNo': params.pageNo,
                    'typeCode': params.typeCode,
                    'input': params.input
                }).then((res) => {
                    console.log(res)
                    this.fileList = res.data.data.sharedFiles
                    this.fileList.forEach(item => {
                        item.createdDate = this.$moment(item.createdDate).format('YYYY-MM-DD HH:mm:ss')
                        item.modifiedDate = this.$moment(item.modifiedDate).format('YYYY-MM-DD HH:mm:ss')
                    })
                    this.totalFiles = res.data.total
                    console.log(this.fileList)
                })
            }
        }
    }
</script>
