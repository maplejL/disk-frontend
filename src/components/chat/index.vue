<template>
    <div class="chat">
        <el-container style="width: 70%;margin: auto;height: 700px;margin-top: 10px;margin-bottom: 10px">
            <el-aside style="background-color: white">
                <div style="height: 60px">
                    <ul>
                        <li class="chatUl" @click="session" :class="{changeColor:color1==true}">会话</li>
                        <li class="chatUl" @click="friends" :class="{changeColor:color2==true}">好友</li>
                    </ul>
                </div>
                <div class="left-content">
                    <table v-if="contentData !== null && color1 === false">
                        <tr style="height: 50px;border-bottom: 1px solid black" v-for="(item, index) in contentData"
                            :key="index"
                            @contextmenu.prevent="onContextmenu(item)">
                            <td width="50px">
                                <img src="static/image/img.png"
                                     style="width: 45px;height: 45px;margin: 5px;float: left">
                            </td>
                            <td style="position: relative;width: 250px">
                                <span style="position: absolute;top: 0px;font-size: 16px;left: 10px"
                                      @click="chooseUser(index)">{{item.username}}</span>
                                <span style="position: absolute;top: 0px;right: 0px; font-size: 16px">1237777</span>
                            </td>
                        </tr>
                    </table>
                    <table v-if="conversations !== null && color2 === false">
                        <tr style="height: 50px;border-bottom: 1px solid black" v-for="(item, index) in conversations"
                            :key="index"
                            @contextmenu.prevent="onContextmenu(item)">
                            <td width="50px">
                                <img src="static/image/img.png"
                                     style="width: 45px;height: 45px;margin: 5px;float: left">
                            </td>
                            <td style="position: relative;width: 250px;">
                                <span style="position: absolute;top: 0px;font-size: 16px;left: 10px;"
                                      @click="showChat(index)">{{item.conversationName}}</span>
                                <span style="position: absolute;top: 0px;right: 0px; font-size: 16px">1237777</span>
                            </td>
                        </tr>
                    </table>
                    <el-empty v-else :description="color1 === true? '暂无会话': '暂无好友'"></el-empty>
                    <!--                    <ul v-for="(item, index) in contentData" :key="index">-->
                    <!--                        <li class="contentUl">-->
                    <!--                            <div style="width: 50px;height: 50px">-->
                    <!--                                <img src="static/image/img.png" style="width: 45px;height: 45px;margin: 10px;float: left">-->
                    <!--                            </div>-->
                    <!--                            <div style="width: 250px;height: 50px">-->
                    <!--                                <span>{{item.name}}</span>-->
                    <!--                            </div>-->
                    <!--                        </li>-->
                    <!--                    </ul>-->
                </div>
                <div class="left-footer">
                    123
                </div>
            </el-aside>
            <el-main style="margin-left: 20px; background-color: white">
                <div class="main-user-info" v-if="chosenUser!== null">
                    <!--                    <img src="static/image/img.png" style="width: 110px;height: 110px">-->
                    <!--                    {chosenUser.username}}-->
                    <!--                    <el-divider></el-divider>-->
                    <table>
                        <tr>
                            <td style="height: 60px">
                                <img src="static/image/img.png" style="height: 50px">
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <img src="static/image/img.png">
                            </td>
                        </tr>
                    </table>
                </div>
                <div v-if="isChat === true" style="height: 100%;position:relative;background-color: #FFF">
                    <div style="height: 50px;">
                        <span style="position: fixed;top: 100px;font-size: x-large">{{chosenConversation.conversationName}}</span>
                    </div>
                    <div style="height: 550px;border: 1px solid;overflow-x: hidden;overflow-y: auto">
                        <!--                        <ul class="infinite-list" v-infinite-scroll="load" style="overflow:auto">-->
                        <!--                            <li v-for="(item, index) in chatRecords" :key="index" class="infinite-list-item">-->
                        <!--                                <chatRecord :showLeft="item.showLeft"-->
                        <!--                                            :record="item"-->
                        <!--                                            :key="index" :class="{selfStyle: item.showLeft === false}">-->
                        <!--                                </chatRecord>-->
                        <!--                            </li>-->
                        <!--                        </ul>-->
                        <ul id="chatRecords" class="infinite-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy"
                            infinite-scroll-distance="10">
                            <li v-for="(item, index) in chatRecords" :key="index" class="infinite-list-item">
                                <chatRecord :showLeft="item.showLeft"
                                            :record="item"
                                            :key="index" :class="{selfStyle: item.showLeft === false}">
                                </chatRecord>
                            </li>
                        </ul>
                        <!--                        <span v-for="(item, index) in chatRecords" :key="index"-->
                        <!--                              :class="{selfStyle: item.sendUser === userInfo.id}">-->
                        <!--                            {{item.content}}-->
                        <!--                        </span>-->
                        <br/>
                    </div>
                    <div style="border: 1px solid;height: 50px;margin: 0px;position:absolute;bottom: 0px;width: 100%">
                        <div>
                            <el-button type="primary" size="middle" style="float: left"> 分享文件</el-button>
                            <el-input style="float: left;width: 700px;margin-left: 20px"
                                      v-model="chatMessage" placeholder="请输入聊天内容">
                                <template slot="append">
                                    <el-button type="primary" size="middle" @click="sendMessage">发送</el-button>
                                </template>
                            </el-input>
                        </div>

                    </div>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import chatRecord from '../common/chatRecord'

    export default {
        name: 'chat',
        props: ['userInfo', 'contentData', 'conversations', 'newChatRecord'],
        data () {
            return {
                color1: false,
                color2: false,
                busy: false,
                chosenUser: null,
                chosenConversation: null,
                isChat: false,
                chatRecords: null,
                isSelf: null,
                showLeft: true,
                chatMessage: ''
            }
        },
        components: {
            chatRecord
        },
        mounted () {
        },
        watch: {
            newChatRecord: {
                handler (newV, oldV) {
                    console.log(newV, oldV)
                    if (newV === undefined && (oldV === undefined || oldV === null)) {
                        return false
                    } else if (((oldV === null || oldV === undefined) && newV) || newV[0] !== oldV[0]) {
                        this.dealNewChatRecord(newV)
                    }
                },
                deep: true
            }
        },
        methods: {
            dealNewChatRecord (newV) {
                let item = newV[0]
                item.createdDate = this.$moment(item.createdDate).format('YYYY-MM-DD HH:mm:ss')
                item.modifiedDate = this.$moment(item.modifiedDate).format('YYYY-MM-DD HH:mm:ss')
                if (item.sendUser === this.userInfo.id) {
                    item.showLeft = false
                } else {
                    item.showLeft = true
                }
                this.chatRecords.push(item)
            },
            loadMore () {
                this.busy = true
                setTimeout(() => {
                    // for (var i = 0, j = 10; i < j; i++) {
                    //     this.data.push({name: this.count++ })
                    // }
                    this.busy = false
                }, 1000)
            },
            async sendMessage () {
                let body = []
                body.push(this.userInfo)
                body.push(this.chatMessage)
                let res = await this.post('/chatRecord/send', {
                    'userId': this.userInfo.id,
                    'conversationId': this.chosenConversation.id,
                    'content': this.chatMessage
                })
                console.log(res)
                this.chatMessage = ''
            },
            scrollToBottom: function () {
                this.$nextTick(() => {
                    var div = document.getElementById('chatRecords')
                    console.log(div.scrollHeight)
                    div.scrollTop = div.scrollHeight
                })
            },
            test (item) {
                console.log(item)
            },
            onContextmenu (item) {
                this.$contextmenu({
                    items: [
                        {
                            label: '发起聊天',
                            onClick: () => {
                                this.session()
                                let userIds = []
                                let conversationName = '' + this.userInfo.username + ',' + item.username
                                userIds.push(this.userInfo.id)
                                userIds.push(item.id)
                                this.post('/conversation/addConversation', {
                                    userIds,
                                    conversationName
                                }).then(res => {
                                    console.log(res)
                                })
                            }
                        }
                        //     {
                        //         label: '返回(B)',
                        //         onClick: () => {
                        //             this.message = '返回(B)'
                        //             console.log('返回(B)')
                        //         },
                        //         disabled: true
                        //     },
                        //     { label: '前进(F)', disabled: true },
                        //     { label: '重新加载(R)', divided: true, icon: 'el-icon-refresh' },
                        //     { label: '投射(C)...', divided: true },
                        //     {
                        //         label: '截取网页(R)',
                        //         minWidth: 0,
                        //         children: [
                        //             {
                        //                 label: '截取可视化区域',
                        //                 onClick: () => {
                        //                     this.message = '截取可视化区域'
                        //                     console.log('截取可视化区域')
                        //                 }
                        //             },
                        //             { label: '截取全屏' }
                        //         ]
                        //     }
                    ],
                    event,
                    customClass: 'class-a',
                    zIndex: 3,
                    minWidth: 230
                })
                return false
            },
            session () {
                this.color2 = false
                this.color1 = true
            },
            async friends () {
                this.color1 = false
                this.color2 = true
            },
            chooseUser (index) {
                this.chosenUser = this.contentData[index]
            },
            async showChat (index) {
                this.chosenUser = null
                this.isChat = true
                this.chosenConversation = this.conversations[index]
                let res = await this.get('/chatRecord/getChatRecord', {
                    'id': this.chosenConversation.id
                })
                this.chatRecords = res.data.data
                this.chatRecords.forEach(item => {
                    item.createdDate = this.$moment(item.createdDate).format('YYYY-MM-DD HH:mm:ss')
                    item.modifiedDate = this.$moment(item.modifiedDate).format('YYYY-MM-DD HH:mm:ss')
                    if (item.sendUser === this.userInfo.id) {
                        item.showLeft = false
                    } else {
                        item.showLeft = true
                    }
                })
                console.log(this.chatRecords)
                this.scrollToBottom()
            }
        }
    }
