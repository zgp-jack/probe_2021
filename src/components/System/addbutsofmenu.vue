<template>
  <div class="box">
		<p class="earename">新增菜单按钮</p>
		<div class="custom-tree-container">
			<div class="block">
				<el-tree
					:data="$store.state.naviArr"
					show-checkbox
					class="filter-tree"
					node-key="id"
					default-expand-all
					:expand-on-click-node="false"
					:render-content="renderContent">
				</el-tree>
			</div>
		</div>
		<!-- 为菜单新增按钮 -->
		<el-dialog :visible.sync="dialogTableVisible">
			<div class="butbox">
				<div class="butShow" 
				v-for="(item,index) in $store.state.butsArr" 
				:key="index" 
				v-html="item.name" 
				@click="ifSelectBut(item)"
				:class="[{onselectbuts:exitedButsIds_new.indexOf(item.id)>-1}]">
				</div>
			</div>
			<input class="input-requestMapping" placeholder="请输入请求映射" type="text" v-model="requestMapping" /> 
			<div class="buts">
				<div class="submit-but-selectParent" @click="submitSelectbuts">确 定</div>
				<div class="cancel-but-selectParent" @click="dialogTableVisible=!dialogTableVisible">取 消</div>
			</div>
		</el-dialog>
		
  </div>
</template>

<script>
import axiosHttp from '../../js/axiosHttp.js';
import baseUrl from '../../js/baseUrl.js'
  export default {
    name: 'addButsOfMenu',
		data(){
			return ({
				dialogTableVisible:false,
				exitedButsIds:[],//当前选中菜单中已经存在的按钮ids
				exitedButsIds_new:[],
				newButId:'',//当前选中按钮的id
				requestMapping :'',//映射 input
				addButForMenuUrl:'resource/action/save',
				menuId:''//菜单id
			})
		},
    components: {

    },
		methods:{
			addButsForMenu:function(node, data){
				console.log(data)
				this.exitedButsIds=[]
				this.exitedButsIds_new = []
				this.menuId = data.id
				var buttons = data.buttons?data.buttons:[]
				var buttonsLen = buttons.length
				if(buttonsLen>0){
					for(var i=0;i<buttonsLen;i++){
						var item = buttons[i]
						this.exitedButsIds.push(item.buttonId)
						this.exitedButsIds_new.push(item.buttonId)
					}
				}else{
					this.exitedButsIds = []
					this.exitedButsIds_new = []
				}
				this.dialogTableVisible = !this.dialogTableVisible
				console.log("exitedButsIds_new:")
				console.log(this.exitedButsIds_new)
				console.log("exitedButsIds:")
				console.log(this.exitedButsIds)
			},
			renderContent(h, { node, data, store }) {
				if(data.children){
						return (
						  <span class="custom-tree-node">
							<span>{node.label}</span>
						  </span>);
				}
				return (
				  <span class="custom-tree-node">
					<span>{node.label}</span>
					<span>
					  <el-button size="mini" type="text" on-click={ () => this.addButsForMenu(node, data) }>新增</el-button>
					</span>
				  </span>);
			},
			/* 选中或者弃选某个按钮 */
			ifSelectBut(item){
				var index  = this.exitedButsIds.indexOf(item.id)
				var index_new = this.exitedButsIds_new.indexOf(item.id)
				var len = this.exitedButsIds.length
				var len_new = this.exitedButsIds_new.length
				if(index>-1){//如果点击的是之前已有的按钮则
				console.log(0)
					this.newButId = ''
				}else{
					if(index_new>-1){
						console.log("1")
						this.exitedButsIds_new.splice(index_new,1)
						this.newButId = ''
					}else{
						if(len_new>len){
							console.log(3)
							this.exitedButsIds_new.splice((len_new-1),1)
							this.exitedButsIds_new.push(item.id)
							this.newButId = item.id
						}else{
							console.log(2)
							this.exitedButsIds_new.push(item.id)
							this.newButId = item.id
						}
					}
				}
			},
			submitSelectbuts(){
				var $this = this;
				let loading = CommonFun.openFullScreen($this)
				if(this.newButId == '' || this.requestMapping == ''){
					$this.$message.error('必须选中一个按钮,并且输入映射才能进行添加');
					CommonFun.closeFullScreen(loading)
					return;
				}
				var param = {menuId:this.menuId,buttonId:this.newButId,requestMapping :this.requestMapping}
				axiosHttp.post(baseUrl.BASEURL+$this.addButForMenuUrl,param).then(function(res){
					console.log("为页面添加按钮结果")
					console.log(res)
					CommonFun.closeFullScreen(loading)
					if(res.data.status == 1){
						$this.$store.dispatch('getNaviData')
						$this.$message({
						  message: '菜单添加按钮成功！',
						  type: 'success'
						});
						$this.requestMapping = ''
						$this.dialogTableVisible = !$this.dialogTableVisible
					}
				}).catch(function(res){
					CommonFun.closeFullScreen(loading)
					$this.$message.error(res.meaasge);
				})
			}
		}
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
	.earename{font-size: 18px;font-weight: bold;margin-bottom: 20px;}
	.butbox{padding: 20px;border:1px solid #dedede; max-width: 500px;overflow: hidden}
	.addBut{width: 300px;height: 40px;background-color: #58a7ea;color: #fff;text-align: center;cursor: pointer;line-height: 40px;margin-top: 20px;}
	.buts{margin-top: 30px;display: flex;justify-content: flex-end;}
	.buts div{line-height: 40px;padding: 0 30px;margin-right: 10px;cursor: pointer;}
	.buts .submit-but-selectParent{background-color: #58a7ea;color: #fff}
	.buts .cancel-but-selectParent{background-color: #fafafa;color: #adadad}
	.butbox{padding: 20px;border:1px solid #dedede; max-width: 500px;overflow: hidden}
	.butShow{float: left; padding: 10px 20px;background-color: #ddd;color:#fff;width: 100px;text-align: center;margin: 7px;cursor: pointer;}
	.onselectbuts{background-color: #ffac5b;}
	.input-requestMapping{display: block;width: 500px;border: 1px solid #ddd;height: 40px;line-height: 40px;margin-top: 20px;}
</style>
