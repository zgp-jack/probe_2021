<template>
    <div class="trendChart">
        <el-dialog
            v-if="dialogVisible"
            :visible.sync="dialogVisible"
            :show-close="false"
            :close-on-click-modal="false"
            width="1088px">
            <div class="dialog-body">
                <el-scrollbar>
                        <useRatio :trendData="trendData" />
                        <lineChart :viewAnalysis="trendData" />
                </el-scrollbar>
            </div>
            <div class="dialog-close" @click="dialogVisible = false"><i class="el-icon-circle-close"></i></div>
        </el-dialog>
    </div>
</template>
<script>
import useRatio from './useRatio'
import lineChart from './lineChart'
import Bus from '../vue-simple-upload-js/bus'
export default {
    name: 'trendChart',
    data() {
        return {
            dialogVisible: false,
            trendData: {}
        }
    },
    components: {
        useRatio,
        lineChart
    },
    methods: {
        handleClose(){

        },
        getTrendData(trendData){
            this.dialogVisible = true;
            this.trendData = trendData;
        }
    },
    mounted(){
        Bus.$on('changeDialogVisible',this.getTrendData)
    },
    beforeDestroy() {
      Bus.$off('changeDialogVisible')
    },
}
</script>
<style>
.trendChart .dialog-body {
    width: 100%;
    height: 600px;
    background-color: #000;
    /* background-image: url('../../assets/trend-bgm-line.png'); */
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
.trendChart .el-scrollbar__wrap .el-scrollbar__view {
    flex-direction: column;
}
.trendChart .use-ratio-title {
    font-size: 16px;
    color: #fff;
    text-align: center;
    line-height: 40px;
}
.trendChart .el-dialog  .dialog-close {
    position: absolute;
    width: 40px;
    height: 40px;
    right: -30px;
    top: -30px;
    color: #00E2DA;
    cursor: pointer;
}
.trendChart .el-dialog  .dialog-close i {
    font-size: 30px!important;
}
</style>