</script>

<style scoped lang="less">
    .chat {
        background-color: #e9eef3;
    }

    .el-main {
        color: #333;
        text-align: center;
        /*line-height: 700px;*/
        overflow: unset;
    }

    body > .el-container {
        margin-bottom: 40px;
    }

    .el-tab-pane {
        width: 150px;
        text-align: center;
    }

    .chatUl {
        float: left;
        width: 150px;
        list-style: none;
        text-align: center;
        font-size: 16px;
        border-bottom: 1px solid #d2d8e0;
        border-right: 1px solid #d2d8e0;
        height: 50px;
        padding-top: 10px;
        cursor: pointer;
    }

    .contentUl {
        list-style: none;
    }

    .changeColor {
        color: #09AAFF;
    }

    .left-content {
        height: 80%;
        border-bottom: 1px solid black;
    }

    .left-footer {
        height: 10%;
        border-bottom: 1px solid black;
    }

    .main-user-info {
        width: 60%;
        height: 100%;
        border: 1px solid;
        position: relative;
    }

    .main-user-info ul {
        list-style: none;
        color: black;
    }

    .main-user-info li {
        height: 50px;
    }

    .info {
        width: 100%;
        border: 1px solid;
    }

    .info div {
        height: 80px;
        border: 1px solid;
    }

    .context-menu {
        .ctx-menu {
            min-width: 65px;
            font-size: 14px;

            li {
                padding: 5px 14px;
                text-align: center;
                cursor: pointer;

                &:hover {
                    background-color: #409eff;
                }
            }
        }
    }

    .selfStyle {
        width: 250px;
        color: red;
        position: relative;
        left: 580px;
    }

    .otherStyle {
        float: left;
    }
</style>
