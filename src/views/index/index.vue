<template>
    <div class="content" id="indexPanel" :style="{paddingTop: this.fullScreen ? '0' : '40px'}">
        <div class="btn-fullscreen btn-fullscreen-position" v-if="!this.fullScreen" @click="setFullScreen"></div>
        <div class="content-top" :class="{'top-index': this.fullScreen}">
            <div class="system-time">
                <div class="system-time-time">{{nowTime}}</div>
                <div class="system-time-day">{{nowWeek}}<br/>{{nowDay}}</div>
            </div>
            <div class="system-title">
                <!-- <img class="system-logo" src="../../assets/badges-logo.png" /> -->
                <!-- <img class="system-name" src="../../assets/system-name.png"/> -->
            </div>
            <div class="update-time">
                数据更新时间 {{updateTime}}
                <div class="btn-fullscreen btn-fullscreen-1" v-if="this.fullScreen" @click="setFullScreen"></div>
            </div>
        </div>
        <div class="task-content">
            <div class="task-panel">
                <div class="task-static-box">
                    <p class="static-box-title">拨测任务</p>
                    <ul>
                        <li><span class="high" @click="toPage(taskFault[0], {grade: 3, taskType: 1, status: '0'})">{{taskFault[0]}}</span>高</li>
                        <li><span class="normal" @click="toPage(taskFault[0], {grade: 2, taskType: 1, status: '0'})">{{taskFault[1]}}</span>中</li>
                        <li><span class="low" @click="toPage(taskFault[0], {grade: 1, taskType: 1, status: '0'})">{{taskFault[2]}}</span>低</li>
                    </ul>
                </div>
            </div>
            <div class="task-panel">
                <div class="task-static-box">
                    <p class="static-box-title">接口任务</p>
                    <ul>
                        <li><span class="high" @click="toPage(taskFault[3], {grade: 3, taskType: 2, status: '0'})">{{taskFault[3]}}</span>高</li>
                        <li><span class="normal" @click="toPage(taskFault[4], {grade: 2, taskType: 2, status: '0'})">{{taskFault[4]}}</span>中</li>
                        <li><span class="low" @click="toPage(taskFault[5], {grade: 1, taskType: 2, status: '0'})">{{taskFault[5]}}</span>低</li>
                    </ul>
                </div>
            </div>
            <div class="task-panel">
                <div class="task-static-box">
                    <p class="static-box-title">专线任务</p>
                    <ul>
                        <li><span class="high" @click="toPage(taskFault[6], {taskType: 3})">{{taskFault[6]}}</span>高</li>
                        <li><span class="normal" @click="toPage(taskFault[7], {taskType: 3})">{{taskFault[7]}}</span>中</li>
                        <li><span class="low" @click="toPage(taskFault[8], {taskType: 3})">{{taskFault[8]}}</span>低</li>
                    </ul>
                </div>
            </div>
            <div class="task-panel">
                <div class="task-static-box">
                    <p class="static-box-title">网络设备</p>
                    <ul>
                        <li><span class="high" @click="toPage(taskFault[9], {})">{{taskFault[9]}}</span>高</li>
                        <li><span class="normal" @click="toPage(taskFault[10], {})">{{taskFault[10]}}</span>中</li>
                        <li><span class="low" @click="toPage(taskFault[11], {})">{{taskFault[11]}}</span>低</li>
                    </ul>
                </div>
            </div>
        </div>
        <el-row :style="{height: this.fullScreen ? 'calc(66.67% - 42px)' : 'calc(66.67% + 20px)'}">
            <el-col :span="6" class="panel-cover">
                <div class="item-box">
                    <span class="item-box-label">丢包分布</span>
                    <div style="height: 100%; position: relative">
                        <div v-for="item,index of checkTemp1" v-show="item.actived" :key="index" class="btn-check-chart" size="mini" type="text" @click="revertMap(item, 1)">
                            {{item.name}}
                        </div>
                        <packet-loss-bar ref="chart1"></packet-loss-bar>
                    </div>
                </div>
                <div class="item-box">
                    <span class="item-box-label">时延分布</span>
                    <div style="height: 100%; position: relative">
                        <div v-for="item,index of checkTemp2" v-show="item.actived" :key="index" class="btn-check-chart" size="mini" type="text" @click="revertMap(item, 2)">
                            {{item.name}}
                        </div>
                        <delay-bar ref="chart2"></delay-bar>
                    </div>
                </div>
            </el-col>
            <el-col :span="12" class="panel-full">
                <mapCharts ref="chart3" @setParam="setSearchParam" style="flex-grow: 1;"></mapCharts>
            </el-col>
            <el-col :span="6" class="panel-cover">
                <div class="item-box">
                    <span class="item-box-label">流量趋势</span>
                    <mulitiple-flow ref="chart4"></mulitiple-flow>
                </div>
                <div class="item-box">
                    <span class="item-box-label">网络故障机构TOP8</span>
                    <net-bar ref="chart5"></net-bar>
                </div>
            </el-col>
        </el-row>
        <el-row :style="{height: this.fullScreen ? 'calc(33.33% - 52px)' : 'calc(33.33% - 20px)'}" >
            <el-col :span="9" class="panel-full">
                <div class="item-box">
                    <span class="item-box-label item-box-label-long">故障类型分布</span>
                    <pie-charts ref="chart6"></pie-charts>
                </div>
            </el-col>
            <el-col :span="9" class="panel-full">
                <div class="item-box">
                    <span class="item-box-label item-box-label-long">近24小时故障趋势</span>
                    <div style="height: calc(100% - 30px); position: relative">
                        <div v-for="item,index of checkTemp3" v-show="item.actived" :key="index" class="btn-check-chart" size="mini" type="text" @click="revertMap(item, 3)">
                            {{item.name}}
                        </div>
                        <multiple-line ref="chart7"></multiple-line>
                    </div>
                </div>
            </el-col>
            <el-col :span="6" class="panel-full">
                <div class="item-box">
                    <span class="item-box-label">设备故障机构TOP8</span>
                    <device-bar ref="chart8"></device-bar>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import moment from "moment";
