<template>
    <div id="login">
        <div id="bgd">
            <canvas
                    id='myCanvas'
                    :width='width'
                    :height='height'
            >
            </canvas>
        </div>
        <div v-if="showLogin === 1" id="loginBox">
            <h2>登录</h2>
            <el-form
                    :model="loginForm"
                    :rules="loginRules"
                    ref="loginForm"
                    label-width="0px"
            >
                <el-form-item
                        label=""
                        prop="username"
                        style="margin-top:40px;"
                >
                    <el-row>
                        <el-col :span='4'>
                            <span class="iconfont">用户名:</span>
                        </el-col>
                        <el-col :span='19'>
                            <el-input
                                    class="inps"
                                    placeholder='用户名'
                                    v-model="loginForm.username"
                            ></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item
                        label=""
                        prop="password"
                >
                    <el-row>
                        <el-col :span='4'>
                            <span class="iconfont">密码:</span>
                        </el-col>
                        <el-col :span='18'>
                            <el-input
                                    type="password"
                                    class="inps"
                                    placeholder='密码'
                                    v-model="loginForm.password"
                            ></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item style="margin-left:50px;">
                    <el-button
                            type="primary"
                            round
                            class="submitBtn"
                            @click="submitForm"
                    >登录
                    </el-button>
                </el-form-item>
                <el-form-item style="margin-left:50px;">
                    <el-button
                            type="primary"
                            round
                            class="registerButton"
                            @click="changeView"
                    >注册
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div v-else id="registerBox">
            <h3>注册</h3>
            <el-form
                    :model="registerForm"
                    :rules="ruleValidate"
                    ref="registerForm"
                    label-width="0px"
            >
                <el-form-item
                        label=""
                        prop="username"
                        style="margin-top:40px;"
                >
                    <el-row>
                        <el-col :span='4'>
                            <span class="iconfont">用户名:</span>
                        </el-col>
                        <el-col :span='19'>
                            <el-input
                                    class="inps"
                                    placeholder='用户名'
                                    v-model="registerForm.username"
                            ></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item
                        label=""
                        prop="password"
                >
                    <el-row>
                        <el-col :span='4'>
                            <span class="iconfont">密码:</span>
                        </el-col>
                        <el-col :span='19'>
                            <el-input
                                    type="password"
                                    class="inps"
                                    placeholder='密码'
                                    v-model="registerForm.password"
                            ></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item
                        label=""
                        prop="email"
                        style="margin-top:20px;"
                >
                    <el-row>
                        <el-col :span='4'>
                            <span class="iconfont">邮箱:</span>
                        </el-col>
                        <el-col :span='19'>
                            <el-input
                                    class="inps"
                                    placeholder='请输入邮箱'
                                    v-model="registerForm.email"
                            ></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item
                        label=""
                        prop="city"
                        style="margin-top:20px;"
                >
                    <el-row>
                        <el-col :span='4'>
                            <span class="iconfont">城市:</span>
                        </el-col>
                        <el-col :span='19'>
                            <el-input
                                    class="inps"
                                    placeholder='请输入城市'
                                    v-model="registerForm.city"
                            ></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item
                        label=""
                        prop="sex"
                        style="margin-top:20px;"
                >
                    <el-row>
                        <el-col :span='4'>
                            <span class="iconfont">性别:</span>
                        </el-col>
                        <el-col :span='19'>
                            <el-input
                                    class="inps"
                                    placeholder='默认性别为男'
                                    v-model="registerForm.sex"
                            ></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item style="margin-left: 60px;">
                    <el-button
                            type="primary"
                            round
                            class="submitBtn"
                            @click="cancelRegister"
                    >取消
                    </el-button>
                </el-form-item>
                <el-form-item style="margin-left: 60px;">
                    <el-button
                            type="primary"
                            round
                            class="registerButton"
                            @click="doRegister"
                    >提交
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import JSEncrypt from 'jsencrypt'
    import {MessageBox} from 'element-ui'

    export default {
        data () {
            return {
                canvas: null,
                context: null,
                stars: [], // 星星数组
                showLogin: 1,
                publicKey: '',
                registerForm: {
                    username: '',
                    password: '',
                    email: '',
                    city: '',
                    sex: ''
                },
                ruleValidate: {
                    username: [
                        {required: true, message: '姓名不能为空', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'blur'}
                    ]
                },
                shadowColorList: [
                    '#39f',
                    '#ec5707',
                    '#b031d4',
                    '#22e6c7',
                    '#92d819',
                    '#14d7f1',
                    '#e23c66'
                ], // 阴影颜色列表
                directionList: ['leftTop', 'leftBottom', 'rightTop', 'rightBottom'], // 星星运行方向
                speed: 50, // 星星运行速度
                last_star_created_time: new Date(), // 上次重绘星星时间
                Ball: class Ball {
                    constructor (radius) {
                        this.x = 0
                        this.y = 0
                        this.radius = radius
                        this.color = ''
                        this.shadowColor = ''
                        this.direction = ''
                    }

                    draw (context) {
                        context.save()
                        context.translate(this.x, this.y)
                        context.lineWidth = this.lineWidth
                        var myGradient = context.createLinearGradient(0, 0, 0, 8)
                        myGradient.addColorStop(0, this.color)
                        myGradient.addColorStop(1, this.shadowColor)
                        context.fillStyle = myGradient
                        context.beginPath()
                        context.arc(0, 0, this.radius, 0, Math.PI * 2, true)
                        context.closePath()

                        context.shadowColor = this.shadowColor
                        context.shadowOffsetX = 0
                        context.shadowOffsetY = 0
                        context.shadowBlur = 10

                        context.fill()
                        context.restore()
                    }
                }, // 工厂模式定义Ball类
                width: window.innerWidth,
                height: window.innerHeight,
                result1: null,
                loginForm: {
                    username: '',
                    password: '',
                    email: '',
                    city: '',
                    sex: ''
                },
                loginRules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [{required: true, message: '请输入密码', trigger: 'blur'}],
                    email: [
                        {required: true, message: '邮箱不能为空', trigger: 'blur'},
                        {type: 'email', message: '邮箱格式不正确', trigger: 'blur'}
                    ],
                    city: [
                        {required: true, message: '请选择城市', trigger: 'change'}
                    ],
                    sex: [
                        {required: true, message: '请选择性别', trigger: 'change'}
                    ]
                    // sex: [
                    //     { required: true, message: '请选择性别', trigger: 'change' }
                    // ]
                }
            }
        },
        mounted () {
            this.canvas = document.getElementById('myCanvas')
            this.context = this.canvas.getContext('2d')

            this.createStar(true)
            this.drawFrame()
            this.get('/user/getPublicKey').then(res => {
                global.setPublicKey(res.data.data.publicKey)
            })
            // window.addEventListener('keydown', this.keyDown)
        },
        methods: {
            // keyDown (e) {
            //     console.log(e)
            //     console.log(this.loginForm)
            //     // 如果是回车则执行登录方法
            //     if (e.keyCode === 13) {
            //         console.log('111')
            //         this.submitForm()
            //     }
            // },
            changeView () {
                this.showLogin = 0
            },
            doRegister () {
                let encryptor = new JSEncrypt()
                encryptor.setPublicKey(this.global.publicKey)
                this.registerForm.password = encryptor.encrypt(this.registerForm.password)
                this.post('/user/register', this.registerForm).then(res => {
                    this.$message.success('注册成功,请登录')
                    this.showLogin = 1
                })
            },
            cancelRegister () {
                this.showLogin = 1
            },
            // 提交登录
            async submitForm () {
                let encryptor = new JSEncrypt()
                encryptor.setPublicKey(this.global.publicKey)
                this.loginForm.password = encryptor.encrypt(this.loginForm.password)
                // let res = await this.post('/user/login', this.loginForm)
                this.post('/user/login', this.loginForm).then(res => {
                    // window.removeEventListener('keydown', this.keyDown, false)
                }).catch(error => {
                    if (error.response.data.status === 444) {
                        setTimeout(() => {
                            MessageBox({
                                title: '提示:',
                                message: '是否继续登录',
                                showCancelButton: true,
                                confirmButtonText: '确定',
                                cancelButtonText: '取消'
                            }).then(action => {
                                this.$message({
                                    message: '正在登陆'
                                })
                                this.loginForm.stillLogin = true
                                this.post('/user/login', this.loginForm)
                            })
                        }, 1000)
                    }
                })
            },
            initWebSocket () {
                let userInfo = JSON.parse(localStorage.getItem('userInfo'))
                console.log(userInfo)
                // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
                this.websock = new WebSocket('ws://localhost:9999/websocket/' + userInfo.id)
                this.websock.onopen = this.websocketonopen
                this.websock.onerror = this.websocketonerror
                this.websock.onmessage = this.websocketonmessage
                this.websock.onclose = this.websocketclose
            },
            websocketonopen () {
                console.log('WebSocket连接成功')
            },
            websocketonerror (e) {
                console.log('WebSocket连接发生错误')
            },
            async websocketonmessage (e) {
                console.log(e)
            },
            websocketclose (e) {
                console.log('connection closed')
            },
            // 重复动画
            drawFrame () {
                // eslint-disable-next-line no-unused-vars
                let animation = requestAnimationFrame(this.drawFrame)
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
                this.createStar(false)
                this.stars.forEach(this.moveStar)
            },
            // 展示所有的星星
            createStar (params) {
                let now = new Date()
                if (params) {
                    // 初始化星星
                    for (var i = 0; i < 50; i++) {
                        const radius = Math.random() * 3 + 2
                        let star = new this.Ball(radius)
                        star.x = Math.random() * this.canvas.width + 1
                        star.y = Math.random() * this.canvas.height + 1
                        star.color = '#ffffff'
                        // eslint-disable-next-line standard/computed-property-even-spacing
                        star.shadowColor = this.shadowColorList[
                            Math.floor(Math.random() * this.shadowColorList.length)
                        ]
                        // eslint-disable-next-line standard/computed-property-even-spacing
                        star.direction = this.directionList[
                            Math.floor(Math.random() * this.directionList.length)
                        ]
                        this.stars.push(star)
                    }
                } else if (!params && now - this.last_star_created_time > 3000) {
                    // 每隔3秒重绘修改颜色其中30个球阴影颜色
                    for (var J = 0; J < 30; J++) {
                        // eslint-disable-next-line standard/computed-property-even-spacing
                        this.stars[J].shadowColor = this.shadowColorList[
                            Math.floor(Math.random() * this.shadowColorList.length)
                        ]
                    }
                    this.last_star_created_time = now
                }
            },
            // 移动
            moveStar (star, index) {
                if (star.y - this.canvas.height > 0) {
                    // 触底
                    if (Math.floor(Math.random() * 2) === 1) {
                        star.direction = 'leftTop'
                    } else {
                        star.direction = 'rightTop'
                    }
                } else if (star.y < 2) {
                    // 触顶
                    if (Math.floor(Math.random() * 2) === 1) {
                        star.direction = 'rightBottom'
                    } else {
                        star.direction = 'leftBottom'
                    }
                } else if (star.x < 2) {
                    // 左边
                    if (Math.floor(Math.random() * 2) === 1) {
                        star.direction = 'rightTop'
                    } else {
                        star.direction = 'rightBottom'
                    }
                } else if (star.x - this.canvas.width > 0) {
                    // 右边
                    if (Math.floor(Math.random() * 2) === 1) {
                        star.direction = 'leftBottom'
                    } else {
                        star.direction = 'leftTop'
                    }
                }
                if (star.direction === 'leftTop') {
                    star.y -= star.radius / this.speed
                    star.x -= star.radius / this.speed
                } else if (star.direction === 'rightBottom') {
                    star.y += star.radius / this.speed
                    star.x += star.radius / this.speed
                } else if (star.direction === 'leftBottom') {
                    star.y += star.radius / this.speed
                    star.x -= star.radius / this.speed
                } else if (star.direction === 'rightTop') {
                    star.y -= star.radius / this.speed
                    star.x += star.radius / this.speed
                }
                star.draw(this.context)
            }
        }
    }
