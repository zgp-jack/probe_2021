<template>
<!-- 搜索 开始 -->
	<div class="box">
		<div class="top">
			<el-tabs style="width: 100%;" type="card" v-model="$store.state.editableTabsValue" closable @tab-remove="hidePage" @tab-click="linkRouter">
			  <el-tab-pane
			    v-for="(item, index) in pageTabArr"
			    :key="index"
			    :label="item.name"
			    :name="item.name"
				v-if="$store.state.currentExistTabPageArr.indexOf(item.url)>-1"
			  >
			  </el-tab-pane>
			</el-tabs>
		</div>
		<div class="bottom" :class="[{'bordernone':$store.state.currentAddress=='首页'}]">{{ $store.state.currentAddress=='首页'?'首页 ＞ 统计信息':$store.state.currentAddress }}</div>
	</div>
<!--搜索 结束  -->
</template>

<script>
export default {
  name: 'pageTabComponent',
  data () {
    return {
		pageTabArr:[],
    }
  },
  props: [],
  methods: {
	hidePage(r){
		if(r == '首页'){
			return;
		}
		let $this = this
		let url = ''
		for(let j=0;j<$this.pageTabArr.length;j++){
			let pageTabArrItem = $this.pageTabArr[j]
			if(pageTabArrItem.name == r){
				url = $this.pageTabArr[j].url
			}
		}
		$this.$store.dispatch('popuCurrentExistTabPageArr',url)
		let len2 = $this.$store.state.currentExistTabPageArr.length-1
		console.log('当前currentExistTabPageArr长度：'+len2)
		let len = $this.pageTabArr.length
		let data = {}
		for(let i=0;i<len;i++){
			let item = $this.pageTabArr[i]
			if(item.url == $this.$store.state.currentExistTabPageArr[len2]){
				data = JSON.parse(JSON.stringify(item))
				break;
			}
		}
		sessionStorage.setItem('defaultActive',data.url)//url 路由
		this.$store.dispatch('setDefaultActive', data.url)
		var openlistArr = [];
		openlistArr.push(data.icon);
		sessionStorage.setItem('openlist',JSON.stringify(openlistArr))//openlistArr 是小图标
		this.$store.dispatch('setOpenList', openlistArr)
		this.$store.dispatch('setCurrentAddress',data.url)
		this.$store.dispatch('setEditableTabsValue',data.name)
		this.$router.push('/'+data.url+'')
	},
	linkRouter(r,event){
		let $this = this
		console.log('r::')
		console.log(r)
		console.log(event.target.getAttribute('id'))  //获取到当前元素的id
		let len1 = event.target.baseURI.split('/').length -1
		console.log(event.target.baseURI.split('/')[len1])
		let data = {}
		let len = $this.pageTabArr.length
		for(let i=0;i<len;i++){
			let item = $this.pageTabArr[i]
			if(r.label == item.name){
				data = JSON.parse(JSON.stringify(item))
			}
		}
		console.log('++++++')
		console.log(data.url)
		sessionStorage.setItem('defaultActive',data.url)//url 路由
		$this.$store.dispatch('setDefaultActive', data.url)
		var openlistArr = [];
		openlistArr.push(data.icon);
		sessionStorage.setItem('openlist',JSON.stringify(openlistArr))//openlistArr 是小图标 [el-icon-s-tools]
		$this.$store.dispatch('setOpenList', openlistArr)
		$this.$store.dispatch('setCurrentAddress',data.url)//获得 当前具体地址  pdfView
		$this.$store.dispatch('setEditableTabsValue',data.name)//tab page 高亮显示：$store.state.editableTabsValu  PDF预览测试
		console.log('openlistArr:')
		console.log(openlistArr)
		console.log(data)
		console.log('------')
		console.log(openlistArr)
		console.log(data.name)
		
		$this.$router.push('/'+data.url+'')
	}
},
	created: function (){
		let $this = this
		$this.pageTabArr = JSON.parse(sessionStorage.getItem('pageTabArr'))
	},
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.box{height: 80px !important;width: 100%; background-color: #fff;font-size: 12px;}
	.top{width: 100%; height: 40px;background-color: #f5f5f5;display: flex;}
	.pagetab{padding: 0 15px;height: 40px;display: flex;}
	.pagetab-on{background-color: #fff;}
	.pagetab .page-name,.pagetab i{line-height: 40px;color: #333;cursor: pointer;}
	.pagetab i{margin-left: 5px;font-size: 14px;}
	.pagetab-on .page-name,.pagetab-on i{color: #08a8ff;}
	.pagetab i{cursor: pointer;}
	.bottom{background-color: #fff;color: #999; text-align: left; height: 40px;width: 100%;box-sizing: border-box;padding-left: 15px;line-height: 38px;border:1px solid #E4E7ED;}
	.top >>> .el-tabs__header{margin: 0;}
	.top >>> .el-tabs__content{display: none;}
	.bordernone{border-bottom: none;}
</style>
