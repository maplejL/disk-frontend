<template>
    <div>
        <fileTable :tableData="fileList" :typeCode="typeCode"></fileTable>
    </div>
</template>

<style>
    @import "index.css";
</style>
<script>
    import fileTable from '../common/fileTable'
    export default {
        name: 'file',
        props: ['fileList', 'typeCode'],
        components: {
            fileTable
        },
        data () {
            return {}
        },
        methods: {}
    }
</script>
