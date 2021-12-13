<template>
    <div>
<!--        <Button type="primary" @click="modal1 = true">显示对话框</Button>-->
        <Modal
                v-model="modal1"
                title="普通的Modal对话框标题"
                @on-ok="ok"
                @on-cancel="cancel">
            <div>
                <VideoPlayer :options="videoOptions" class="video"></VideoPlayer>
            </div>
        </Modal>
    </div>
</template>
<script>
    import VideoPlayer from './VideoPlayer'
    import video from './video'
    export default {
        data () {
            return {
                modal1: true,
                videoOptions: {
                    autoplay: 'muted', // 自动播放
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
                }
            }
        },
        components: {
            VideoPlayer,
            video
        },
        methods: {
            ok () {
                this.$Message.info('点击了确定')
            },
            cancel () {
                this.$Message.info('点击了取消')
            }
        }
    }
</script>
