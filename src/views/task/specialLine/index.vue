<template>
    <div class="content outerbox-pro">
        <div class="topruleform">
            <div class="gapright30 topruleform-inline">
                <label>开始时间：</label>
                <el-date-picker
                    v-model="searchData.beginDate"
                    type="date"
                    value-format="timestamp"
                    :clearable="false"
                    :editable="false"
                    placeholder="选择日期时间">
                </el-date-picker>
                <i class="el-icon-arrow-down select-unit-icon"></i>
            </div>
            <div class="gapright30 topruleform-inline">
                <label>结束时间：</label>
                <el-date-picker
                    v-model="searchData.endDate"
                    type="date"
                    value-format="timestamp"
                    :clearable="false"
                    :editable="false"
                    :picker-options="pickerOptions"
                    placeholder="选择日期时间">
                </el-date-picker>
                <i class="el-icon-arrow-down select-unit-icon"></i>
            </div>
            <div class="gapright30 topruleform-inline">
                <label>组织机构：</label>
                <div :class="['search-div',{'search-div-placeholder':currenCompanyName == '选择单位'}]" @click="selectCompanyFun(1)">{{ currenCompanyName }}<i class="el-icon-arrow-down select-unit-icon"></i></div>
            </div>
            <div class="gapright30 topruleform-inline">
                <label>运营商：</label>
                <el-input v-model="searchData.operators" placeholder="运营商"></el-input>
            </div>
            <div class="gapright30 topruleform-inline">
                <label>模糊查询：</label>
                <el-input v-model="searchData.keyword" placeholder="请输入关键字"></el-input>
            </div>
            <div class="but popup-but-submit gapright30" @click="handleSearch"><i class="el-icon-search"></i></div>
            <div v-if="currentButtonJurisdiction.indexOf('add')>-1" class="but popup-but-submit gapright30" @click="handlerAdd">新增</div>
            <div v-if="currentButtonJurisdiction.indexOf('start')>-1" class="but popup-but-submit gapright30" @click="sendTaskFun">批量启动</div>
            <div v-if="currentButtonJurisdiction.indexOf('stop')>-1" class="but popup-but-submit gapright30" @click="batchStop">批量暂停</div>
            <div v-if="currentButtonJurisdiction.indexOf('delete')>-1" class="but popup-but-submit" @click="batchDelete">批量删除</div>
        </div>
        <div class="listbox">
            <div class="list-outer-div">
                <div class="list-content-div">
                    <el-table
                        :data="listData"
                        stripe
                        ref="multipleTable"
                        row-key="id"
                        header-row-class-name="table-header-row"
                        row-class-name="table-row"
                        height="100%" 
                        @sort-change="sortFunc"
                        @filter-change="filterStatusFunc"
                        style="width: 100%">
                        <div slot="empty" class="no-data-box">
                            <img src="../../../assets/no-data-table.png"/>
                            <p>暂无数据</p>
                        </div>
                        <el-table-column type="selection" width="55" reserve-selection></el-table-column>
                        <el-table-column prop="index" label="序号" type="index" align="center"></el-table-column>
                        <el-table-column prop="taskName" label="任务名称" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column width="150" :formatter="CommonFun.formatterCompanyName" label="组织机构" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column width="90" prop="validityCycle" label="生效日期" sortable></el-table-column>
                        <el-table-column width="125" prop="validityBeginTime" :formatter="timeFormatter" label="生效时间" sortable></el-table-column>
                        <el-table-column width="100" prop="anodeIp" label="A端地址"></el-table-column>
                        <el-table-column width="80" prop="anodeAlias" label="A端别名"></el-table-column>
                        <el-table-column width="100" prop="bnodeIp" label="Z端地址"></el-table-column>
                        <el-table-column width="80" prop="bnodeAlias" label="Z端别名"></el-table-column>
                        <el-table-column width="90" prop="bandWidth" label="带宽"></el-table-column>
                        <el-table-column width="90" prop="operators" label="运营商"></el-table-column>
                        <el-table-column width="140" prop="gmtCreate" label="创建时间" sortable :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column width="55" prop="masterSlave" label="角色" :formatter="masterSlaveFormatter"></el-table-column>
                        <el-table-column width="120" prop="relayFlag" label="绑定接口任务" :formatter="relayFormatter" :filters="filterRelayFlag" column-key="relayFlag"></el-table-column>
                        <el-table-column width="80" prop="bingStatus" label="匹配结果" :formatter="bingFormatter" :filters="filterBingStatus" column-key="bingStatus"></el-table-column>
                        <el-table-column width="100" label="操作" align="center">
                            <template slot-scope="scope">
                                <div class="btnBox" title="编辑" v-if="currentButtonJurisdiction.indexOf('edit')>-1" @click="handleEdit(scope.$index, scope.row)"><i
                                        class="el-icon-edit-outline"></i></div>
                                <div class="btnBox" title="删除" v-if="currentButtonJurisdiction.indexOf('delete')>-1" @click="handleDelete(scope.$index, scope.row)"><i
                                        class="el-icon-delete"></i></div>
                                <div class="btnBox" title="启用" v-if="currentButtonJurisdiction.indexOf('start')>-1" v-show="scope.row.status==0"
                                    @click="statusFun(scope.row, 1)"><i class="el-icon-video-play"></i></div>
                                <div class="btnBox" title="停用" v-if="currentButtonJurisdiction.indexOf('stop')>-1" v-show="scope.row.status==1"
                                    @click="statusFun(scope.row, 0)"><i class="el-icon-video-pause"></i></div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="pagebox">
                    <!-- <span class="page-span">共{{totle}}条记录，当前为第{{currentPage}}页</span> -->
                    <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="pageSize"
                        :page-sizes="$store.state.pageSizes"
                        layout="sizes,total,prev, pager, next, jumper"
                        @size-change="handleSizeChange" 
                        :total="totle"
                        background />
                </div>
            </div>
        </div>
        <el-dialog :visible.sync="visibleCompany" :close-on-click-modal="false" v-if="visibleCompany" width="690px">
            <div class="popup">
                <div class="title">单位选择</div> 
                <div class="hidepopup" @click="visibleCompany=!visibleCompany">×</div>
                <SelectCompanyComponent type="multiple" :checkStrictly="false" v-on:setSearchCompanyIds='setSearchCompanyIds'
                v-on:setSearchCompanyNames='setSearchCompanyNames' v-on:closeSelectcompany='closeSelectcompany' :checkedMenuIds='currenCompanyIdsOfSearch'
                :checkedMenuName='currenCompanyNameOfSearch'></SelectCompanyComponent>
            </div>
        </el-dialog>
        <DetailDialog
            v-if="visible" 
            :visible.sync="visible" 
            :title="title" 
            :staut="staut" 
            :detail-data="detailData"
            @closeDialog="closeDialog" />
        <el-dialog :visible.sync="dialogTableVisible_delete" :close-on-click-modal="false" width="21.9%">
            <div class="popup">
                <div class="title">删除</div>
                <div class="hidepopup" @click="dialogTableVisible_delete=!dialogTableVisible_delete">×</div>
                <div class="add-info-box">
                    <p class="popop-tipinfo">确定删除该数据吗？</p>
                </div>
                <div class="popup-buts">
                    <div class="popup-but popup-but-submit" @click="submitDelete()">确定</div>
                    <div class="popup-but popup-but-cancel" @click="dialogTableVisible_delete= !dialogTableVisible_delete">取消</div>
                </div>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="dialogTableVisible_delete_batch" :close-on-click-modal="false" width="21.9%">
            <div class="popup">
                <div class="title">批量删除</div>
                <div class="hidepopup" @click="dialogTableVisible_delete_batch=!dialogTableVisible_delete_batch">×</div>
                <div class="add-info-box">
                    <p class="popop-tipinfo">确定删除选中数据吗？</p>
                </div>
                <div class="popup-buts">
                    <div class="popup-but popup-but-submit" @click="batchDeleteSubmit()">确定</div>
                    <div class="popup-but popup-but-cancel" @click="dialogTableVisible_delete_batch= !dialogTableVisible_delete_batch">取消</div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import ApiTaskSpecialLine from './api';
