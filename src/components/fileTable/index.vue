<template>
    <div>
        <fileTable :tableData="fileList"
                   :typeCode="typeCode"
                   :userInfo="userInfo"
                   class="fileTable"
                   @toDetail="toDetail"
                   ref="fileTable"
                   @refreshData="refreshData"
                   @loadFile="loadFile"
                   @setAudio="setAudio"
                   @doSearch="doSearch"></fileTable>
        <div class="detail">
            <fileDetail :data="detail" @play="play"
                        ref="fileDetail"
                        v-if="typeCode !== 0"
                        :typeCode="typeCode" :audioSrc="audioSrc" :audioName="audioName" :audioArtist="audioArtist"></fileDetail>
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
        props: ['fileList', 'typeCode', 'total', 'userInfo'],
        components: {
            fileTable,
            fileDetail
        },
        data () {
            return {
                detail: null,
                pageSize: 5,
                pageNo: 0,
                currentPage: 0,
                audioSrc: 'https://disk-1305749742.cos-website.ap-shanghai.myqcloud.com/mall/61801646116563162.mp3',
                audioName: 'unknown',
                audioArtist: 'unknown',
                input: null
            }
        },
        mounted () {
            this.loadFile()
            console.log(this.typeCode)
        },
        methods: {
            doSearch (input) {
                console.log()
                this.input = input
                this.$emit('doSearch', this.pageNo, this.pageSize, input)
            },
            setAudio (row) {
                this.audioSrc = row.url
                let fileName = row.fileName.split('-')
                this.audioName = fileName[1].replace(' ', '')
                this.audioArtist = fileName[0].replace(' ', '')
                console.log(this.audioSrc)
            },
            refreshData () {
                this.$emit('refreshData')
            },
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
                if (this.input !== null) {
                    this.doSearch(this.input)
                } else {
                    this.loadFile()
                }
            },
            handleCurrentChange (val) {
                console.log(val)
                this.pageNo = val - 1
                if (this.input !== null) {
                    this.doSearch(this.input)
                } else {
                    this.loadFile()
                }
            },
            // changePage (pageSize, pageNo) {
            //     this.pageSize = pageSize
            //     this.pageNo = pageNo
            //     this.loadFile()
            // },
            loadFile () {
                this.$emit('loadFile', this.pageNo, this.pageSize)
            }
        }
    }
</script>
