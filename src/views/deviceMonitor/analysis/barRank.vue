<template>
    <div class="content">
        <div class="flex-box">
            <div class="flex-box-item" style="width: 60px">排名</div>
            <div class="flex-box-item" style="width: 80px">单位名称</div>
            <div class="flex-box-item-bar"></div>
            <div class="flex-box-item" style="width: 60px">{{type==='online'?'在线率':'健康度'}}</div>
        </div>
        <div class="flex-body">
            <template v-if="tableData.length > 0">
                <div class="flex-box" v-for="item,index in tableData" :key="index">
                    <template v-if="index < 3">
                        <div class="flex-box-item" style="width: 60px">
                            <img v-if="index === 0" src="../../../assets/no-1.png">
                            <img v-else-if="index === 1" src="../../../assets/no-2.png">
                            <img v-else src="../../../assets/no-3.png">
                        </div>
                    </template>
                    <div class="flex-box-item" v-else style="width: 60px">{{index + 1}}</div>
                    <div class="flex-box-item" style="width: 80px">{{item.companyName}}</div>
                    <div class="flex-box-item-bar" :class="{'bar-top': index==0, 'bar-second': index==1, 'bar-third':index==2}">
                        <el-progress :percentage="item.onlineRang" :show-text="false" stroke-linecap="butt"></el-progress>
                    </div>
                    <div class="flex-box-item" style="width: 60px">{{item.onlineRang}}%</div>
                </div>
            </template>
            <div v-else class="no-data-box">
                <img src="../../../assets/no-data-table.png"/>
                <p>暂无数据</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        chartData: {
            type: Array
        },
        type: {
            type: String,
            default: 'online'
        }
    },
    data() {
        return {
            tableData: []
        }
    },
    watch: {
        chartData: {
            handler: function(arr) {
                this.tableData = [];
                arr.map(item => {
                    this.tableData.push({companyName: item.key, onlineRang: item.value})
                })
            },
            deep: true
        }
    }
}
</script>
<style lang="scss" scoped>
.content{
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
}
.flex-body{
    max-height: 240px;
    overflow: auto;
}
    .flex-box{
        display: flex;
        color: #fff;
        height: 32px;
        .flex-box-item{
            flex-grow: 0;
        }
        .flex-box-item-bar{
            flex-grow: 1;
        }
        .bar-top::v-deep .el-progress .el-progress-bar__outer{
            border-color: #977A58 !important;
            .el-progress-bar__inner{
                background-color: #FFA73F !important;
            }
        }
        .bar-second::v-deep .el-progress .el-progress-bar__outer{
            border-color: #92824F !important;
            .el-progress-bar__inner{
                background-color: #FDD658 !important;
            }
        }
        .bar-third::v-deep .el-progress .el-progress-bar__outer{
            border-color: #30747C !important;
            .el-progress-bar__inner{
                background-color: #22E8FF !important;
            }
        }
        .flex-box-item-bar::v-deep .el-progress{
            width: calc(100% - 30px);
            margin-top: 4px;
            .el-progress-bar__outer{
                height: 10px !important;
                border-radius: 0;
                border-style: solid;
                border-width: 1px;
                border-color: #12605D;
                background-color: transparent;
                padding: 2px;
                .el-progress-bar__inner{
                    position: relative;
                    height: 4px;
                    background-color: #41C4A4;
                    border-radius: 0;
                }
            }
        }
    }
</style>