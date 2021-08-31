<template>
<div>
	<el-dialog :visible.sync="visible" :close-on-click-modal="false" append-to-body v-if="visible" width="660px">
		<div class="popup">
			<div class="title">任务列表</div> 
			<div class="hidepopup" @click="handleClose">×</div>
            <div class="add-info-box">
                <div class="topruleform" style="margin-bottom: 10px">
                    <div class="block gapright topruleform-width200">
						<el-input v-model="searchData.taskName" placeholder="任务名称"></el-input>
					</div>
                    <div class="btn-dialog" @click="searchAction()"><i class="el-icon-search"></i></div>
                </div>
                <el-table
                    :data="taskList"
                    ref="table"
                    stripe header-row-class-name="table-header-row"
                    row-class-name="table-row" 
                    row-key="id"
                    style="width: 100%" 
                    height="300px" 
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" reserve-selection></el-table-column>
                    <!-- <el-table-column prop="targetIp" label="目标IP"></el-table-column> -->
                    <el-table-column prop="taskName" label="任务名称"></el-table-column>
                </el-table>
                <div class="pagebox">
                    <el-pagination @current-change="handleCurrentChange" :current-page.sync="page" :page-size="pageSize"
						 @size-change="handleSizeChange" :page-sizes="$store.state.pageSizeS" layout="total,prev, pager, next"
						 :total="total">
						</el-pagination>
                    <!-- <el-button type="text" icon="el-icon-download" class="btn-export" @click="exportListFun">导出表格</el-button> -->
                </div>
            </div>
            <div class="popup-buts">
				<div class="popup-but popup-but-submit" @click="submit">确定</div>
				<div class="popup-but popup-but-cancel" @click="handleClose">取消</div>
			</div>
		</div>
	</el-dialog>
</div>
</template>
<script>
import axiosHttp from "@/js/axiosHttp.js";
import baseUrl from "@/js/baseUrl.js";
import CommonFun from '@/js/commonFun.js';
export default {
	props: {
		visible: {
			type: Boolean,
			default: false
		},
        params: {
            type: Object,
            default: function() {
                return {}
            }
        },
        defaultData: {
            type: Array,
            default: function() {
                return []
            }
        }
	},
    data() {
        return {
            searchData: {
                taskName: '',
                companyIdList: []
            },
            
            targetModel: {
                targetCollectVal: ''
            },
            taskList: [], //任务列表
            valList: [],
            
            total: 0,
            page: 1,
            pageSize: 30
        }
    },
	mounted() {
		this.init();
	},
    methods: {
		init() {
			this.loadData();
		},
        searchAction() {
            this.loadData();
        },
        //加载远端数据
        loadData() {
            let that = this;
            that.searchData.page = this.page;
            that.searchData.pageSize = this.pageSize;
            if(!!this.params.companyId) {
                that.searchData.companyIdList = [this.params.companyId];
            }
            that.searchData.deviceId = this.params.deviceId;
            axiosHttp.post(baseUrl.BASEURL + 'taskManagerDial/listPage', that.searchData).then((res) => {
                const data = res.data;
                if (data.status === 1) {
                    this.total = data.data.total;
                    this.taskList = data.data.records;
                }
                //default选中
                that.$nextTick(() => {
                    if(this.defaultData.length) {
                        for (let item of this.taskList) {
                            if(this.defaultData.indexOf(item.id) > -1) {
                                this.$refs.table.toggleRowSelection(item, true);
                            }
                        }
                    }
                })
            })
        },
        handleEdit(index, row) {
            
            
        },
        handleDelete(index, row) {

        },
		submit() {
            console.log('选中', this.valList);
            this.$emit('setFormData', 'taskId', this.valList);
            this.handleClose();
        },
        handleSelectionChange(val) {
            this.valList = val;
            // let addList = [];
            // for (const item of val) {
            //     let get = false;
            //     for (const result of this.valList) {
            //         if(item.id === result.id) {
            //             get = true;
            //         }
            //     }
            //     if(!get) {
            //         addList.push(item);
            //     }
            // }
            // addList.concat(this.valList);
        },
        handleCurrentChange(page) {
            this.page = page;
            this.loadData();
        },
        handleSizeChange(size) {
            this.pageSize = size;
            this.loadData();
        },
        handleClose(){
			this.$emit('update:visible', false);
		}
    }
}
</script>
<style lang="scss" scoped>
    .target-list{
        width: 100%;
    }
</style>