</script>

<style lang='less' scoped>
    #login {
        width: 100vw;
        padding: 0;
        margin: 0;
        height: 100vh;
        font-size: 16px;
        background-repeat: no-repeat;
        background-position: left top;
        background-color: #242645;
        color: #fff;
        font-family: "Source Sans Pro";
        background-size: 100%;
        background-image: url("../../../static/image/Starry.png");
        position: relative;

        #bgd {
            height: 100vh;
            width: 100vw;
            overflow: hidden;
        }

        #loginBox {
            width: 380px;
            height: 400px;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            padding: 50px 40px 40px 40px;
            box-shadow: -15px 15px 15px rgba(6, 17, 47, 0.7);
            opacity: 1;
            background: linear-gradient(230deg,
            rgba(53, 57, 74, 0) 0%,
            rgb(0, 0, 0) 100%);

            /deep/ .inps input {
                border: none;
                color: #fff;
                background-color: transparent;
                font-size: 12px;
            }

            .submitBtn {
                background-color: transparent;
                color: #39f;
                width: 200px;
            }

            .registerButton {
                background-color: transparent;
                color: white;
                width: 200px;
            }

            .iconfont {
                text-align: center;
                color: #fff;
            }
        }

        #registerBox {
            width: 400px;
            height: 550px;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            padding: 50px 40px 40px 40px;
            box-shadow: -15px 15px 15px rgba(6, 17, 47, 0.7);
            opacity: 1;
            background: linear-gradient(230deg,
            rgba(53, 57, 74, 0) 0%,
            rgb(0, 0, 0) 100%);

            /deep/ .inps input {
                border: none;
                color: #fff;
                background-color: transparent;
                font-size: 12px;
            }

            .submitBtn {
                background-color: transparent;
                color: #39f;
                width: 200px;
            }

            .registerButton {
                background-color: transparent;
                color: white;
                width: 200px;
            }

            .iconfont {
                text-align: center;
                color: #fff;
            }
        }
    }
</style>
