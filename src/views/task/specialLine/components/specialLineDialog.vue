<template>
    <el-dialog :visible.sync="visible" :close-on-click-modal="false">
		<div class="popup">
			<div class="title">专线选择</div>
			<div class="hidepopup" @click="visible=!visible">×</div>
			<div class="add-info-box">
				<div class="select-exam-topfun">
					<div class="fun-box">
						<div class="topruleform">
							<el-input class="gapright topruleform-width120" v-model="searchDataDetail.taskName" placeholder="专线名称"></el-input>
							<div class="search-but" @click="searchActionDetail"><i class="el-icon-search"></i></div>
						</div>
					</div>
				</div>
				<div class="examList">
					<el-table :data="listDataDetail" @selection-change="handleSelectionChangeDetail" border :header-cell-style="{background:'#f2f2f2'}"
						ref='detailTable' style="width: 100%">
						<el-table-column type="selection" align="center"></el-table-column>
						<el-table-column prop="taskName" label="专线名称" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column width="70" prop="bandWidth" label="带宽"></el-table-column>
						<el-table-column width="70" prop="operators" label="运营商"></el-table-column>
						<el-table-column width="70" prop="relayFlag" label="绑定接口" :formatter="relayFormatter"></el-table-column>
						<el-table-column width="70" prop="masterSlave" label="主备角色" :formatter="masterSlaveFormatter"></el-table-column>
					</el-table>
				</div>
				<div class="pagebox">
					<el-pagination @current-change="handleCurrentChangeDetail" :current-page.sync="currentPageDetail" :page-size="$store.state.pageSize"
						layout="total,prev, pager, next, jumper" :total="totleDetail">
					</el-pagination>
				</div>
			</div>
			<div class="popup-buts">
				<div class="popup-but popup-but-submit" @click="selectDetail">确定</div>
				<div class="popup-but popup-but-cancel" @click="visible= !visible">关闭</div>
			</div>
		</div>
	</el-dialog>
</template>
<script>
import ApiTaskSpecialLine from './../api';
import CommonFun from '@/js/commonFun.js';
export default {
    props: {
        visible: {
			type: Boolean,
			default: false
		},
    },
    data() {
        return {
			searchDataDetail: {
                taskName: '',
                page: 1,
                pageSize: 20
            },
			listDataDetail: [],
			currentPageDetail: 1,
			totleDetail: 0
        }
    },
    mounted() {
        this.searchActionDetail();
    },
    methods: {
		handleSelectionChangeDetail(selection) {
			if (selection.length > 1) {
				this.$refs.detailTable.clearSelection();
				this.$refs.detailTable.toggleRowSelection(selection.pop());
			}
		},
		handleCurrentChangeDetail(val) {
			this.currentPageDetail = val
		},
		relayFormatter(row, column) {
			if (!CommonFun.ifNall(row.relayFlag)) {
				if (row.relayFlag == 0) {
					return '不绑定'
				} else if (row.relayFlag == 1) {
					return '绑定'
				} else {
					return ''
				}
			}
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
		searchActionDetail() {
			let $this = this
			$this.searchDataDetail.page = $this.currentPageDetail
			$this.searchDataDetail.pageSize = $this.$store.state.pageSize
			let loading = CommonFun.openFullScreen($this)
			ApiTaskSpecialLine.listSpecialLine($this.searchDataDetail).then((res) => {
				CommonFun.closeFullScreen(loading)
				if (res.data.status === 1) {
					$this.listDataDetail = res.data.data.records
					$this.totleDetail = res.data.data.total
				} else {
					CommonFun.responseError(res.data, $this)
				}
			}).catch(function(err) {
				CommonFun.closeFullScreen(loading)
			})
		},
		selectDetail() {
			this.$emit('selectDetail', this.$refs.detailTable.selection);
		},
    }
}
</script>