import MapCharts from "./components/mapCharts";
// import MapCharts from "./components/openLayerMap.vue";
import MultipleLine from "./components/multipleLine";
import PacketLossBar from './components/packetLossBar';
import DelayBar from './components/delayBar';
import PieCharts from './components/pieCharts';
import MulitipleFlow from './components/mulitipleFlow.vue';
import NetBar from './components/netBar.vue';
import DeviceBar from './components/deviceBar.vue';
import Api from './api';
import { mapState } from 'vuex';

var elementResizeDetectorMaker = require('element-resize-detector');
export default {
    name: 'index',
    data() {
        return {
            nowTime: '',
            nowWeek: '',
            nowDay: '',
            height: document.documentElement.clientHeight - 74,
            weekList: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            timerAll: null,
            updateTime: moment(new Date()).format('HH:mm:ss'),
            checkTemp1: [{name: '拨测任务', value: 1, actived: true}, {name: '接口任务', value: 2, actived: false}, {name: '专线任务', value: 3, actived: false}],
            checkTemp2: [{name: '拨测任务', value: 1, actived: true}, {name: '接口任务', value: 2, actived: false}, {name: '专线任务', value: 3, actived: false}],
            checkTemp3: [{name: '拨测任务', value: 1, actived: true}, {name: '接口任务', value: 2, actived: false}, {name: '专线任务', value: 3, actived: false}],
            taskFault: [0,0,0,0,0,0,0,0,0,0,0,0],
            searchParam: {name: '四川省', level: 1}
        }
    },
    components: {
        MapCharts,
        MultipleLine,
        PacketLossBar,
        DelayBar,
        PieCharts,
        MulitipleFlow,
        NetBar,
        DeviceBar,
    },
    computed: {
        ...mapState({
            fullScreen: state => state.fullScreen
        })
    },
    created() {
        this.timerFun();
        
        this.timerTable = setInterval(this.timerFun, 1000);
        this.timerAll = setInterval(this.timerAllFun, 60000);
    },
    mounted() {
        // this.getHomeReportLevelStatistics();
        let erd = elementResizeDetectorMaker();
        erd.listenTo(document.getElementById("indexPanel"), this.CommonFun.debounce(this.resizeFunc));
        // window.addEventListener('resize', function() {
			
		// })
        this.getHomeData();
    },
    beforeDestroy() {
        clearInterval(this.timerTable);
        clearInterval(this.timerAll);
        this.$store.commit('updateFullScreen', false);
    },
    methods: {
        setSearchParam(param) {
            this.searchParam.name = param.name;
            this.searchParam.level = param.level;
        },
        toPage(count, params) {
            let toPage = params.taskType === 3 ? 'analyseSpecialLine' : 'analyseDelayDegradation';
            let icon = params.taskType === 3 ? 'iconfont icon-zhuanti' : 'iconfont icon-zhuanjia';
            if(!params.taskType) {
                toPage = 'analyseNetworkDevice';
                icon = 'iconfont icon-jiankong'
            }
            if(count) {
                // this.$store.commit('pushIncludeList', 'index');
                sessionStorage.setItem('defaultActive', toPage);
                this.$store.dispatch('setDefaultActive', toPage);
                sessionStorage.setItem('openlist', JSON.stringify([icon]))
                this.$store.dispatch('setOpenList', [icon])
                setTimeout(() => this.$router.push({name: toPage, params: params}))
            }
        },
        revertMap(item, key) {
            let dataName = `checkTemp${key}`;
            let refList = ['', 'chart1', 'chart2', 'chart7']
            let refName = refList[key];
            this[dataName].forEach((res, inx) => {
                res.actived = false;
                this.$set(this[dataName], inx, res);
            })

            let ins = this[dataName].findIndex(res => res.value === item.value);
            ins++;
            if(ins >= this[dataName].length) {
                ins = 0;
            }
            this[dataName][ins].actived = true;
            this.$set(this[dataName], ins, this[dataName][ins]);
            //更新图表
            this.$refs[refName].init({taskType: this[dataName][ins]['value']});
        },
        getHomeReportLevelStatistics(data) {
            this.taskFault[0] = data[13];
            this.taskFault[1] = data[12];
            this.taskFault[2] = data[11];
            this.taskFault[3] = data[23];
            this.taskFault[4] = data[22];
            this.taskFault[5] = data[21];
            this.taskFault[6] = data[33];
            this.taskFault[7] = data[32];
            this.taskFault[8] = data[31];
            this.taskFault[9] = data[43];
            this.taskFault[10] = data[42];
            this.taskFault[11] = data[41];
        },
        setFullScreen() {
            this.$store.commit('updateFullScreen', !this.fullScreen);
        },
        resizeFunc(element) {
			let that = this;
			that.$nextTick(() => {
				that.$refs['chart1'].resize();
                that.$refs['chart2'].resize();
                that.$refs['chart3'].resize();
                that.$refs['chart4'].resize();
                that.$refs['chart5'].resize();
                that.$refs['chart6'].resize();
                that.$refs['chart7'].resize();
                that.$refs['chart8'].resize();
			})
		},
        timerFun() {
            let that = this;
            let now = new Date();
            this.nowWeek = that.weekList[now.getDay()]
            this.nowTime = moment(now).format('HH:mm:ss');
            this.nowDay =  moment(now).format('YYYY-MM-DD');
        },
        async getHomeData() {
            const res = await Api.homeDataStatistics(this.searchParam);
            const data = res.data;
            this.getHomeReportLevelStatistics(data.data.taskTypeAndDeviceMap);
            this.$refs['chart3'].init(data.data.map.barrioList);
            this.$refs['chart5'].init(data.data.taskTop);
            this.$refs['chart6'].init(data.data.taskStatisticsByEventType, data.data.deviceStatisticsByType);
            this.$refs['chart8'].init(data.data.deviceTop);
        },
        timerAllFun() {
            this.$refs['chart1'].init({taskType: this.checkTemp1.find(item => item.actived === true)['value']});
            this.$refs['chart2'].init({taskType: this.checkTemp2.find(item => item.actived === true)['value']});
            this.$refs['chart4'].init();
            // this.$refs['chart6'].init();
            this.$refs['chart7'].init({taskType: this.checkTemp3.find(item => item.actived === true)['value']});
            this.updateTime = moment(new Date()).format('hh:mm:ss');
            this.getHomeData();
        },
    },
}
</script>
<style lang="scss" scoped>
.btn-check-chart{
    right: 0;
    top: 0;
}
.content{
    background-color: #020c0d;
    background-image: url(../../assets/index-bg.png);
    background-size: 100%;
    background-repeat: no-repeat;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    position: relative;
}
.btn-fullscreen{
    width: 14px;
    height: 14px;
    background-image: url(../../assets/fullscreen.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
    display: inline-block;
}
.btn-fullscreen-position{
    position: absolute;
    top: 20px;
    right: 30px;
    z-index: 999;
}
.btn-fullscreen-1{
    background-image: url(../../assets/fullscreen-1.png);
}
.top-index{
    background-image: url(../../assets/system-name-bg.png) !important;
    display: block !important;
}
.content-top{
    width: 100%;
    display: none;
    background-image: none;
    background-size: 100% 100%;
    background-position: center center;
    background-repeat: no-repeat;
    text-align: center;
    position: relative;
    .system-time{
        position: absolute;
        top: 14px;
        left: 20px;
        color: #fff;
        display: flex;
        .system-time-time{
            font-size: 30px;
        }
        .system-time-day{
            padding-top: 2px;
            line-height: 18px;
            margin-left: 10px;
            text-align: left;
            font-size: 12px;
            color: #ccc;
        }
    }
    .update-time{
        position: absolute;
        top: 20px;
        right: 20px;
        color: #fff;
        font-size: 16px;
    }
    .system-title{
        margin: auto;
        width: 25%;
        height: 74px;
        line-height: 74px;
        .system-logo{
            display: inline-block;
            width: 74px;
            height: 74px;
            vertical-align: middle;
            transform: scale(.5);
        }
        img.system-name{
            display: inline-block;
            width: calc(100% - 74px);
            vertical-align: middle;
        }
    }
    
}
.item-box::v-deep .el-scrollbar__wrap {
    overflow: hidden;
    overflow-y: scroll;
}
.panel-cover{
    margin-top: 110px;
    height: calc(100% - 110px);
    display: flex;
    flex-flow: column;
    .item-box{
        height: 50%;
    }
}
.panel-full{
    height: 100%;
    display: flex;
}
.item-box{
    flex-grow: 1;
    width: 100%;
    box-sizing: border-box;
    padding: 15px;
    .item-box-label{
        width: 100%;
        display: block;
        background-image: url(../../assets/title-bg.png);
        background-size: 100% 100%;
        background-repeat: no-repeat;
        color: #fff;
        height: 40px;
        line-height: 25px;
        padding-left: 25px;
        font-size: 15px;
        position: relative;
        z-index: 1000;
    }
    .item-box-label-long {
        background-image: url(../../assets/title-long-bg.png);
        padding-left: 30px;
    }
}
.task-content{
    position: absolute;
    height: 140px;
    z-index: 11;
    width: 100%;
    letter-spacing: -10px;
    box-sizing: border-box;
    padding-left: 30px;
    pointer-events: none;
    .task-panel{
        display: inline-block;
        letter-spacing: 0;
        width: 25%;
        vertical-align: top;
    }
}
.task-static-box{
    height: 90px;
    margin-top: 22px;
    width: calc(100% - 30px);
    box-sizing: border-box;
    margin: 20px 30px 0 0;
    background: url(../../assets/task-panel.png) no-repeat;
    background-size: 100% 100%;
    .static-box-title{
        width: 120px;
        height: 40px;
        line-height: 40px;
        margin: auto;
        background-image: url(../../assets/static-title-bg.png);
        background-repeat: no-repeat;
        background-size: 20px 14px;
        background-position: 0 14px;
        color: #fff;
        text-align: center;
        font-size: 14px;
    }
    ul{
        display: flex;
        list-style: none;
        margin-left: 20px;
        li{
            color: #fff;
            width: 33.33%;
            margin: 0 20px 0 0;
            border-bottom: 1px solid #29B3AD;
            text-align: right;
            padding-right: 10px;
            position: relative;
            ::after{
                content: '';
                position: absolute;
                right: 0;
                bottom: -1px;
                width: 4px;
                height: 4px;
                background-color: #22CCC5;
            }
            span{
                font-size: 22px;
                display: inline-block;
                width: calc(100% - 20px);
                text-align: center;
                pointer-events: all;
                cursor: pointer;
            }
            .high{
                color: #FA7142;
            }
            .normal{
                color: #FDD658;
            }
            .low{
                color: #22C3FF;
            }
        }
    }
}
</style>
