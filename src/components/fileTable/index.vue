<template>
    <div>
        <fileTable :tableData="fileList"
                   :typeCode="typeCode"
                   class="fileTable"
                   @toDetail="toDetail"
                   ref="fileTable"
                   @loadFile="loadFile"></fileTable>
        <div class="detail">
            <fileDetail :data="detail" @play="play" ref="fileDetail" v-if="typeCode !== 0"></fileDetail>
        </div>
        <div class="block" style="float: left; position:relative; top: 20px" v-if="typeCode !== 0">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="5"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
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
        props: ['fileList', 'typeCode', 'total'],
        components: {
            fileTable,
            fileDetail
        },
        data () {
            return {
                detail: null,
                pageSize: 5,
                pageNo: 0,
                currentPage: 0
            }
        },
        mounted () {
            this.loadFile()
            console.log(this.typeCode)
        },
        methods: {
            cellMouseEnter (row) {
                this.$emit('cellMouseEnter', row)
            },
            toDetail (val) {
                this.detail = val
                this.$refs.fileDetail.showDetail = true
            },
            play (url) {
                this.$refs.fileTable.play(url)
            },
            handleSizeChange (val) {
                console.log(`每页 ${val} 条`)
                this.pageSize = val
                this.loadFile()
            },
            handleCurrentChange (val) {
                this.pageNo = val - 1
                this.loadFile()
            },
            changePage (pageSize, pageNo) {
                this.pageSize = pageSize
                this.pageNo = pageNo
                this.loadFile()
            },
            loadFile () {
                this.$emit('loadFile')
            }
        }
    }
</script>
