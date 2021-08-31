<template>
    <div class="nodeFile">
        <div class="listbox">
            <div class="fun-box">
                <div class="topruleform">
                    <div class="topruleform-item" style="margin-right: 20px">
                        <p class="topruleform-margin">条件查询：</p>
                        <el-input class="topruleform-width180" v-model="searchData.keyword" placeholder="搜索名称/地址"></el-input>
                    </div>
                    <div class="topruleform-item">
                        <div class="but popup-but-submit" @click="searchAction"><i class="el-icon-search"></i></div>
                        <div v-if="currentButtonJurisdiction.indexOf('add') > -1" class="but popup-but-submit" style="margin-left: 20px" @click="addFun">新增</div>
                    </div>
                </div>
            </div>
            <div class="list-outer-div">
                <div class="list-content-div">
                    <template>
                        <el-table :data="listData" height="100%" stripe :cell-style="{textAlign: 'center',height: '40px'}" :header-cell-style="{background:'rgba(10, 179, 172, .2)',height:'40px',textAlign:'center'}"  style="width: 100%">
                            <el-table-column prop="index" label="序号" type="index" align="center"></el-table-column>
                            <el-table-column prop="ip" label="IP地址" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="name" label="别名"></el-table-column>
                            <el-table-column prop="interfaceName" label="接口名称" ></el-table-column>
                            <el-table-column prop="managerAddress" label="管理地址"></el-table-column>
                            <el-table-column :formatter="CommonFun.deviceTypeFun" prop="deviceType" label="设备类型"></el-table-column>
                            <el-table-column prop="computerRoom" label="机房"></el-table-column>
                            <el-table-column prop="cabinet" label="机柜"></el-table-column>
                            <el-table-column prop="number" label="编号"></el-table-column>
                            <el-table-column label="操作" align="center">
                                <template slot-scope="scope">
                                    <div class="btnBox" v-if="currentButtonJurisdiction.indexOf('edit') > -1" title="编辑" @click="editFun(scope.$index, scope.row)"><i
											 class="el-icon-edit-outline"></i></div>
                                    <div class="btnBox" title="删除" v-if="currentButtonJurisdiction.indexOf('delete') > -1" @click="deleteFun(scope.$index, scope.row)"><i
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
                    <el-upload :action="uploadUrl"
                        :show-file-list='false'
                        :on-success="handleUploadSuccess"
                        :on-error='handleUploadError'
                        :before-upload='handleUploadBefore'
                        :headers="myHeaders" 
                        accept=".xlsx,.xls"
                        >
                        <span class="pageExport pageImport" style="right: 168px !important"><i class="pageImport-img"></i>导入</span>
                    </el-upload>
                    <div class="pageExport" @click="downExcel"><i class="pageExport-img pageImport-img-template"></i>下载模板</div>
                    <!-- <div class="but export-but" @click="exportAnalyseDegradation()">导出</div> -->
                    <div class="pageExport" style="right: 95px" @click="exportAnalyseDegradation"><i class="pageExport-img"></i>导出</div>
                </div>
            </div>
        </div>
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
        <el-dialog :visible.sync="dialogTableVisible_addAndedit" v-if="dialogTableVisible_addAndedit" :close-on-click-modal="false" width="846px">
            <el-form class="popup" :model="addTaskData" ref="addTaskData" :rules="addTaskDatarules" >
                    <div class="title">{{ popupTitle }}</div>
                    <div class="hidepopup" @click="dialogTableVisible_addAndedit=!dialogTableVisible_addAndedit">×</div>
                    <div class="add-info-box popupruleform">
                        <div class="alignBoth">
                            <el-form-item prop="ip" label="IP地址" class="flex1 is-required">
                                <el-input v-model="addTaskData.ip" class="add-item-input" type="text" maxlength="16" placeholder="请输入IP地址"></el-input>
                            </el-form-item>
                            <el-form-item prop="deviceType" label="设备类型" class="flex1 marginLeft10 is-required">
                                <el-select v-model="addTaskData.deviceType" placeholder="请输入设备类型">
                                    <el-option
                                    v-for="(item,index) in manufacturerOption"
                                    :key="index"
                                    :value="item.value"
                                    :label="item.label"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="name" label="别名" class="flex1 marginLeft10">
                                <el-input v-model="addTaskData.name" class="add-item-input" type="text" maxlength="64" placeholder="请输入别名"></el-input>
                            </el-form-item>
                        </div>
                        <div class="alignBoth">
                            <el-form-item prop="interfaceName" label="接口名称" class="flex1">
                                <el-input v-model="addTaskData.interfaceName" class="add-item-input" type="text" placeholder="请输入接口地址"></el-input>
                            </el-form-item>
                            <el-form-item prop="managerAddress" label="管理地址" class="flex1 marginLeft10">
                                <el-input v-model="addTaskData.managerAddress" class="add-item-input" type="text" maxlength="16" placeholder="请输入管理地址"></el-input>
                            </el-form-item>
                            <el-form-item prop="computerRoom" label="机房" class="flex1 marginLeft10">
                                <el-input v-model="addTaskData.computerRoom" class="add-item-input" type="text" maxlength="64" placeholder="请输入机房"></el-input>
                            </el-form-item>
                        </div>
                        <div class="alignBoth">
                            <el-form-item prop="cabinet" label="机柜" class="flex1">
                                <el-input v-model="addTaskData.cabinet" class="add-item-input" type="text" maxlength="64" placeholder="请输入机柜"></el-input>
                            </el-form-item>
                            <el-form-item prop="number" label="编号" class="flex1 marginLeft10">
                                <el-input v-model="addTaskData.number" class="add-item-input" type="text" placeholder="请输入编号"></el-input>
                            </el-form-item>
                            <el-form-item class="flex1 marginLeft10">
                            </el-form-item>
                        </div>
                    </div>
                    <div class="popup-buts">
                        <div class="popup-but popup-but-submit" @click="addAndEditSubmit">确定</div>
                        <div class="popup-but popup-but-cancel" @click="dialogTableVisible_addAndedit= !dialogTableVisible_addAndedit">取消</div>
                    </div>
                </el-form>
        </el-dialog>
    </div>
