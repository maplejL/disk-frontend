<template>
    <div>
        <fileTable :tableData="fileList" :typeCode="typeCode" class="fileTable" @toDetail="toDetail" ref="fileTable"></fileTable>
        <div class="detail">
            <fileDetail :data="detail" @play="play" ref="fileDetail"></fileDetail>
        </div>
        <div class="block" style="float: left; position:relative; top: 20px">
            <el-pagination
                    layout="prev, pager, next"
                    :total="50"
                    :page-size="5">
            </el-pagination>
        </div>
    </div>
</template>

<style>
    @import "index.css";
</style>
<script>
    import fileTable from './components/fileTable'
    import fileDetail from './components/fileDetail'
    export default {
        name: 'file',
        props: ['fileList', 'typeCode'],
        components: {
            fileTable,
            fileDetail
        },
        data () {
            return {
                detail: null,
                pageSize: 5,
                pageNo: 0
            }
        },
        methods: {
            toDetail (val) {
                this.detail = val
                this.$refs.fileDetail.showDetail = true
            },
            play (url) {
                this.$refs.fileTable.play(url)
            }
        }
    }
</script>
