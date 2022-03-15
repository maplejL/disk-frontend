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
                                              @click.native="isUpdatePass = true">修改密码
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
                        <span style="width: 50%;color: white;" v-show="tempChatsCount === 0">聊天</span>
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

<style>

</style>

<script>
    export default {
        name: 'header',
        data () {
            return {

            }
        },
        methods: {
            home () {
                this.ischat = 0
            }
        }
    }
</script>
