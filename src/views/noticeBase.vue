<template>
<div class="boxStyle">
  <div class="outerbox-pro">
    <div class="fun-box">
      <div class="topruleform">
			<el-input class="gapright topruleform-width240" v-model="serachData.name" placeholder="请输入公告名称"></el-input>
			<div class="popup-but-submit" @click="searchAction"><i class="el-icon-search"></i></div>
			<div class="but add-but popup-but-submit" @click="addFun">新增公告</div>
		</div>
    </div>
    <div class="listbox">
      <div class="list-outer-div">
        <div class="list-content-div">
            <template>
              <el-table
                :data="listData"
                stripe :cell-style="{textAlign: 'center',height: '40px'}" :header-cell-style="{background:'rgba(10, 179, 172, .2)',height:'40px',textAlign:'center'}"  style="width: 100%">
                <el-table-column prop="index" label="序号" type="index"  align="center"></el-table-column>
                <el-table-column prop="name" label="公告名称" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="createUser" label="创建人"></el-table-column>
                <el-table-column prop="gmtCreate" label="创建日期"></el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <div class="btnBox" title="编辑" @click="editFun(scope.$index, scope.row)"><i class="el-icon-edit-outline"></i></div>
					<div class="btnBox" title="查看"  @click="showFun(scope.$index, scope.row)"><i class="el-icon-view"></i></div>
                    <div class="btnBox" title="删除" @click="deleteFun(scope.$index, scope.row)"><i class="el-icon-delete"></i></div>
                  </template>
                </el-table-column>
              </el-table>
            </template>
        </div>
        <div class="pagebox">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="$store.state.pageSize"
            layout="total,prev, pager, next, jumper"
            :total="totle">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 弹出框  add edit-->
    <el-dialog
      :visible.sync="dialogTableVisible_addAndedit"
      :close-on-click-modal="false"
      width="690px">
      <div class="popup">
        <div class="title">{{ popupTitle }}</div>
        <div
          class="hidepopup"
          @click="dialogTableVisible_addAndedit=!dialogTableVisible_addAndedit"
        >×</div>
        <div class="add-info-box">
          <el-form :model="currentItem" :rules="ruleAddEdit" ref="validateAddEdit" class="popupruleform">
			<el-form-item prop="name" label="公告名称" class="popupruleform-width-100">
			  <el-input class="add-item-input" type="text" :disabled="isDisabled" v-model="currentItem.name" maxlength="50"></el-input>
			</el-form-item>
			<el-form-item prop="content" label="公告内容" class="popupruleform-width-100">
			  <el-input class="add-item-input" type="textarea" :rows="20" :disabled="isDisabled" v-model="currentItem.content"></el-input>
			</el-form-item>
          </el-form>
        </div>
        <div class="popup-buts">
          <el-button type="danger" @click="addAndEditSubmit">确定</el-button>
          <div
            class="popup-but popup-but-cancel"
            @click="dialogTableVisible_addAndedit= !dialogTableVisible_addAndedit"
          >取消</div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogTableVisible_delete"
      :close-on-click-modal="false"
      width="21.9%">
      <div class="popup">
        <div class="title">{{ popupTitle }}</div>
        <div class="hidepopup" @click="dialogTableVisible_delete=!dialogTableVisible_delete">×</div>
        <div class="add-info-box">
          <p class="popop-tipinfo">确定删除该数据吗？</p>
        </div>
        <div class="popup-buts">
          <div class="popup-but popup-but-submit" @click="submitDelete">确定</div>
          <div
            class="popup-but popup-but-cancel"
            @click="dialogTableVisible_delete= !dialogTableVisible_delete"
          >取消</div>
        </div>
      </div>
    </el-dialog>
  </div>
</div>
</template>

