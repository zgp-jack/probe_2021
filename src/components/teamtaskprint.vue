<template>
  <el-dialog :visible.sync="isShowDialog" :close-on-click-modal="false" :close-on-press-escape="false" width="70%">
    <div class="popup">
      <div class="title">打印预览</div>
      <div class="hidepopup" @click="clickClose"></div>
      <vue-easy-print table-show ref="printItem" id="printId">
        <template slot-scope>
          <div class="add-info-box add-info-box-view">
            <div class="headerName">班组生产任务书</div>
            <div class="taskContentBox">
              <div class="add-item-div flex2">
                <div class="viewHeader">{{preview.className}}</div>
              </div>
              <div class="flex2"></div>
              <div class="add-item-div flex2">
                <div class="viewHeader">{{preview.workbookDate}}</div>
              </div>
              <div class="flex2"></div>
              <div class="add-item-div flex2">
                <div class="viewHeader">{{formatType(preview.type)}}</div>
              </div>
              <div class="flex2"></div>
            </div>
            <div class="taskContentBox">
              <div class="add-item-div add-item-div1 flex2">
                <div class="taskName">地层</div>
              </div>
              <div class="add-item-div add-item-div1 flex2">
                <div class="taskName whiteBg">{{preview.layer}}</div>
              </div>
              <div class="add-item-div add-item-div1 flex1">
                <div class="taskName">岩性</div>
              </div>
              <div class="add-item-div add-item-div1 flex2">
                <div class="taskName whiteBg">{{preview.lithology}}</div>
              </div>
              <div class="add-item-div add-item-div1 flex1">
                <div class="taskName">司钻</div>
              </div>
              <div class="add-item-div add-item-div1 flex1">
                <div class="taskName whiteBg">{{preview.drillerName}}</div>
              </div>
              <div class="add-item-div add-item-div1 flex1">
                <div class="taskName">技术负责人</div>
              </div>
              <div class="add-item-div add-item-div1 flex2">
                <div class="taskName whiteBg borderRight">{{preview.technicalName}}</div>
              </div>
            </div>
            <div class="taskContentBox">
              <div class="add-item-div add-item-divnew flex4 blackBg">
                <div class="taskNameNew blackBg">本班任务流程</div>
              </div>
              <div class="add-item-div add-item-divnew flex8 borderRight">
                <div class="taskNameNew whiteBg">{{preview.taskFlow}}</div>
              </div>
            </div>
            <div style="margin-top: 10px;"></div>
            <div class="taskContentBox" v-if="preview.drillingClassTask">
              <div class="add-item-div add-item-div1 flex2">
                <div class="taskName">量化任务</div>
              </div>
              <div class="add-item-div add-item-div1 flex2">
                <div class="taskName">参数</div>
              </div>
              <div class="add-item-div add-item-div1 flex3">
                <div class="taskName">重点风险提示</div>
              </div>
              <div class="add-item-div add-item-div1 flex4">
                <div class="taskName">技术与安全措施</div>
              </div>
              <div class="add-item-div add-item-div1 flex1">
                <div class="taskName borderRight">预计时间</div>
              </div>
            </div>
            <div class="taskContentBox" v-if="preview.drillingClassTask">
              <div class="add-item-div add-item-divnew flex2">
                <div class="taskNameNew">
                  <span>{{preview.drillingClassTask.taskName}}</span>
                </div>
              </div>
              <div class="add-item-div add-item-divnew flex2 parametric">
                <div class="taskName3">
                  <div class="parametricBox">
                    <div class="taskName1">
                      钻压
                      <br />（KN）
                    </div>
                    <div class="taskName1 taskName1Bg">
                      <div
                        class="add-item-input1 flex1"
                      >{{preview.drillingClassTask.drillingPressure}}</div>
                    </div>
                  </div>
                  <div class="parametricBox">
                    <div class="taskName1">
                      转速
                      <br />（rpm）
                    </div>
                    <div class="taskName1 taskName1Bg">
                      <div class="add-item-input1 flex1">{{preview.drillingClassTask.rotateSpeed}}</div>
                    </div>
                  </div>
                  <div class="parametricBox">
                    <div class="taskName1">
                      排量
                      <br />（l/s）
                    </div>
                    <div class="taskName1 taskName1Bg">
                      <div class="add-item-input1 flex1">{{preview.drillingClassTask.displacement}}</div>
                    </div>
                  </div>
                  <div class="parametricBox">
                    <div class="taskName1">
                      泵压
                      <br />（MPa）
                    </div>
                    <div class="taskName1 taskName1Bg">
                      <div
                        class="add-item-input1 flex1"
                      >{{preview.drillingClassTask.pumpingPressure}}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="add-item-div add-item-divnew flex3">
                <div class="taskNameNew">
                  <span v-html="preview.drillingClassTask.taskRisk"></span>
                </div>
              </div>
              <div class="add-item-div add-item-divnew flex4">
                <div class="taskNameNew">
                  <span style="white-space: pre-line" v-html="preview.drillingClassTask.taskSafety"></span>
                </div>
              </div>
              <div class="add-item-div add-item-divnew flex1 borderRight">
                <div class="taskNameNew">
                  <span>{{preview.drillingClassTask.gmtPlan}}</span>
                </div>
              </div>
            </div>
            <div style="margin-top: 10px;"></div>
            <div
              class="taskContentBox"
              v-if="preview.otherClassTasks && preview.otherClassTasks.length>0"
            >
              <div class="add-item-div add-item-div1 flex2">
                <div class="taskName">其他任务</div>
              </div>
              <div class="add-item-div add-item-div1 flex2">
                <div class="taskName">负责人</div>
              </div>
              <div class="add-item-div add-item-div1 flex3">
                <div class="taskName">重点风险提示</div>
              </div>
              <div class="add-item-div add-item-div1 flex4">
                <div class="taskName">技术与安全措施</div>
              </div>
              <div class="add-item-div add-item-div1 flex1">
                <div class="taskName borderRight">预计时间</div>
              </div>
            </div>
            <div
              v-for="(item,index) in preview.otherClassTasks"
              :key="index"
              class="taskContentBox"
            >
              <div class="taskContentBox">
                <div class="add-item-div add-item-divnew flex2">
                  <div class="taskNameNew">
                    <p>
                      <span>{{formatClassTaskType(item.type)}}：</span>
                      {{item.taskName}}
                    </p>
                  </div>
                </div>
                <div class="add-item-div add-item-divnew flex2">
                  <div class="taskNameNew">
                    <span>{{item.responsibilityUser}}</span>
                  </div>
                </div>
                <div class="add-item-div add-item-divnew flex3">
                  <div class="taskNameNew">
                    <span v-html="item.taskRisk"></span>
                  </div>
                </div>
                <div class="add-item-div add-item-divnew flex4">
                  <div class="taskNameNew">
                    <span v-html="item.taskSafety"></span>
                  </div>
                </div>
                <div class="add-item-div add-item-divnew flex1 borderRight">
                  <div class="taskNameNew">
                    <span>{{item.gmtPlan}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div style="margin-top: 10px;"></div>
          </div>
        </template>
      </vue-easy-print>
      <div class="popup-buts">
        <div class="popup-but popup-but-submit" @click="submitPrint">打 印</div>
        <div class="popup-but popup-but-cancel" @click="clickCancel">取 消</div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import CommonFun from '../js/commonFun.js'
import vueEasyPrint from 'vue-easy-print'

export default {
  name: 'TeamTaskPrint',
  components: {
    vueEasyPrint
  },
  data () {
    return {}
  },
  props: ['preview', 'isShowDialog'],
  methods: {
    formatType: function (type) {
      return CommonFun.formatClassType(type)
    },
    // 格式化type
    formatClassTaskType: function (type) {
      return CommonFun.formatClassTaskType(type)
    },
    // 取消按钮
    clickCancel: function () {
      this.$emit('cancel', false)
    },
    // 关闭按钮
    clickClose: function () {
      this.$emit('close', false)
    },
    // 提交打印
    submitPrint: function () {
      this.$refs.printItem.print()
      // this.getPdf("printId", "班组生产任务书");
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@page {
  size: auto A4 landscape;
  margin: 3mm;
}
@media print {
  html,
  body {
    height: inherit;
  }
}
.headerName {
  width: 100%;
  text-align: center;
  font-size: 22px;
  font-weight: bolder;
  color: #333;
  margin: 10px 0px 20px;
}
.taskContentBox {
  display: flex; /* justify-content:space-between; */
}
.parametric {
  display: flex;
  flex-direction: column;
}
.add-info-box {
  display: flex;
  padding-right: 8px;
  flex-wrap: wrap;
}
.add-info-box-view {
  padding: 16px 22px 22px 22px;
  padding-right: 22px !important;
}
.add-item-div {
  width: 31%;
  margin-right: 2%;
}
.taskName1 {
  background: #f5f5f5;
  border: 1px solid #000;
  color: #333;
  text-align: center;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  /* margin-right: -1px; */
  margin-left: -1px;
}
.taskName {
  background: #f5f5f5;
  border: 1px solid #000;
  border-right: none;
  height: 38px;
  color: #333;
  line-height: 38px;
  text-align: center;
}
.taskName3 {
  background: #fff;
  height: 200px;
  color: #333;
  text-align: center;
  width: 100%;
}
.addTaskList {
  width: 100%;
  height: 40px;
  border: 1px solid #000;
  text-align: center;
  line-height: 40px;
  color: #333;
}
.add-item-div1 {
  margin-bottom: 0px;
  margin-right: -1px;
  margin-bottom: -1px;
}
.taskContentBox .taskName {
  font-weight: 500;
  font-size: 12px;
}
.taskContentBox .add-item-div {
  font-size: 12px;
  color: #333;
}
.taskContentBox .add-item-div1 {
  margin-right: 0px;
}
.taskContentBox .add-item-input1 {
  font-size: 12px;
}
.add-info-box-view .taskContentBox {
  display: flex;
  width: 100%;
  margin-bottom: 0px;
  margin-top: 0px;
}
.taskNameNew {
  background: #fff;
  /* border: 1px solid #ededed; */
  /* height: 100%; */
  color: #333;
  text-align: left;
  width: 98%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
  margin-bottom: 0px;
  padding: 10px 10px;
}
.parametricBox {
  display: flex;
  width: 100%;
  margin-bottom: -1px;
}
.add-item-divnew .taskName3 {
  background: #fff;
  /* border: 1px solid #ededed; */
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-top: -1px;
  margin-left: -2px;
  /* height: 100%; */
  color: #333;
  text-align: left;
  width: 100%;
}
.add-item-divnew .taskName1 {
  margin-left: 0px;
  border-right: none;
}
.add-item-divnew .taskName1Bg {
  background: #fff;
}
.borderRight {
  border-right: 1px solid #000 !important;
  margin-right: -2px !important;
}
.whiteBg {
  background: #fff;
}
.blackBg {
  background: #f5f5f5;
}
.add-item-divnew .taskName3 .parametricBox {
  flex: 1;
  margin-bottom: -1px;
}
.add-item-divnew {
  margin-bottom: 0px;
  margin-right: -1px;
  margin-bottom: -1px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #000;
  border-right: none;
}
.taskNameNew span{white-space: pre-line}
</style>
