<template>
    <div class="popupManagement">
        <div class="listbox">
            <div class="fun-box">
                <div class="topruleform">
                    <div class="topruleform-item" style="margin-right: 20px">
                        <p class="topruleform-margin">规则名称：</p>
                        <el-input class="topruleform-width180" v-model="searchData.name" placeholder="请输入规则名称"></el-input>
                    </div>
                    <div class="topruleform-item">
						<p class="topruleform-margin">机构名称：</p>
						<div :class="['search-div topruleform-width300',{'search-div-placeholder':currenCompanyNames == '选择单位'}]" @click="selectCompanyFun(1)">{{ currenCompanyNames }}</div>
                    </div>
                    <div class="topruleform-item">
                        <div class="but popup-but-submit" @click="searchAction"><i class="el-icon-search"></i></div>
                        <div v-if="currentButtonJurisdiction.indexOf('add')>-1" class="but popup-but-submit" style="margin-left: 20px" @click="addFun">新增告警规则</div>
                    </div>
                </div>
            </div>
            <div class="list-outer-div">
                <div class="list-content-div">
                    <template>
                        <el-table :data="listData" @sort-change='sortChangeFun' @filter-change="filterData" height="100%" stripe :cell-style="{textAlign: 'center',height: '40px'}" :header-cell-style="{background:'rgba(10, 179, 172, .2)',height:'40px',textAlign:'center'}"  style="width: 100%">
                            <el-table-column prop="index" label="序号" type="index" align="center"></el-table-column>
                            <el-table-column prop="name" label="规则名称" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="gmtCreate" sortable='custom'  label="创建时间"></el-table-column>
                            <el-table-column :formatter="CommonFun.formatterCompanyName" label="机构" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="username" label="创建用户" ></el-table-column>
                            <el-table-column prop="timeDesc" label="弹窗生效起止日期"></el-table-column>
                            <el-table-column prop="eventTypeName" label="告警类型"
                                column-key="eventTypeName"
                                :filters="eventOption"
                                filter-placement="bottom"></el-table-column>
                            <el-table-column prop="gradeName" label="告警等级"
                                column-key="gradeName"
                                :filters="gradeOption"
                                filter-placement="bottom">
                                <template slot-scope="scope">
                                    <span class="grade-color1">{{scope.row.grade.indexOf('1') == -1? '':'　低'}}</span>
                                    <span class="grade-color2">{{scope.row.grade.indexOf('2') == -1? '':'　中'}}</span>
                                    <span class="grade-color3">{{scope.row.grade.indexOf('3') == -1? '':'　高'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="time" sortable='custom' label="弹窗条件">
                                <template slot-scope="scope">
                                    <span>≥{{scope.row.time}}S</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="statusName" label="弹窗状态"
                                column-key="statusName"
                                :filters="statusOption"
                                :filter-multiple="false"
                                filter-placement="bottom">
                                <template slot-scope="scope">
                                    <!-- <span style="margin-right: 10px;">{{scope.row.statusName}}</span> -->
                                    <el-switch
                                        @change="changeSwitch(scope.row)"
                                        v-model="scope.row.status"
                                        :active-value="1"
                                        :inactive-value="0"
                                        active-color="#009E91"
                                        inactive-color="#324141">
                                    </el-switch>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" align="center">
                                <template slot-scope="scope">
                                    <div v-if="currentButtonJurisdiction.indexOf('edit')>-1" class="btnBox" title="编辑" @click="editFun(scope.$index, scope.row)"><i
											 class="el-icon-edit-outline"></i></div>
                                    <div v-if="currentButtonJurisdiction.indexOf('delete')>-1" class="btnBox" title="删除" @click="deleteFun(scope.$index, scope.row)"><i
                                            class="el-icon-delete"></i></div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </div>
                <div class="pagebox">
                    <el-pagination 
                    @current-change="handleCurrentChange" 
                    :current-page.sync="currentPage" 
                    :page-size="pageSize"
                    :page-sizes="$store.state.pageSizeS"
                    @size-change="handleSizeChange"
                    layout="sizes,total,prev, pager, next, jumper" 
                    :total="totle">
                    </el-pagination>
                    <!-- <el-upload :action="uploadUrl"
                        :show-file-list='false'
                        :on-success="handleUploadSuccess"
                        :on-error='handleUploadError'
                        :before-upload='handleUploadBefore'
                        :headers="myHeaders" 
                        accept=".xlsx,.xls"
                        >
                        <span class="pageExport pageImport" style="right: 168px !important"><i class="pageImport-img"></i>导入</span>
                    </el-upload>
                    <div class="pageExport" @click="downExcel"><i class="pageExport-img pageImport-img-template"></i>下载模板</div> -->
                    <div class="pageExport" style="right: 16px" @click="exportAnalyseDegradation"><i class="pageExport-img"></i>导出</div>
                </div>
            </div>
            <el-dialog :visible.sync="dialogTableVisible_addAndedit" v-if="dialogTableVisible_addAndedit" :close-on-click-modal="false" width="1143px">
                <el-form class="popup" :model="addTaskData" :rules="rules" ref="addTaskData">
                    <div class="title">{{ popupTitle }}</div>
                    <div class="hidepopup" @click="dialogTableVisible_addAndedit=!dialogTableVisible_addAndedit">×</div>
                    <div class="add-info-box popupruleform">
                        <div class="alignBoth">
                            <el-form-item prop="name" label="规则名称" class="flex1 is-required">
                                <el-input v-model="addTaskData.name" class="add-item-input" type="text" maxlength="64" placeholder="请输入描述"></el-input>
                            </el-form-item>
                            <el-form-item label="机构" class="flex1 marginLeft10 is-required">
                                <div :class="['search-div',{'search-div-placeholder':currenCompanyName == '选择单位'}]" @click="selectCompanyFun(0)">{{ currenCompanyName }}<i class="el-icon-arrow-down select-unit-icon"></i></div>
                            </el-form-item>
                            <el-form-item label="告警类型" prop="eventTypeList" class="flex1 marginLeft10 is-required">
                                <el-checkbox-group v-model="eventTypeList">
                                    <el-checkbox :label="3" disabled>链路中断<span class="required-checkbox">（必选）</span></el-checkbox>
                                    <el-checkbox :label="2">丢包劣化</el-checkbox>
                                    <el-checkbox :label="1">时延劣化</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </div>
                        <div class="alignBoth">
                            <el-form-item prop="time" label="弹窗条件" class="flex1 is-required">
                                <template slot="label">
                                    弹窗条件（秒）
                                    <span class="required-label">（达到此设置时才能触发弹窗）</span>
                                </template>
                                <el-input-number class="add-item-input popup-time" v-model="addTaskData.time" controls-position="right" :min="1" placeholder="请输入弹窗条件"></el-input-number>
                            </el-form-item>
                            <el-form-item prop="beginDate" label="起止时间日期" class="flex1 marginLeft10 is-required">
                                <template slot="label">
                                    起止时间日期
                                    <el-checkbox v-model="longTime" class="task-poll-checkbox" @change="changeLongTime">长期执行</el-checkbox>
                                </template>
                                <el-date-picker
                                    @change="changeDateList"
                                    :disabled="longTime"
                                    type="daterange"
                                    v-model="dateList"
                                    range-separator="至"
                                    start-placeholder="开始时间"
                                    end-placeholder="结束时间"
                                    placeholder="选择时间范围"
                                    value-format="yyyy-MM-dd"
                                    class="add-item-input">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="告警等级" prop="gradeList" class="flex1 marginLeft10 is-required">
                                <el-checkbox-group v-model="gradeList">
                                    <el-checkbox :label="3" disabled>高<span class="required-checkbox">（必选）　　　</span></el-checkbox>
                                    <el-checkbox :label="2">中　　　</el-checkbox>
                                    <el-checkbox :label="1">低　　　</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="popup-buts">
                        <div class="popup-but popup-but-submit" @click="addAndEditSubmit">确定</div>
                        <div class="popup-but popup-but-cancel" @click="dialogTableVisible_addAndedit= !dialogTableVisible_addAndedit">取消</div>
                    </div>
                </el-form>
            </el-dialog>
            <el-dialog :visible.sync="dialogTableVisible_delete" :close-on-click-modal="false" width="21.9%">
                <div class="popup">
                    <div class="title">{{ popupTitle }}</div>
                    <div class="hidepopup" @click="dialogTableVisible_delete=!dialogTableVisible_delete">×</div>
                    <div class="add-info-box">
                        <p class="popop-tipinfo">确定删除该数据吗？</p>
                    </div>
                    <div class="popup-buts">
                        <div class="popup-but popup-but-submit" @click="submitDelete">确定</div>
                        <div class="popup-but popup-but-cancel" @click="dialogTableVisible_delete= !dialogTableVisible_delete">取消</div>
                    </div>
                </div>
            </el-dialog>
            <el-dialog :visible.sync="dialogTableVisible_selectcompany" :close-on-click-modal="false" v-if="dialogTableVisible_selectcompany"
			 width="690px">
				<div class="popup">
					<div class="title">单位选择</div>
					<div class="hidepopup" @click="dialogTableVisible_selectcompany=!dialogTableVisible_selectcompany">×</div>
                    <SelectCompanyComponent v-if='dealType==1' type='multiple' :checkStrictly='false' v-on:setSearchCompanyIds='setSearchCompanyIds'
                    v-on:setSearchCompanyNames='setSearchCompanyNames' v-on:closeSelectcompany='closeSelectcompany' :checkedMenuIds='currenCompanyIds'
                    :checkedMenuNames='currenCompanyNames'></SelectCompanyComponent>
                    <SelectCompanyComponent v-if='dealType==0' type='single' v-on:setSearchCompanyId='setSearchCompanyId'
                    v-on:setSearchCompanyName='setSearchCompanyName' v-on:closeSelectcompany='closeSelectcompany' :checkedMenuId='currenCompanyId'
                    :checkedMenuName='currenCompanyName'></SelectCompanyComponent>
				</div>
			</el-dialog>
        </div>
    </div>
</template>
<script>
import baseUrl from '../../js/baseUrl.js'
import axiosHttp from '../../js/axiosHttp.js'
import CommonFun from '@/js/commonFun'
import Validation from '@/js/validation.js'
import SelectCompanyComponent from '../../components/selectCompanyComponent.vue'
export default {
    name: 'popupManagement',
    components: {
        SelectCompanyComponent
    },
    data() {
        return {
            listData: [],
            searchData: {},
            currentPage: 1,
            pageSize: this.$store.state.pageSize,
            totle: 0,
            currenCompanyName: '选择单位',
            dealType: 0,
            dialogTableVisible_selectcompany: false,
            currenCompanyIds: [],
            currenCompanyNames: '选择单位',
            currenCompanyId: null,
            dialogTableVisible_addAndedit: false,
            addTaskData: {},
            eventTypeList: [3],
            gradeList: [3],
            addTaskDatarules: [],
            popupTitle: '新增',
            currentItem: {},
            longTime: false,
            dateList: ['', ''],
            beginDate: [],
            dialogTableVisible_delete: false,
            currentOrder:'',
            currentSort:'',
            eventOption: [
                {text: '时延', value: 1},
                {text: '丢包', value: 2},
                {text: '中断', value: 3},
            ],
            gradeOption: [
                {text: '低', value: 1},
                {text: '中', value: 2},
                {text: '高', value: 3},
            ],
            statusOption: [
                {text: '已启用', value: 1},
                {text: '已关闭', value: 0},
            ],
            rules: {
                name: [{required: true, message: '规则名称不能为空', trigger: 'blur'}],
                time: [{required: true, message: '弹窗条件不能为空', trigger: 'blur'},{
						validator: Validation.ifInteger,
						message: '输入数据无效',
						trigger: 'blur'
					}],
            },
            currentButtonJurisdiction: CommonFun.getCurrentButtonJurisdiction('popupManagement'),
        }
    },
    methods: {
        filterData(value) {
            if(value.eventTypeName){
                this.searchData.eventTypeList = value.eventTypeName;
            }else if(value.gradeName){
                this.searchData.gradeList = value.gradeName;
            }else if(value.statusName){
                this.searchData.status = parseInt(value.statusName)
            }
            this.getList();
        },
        sortChangeFun(column){
            let $this = this;
            if(column.prop == 'gmtCreate'){
                $this.currentSort = 'gmt_create';
            }else if(column.prop == 'time'){
                $this.currentSort = 'time'
            }
            if(column.order == 'ascending'){
                $this.currentOrder = 'ASC'
            }else if(column.order == 'descending'){
                $this.currentOrder = 'DESC'
            }else{
                $this.currentOrder = ''
            }
            if(!$this.currentOrder) {
                $this.currentSort = ''
            }
            $this.getList()
        },
        changeSwitch(row){
            let $this = this
            let params = {
                id: row.id,
                status: row.status,
            };
            axiosHttp
            .post(baseUrl.BASEURL + 'alarmPopup/setStatus', params)
            .then(function(res) {
                if (res.data.status === 1) {
                    $this.getList()
                }else{
                    CommonFun.responseError(res.data, $this)
                }
            }).catch(function(err) {
                    CommonFun.responseError(err, $this)
            })
        },
        submitDelete() {
            let $this = this
            axiosHttp
                .delete(baseUrl.BASEURL + 'alarmPopup/delete', {
                    data: {
                        id: $this.currentItem.id
                    }
                })
                .then(function(res) {
                    if (res.data.status === 1) {
                        CommonFun.responseSuccess(res.data.message, $this)
                        // 判断当前页是不是最后一条数据，如果是且当前页大于1，则当前页减1刷新列表
                        let page = $this.currentPage
                        if (page > 1 && $this.listData.length === 1) {
                            $this.currentPage = page - 1
                        }
                        $this.getList()
                    }else{
                        CommonFun.responseError(res.data, $this)
                    }
                    $this.dialogTableVisible_delete = false
                }).catch(function(err) {
                    CommonFun.responseError(err, $this)
                })
        },
        deleteFun(index, item) {
            this.dialogTableVisible_delete = true
            this.popupTitle = '删除'
            this.currentItem = JSON.parse(JSON.stringify(item))
        },
        editFun(index, item){
            this.dialogTableVisible_addAndedit = true
            this.popupTitle = '编辑'
            this.addTaskData = {
                name: item.name,
                time: item.time,
                id: item.id
            };
            this.longTime = false;
            this.dateList = ['', ''];
            this.currentItem = JSON.parse(JSON.stringify(item))
            this.currenCompanyId = this.currentItem.companyId
            this.currenCompanyName = this.currentItem.companyName
            this.eventTypeList = this.currentItem.eventType.split(',').map(val => Number(val));
            this.gradeList = this.currentItem.grade.split(',').map(val => Number(val));
            if(this.currentItem['endTime']){
				this.dateList = [CommonFun.dateFormat(this.currentItem['beginTime']*1000), CommonFun.dateFormat(this.currentItem['endTime']*1000)];
			}else {
				this.longTime = true;
			}
        },
        changeLongTime(val) {
			this.$refs.addTaskData.clearValidate('beginDate');
			if(val) {
				this.rules.beginDate = [];
				this.dateList = ['', ''];
			} else {
				this.rules.beginDate = [{
					required: true,
					message: '请选择启动日期',
					trigger: 'change'
				}]
			}
		},
        changeDateList(val) {
            if(val){
                this.$refs.addTaskData.clearValidate('beginDate');
                this.rules.beginDate = [];
            }else{
                this.rules.beginDate = [{
					required: true,
					message: '请选择启动日期',
					trigger: 'change'
				}]
            }
		},
        addAndEditSubmit: function() {
            let $this = this
            if(!this.currentItem.companyId){
                return CommonFun.responseWarning('机构不能为空', this)
            }
            this.$refs.addTaskData.validate((valid) => {
                if(valid) {
                    this.addTaskData.beginTime = this.dateList[0] ? new Date(this.dateList[0]).getTime()/1000 : new Date().getTime()/1000;
                    this.addTaskData.endTime = this.dateList[1] ? new Date(this.dateList[1]).getTime()/1000 : 0;
                    let params = {
                        ...this.addTaskData,
                        companyId: this.currentItem.companyId,
                        eventTypeList: this.eventTypeList,
                        gradeList: this.gradeList
                    }
                    axiosHttp
                        .post(baseUrl.BASEURL + 'alarmPopup/save', params)
                        .then(function(res) {
                            if (res.data.status === 1) {
                                CommonFun.responseSuccess(res.data.message, $this)
                                $this.getList()
                                $this.dialogTableVisible_addAndedit = false
                            }else{
                                CommonFun.responseError(res.data, $this)
                            }
                        }).catch(function(err) {
                             CommonFun.responseError(err, $this)
                        })
                }else {
                    return false
                }
            })
        },
        closeSelectcompany() {
            this.dialogTableVisible_selectcompany = false
        },
        setSearchCompanyName(data) {
            let $this = this;
            // $this.currenCompanyNameOfItem = data;
            if(CommonFun.ifNall(data)){
                $this.currenCompanyName = '选择单位'
            }else{
                $this.currenCompanyName = data
            }
        },
        setSearchCompanyId(data) {
            this.addTaskData.companyId = data;
            this.currenCompanyId = data
            this.$set(this.currentItem, 'companyId', data)
        },
        setSearchCompanyNames(data) {
            let $this = this
            // $this.currenCompanyNames = data
            if (data.length > 0) {
                $this.currenCompanyNames = ''
                for (let i = 0; i < data.length; i++) {
                    $this.currenCompanyNames += (data[i] + ',')
                }
            } else {
                $this.currenCompanyNames = '选择单位'
            }
        },
        setSearchCompanyIds(data) {
            this.currenCompanyIds = data
        },
        selectCompanyFun(type) {
            this.dealType = type
            this.dialogTableVisible_selectcompany = true
        },
        handleSizeChange(val) {
            this.currentPage = 1
            this.pageSize = val
            this.getList()
        },
        handleCurrentChange(val) {
            let $this = this
            $this.currentPage = val
            $this.getList()
        },
        addFun(){
            this.dialogTableVisible_addAndedit = true;
            this.popupTitle = '新增';
            this.addTaskData = {};
            this.currentItem = {}
            this.currenCompanyName = '选择单位'
            this.currenCompanyId = null;
            this.eventTypeList = [3]
            this.gradeList = [3]
            this.longTime = true
            this.dateList = ['', ''];
        },
        searchAction() {
            this.searchData.companyIdList = this.currenCompanyIds
            this.currentPage = 1;
            this.getList();
        },
        getList() {
            let $this = this
            let params = {
                page: this.currentPage,
                pageSize: this.pageSize,
                ...this.searchData,
                sort: $this.currentSort,
                order: $this.currentOrder
            }
            let loading = CommonFun.openFullScreen($this)
            return axiosHttp
                .post(baseUrl.BASEURL + 'alarmPopup/listPage', params)
                .then(function(res) {
                    CommonFun.closeFullScreen(loading)
                    if (res.data.status === 1) {
                        $this.totle = res.data.data.total
                        $this.listData = res.data.data.records
                    }
                    else {
                        CommonFun.responseError(res.data, $this)
                    }
                }).catch(function(err) {
                    CommonFun.closeFullScreen(loading)
                })
        },
        exportAnalyseDegradation() {
            let $this = this
            let params = {
                ...this.searchData,
                beginTime: this.searchData.beginTime / 1000,
                endTime: this.searchData.endTime / 1000
            }
            let loading = CommonFun.openFullScreen($this)
            axiosHttp
                .post(baseUrl.BASEURL + 'alarmPopup/exportListFile', params)
                .then(function(res) {
                    CommonFun.closeFullScreen(loading);
                    if (res.data.status === 1) {
                        window.open(res.data.data);
                    }
                    if (res.data.status === 0) {
                        CommonFun.responseError(res.data, $this);
                    }
                })
                .catch(function(err) {
                    CommonFun.closeFullScreen(loading);
                });
        },
    },
    mounted() {
        this.getList()
    }
}
</script>
<style lang="scss" scoped>
.popupManagement {
    height: calc(100% - 100px);
}
.listbox {
    padding: 30px;
}
.required-checkbox {
    color: #01CEC6;
}
.required-label {
    color: #FC3601;
}
.popup-time::after {
    content: '≥';
    color: #fff;
    position: absolute;
    top: 0;
    left: 10px;
}
.task-poll-checkbox{
	position: relative;
    z-index: 999;
	margin-left: 10px;
	color: #fff;
	display: inline-block;
}
.grade-color1 {color: #22C3FF;}
.grade-color2 {color: #FF8D1A;}
.grade-color3 {color: #FF6C3F;}
</style>