<script>
import baseUrl from '../js/baseUrl.js'
import axiosHttp from '../js/axiosHttp.js'
import CommonFun from '../js/commonFun.js'
export default {
  name: 'noticeBase',
  data () {
    return {
      dialogTableVisible_addAndedit: false,
      dialogTableVisible_delete: false,
      currentPage: 1,
      totle: 0,
      popupTitle: '新增',
      currentItem: {}, // 当前新增 编辑 删除项
      serachData: {}, // 搜索条件数据
      getListUrl: 'noticeBase/listPage',
      saveListUrl: 'noticeBase/save',
      deleteListUrl: 'noticeBase/delete',
      listData: [],
	  currentButtonJurisdiction: CommonFun.getCurrentButtonJurisdiction('noticeBase'),
      ruleAddEdit: {},
	  isDisabled: false,
    }
  },
  methods: {
	  /* 搜索 */
    searchAction(){
		let $this = this
        $this.currentPage = 1
        $this.getList()
    },
	/* 获得列表 */
    getList(){
        let $this = this
	    let loading = CommonFun.openFullScreen($this)
	    $this.serachData.page = $this.currentPage
	    $this.serachData.pageSize = $this.$store.state.pageSize
		
        return axiosHttp
        .post(baseUrl.BASEURL + $this.getListUrl, $this.serachData)
        .then(function (res) {
			CommonFun.closeFullScreen(loading)
			console.log('列表::')
			console.log(res)
          if (res.data.status === 1) {
            $this.totle = res.data.data.total
            $this.listData = res.data.data.records
          }
          if (res.data.status === 0) {
            CommonFun.responseError(res.data, $this)
          }
        }).catch(function(err){
			CommonFun.closeFullScreen(loading)
		})
    },
	/* 新增 */
    addFun(){
		let $this = this
		$this.isDisabled = false
		$this.dialogTableVisible_addAndedit = true
		$this.popupTitle = '新增'
		$this.currentItem = {}
    },
	/* 编辑 */
    editFun(index, item){
		let $this = this
		$this.isDisabled = false
        $this.dialogTableVisible_addAndedit = true
        $this.popupTitle = '编辑'
        $this.currentItem = item
	},
	/* 查看 */
    showFun(index, item){
		let $this = this
		$this.isDisabled = true
        $this.dialogTableVisible_addAndedit = true
        $this.popupTitle = '查看'
        $this.currentItem = item
	},
	/* 删除 */
    deleteFun(index,item){
		let $this = this
        this.dialogTableVisible_delete = true
        this.popupTitle = '删除'
        this.currentItem = item
    },
	/*   submit 新增 编辑 */
    addAndEditSubmit() {
        let $this = this
	    let loading = CommonFun.openFullScreen($this)
        axiosHttp
        .post(baseUrl.BASEURL + $this.saveListUrl, $this.currentItem)
        .then(function (res) {
		    CommonFun.closeFullScreen(loading)
            if (res.data.status === 1) {
				CommonFun.responseSuccess(res.data.message, $this)
				$this.getList()
				$this.dialogTableVisible_addAndedit = false
            }
			if (res.data.status === 0) {
				CommonFun.responseError(res.data, $this)
            }
		}).catch(function(err){
		    CommonFun.closeFullScreen(loading)
		})
    },
	/* submit 删除 */
    submitDelete(){
        let $this = this
        let obj = { id: $this.currentItem.id }
	    let loading = CommonFun.openFullScreen($this)
        axiosHttp
        .delete(baseUrl.BASEURL + $this.deleteListUrl, { data: obj })
        .then(function (res) {
			CommonFun.closeFullScreen(loading)
            if (res.data.status === 1) {
				CommonFun.responseSuccess(res.data.message, $this)
				$this.getList()
				$this.dialogTableVisible_delete = false
            }
        })
        .catch(function (error) {
		  CommonFun.closeFullScreen(loading)
          CommonFun.responseError(error, $this)
        })
    },
	/* 分页跳转 */
    handleCurrentChange(val){
		let $this = this
        $this.currentPage = val
        $this.getList()
    },
  },
  created: function () {
	let $this = this
	let loading = CommonFun.openFullScreen($this)
	$this.getList().then((res,error) => {
	  CommonFun.closeFullScreen(loading)
	})
  }
}
</script>

<style scoped>
.listbox{
  height: calc(100% - 47px);
}
.totalNum{
  display: flex;
  align-items: flex-end;
}
.totalNum p {
  height: 36px;
  line-height: 36px;
  font-size: 13px;
  color: #333;
}
.errortip1{position: absolute;top: 25px;left: 84px;line-height: 20px;font-size: 12px;color: red;}
.errortip2{position: absolute;top: 60px;left: 205px;line-height: 20px;font-size: 12px;color: red;}
.avatar-uploader-icon{width: 200px;height: 100px;border: 1px dotted #ddd;}
.image-tip{font-size: 12px;margin-bottom: 10px;}
.add-tip{margin: 5px;color: #66b1ff;font-size: 12px;cursor: pointer;}

.uploader-example {
    width: 880px;
    padding: 15px;
    margin: 40px auto 0;
    font-size: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .4);
  }
  .uploader-example .uploader-btn {
    margin-right: 4px;
  }
  .uploader-example .uploader-list {
    max-height: 440px;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .popup-but-submit {
    margin-left: 20px;
  }
  .topruleform-width240 {
    width: 240px;
  }
</style>
