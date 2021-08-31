<template>
    <div class="boxStyle parameter">
        <div class="parameter-content1">
            <p class="parameter-content-title">分析引擎事件开始灵敏度设置</p>
            <el-radio-group class="parameter-content-radio" v-model="radioBegin">
                <el-radio :label="1">高</el-radio>
                <el-radio :label="2">中</el-radio>
                <el-radio :label="3">低</el-radio>
                <el-radio :label="4">自定义</el-radio>
            </el-radio-group>
            <div v-if="radioBegin == 4" class="parameter-content-input">
                <span>观察窗口</span>
                <el-input-number class="content-input" v-model="windowNum" controls-position="right" :min="1" :max="100"></el-input-number>
                <span class="content-color">≥</span>
                <el-popover
                    placement="top-start"
                    width="180"
                    trigger="hover"
                    content="值越小，灵敏度越高">
                    <span slot="reference">
                        <span>灵敏度</span>
                        <el-input-number class="content-input" v-model="beginNum" controls-position="right" :min="1" :max="100"></el-input-number>
                    </span>
                </el-popover>
            </div>
        </div>
        <div class="parameter-content1">
            <p class="parameter-content-title">分析引擎事件结束灵敏度设置</p>
            <el-radio-group class="parameter-content-radio" v-model="radioEnd">
                <el-radio :label="1">高</el-radio>
                <el-radio :label="2">中</el-radio>
                <el-radio :label="3">低</el-radio>
                <el-radio :label="4">自定义</el-radio>
            </el-radio-group>
            <div v-if="radioEnd == 4" class="parameter-content-input">
                <!-- <span>观察窗口</span>
                <el-input-number class="content-input" v-model="num" controls-position="right" :min="1" :max="10"></el-input-number>
                <span class="content-color">≥</span> -->
                <el-popover
                    placement="top-start"
                    width="180"
                    trigger="hover"
                    content="值越小，灵敏度越高">
                    <span slot="reference">
                        <span>灵敏度</span>
                        <el-input-number class="content-input" v-model="endNum" controls-position="right" :min="1" :max="100"></el-input-number>
                    </span>
                </el-popover>
            </div>
        </div>
        <div class="parameter-content1">
            <p class="parameter-content-title">丢包率阈值</p>
            <span>阈值</span>
            <el-input-number class="content-input content-input-threshold" v-model="lossValue" controls-position="right" :min="1" :max="100"></el-input-number>
        </div>
        <div class="popup-buts">
            <div class="popup-but popup-but-submit" @click="addAndEditSubmit">保存</div>
            <div class="popup-but popup-but-cancel" @click="regain">恢复默认</div>
        </div>
    </div>
</template>
<script>
import baseUrl from '../../js/baseUrl.js'
import axiosHttp from '../../js/axiosHttp.js'
import CommonFun from '@/js/commonFun'
export default {
    name: 'parameterSetting',
    data(){
        return {
            radioBegin: 1,
            radioEnd: 1,
            windowNum: 1,
            beginNum: 1,
            endNum: 1,
            lossValue: 30,
            id: null,
        }
    },
    methods: {
        addAndEditSubmit() {
            let $this = this;
            let windowSize,windowValue,endNumber;
            if(this.radioBegin == 1){
                windowSize = 1;
                windowValue = 1;
            }else if(this.radioBegin == 2){
                windowSize = 5;
                windowValue = 3;
            }else if(this.radioBegin == 3){
                windowSize = 7;
                windowValue = 5;
            }else{
                windowSize = this.windowNum;
                windowValue = this.beginNum;
            }
            if(this.radioEnd == 1){
                endNumber = 1;
            }else if(this.radioEnd == 2){
                endNumber = 3
            }else if(this.radioEnd == 3){
                endNumber = 5;
            }else{
                endNumber = this.endNum;
            }
            let params = {
                windowSize: windowSize,
                windowValue: windowValue,
                endNumber: endNumber,
                interruptValue: 100,
                lossValue: this.lossValue,
                id: this.id
            }
            axiosHttp
            .post(baseUrl.BASEURL + 'taskDatum/saveFaultThresholdValue', params)
            .then(function(res) {
                if (res.data.status === 1) {
                    CommonFun.responseSuccess(res.data.message, $this)
                    // $this.getList()
                }else{
                    CommonFun.responseError(res.data, $this)
                }
            }).catch(function(err) {
                CommonFun.responseError(err, $this)
            })
        },
        regain() {
            this.radioBegin = 1;
            this.radioEnd = 1;
            this.lossValue = 30;
        },
        getList() {
            let $this = this
            let loading = CommonFun.openFullScreen($this)
            return axiosHttp
                .get(baseUrl.BASEURL + 'taskDatum/getFaultThresholdValue',)
                .then(function(res) {
                    CommonFun.closeFullScreen(loading)
                    let data = res.data.data;
                    if (res.data.status === 1) {
                        if(data.windowSize == 1 && data.windowValue == 1){
                            $this.radioBegin = 1; 
                        }else if(data.windowSize == 5 && data.windowValue == 3){
                            $this.radioBegin = 2;
                        }else if(data.windowSize == 7 && data.windowValue == 5){
                            $this.radioBegin = 3;
                        }else{
                            $this.radioBegin = 4;
                        }
                        if(data.endNumber == 1){
                            $this.radioEnd = 1;
                        }else if(data.endNumber == 3){
                            $this.radioEnd = 2;
                        }else if(data.endNumber == 5){
                            $this.radioEnd = 3;
                        }else{
                            $this.radioEnd = 4;
                        }
                        $this.windowNum = data.windowSize;
                        $this.beginNum = data.windowValue;
                        $this.endNum = data.endNumber;
                        $this.lossValue = data.lossValue;
                        $this.id = data.id;
                    }else {
                        CommonFun.responseError(res.data, $this)
                    }
                }).catch(function(err) {
                    CommonFun.closeFullScreen(loading)
                })
        },
    },
    mounted(){
        this.getList();
    },
}
</script>
<style scoped>
.pagebox{
   display: flex;
   justify-content: flex-end;
}
.boxStyle {
	margin: 20px;
    border: 1px solid rgba(10, 179, 172, 1);
    padding: 30px;
    color: #fff;
    height: calc(100% - 40px);
}
.parameter-content1{
    margin-bottom: 50px;
}
.parameter-content-title{
    font-size: 16px;
    margin-bottom: 15px;
}
.parameter-content-radio{
    margin-bottom: 15px;
}
.content-input {
    position: relative;
    width: 100px;
    margin-left: 15px;
}
.content-input-threshold::after{
    content: '%';
    position: absolute;
    top: 0;
    right: 55px;
}
.content-color {
    font-size: 14px;
    color: #00BDB6;
    margin-left: 15px;
    margin-right: 15px;
}
.popup-buts{
    position: absolute;
    bottom: 100px;
}
</style>