<template>
    <div>
        <div style="text-align: left" v-show="showLeft === true">
            <p>{{record.sendUserName}}</p>
            {{record.createdDate}}
        </div>
        <div style="text-align: right;margin-right: 30px;" v-show="showLeft === false">
            <p style="text-align: right">{{record.sendUserName}}</p>
            {{record.createdDate}}</div>
        <div class="row-5" v-show="showLeft === false">{{record.content}}
        </div>
        <el-avatar :size="50" src="static/image/img.png" style="float: left">
        </el-avatar>
        <div class="left" v-show="showLeft === true">{{record.content}}</div>
        <br/><br/><br/>
    </div>

</template>

<script>
    export default {
        name: 'chatRecord',
        props: ['showLeft', 'record'],
        data () {
            return {}
        }
    }
</script>

<style scoped lang="less">
    .el-main {

    }
    .row-5{
        margin-right: 20px;
        width: 150px;
        height: 50px;
        line-height: 50px;
        text-align: left;
        position: relative;
        border-radius: 5px;
        border: 1px solid teal;
        float: left;
    }
    .row-5::before{
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        /* 箭头靠右边 */
        top: 13px;
        right: -15px;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-left: 15px solid teal;
        /* 箭头靠左边 */
        /* top: 13px;
        left: -15px;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-right: 15px solid teal; */
    }
    .row-5::after{
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        /* 箭头靠右边 */
        top: 13px;
        right: -13px;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-left: 15px solid #fff;
        /* 箭头靠下边 */
        /* left: 20px;
        bottom: -13px;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 15px solid #fff; */
        /* 箭头靠左边 */
        /* top: 13px;
        left: -13px;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-right: 15px solid #fff; */
        /* 箭头靠下边 */
        /* left: 20px;
        top: -13px;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 15px solid #fff; */
    }
    .left{
        margin-left: 20px;
        width: 150px;
        height: 50px;
        line-height: 50px;
        text-align: left;
        font-size: large;
        position: relative;
        border-radius: 5px;
        border: 1px solid teal;
        float: left;
    }
    .left::before{
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        /* 箭头靠右边 */
        /*top: 13px;*/
        /*right: -15px;*/
        /*border-top: 10px solid transparent;*/
        /*border-bottom: 10px solid transparent;*/
        /*border-left: 15px solid teal;*/
        /* 箭头靠左边 */
        top: 13px;
        left: -15px;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-right: 15px solid teal;
    }
    .left::after{
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        /* 箭头靠右边 */
        /*top: 13px;*/
        /*right: -13px;*/
        /*border-top: 10px solid transparent;*/
        /*border-bottom: 10px solid transparent;*/
        /*border-left: 15px solid #fff;*/
        /* 箭头靠左边 */
        top: 13px;
        left: -13px;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-right: 15px solid #fff;
    }

</style>
