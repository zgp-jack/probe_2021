<template>
    <div class="content">
        <div class="flex-box">
            <div class="flex-box-item" style="width: 60px">排名</div>
            <div class="flex-box-item" style="width: 80px">厂商名称</div>
            <div class="flex-box-item-bar"></div>
            <div class="flex-box-item" style="width: 60px">{{type=='online'? '在线率':'健康度'}}</div>
        </div>
        <div class="flex-body">
            <template v-if="tableData.length > 0">
                <div class="flex-box" v-for="item,index in tableData" :key="index">
                
                    <div class="flex-box-item" style="width: 60px">{{index + 1}}</div>
                    <div class="flex-box-item" style="width: 80px">{{item.companyName}}</div>
                    <div class="flex-box-item-bar" :class="{'item-blue': theme=='blue','item-yellow': theme=='yellow'}">
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
        theme: {
            type: String,
            default: 'blue'
        },
        type: {
            type: String,
            default: 'health'
        },
        chartData: {
            type: Array
        }
    },
    data() {
        return {
            tableData: [ ]
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
    .flex-box{
        display: flex;
        color: #fff;
        height: 32px;
        width: calc(100% - 20px);
        .flex-box-item{
            flex-grow: 0;
        }
        .flex-box-item-bar{
            flex-grow: 1;
        }
        .item-blue::v-deep .el-progress{
            .el-progress-bar__outer{
                border-color: #327087;
                .el-progress-bar__inner{
                    background-image: linear-gradient(to right, #22C3FF, #22C3FF 7px, transparent 3px);
                }
            }
        }
        .item-yellow::v-deep .el-progress{
            .el-progress-bar__outer{
                border-color: #A59665;
                .el-progress-bar__inner{
                    background-image: linear-gradient(to right, #FDD658, #FDD658 7px, transparent 3px);
                }
            }
        }
        .flex-box-item-bar::v-deep .el-progress{
            width: calc(100% - 40px);
            margin-top: 4px;
            .el-progress-bar__outer{
                height: 10px !important;
                border-radius: 0;
                border-style: solid;
                border-width: 1px;
                background-color: transparent;
                padding: 2px;
                .el-progress-bar__inner{
                    position: relative;
                    height: 4px;
                    background-color: transparent;
                    background-size: 10px 100%;
                    border-radius: 0;
                }
            }
        }
    }
</style>