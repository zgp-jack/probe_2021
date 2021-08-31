<template>
<div style="width: 100%; min-height: 230px">
    <div class="progress-box" v-if="total > 0">
        <div class="progress-item">
            <el-progress type="circle" :percentage="chartData[0]/total * 100" :width="100" color="#FF6C3F" :show-text="false"></el-progress>
            <span class="progress-title" style="color:#FF6C3F">{{chartData[0]}}个</span>
            <div class="progress-label">
                <p style="color:#FF6C3F">差</p>
                <p>[0%, 60%]</p>
            </div>
        </div>
        <div class="progress-item">
            <el-progress type="circle" :percentage="chartData[1]/total * 100" :width="100" color="#ECAF2D" :show-text="false"></el-progress>
            <span class="progress-title" style="color:#ECAF2D">{{chartData[1]}}个</span>
            <div class="progress-label">
                <p style="color:#ECAF2D">中</p>
                <p>[60%, 80%]</p>
            </div>
        </div>
        <div class="progress-item">
            <el-progress type="circle" :percentage="chartData[2]/total * 100" :width="100" color="#22C3FF" :show-text="false"></el-progress>
            <span class="progress-title" style="color:#22C3FF">{{chartData[2]}}个</span>
            <div class="progress-label">
                <p style="color:#22C3FF">良</p>
                <p>[80%,90%]</p>
            </div>
        </div>
        <div class="progress-item">
            <el-progress type="circle" :percentage="chartData[3]/total * 100" :width="100" color="#24D5BC" :show-text="false"></el-progress>
            <span class="progress-title" style="color:#24D5BC">{{chartData[3]}}个</span>
            <div class="progress-label">
                <p style="color:#24D5BC">优</p>
                <p>[90%,100%]</p>
            </div>
        </div>
    </div>
    <div v-else class="no-data-box">
        <img src="../../../assets/no-data-table.png"/>
        <p>暂无数据</p>
    </div>
</div>
</template>
<script>
export default {
    name: "lineRang",
    props: {
        type: {
            type: String,
            default: 'online'
        },
        chartData: {
            type: Array
        }
    },
    data() {
        return {
            loading: false,
            total: 0
        };
    },
    mounted() {
    },
    methods: {
        echartsFun() {
            let that = this;
        },
        resize() {
            this.$echarts.init(this.$refs.multipleChart).resize();
        }
    },
    watch: {
        chartData: {
            handler: function(val) {
                this.total = 0;
                val.map(item => {
                    this.total += item;
                })
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.progress-box{
    height: 230px;
    display: flex;
    .progress-item{
        flex-grow: 1;
        text-align: center;
        padding-top: 38px;
        position: relative;
        .progress-title{
            position: absolute;
            top: 24px;
            width: 130px;
            height: 130px;
            box-sizing: border-box;
            padding-top: 52px;
            font-size: 18px;
            font-weight: bold;
            left: calc(50% - 67px);
        }
        .progress-label{
            margin-top: 20px;
            line-height: 22px;
            p:first-child{
                font-size: 14px;
            }
        }
    }
    .progress-item::after{
        content: '';
        position: absolute;
        top: 22px;
        left: calc(50% - 67px);
        width: 130px;
        height: 130px;
        border: 1px solid #999999;
        border-radius: 50%;
    }  
}
.progress-item::v-deep svg path:first-child {
    stroke: transparent;
}
.progress-item::v-deep .el-progress{
    position: relative;
}
.progress-item::v-deep .el-progress::after{
    content: '';
    position: absolute;
    left: 5px;
    top: 6px;
    width: 88px;
    height: 86px;
    border: 1px solid #999999;
    border-radius: 50%;
}
</style>