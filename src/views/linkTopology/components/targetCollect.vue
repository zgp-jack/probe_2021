<template>
<div>
    <el-dialog :visible.sync="visible" :close-on-click-modal="false" append-to-body width="600px">
		<div class="popup">
			<div class="title">目标集</div>
			<div class="hidepopup" @click="handleClose">×</div>
			<div class="add-info-box">
                <div class="topruleform" style="margin-bottom: 10px">
                    <div class="btn-dialog" style="margin: 0 0 10px 0;" @click="handleEdit">添加</div>
                </div>
				<el-table :data="targetList" stripe header-row-class-name="table-header-row" row-class-name="table-row" class="target-list">
                    <el-table-column type="index" width="55" label="序号"></el-table-column>
                    <el-table-column property="name" label="目标">
                        <template slot-scope="scope">
                            <span v-if="!scope.row.edit">{{scope.row.name}}</span>
                            <el-input v-else size="mini" autofocus v-model="scope.row.name" @blur="scope.row.edit = false"/>
                        </template>
                    </el-table-column>
                    <el-table-column width="100" label="">
                        <template slot-scope="scope">
                            <div class="btnBox" title="编辑" @click="handleEdit(scope.$index, scope.row)"><i class="el-icon-edit-outline"></i></div>
                            <div class="btnBox" title="删除" @click="handleDelete(scope.$index, scope.row)"><i class="el-icon-delete"></i></div>
                        </template>
                    </el-table-column>
                </el-table>
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
		}
	},
    data() {
        return {
            targetList: [],
        }
    },
	mounted() {
		this.init();
	},
    methods: {
		init() {
			
		},
        handleEdit(index, row) {
            if(row) {
                row.edit = true;
                this.$set(this.targetList, index, row);
            } else {
                this.targetList.push({name: '', edit: true});
            }
            
        },
        handleDelete(index, row) {
            this.targetList.splice(index, 1);
        },
		submit() {
            this.handleClose();
        },
        handleClose(){
            this.$emit('setFormData', 'targetIp', this.targetList);
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