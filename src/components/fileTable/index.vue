<template>
    <div>
        <fileTable :tableData="fileList" :typeCode="typeCode" class="fileTable" @toDetail="toDetail" ref="fileTable"></fileTable>
        <div class="detail">
            <fileDetail :data="detail" @play="play" ref="fileDetail"></fileDetail>
        </div>
        <div class="block" style="float: left; position:relative; top: 20px">
<!--            <el-pagination-->
<!--                    layout="prev, pager, next"-->
<!--                    :total="total"-->
<!--                    :page-size="pageSize"-->
<!--                    @current-change="handleCurrentChange">-->
<!--            </el-pagination>-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="5"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalFiles">
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
        // props: ['fileList', 'typeCode', 'total'],
        components: {
            fileTable,
            fileDetail
        },
        data () {
            return {
                detail: null,
                pageSize: 5,
                pageNo: 0,
                fileList: [],
                currentPage: 0,
                typeCode: 0,
                totalFiles: 0
            }
        },
        created () {
            this.$nextTick(() => {
                if (this.$route.query.typeName) {
                    this.typeName = this.$route.query.typeName
                    this.$refs.typeName.updateActiveName()
                }
            })
            // this.getPublicKey()
            // this.loadFile()
        },
        mounted () {
            this.loadFile()
        },
        methods: {
            changeType (e) {
                this.$route.query.typeName = e
                this.typeName = e
                switch (this.typeName) {
                case '视频':
                    this.typeCode = 1
                    break
                case '文档':
                    this.typeCode = 2
                    break
                case '音乐':
                    this.typeCode = 3
                    break
                case '图片':
                    this.typeCode = 4
                    break
                }
                this.loadFile()
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
                this.post('/file/getPage', {
                    pageSize: this.pageSize,
                    pageNo: this.pageNo,
                    typeCode: this.typeCode
                }).then((res) => {
                    console.log(res)
                    this.fileList = res.data.files
                    this.fileList.forEach(item => {
                        item.createdDate = this.$moment(item.createdDate).format('YYYY-MM-DD HH:mm:ss')
                        item.modifiedDate = this.$moment(item.modifiedDate).format('YYYY-MM-DD HH:mm:ss')
                    })
                    this.totalFiles = res.data.total
                })
            }
        }
    }
</script>
