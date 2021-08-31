<template>
<div class="boxStyle">
  <div class="outerbox-pro">
    <p class="systemHeader">系统状态</p>
    <p class="systemText">平台内存：{{ currentItem.memory }}</p>
    <p class="systemText">硬盘使用状态：{{ currentItem.disk }}</p>
  </div>
</div>
</template>

<script>
import baseUrl from '../js/baseUrl.js';
import axiosHttp from '../js/axiosHttp.js';
import CommonFun from '../js/commonFun.js';
export default {
  name: 'systemStatue',
  data () {
    return {
			getDataUrl:'base/getSystemInfo',
			currentItem:{},
		}
  },
  methods: {
			getData(){
				let $this = this;
				let loading = CommonFun.openFullScreen($this)
				axiosHttp
				.post(baseUrl.BASEURL + $this.getDataUrl, {})
				.then(function(res) {
					CommonFun.closeFullScreen(loading);
					console.log('data res::');
					console.log(res);
					if (res.data.status == 1) {
						$this.currentItem = res.data.data
					}
					if (res.data.status == 0) {
						CommonFun.responseError(res.data, $this);
					}
				})
				.catch(function(err) {
					CommonFun.closeFullScreen(loading);
				});
			},
  },
  created: function () {
		this.getData()
  }
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
    padding: 0;
    color: #fff;
    height: calc(100% - 40px);
}
.outerbox-pro{
	background-color: #03201F;
    height: auto;
    box-sizing: border-box;
    padding: 20px 30px;
    line-height: 24px;
}

.systemHeader{margin-bottom:5px;font-size: 14px;}
.systemText{font-size: 13px;margin-top:5px;}
</style>
