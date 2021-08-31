<template>
  <div class="box">
		<p class="earename">按钮列表</p>
		<div class="butbox">
			<div class="butShow" v-for="(item,index) in $store.state.butsArr" :key="index" v-html="item.name">
			</div>
		</div>
		<div class="addBut" @click="dialogTableVisible = !dialogTableVisible">增加按钮</div>
		<div class="addBut" @click="dialogTableVisible_delete = !dialogTableVisible_delete">删除按钮</div>
		<el-dialog :visible.sync="dialogTableVisible">
			<input type="text" placeholder="请输入按钮名称" class="inputButName" v-model="newBut.name" />
			<input type="text" placeholder="请输入code名称" class="inputButCode" v-model="newBut.code" />
			<div class="buts">
				<div class="submit-but-selectParent" @click="submitAddBut">确 定</div>
				<div class="cancel-but-selectParent" @click="dialogTableVisible = !dialogTableVisible">取 消</div>
			</div>
		</el-dialog>
		<el-dialog :visible.sync="dialogTableVisible_delete">
			<p class="tip">点击选中</p>
			<div class="butShow" v-for="(item,index) in $store.state.butsArr" :key="index" v-html="item.name" @click="selectDeleteBut(item,index)" :class="[{onselectdelete:deleteButsIds.indexOf(item.id)>-1}]"> 
			</div>
			<div class="buts">
				<div class="submit-but-selectParent" @click="submitDeteteBut">确 定</div>
				<div class="cancel-but-selectParent" @click="dialogTableVisible_delete = !dialogTableVisible_delete">取 消</div>
			</div>
		</el-dialog>
  </div>
</template>

<script>
import axiosHttp from '../../js/axiosHttp.js';
import baseUrl from '../../js/baseUrl.js'
  export default {
    name: 'addBut',
		data(){
			return ({
				dialogTableVisible:false,
				dialogTableVisible_delete:false,
				addButUrl:'resource/button/save',
				deleteButUrl:'resource/button/delete',
				newBut:{name:'',code:''},
				deleteButsIds:[]
			})
		},
    components: {

    },
		methods:{
			submitAddBut:function(){
				var $this = this;
				let loading = CommonFun.openFullScreen($this)
				axiosHttp.post(baseUrl.BASEURL+$this.addButUrl,this.newBut).then(function(res){
					console.log('新添加按钮结果：')
					console.log(res)
					CommonFun.closeFullScreen(loading)
					if(res.data.status == 1){
						$this.$store.dispatch('getButsData')
						$this.dialogTableVisible = false
						$this.$message({
						  message: '新增按钮成功！',
						  type: 'success'
						});
						$this.newBut = {name:'',code:''}
					}
				}).catch(function(res){
					CommonFun.closeFullScreen(loading)
					$this.$message.error(res.data.message);
				})
			},
			selectDeleteBut:function(item,index){
				if(this.deleteButsIds.indexOf(item.id)>-1){
					var index = this.deleteButsIds.indexOf(item.id)
					this.deleteButsIds.splice(index,1)
				}else{
					this.deleteButsIds.push(item.id)
				}
			},
			submitDeteteBut(){
				var $this = this;
				let loading = CommonFun.openFullScreen($this)
				axiosHttp.post(baseUrl.BASEURL+this.deleteButUrl,{ids:this.deleteButsIds}).then(function(res){
					console.log('删除按钮结果：')
					console.log(res)
					CommonFun.closeFullScreen(loading)
					if(res.data.status == 1){
						$this.$store.dispatch('getButsData')
						$this.dialogTableVisible_delete = false
						$this.$message({
						  message: '删除按钮成功！',
						  type: 'success'
						});
						$this.deleteButsIds = []
						
					}
				}).catch(function(res){
					CommonFun.closeFullScreen(loading)
					$this.$message.error(res.data.message);
				})
			}
		},
		created:function(){
			this.$store.dispatch('getButsData')
		}
  }
</script>
<style scoped lang="scss">
	.earename{font-size: 18px;font-weight: bold;margin-bottom: 20px;}
	.butbox{padding: 20px;border:1px solid #dedede; max-width: 500px;overflow: hidden}
	.addBut{width: 300px;height: 40px;background-color: #58a7ea;color: #fff;text-align: center;cursor: pointer;line-height: 40px;margin-top: 20px;}
	.buts{margin-top: 30px;display: flex;justify-content: flex-end;}
	.buts div{line-height: 40px;padding: 0 30px;margin-right: 10px;cursor: pointer;}
	.buts .submit-but-selectParent{background-color: #58a7ea;color: #fff}
	.buts .cancel-but-selectParent{background-color: #fafafa;color: #adadad}
	.inputButCode,.inputButName{display: block;height: 40px;border: 1px solid #ddd;padding: 5px;line-height: 40px;width: 500px;margin-top: 20px;}
	.butShow{float: left; padding: 10px 20px;background-color: #ffac5b;color:#fff;width: 100px;text-align: center;margin: 7px;cursor: pointer;}
	.onselectdelete{background-color: #ddd;}
</style>
