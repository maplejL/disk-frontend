<template>
    <div>
        <upload :typeCode="typeCode"></upload>
        <el-table
                :data="tableData"
                height="700"
                style="width: 80%">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column width="70px">
                <template slot-scope="scope">
                    <img v-if="scope.row.typeCode !== 1" :src="scope.row.url" style="height: 50px"/>
                    <img v-else :src="scope.row.thumbnailName" style="height: 50px" />
                </template>
            </el-table-column>
            <el-table-column
                    label="文件名"
                    prop="fileName"
                    width="500px"
                    :show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column
                    prop="createdDate"
                    label="修改时间"
                    width="200px">
            </el-table-column>
            <el-table-column
                    prop="size"
                    label="大小"
                    width="200px">
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                    layout="prev, pager, next"
                    :total="50"
                    :page-size="5">
            </el-pagination>
        </div>
    </div>
</template>

<style scoped>
</style>

<script>
    import upload from './upload'

    export default {
        name: 'fileTable',
        props: ['tableData', 'typeCode'],
        data () {
            return {}
        },
        components: {
            upload
        },
        methods: {}
    }
</script>
