<template>
    <div>
        <fileTable :pictureList="pictureList"></fileTable>
    </div>
</template>

<style>
    @import "index.css";
</style>
<script>
    import fileTable from '../common/fileTable'
    export default {
        name: 'photo',
        props: ['pictureList'],
        components: {
            fileTable
        },
        data () {
            return {}
        },
        methods: {}
    }
</script>
