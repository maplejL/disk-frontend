<!--                                <Submenu v-for="(item, i) in menu" v-bind:key="i" :name="item.name">-->
<!--                                    <template slot="title">-->
<!--                                        <Icon :type="item.icon"></Icon>-->
<!--                                        {{ item.name }}-->
<!--                                    </template>-->
<!--                                    <MenuItem v-for="(group, i) in item.groups" v-bind:key="i">-->
<!--                                        {{group.name}}-->
<!--&lt;!&ndash;                                        <template slot="title">&ndash;&gt;-->
<!--&lt;!&ndash;                                                                                    <Icon :type="group.icon"></Icon>&ndash;&gt;-->
<!--&lt;!&ndash;                                            {{ group.name }}&ndash;&gt;-->
<!--&lt;!&ndash;                                        </template>&ndash;&gt;-->
<!--&lt;!&ndash;                                        <MenuItem :name="group.name">&ndash;&gt;-->

<!--&lt;!&ndash;                                        </MenuItem>&ndash;&gt;-->
<!--                                    </MenuItem>-->
<!--                                </Submenu>-->
<template>
    <div class="layout">
        <Layout>
            <Header>
                <Menu mode="horizontal" theme="dark" active-name="1">
                    <div class="layout-logo"></div>
                    <div class="layout-nav">
                        <MenuItem name="1">
                            <Icon type="ios-navigate"></Icon>
                            Item 1
                        </MenuItem>
                        <MenuItem name="2">
                            <Icon type="ios-keypad"></Icon>
                            Item 2
                        </MenuItem>
                        <MenuItem name="3">
                            <Icon type="ios-analytics"></Icon>
                            Item 3
                        </MenuItem>
                        <MenuItem name="4">
                            <Icon type="ios-paper"></Icon>
                            Item 4
                        </MenuItem>
                    </div>
                </Menu>
            </Header>
            <Layout :style="{padding: '0 20px'}">
                <Breadcrumb :style="{margin: '16px 0'}">
                    <BreadcrumbItem>Home</BreadcrumbItem>
                    <BreadcrumbItem>Components</BreadcrumbItem>
                    <BreadcrumbItem>Layout</BreadcrumbItem>
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
                            <photo v-if="typeName === '图片'" :pictureList="pictureList"></photo>
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
    import photo from '../photo/index'

    export default {
        name: 'homePage',
        data () {
            return {
                name: '',
                menu: [
                    {
                        name: '我的文件',
                        icon: 'ios-navigate',
                        groups: [
                            {
                                name: '文档'
                            },
                            {
                                name: '视频'
                            },
                            {
                                name: '音乐'
                            },
                            {
                                name: '图片'
                            }
                        ]
                    }
                ],
                breadcrumb: ['主页'],
                typeName: null,
                pictureList: [],
                pageSize: 5,
                pageNo: 0
            }
        },
        components: {
            photo
        },
        created () {
            this.$nextTick(() => {
                if (this.$route.query.typeName) {
                    this.typeName = this.$route.query.typeName
                    this.$refs.typeName.updateActiveName()
                }
            })
            this.loadFile()
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
            showName (name) {
                console.log(name)
            },
            changeType (e) {
                this.$route.query.typeName = e
                this.typeName = e
            },
            parentTag (e) {
                console.log(e[0])
            },
            loadFile () {
                this.axios.get('/file/getPage', {
                    params: {
                        pageSize: this.pageSize,
                        pageNo: this.pageNo
                    }
                }).then(res => {
                    this.pictureList = res.data
                    this.pictureList.forEach(item => {
                        item.createdDate = this.$moment(item.createdDate).format('YYYY-MM-DD HH:mm:ss')
                    })
                }).catch(error => {
                    console.log(error)
                })
            }
        }
    }
</script>