import CommonFun from '@/js/commonFun.js';
import SelectCompanyComponent from '@/components/selectCompanyComponent';
import DetailDialog from './components/detailDialog'
import { mapState } from 'vuex';
export default {
    name: 'taskDialTest',
	components: {
		SelectCompanyComponent, DetailDialog
	},
    data() {
        return {
            filterRelayFlag: [{text: '是', value: 1}, {text: '否', value: 0}],
            filterBingStatus: [{text: '成功', value: 0}, {text: '失败', value: 1}],
            dialogTableVisible_delete_batch: false,
            dialogTableVisible_delete: false,
            searchData: {
                name: '',
                ip: ''
            },
            currenCompanyNameOfSearch: [],
            currenCompanyIdsOfSearch: [],
            currenCompanyName: '选择单位',
            currentButtonJurisdiction: CommonFun.getCurrentButtonJurisdiction('taskSpecialLine'),
            listData: [],
            currentPage: 1,
			totle: 0,
            pageSize: 20,
            
            //弹出框
            visible: false,
            title: '新增',
            staut: 1,
            detailData: { //操作行

            },
            pickerOptions: {
                disabledDate: time =>{
                    let timeOptionRange = this.searchData.beginDate;
                    let now = Date.now();
                    if(timeOptionRange){
                        return time.getTime() < new Date(timeOptionRange).getTime() || time.getTime() > now;
                    }
                    return time.getTime() > now;
                },
                selectableRange: "00:00:00 - 23:59:59",
            },
            visibleCompany: false,
        }
    },
    computed: {
		...mapState({
            taskValidityList: state => CommonFun.getDataDictionaryChildrenListData(state.taskValidityValue)
		})
	},
    mounted() {
        this.getList();
    },
    methods: {
        /* 多 设置id */
		setSearchCompanyIds(data) {
			let that = this;
			that.currenCompanyIdsOfSearch = data;
		},
        setSearchCompanyNames(data) {
            let that = this;
            that.currenCompanyNameOfSearch = data;
            if (data.length > 0) {
                that.currenCompanyName = data.join(',')
            } else {
                that.currenCompanyName = '选择单位'
            }
        },
        closeSelectcompany() {
			this.visibleCompany = false;
		},
        handleSizeChange(val) {
            this.currentPage = 1;
            this.pageSize = val;
            this.getList()
        },
        filterStatusFunc(val) {
            for (let key in val) {
                this.searchData[key] = val[key].toString();
            }
            this.handleSearch();
        },
        sortFunc(obj) {
            let field = 0;
            switch(obj.prop) {
                case 'validityCycle':
                    field = 0;
                    break;
                case 'validityBeginTime':
                    field = 1;
                    break;
                case 'gmtCreate':
                    field = 2;
                    break;
            }
            this.searchData['field'] = field;
            if(obj.order == "ascending") {
                this.searchData.sort = 1
            }else if(obj.order == "descending") {
                this.searchData.sort = 0
            }else{
                this.searchData.sort = undefined;
                this.searchData.orderField = undefined;
            }
            this.getList();
        },
        //查询列表
        getList(page) {
            let that = this;
            let loading = CommonFun.openFullScreen(that);
            let param = JSON.parse(JSON.stringify(that.searchData));
            param.page = page ? page : that.currentPage;
            param.pageSize = this.pageSize;
            param.companyIdList = that.currenCompanyIdsOfSearch.length > 0 ? that.currenCompanyIdsOfSearch : undefined;
            ApiTaskSpecialLine.list(param).then( res => {
                const data = res.data;
                CommonFun.closeFullScreen(loading);
                if (data.status === 1) {
                    that.totle = data.data.total;
                    that.listData = data.data.records;
                }
                else {
                    CommonFun.responseError(data, that);
                }
            }).catch(function(err) {
                CommonFun.closeFullScreen(loading);
            })
        },
        sourcePortFormatter(row, column){
            if(row.protocolName == 'ICMP'){
                return '-'
            }else{
                return row.sourcePort
            }
        },
        targetPortFormatter(row, column){
            if(row.protocolName == 'ICMP'){
                return '-'
            }else{
                return row.targetPort
            }
        },
        relayFormatter(row, column) {
            if (!!row.relayId) {
                return '是';
            }
            return '否';
        },
        bingFormatter(row, column) {
            if (!CommonFun.ifNall(row.bingStatus)) {
                if (row.bingStatus == 0) {
                    return '成功'
                } else if (row.bingStatus == 1) {
                    return '失败'
                }
            }
            return '失败'
        },
        masterSlaveFormatter(row, column) {
            if (!CommonFun.ifNall(row.masterSlave)) {
                if (row.masterSlave == 1) {
                    return '主用'
                } else if (row.masterSlave == 2) {
                    return '备用'
                } else {
                    return '无'
                }
            }
        },
        timeFormatter(row, column) {
            return (row.validityBeginTime || '') + "-" + (row.validityEndTime || '');
        },
        //格式化类型
        selectCompanyFun(type) {
            this.dealType = type
			this.visibleCompany = true
        },
        handleSearch() {
            this.currentPage = 1;
            this.getList();
        },
        handlerAdd() {
            this.visible = true;
            this.title = '新增';
            this.staut = 1;
            let validityCycleExArr = [];
            for(let i = 0; i < this.taskValidityList.length; i++) {
                validityCycleExArr.push(this.taskValidityList[i].value);
            }
            this.detailData = {
                validityCycleEx: validityCycleExArr,
                validityBeginTime: '00:00:00',
                validityEndTime: '23:59:59',
                masterSlave: 0,
                bingFlag: 1
            };
        },
        handleEdit(index, row) {
            this.visible = true;
            this.title = '编辑';
            this.staut = 2;
            this.detailData = JSON.parse(JSON.stringify(row));
        },
        handleView(index, row) {
            this.visible = true;
            this.title = '查看';
            this.staut = 0;
            this.detailData = JSON.parse(JSON.stringify(row));
        },
        getTableSelection() {
            let list = this.$refs.multipleTable.selection.map(item => {
                return item.id;
            });
            if(list.length == 0) {
                this.$message({
                    type: 'error',
                    message: '请至少选中一条任务'
                });
                return false
            }
            return list;
        },
        //下发
        sendTaskFun() {
            let list = this.getTableSelection();
            if(!list) {
                return false;
            }
            let params = {idList: list, status: 1};
            ApiTaskSpecialLine.status(params).then( res => {
                const data = res.data;
                
                if (data.status === 1) {
                    this.$message({
                        type: 'success',
                        message: data.message
                    });
                    this.getList(1);
                }
                else {
                    this.$message({
                        type: 'error',
                        message: data.message
                    });
                }
            })
        },
        //批量暂停
        batchStop(item) {
            let list = this.getTableSelection();
            if(!list) {
                return false;
            }
            let params = {idList: list, status: 0};

            let loading = CommonFun.openFullScreen(this)
            ApiTaskSpecialLine.status(params).then((res) => {
                const data = res.data;
                CommonFun.closeFullScreen(loading);
                if (data.status === 1) {
                    this.$message({
                        type: 'success',
                        message: data.message
                    });
                    this.getList();
                }
                else {
                    this.$message({
                        type: 'error',
                        message: data.message
                    });
                }
            }).catch(function(err) {
                CommonFun.closeFullScreen(loading);
            })
        },
        //批量删除
        batchDelete() {
            let list = this.getTableSelection();
            if(!list) {
                return false;
            }
            this.dialogTableVisible_delete_batch = true;
        },
        batchDeleteSubmit() {
            let list = this.getTableSelection();
            let params = {idList: list};
            let loading = CommonFun.openFullScreen(this);
            ApiTaskSpecialLine.delete(params).then((res) => {
                const data = res.data;
                CommonFun.closeFullScreen(loading);
                if (data.status === 1) {
                    this.$message({
                        type: 'success',
                        message: data.message
                    });
                    this.getList(1);
                }
                else {
                    this.$message({
                        type: 'error',
                        message: data.message
                    });
                }
                this.dialogTableVisible_delete_batch = false;
            }).catch(function(err) {
                CommonFun.closeFullScreen(loading);
            })
        },
        statusFun(item, status) {
            let loading = CommonFun.openFullScreen(this)
            ApiTaskSpecialLine.status({id: item.id, status: status}).then((res) => {
                CommonFun.closeFullScreen(loading)
                if (res.data.status === 1) {
                    this.getList()
                }
                else {
                    CommonFun.responseError(res.data, this)
                }
            }).catch(function(err) {
                CommonFun.closeFullScreen(loading)
            })
        },
        handleDelete(index, row) {
            this.dialogTableVisible_delete = true;
            this.detailData = JSON.parse(JSON.stringify(row));    
        },
        submitDelete() {
            ApiTaskSpecialLine.delete({id: this.detailData.id}).then( res => {
                const data = res.data;
                
                if (data.status === 1) {
                    this.$message({
                        type: 'success',
                        message: data.message
                    });
                    this.getList(1);
                }
                else {
                    this.$message({
                        type: 'error',
                        message: data.message
                    });
                }
                this.dialogTableVisible_delete = false;
            })
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.getList()
        },
        closeDialog(boo) {
            this.visible = boo;
            this.getList();
        }
    }
}
</script>
<style lang="scss" scoped>
.content{
    padding: 27px;
    .topruleform {
        margin-bottom: 15px;
    }
}
.listbox{height: calc(100% - 90px);}
</style>