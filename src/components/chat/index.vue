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
                        <tr style="height: 50px;border-bottom: 1px solid black" v-for="(item, index) in contentData" :key="index">
                            <td width="50px">
                                <img src="static/image/img.png" style="width: 45px;height: 45px;margin: 5px;float: left">
                            </td>
                            <td style="position: relative;width: 250px">
                                <span style="position: absolute;top: 0px;font-size: 16px;left: 10px" @click="chooseUser(index)">{{item.username}}</span>
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
                        <tr><td style="height: 60px">
                            <img src="static/image/img.png" style="height: 50px">
                        </td></tr>
                        <tr><td>
                            <img src="static/image/img.png">
                        </td></tr>
                    </table>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: 'chat',
        props: ['userInfo', 'contentData'],
        data () {
            return {
                color1: false,
                color2: false,
                chosenUser: null
            }
        },
        methods: {
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
            }
        }
    }
</script>

<style lang="less">
    .chat {
        background-color: #e9eef3;
    }
    .el-main {
        color: #333;
        text-align: center;
        line-height: 700px;
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
    .info div{
        height: 80px;
        border: 1px solid;
    }
</style>
