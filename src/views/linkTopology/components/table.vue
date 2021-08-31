<template>
    <!-- <el-table
        :data="listData"
        border
        :header-cell-style="{background:'#f2f2f2'}"
        :height="195"
        style="width: 100%; margin-top: 10px"
        v-el-table-infinite-scroll="getList"
    >
        <el-table-column width="200" prop="taskName" label="任务名称" show-overflow-tooltip></el-table-column>
        <el-table-column :formatter="CommonFun.formatterCompanyName" label="单位名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column width="120" prop="eventType" label="故障类型"></el-table-column>
        <el-table-column width="70" label="" fixed="right" align="center">
            <div class="btnBox" title="编辑" @click="editFun(scope.$index, scope.row)"><i class="el-icon-view"></i></div>
        </el-table-column>
    </el-table> -->
    <div class="table-list-scroll">
        <div class="table-title">
            <div class="table-title-item" style="width: 480px">任务名称</div>
            <div class="table-title-item" style="width: 220px">单位名称</div>
            <div class="table-title-item" style="width: 160px">故障类型</div>
            <div class="table-title-item" style="width: 120px"></div>
        </div>
        <div class="table-body" @mouseover="clearTimer" @mouseout="setTimer">
            <el-scrollbar :style="{height: height + 'px'}" id="scrollbar" ref="scroll">
                <template v-if="listData.length > 0">
                    <div class="table-body-row" v-for="item,index in listData" :key="index">
                        <div class="table-body-item" style="width: 480px">{{item.taskName}}</div>
                        <div class="table-body-item" style="width: 220px">{{CommonFun.formatterCompanyName(item)}}</div>
                        <div class="table-body-item" style="width: 160px">{{item.eventType}}</div>
                        <div class="table-body-item" style="width: 120px">
                            <div class="btnBox" title="查看" @click="editFun(index, item)"><i class="el-icon-view"></i></div>
                        </div>
                    </div>
                </template>
                <div v-else class="no-data-box">
                    <img src="../../../assets/no-data-table.png"/>
                    <p>暂无数据</p>
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>
<script>
import axiosHttp from "@/js/axiosHttp.js";
import baseUrl from "@/js/baseUrl.js";

const cubic = value => Math.pow(value, 3);
const easeInOutCubic = value => value < 0.5
  ? cubic(value * 2) / 2
  : 1 - cubic((1 - value) * 2) / 2;

export default {
    directives: {
        
    },
    props:{
        isfullscreen: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isfullscreens: false,
            totalPage: 0,
            listData: [],
            resonType: ['', '时延', '丢包', '中断', '流量拥塞'],
            height: 160,
            timer: null,
            timerT: 8000,
            param: {
                page: 1, 
                pageSize: 5, 
                second: 60
            }
        }
    },
    created() {
    },
    beforeDestroy() {
        this.clearTimer();
    },
    mounted() {
        
    },
    methods: {
        init(params) {
            if(!!params) {
                for (const key in params) {
                    if (Object.hasOwnProperty.call(params, key)) {
                        const element = params[key];
                        this.param[key] = element;
                    }
                }
            }
            this.getList(true);
            this.setTimer();
        },
        getList(init) {
            if(!init) {
                this.param.page++;
            } else {
                this.param.page = 1;
            }
            
            if(this.totalPage != 0 && this.param.page > this.totalPage) {
                this.listData = [];
                this.param.page = 1;
            }
            axiosHttp.post(baseUrl.BASEURL + 'topography/tips', this.param).then((res) => {
                let data = res.data;
                
                if (data.status === 1) {
                    data.data.records = data.data.records.map(item => {
                        item['eventType'] = this.resonType[item['eventType']];
                        return item;
                    });
                    this.totalPage = data.data.pages;
                    // this.listData = data.data.records;
                    // this.$set(this.$data, 'listData', this.listData);
                    if(init || this.param.page > this.totalPage) {
                        this.listData = data.data.records;
                    } else {
                        this.listData = data.data.records.concat(this.listData);
                    }
                    
                }
            })
        },
        editFun(index, row) {
            let toPage = '';
            switch(row.eventType) {
                case '时延': toPage = 'analyseDelayDegradation'; break;
                case '丢包': toPage = 'analyseDelayDegradation'; break;
                case '中断': toPage = 'analyseDelayDegradation'; break;
                case 4: break;
            }
            if(toPage) {
                this.$router.push({name: toPage, params: {taskId: row.taskId}});
                sessionStorage.setItem('defaultActive', toPage);
                this.$store.dispatch('setDefaultActive', toPage);
                this.$store.dispatch('pushCurrentExistTabPageArr', toPage);
		        this.$store.dispatch('setCurrentAddress', toPage);
                sessionStorage.setItem('openlist',JSON.stringify(['el-icon-s-order']))
		        this.$store.dispatch('setOpenList', ['el-icon-s-order']);

                let pageTabArr = JSON.parse(sessionStorage.getItem('pageTabArr'));
                for(let i = 0; i < pageTabArr.length; i++) {
                    if(toPage == pageTabArr[i].url) {
                        this.$store.dispatch('setEditableTabsValue', pageTabArr[i].name);
                        break;
                    }
                }
            }
        },
        clearTimer() {
            clearInterval(this.timer);
        },
        setTimer() {
            // let $dom = document.getElementById('scrollbar').querySelector('.el-scrollbar__wrap');
            if(!!this.timer) {
                return
            }
            this.timer = setInterval(() => {
                this.getList();
                this.$nextTick(() => {
                    this.toTop();
                })
            }, this.timerT);
        },
        toTop() {
            // el-scrollbar 容器
            const el = this.$refs['scroll'].wrap;
            
            const beginTime = Date.now();
            const beginValue = 160;
            const rAF = window.requestAnimationFrame || (func => setTimeout(func, 16));
            const frameFunc = () => {
                const progress = (Date.now() - beginTime) / 500;
                if (progress < 1) {
                    el.scrollTop = beginValue * (1 - easeInOutCubic(progress));
                    rAF(frameFunc);
                }
            };
            rAF(frameFunc);
        },
    }
}
</script>
<style lang="scss" scoped>
::v-deep .el-scrollbar__wrap{
    overflow-x: hidden;
}
.no-data-box{
    padding-top: 30px;
}
.table-list-scroll{
    width: 100%;
    height: auto;
    margin-top: 20px;
    .table-title{
        display: flex;
        background-color: rgba(10, 179, 172, .2);
        color: #fff;
        height: 36px;
        line-height: 36px;
        text-align: center;
        font-size: 14px;
    }
    .table-body{
        width: 100%;
        .table-body-row:nth-of-type(even){
            background:rgba(10, 179, 172, .08);
        }
        .table-body-row{
            width: 100%;
            height: 32px;
            padding: 8px 0;
            text-align: left;
            display: flex;
            color: #fff;
            font-size: 14px;
            .table-body-item{
                text-align: center;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }
}
</style>