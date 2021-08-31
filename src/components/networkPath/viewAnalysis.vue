<template>
    <div class="faultAnalysisDetail-view">
      <p class="faultAnalysisDetail-title">基本信息</p>
      <hr class="faultAnalysisDetail-title-line" />
      <div class="faultAnalysisDetail-view-container">
        <div class="basic-item" v-for="(value, index) in viewAnalysis" :key="index">{{(value[0]?value[0]:'') + ': ' + (value[1]?value[1]:'')}}</div>
        <!-- <div class="basic-item">机构名称: 5.2拨测任务</div>
        <div class="basic-item">拨测接口: 192.168.2.4</div>
        <div class="basic-item">目的地址: 192.168.2.4</div>
        <div class="basic-item">故障类型: 时延劣化</div>
        <div class="basic-item">任务类型: 拨测任务</div>
        <div class="basic-item">故障节点对: 192.168.2.4—192.168.4.4</div>
        <div class="basic-item">故障原因: CPU利用率偏高</div> -->
      </div>
    </div>
</template>
<script>
import CommonFun from '@/js/commonFun.js'
export default {
    name: 'viewAnalysis',
    data() {
        return {
            id: this.$route.query.id,
            viewAnalysis: {...this.viewAnalysisData}
        }
    },
    props: ["viewAnalysisData"],
}
</script>
<style lang="scss" scoped>
  .faultAnalysisDetail-view-container {
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .basic-item{
    width: 450px;
    height: 30px;
    line-height: 30px;
    background-color: rgba(2, 37, 37, 1);
    border-left: 2px solid rgba(1, 242, 232, 1);
    padding-left: 10px;
    margin-bottom: 30px;
  }
  .faultAnalysisDetail .faultAnalysisDetail-view {
    padding-bottom: 0;
  }
</style>