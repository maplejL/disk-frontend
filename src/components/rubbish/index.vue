<template>
    <div>
        <div>
            <table>
                <tr>
                    <td style="position: relative">
                        <el-button size="small"
                                   type="danger"
                                   @click="recover"
                        >批量恢复</el-button>
                    </td>
                    <td style="position: relative">
                        <el-button size="small"
                                   type="success"
                                   @click="completelyDelete"
                                   style="margin-left: 10px"
                        >彻底删除</el-button>
                    </td>
                </tr>
            </table>
        </div>
        <el-table
                :data="tableData"
                height="500px"
                :highlight-current-row="true"
                style="width: 100%"
                @select="selectRow"
                @select-all="selectAll"
        >
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column width="70px" v-viewer.static="{inline: true}">
                <template slot-scope="scope">
                    <el-image v-if="scope.row.typeCode !== 1"
                              :src="scope.row.url"
                              style="height: 50px;cursor: pointer;"
                              fit="scale-down"
                    >
                    </el-image>
                    <el-image v-else
                              :src="scope.row.thumbnailName"
                              style="height: 50px;cursor: pointer;"
                    >
                    </el-image>
                    <el-image-viewer
                            v-if="showViewer === 1"
                            style="transform: scale(1) rotate(0deg); margin: auto; max-height: 80%; max-width: 80%;"
                            :on-close="closeViewer"
                            :url-list="srcList"/>
                </template>
            </el-table-column>
            <el-table-column
                    label="文件名"
                    prop="fileName"
                    width="500px"
                    :show-overflow-tooltip="true"
            >
                <template slot-scope="scope">
                    <span style="cursor: pointer"
                          @click="setSrc(scope.row.url, scope.row.typeCode)"
                    >{{scope.row.fileName}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="modifiedDate"
                    label="删除时间"
                    width="200px">
            </el-table-column>
            <el-table-column
                    prop="size"
                    label="大小"
                    width="200px">
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="250px">
                <template slot-scope="scope">
                    <span style="cursor: pointer;height: 50px"
                          @click="setSrc(scope.row.url, scope.row.typeCode)"
                    >{{scope.row.fileName}}</span>
                </template>
            </el-table-column>
        </el-table>
        <div class="block" style="float: left; position:relative; top: 20px">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageNo"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'rubbish',
        props: ['tableData', 'total', 'pageSize'],
        data () {
            return {
                srcList: [],
                showViewer: 0,
                isHover: 0,
                isSelect: 0,
                hoverId: null,
                hoverData: null,
                currentPage: 0,
                pageNo: 0
            }
        },
        methods: {
            refreshData () {
                this.$emit('changeRubbishPage', this.pageNo)
            },
            handleSizeChange (val) {
                console.log(`每页 ${val} 条`)
                this.pageSize = val
                this.refreshData()
            },
            handleCurrentChange (val) {
                console.log(val)
                this.pageNo = val - 1
                this.refreshData()
            },
            async cellMouseEnter (row, column, cell, event) {
                let res = await this.compare(row)
                this.hoverId = res.id
                this.hoverData = res
            },
            cellMouseLeave () {
                // 移除hover的事件
                this.hoverId = null
            },
            async completelyDelete () {
                // 彻底删除
                await this.post('/file/completelyDelete', this.selectedIds)
                this.$message.success('删除成功')
                this.$emit('refreshRubbish')
            },
            async recover () {
                await this.post('/file/recoverFiles', this.selectedIds)
                this.$message.success('恢复成功')
                this.$emit('refreshRubbish')
            },
            selectAll () {
                this.selectedIds = []
                for (let i = 0; i < this.tableData.length; i++) {
                    this.selectedIds.push(this.tableData[i].id)
                }
            },
            selectRow (selection) {
                // this.isSelect = 1
                this.selectedIds = []
                for (let i = 0; i < selection.length; i++) {
                    this.selectedIds.push(selection[i].id)
                }
            },
            setSrc (url, typeCode) {
                if (typeCode === 1) {
                    this.isPlay = 1
                    this.showViewer = 0
                    this.videoOptions.sources[0].src = url
                } else {
                    this.srcList = []
                    this.srcList.push(url)
                    this.showViewer = 1
                }
            },
            closeViewer () {
                this.showViewer = 0
            }
        }
    }
</script>
