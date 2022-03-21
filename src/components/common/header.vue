<template>
    <Header style="margin-bottom: 20px">
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
                            <el-dropdown-item icon="el-icon-circle-plus" @click.native="personInfo">
                                个人信息
                            </el-dropdown-item>
                            <el-dropdown-item icon="el-icon-circle-plus-outline"
                                              @click.native="updatePass">修改密码
                            </el-dropdown-item>
                            <el-dropdown-item icon="el-icon-check" @click.native="doLogout">退出登录
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </MenuItem>
                <!--                        <MenuItem name="2">-->
                <!--                            <Icon type="ios-keypad"></Icon>-->
                <!--                            item 2-->
                <!--                        </MenuItem>-->
                <MenuItem name="3" @click.native="toChat">
                    <el-badge :value="tempChatsCount" class="item">
                        <span style="width: 100px;color: white;" v-show="tempChatsCount === 0">聊天</span>
                        <el-dropdown trigger="hover" v-show="tempChatsCount !== 0">
                                    <span class="el-dropdown-link" style="color: white">
                                    聊天<i class="el-icon-arrow-down el-icon--right"></i>
                                  </span>
                            <el-dropdown-menu slot="dropdown"
                                              divided="true"
                                              style="width: 300px; position:relative; left: 100px;height: 600px;overflow-y: auto"
                            >
                                <el-dropdown-item v-for="(item, index) in tempChats" :key="index" @click.native="clickTempChat(item)">
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
</template>

<style scoped>
    .layout {
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        height: 100%;
    }

    .layout-logo {
        width: 100px;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 15px;
        left: 20px;
    }

    .layout-nav {
        width: 300px;
        margin: 0 auto;
        margin-right: 20px;
    }

    .layout-footer-center {
        margin-top: -10px;
        text-align: center;
    }

    #menu {
        height: 700px;
    }

    #breadcrumb {
        margin: 16px 0px;
        float: left;
    }

    .el-divider--horizontal {
        margin: 0px 0;
        background-color: black;
        height: 1px;
    }

    .el-descriptions-item__cell el-descriptions-item__label is-bordered-label {
        width: 100px;
    }
    .item {
    }
    /deep/ .item sup{
        position: relative;
    }

    .refactor {
        width: 38px;
        height: 38px;
        background-color: white;
        border: 0px;
        cursor: pointer;
    }

</style>

<script>
    export default {
        name: 'pageHead',
        props: ['userInfo', 'tempChatsCount', 'tempChats'],
        data () {
            return {
            }
        },
        methods: {
            updatePass () {
                this.$emit('updatePass')
            },
            home () {
                this.$emit('home')
            },
            doLogin () {
                this.$router.push({
                    name: 'login'
                })
            },
            personInfo () {
                this.$emit('personInfo')
            },
            doLogout () {
                this.$emit('doLogout')
            },
            toChat () {
                this.$emit('toChat')
            },
            clickTempChat (item) {
                this.$emit('clickTempChat', item)
            }
        }
    }
</script>