</template>
<script>
import baseUrl from '../../js/baseUrl.js'
import axiosHttp from '../../js/axiosHttp.js'
import Validation from '../../js/validation.js'
import CommonFun from '@/js/commonFun'
export default {
    name: 'nodeFile',
    data(){
        return {
            currentPage: 1,
            pageSize: this.$store.state.pageSize,
            totle: 0,
            listData: [],
            searchData: {},
            addTaskData: {deviceType: ''},
            currentItem: {},
            popupTitle: '删除',
            manufacturerOption: [],
            dialogTableVisible_delete: false,
            dialogTableVisible_addAndedit: false,
            addTaskDatarules: {
                ip: [{
                    required: true,
                    message: 'IP不能为空',
                    trigger: 'blur'
                },{
                    validator: Validation.ifIp,
                    message: '输入数据无效',
                    trigger: 'blur'
                }],
                deviceType: [{
                    required: true,
                    message: '设备类型不能为空',
                    trigger: 'change'
                }],
            },
            uploadUrl: `${baseUrl.BASEURL}resource/node/management/importData`,
            myHeaders: {token:sessionStorage.getItem('token')},
            currentButtonJurisdiction: CommonFun.getCurrentButtonJurisdiction('nodeFile')
        }
    },
    methods: {
        handleCurrentChange: function(val) {
            let $this = this
            $this.currentPage = val
            $this.getList()
        },
        handleSizeChange: function(val) {
            this.currentPage = 1
            this.pageSize = val
            this.getList()
        },
        searchAction() {
            this.currentPage = 1;
            this.getList();
        },
        addFun() {
            this.dialogTableVisible_addAndedit = true;
            this.popupTitle = '新增';
            this.addTaskData = {};
            // this.$nextTick(() => {
            //     this.$refs.addTaskData.resetFields();
            // })
            this.currentItem = {}
        },
        editFun: function(index, item) {
            this.dialogTableVisible_addAndedit = true
            this.popupTitle = '编辑'
            this.addTaskData = {}
            this.addTaskData = JSON.parse(JSON.stringify(item));
            this.addTaskData.deviceType = parseInt(item.deviceType)
            this.currentItem = JSON.parse(JSON.stringify(item))
        },
        deleteFun: function(index, item) {
            this.dialogTableVisible_delete = true
            this.popupTitle = '删除'
            this.currentItem = JSON.parse(JSON.stringify(item))
        },
        submitDelete: function() {
            let $this = this
            axiosHttp
                .delete(baseUrl.BASEURL + 'resource/node/management/delete', {
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
                    CommonFun.closeFullScreen(loading)
                })
        },
        addAndEditSubmit: function() {
            let $this = this
            this.$refs.addTaskData.validate((valid) => {
                if(valid) {
                    let params = {
                        ...this.addTaskData,
                        id: this.currentItem.id
                    }
                    axiosHttp
                        .post(baseUrl.BASEURL + 'resource/node/management/save', params)
                        .then(function(res) {
                            if (res.data.status === 1) {
                                CommonFun.responseSuccess(res.data.message, $this)
                                $this.getList()
                                $this.dialogTableVisible_addAndedit = false
                            }else{
                                CommonFun.responseError(res.data, $this)
                            }
                        }).catch(function(err) {
                            CommonFun.closeFullScreen(loading)
                        })
                }else {
                    return false
                }
            })
        },
        getList() {
            let $this = this
            let params = {
                page: this.currentPage,
                pageSize: this.pageSize,
                ...this.searchData
            }
            let loading = CommonFun.openFullScreen($this)
            return axiosHttp
                .post(baseUrl.BASEURL + 'resource/node/management/companyList', params)
                .then(function(res) {
                    CommonFun.closeFullScreen(loading)
                    if (res.data.status === 1) {
                        $this.totle = res.data.data.total
                        $this.listData = res.data.data.records
                        sessionStorage.setItem('currentEndTime',res.data.responseTime)
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
                .post(baseUrl.BASEURL + 'resource/node/management/exportData', params)
                .then(function(res) {
                    CommonFun.closeFullScreen(loading);
                    console.log('导出::');
                    console.log(res);
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
        //上传相关
        handleUploadSuccess: function (response, file, fileList){
            let $this = this
            console.log("返回成功内容：")
            console.log(response)
            CommonFun.closeFullScreen($this.loading)
            if(response.status == 1){
                CommonFun.responseSuccess('导入成功', $this)
                $this.getList()
            }
            else{
                CommonFun.responseError(response, $this)
            }
        }, 
        handleUploadError: function (err, file, fileList){
            let $this = this
            console.log("返回错误内容：")
            console.log(err,file,fileList)
            CommonFun.responseError(err, $this)
            CommonFun.closeFullScreen($this.loading)
        },
        handleUploadBefore: function (file){
            let $this = this
            $this.loading = CommonFun.openFullScreen($this)
		},
        downExcel() {
            let $this = this
            let loading = CommonFun.openFullScreen($this)
            axiosHttp
                .post(baseUrl.BASEURL + 'resource/node/management/downExportTemp', {})
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
        }
    },
    mounted() {
        let $this = this
        let faultdataList = JSON.parse(sessionStorage.getItem('dataDictionaryList'));
        if(faultdataList[0].children){
            faultdataList[0].children.forEach((item, index) => {
                if(item.name == '设备类型') {
                    $this.manufacturerOption = item.children
                }
            })
        }
        this.getList();
    }
}
</script>
<style lang="scss" scoped>
.nodeFile {
    height: calc(100% - 47px);
}
.listbox {
    padding: 30px;
}
</style>