<template>
    <div>
        <el-table
            :data="listData"
            stripe
            v-loading="loading"
            header-row-class-name="table-header-row"
            row-class-name="table-row"
            @sort-change="sortFunc" 
            style="width: 100%">
            <div slot="empty" class="no-data-box">
                <img src="../../../../assets/no-data-table.png"/>
                <p>暂无数据</p>
            </div>
			<el-table-column prop="index" label="序号" type="index" align="center"></el-table-column>
                <el-table-column prop="taskName" label="任务名称" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column width="160" prop="probeInterfaceIp" label="拨测接口"></el-table-column>
                <el-table-column width="160" prop="targetIp" label="目标地址"></el-table-column>
                <el-table-column width="120" prop="allDuration" sortable :formatter="CommonFun.formatterContinuedTimeByKey" :show-overflow-tooltip="true" label="故障总时长"></el-table-column>
                <el-table-column width="140" prop="faultCount" sortable label="故障总次数" >
                    <template slot-scope="scope">
                        <span title="查看" @click="toPage(scope.row)" style="cursor: pointer; color: #00E9DF">{{scope.row.faultCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="120" prop="averageDuration" sortable :formatter="CommonFun.formatterContinuedTimeByKey" :show-overflow-tooltip="true" label="故障平均时长"></el-table-column>
                <el-table-column width="160" prop="interfaceCount" sortable  label="接口总数"></el-table-column>
                <el-table-column width="100" prop="health" sortable label="健康度"></el-table-column>
                <el-table-column width="120" prop="statusName" label="任务状态"></el-table-column>
                <el-table-column width="100" label="详情" align="center">
                    <template slot-scope="scope">
                        <div class="btnBox" title="查看" @click="handleView(scope.row)"><i class="el-icon-view"></i></div>
                    </template>
                </el-table-column>
		</el-table>
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
            <!-- <el-button type="text" icon="el-icon-download" class="btn-export" @click="exportListFun">导出</el-button> -->
            <div class="pageExport" @click="exportListFun"><i class="pageExport-img"></i>导出</div>
		</div>
    </div>
</template>
<script>
import baseUrl from '@/js/baseUrl.js';
import axiosHttp from '@/js/axiosHttp.js';
import CommonFun from '@/js/commonFun.js';
export default {
    props: {
        searchData: {
            type: Object
        }
    },
    data() {
        return {
            loading: false,
            listData: [],
            currentPage: 1,
			totle: 0,
            pageSize: 20,
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        toPage(row) {
            let toPage = 'analyseFlowCongestion';
            this.$store.commit('pushIncludeList', 'analyseNetworkDevice');
            this.$router.push({path: toPage, query: {taskName: row.taskName}});
            sessionStorage.setItem('defaultActive', toPage);
            this.$store.dispatch('setDefaultActive', toPage);
            // this.$store.dispatch('pushCurrentExistTabPageArr', toPage);
            // this.$store.dispatch('setCurrentAddress', toPage);

            // let pageTabArr = JSON.parse(sessionStorage.getItem('pageTabArr'));
            // for(let i = 0; i < pageTabArr.length; i++) {
            //     if(toPage == pageTabArr[i].url) {
            //         this.$store.dispatch('setEditableTabsValue', pageTabArr[i].name);
            //         break;
            //     }
            // }
        },
        handleSizeChange: function(val) {
            this.currentPage = 1
            this.pageSize = val
            this.getList()
        },
        sortFunc(obj) {
            let field = 0;
            switch(obj.prop) {
                case 'allDuration':
                    field = 0;
                    break;
                case 'averageDuration':
                    field = 1;
                    break;
                case 'faultCount':
                    field = 2;
                    break;
                case 'interfaceCount':
                    field = 3;
                    break;
                case 'health':
                    field = 4;
                    break;
            }
            this.searchData['field'] = field;
            if(obj.order == "ascending") {
                this.searchData.sort = 1;
            }else if(obj.order == "descending") {
                this.searchData.sort = 2;
            }else{
                this.searchData.order = undefined;
                this.searchData.sort = undefined;
            }
            this.getList();
        },
        //查询列表
        getList(page) {
            let that = this;
            that.loading = true;
            let param = JSON.parse(JSON.stringify(that.searchData));
            param.beginTime = param.beginTime / 1000;
            param.endTime = param.endTime / 1000;
            param.page = page ? page : that.currentPage;
            param.pageSize = this.pageSize;
            axiosHttp.post(`${baseUrl.BASEURL}taskManagerDevice/analysis/list`, param).then( res => {
                const data = res.data;
                that.loading = false;
                if (data.status === 1) {
                    that.totle = data.data.total;
                    that.listData = data.data.records;
                }
                else {
                    CommonFun.responseError(data, that);
                }
            }).catch(function(err) {
                that.loading = false;
            })
        },
        handleView(row) {
            let param = {
                id: row.id,
                taskType: 1,
                beginTime: this.searchData.beginTime / 1000,
                endTime: this.searchData.endTime / 1000,
            }
            this.$store.commit('pushIncludeList', 'analyseNetworkDevice');
            setTimeout(() => {
                this.$router.push({path: 'faultDetail', query: param});
            })
        },
        exportListFun() {
            let that = this;
            let param = JSON.parse(JSON.stringify(that.searchData));
            param.beginTime = param.beginTime / 1000;
            param.endTime = param.endTime / 1000;
            let loading = CommonFun.openFullScreen(that);
            //TODO
            axiosHttp.post(`${baseUrl.BASEURL}taskManagerDevice/analysis/exprotList`, param).then((res) => {
                CommonFun.closeFullScreen(loading);
                if (res.data.status === 1) {
                    window.open(res.data.data);
                }
                else {
                    CommonFun.responseError(res.data, that);
                }
            })
            .catch(function(err) {
                CommonFun.closeFullScreen(loading);
            });
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getList()
        },
    },
    watch: {
    }
}
</script>
<style lang="scss" scoped>
.pagebox{display: flex;justify-content: center;position: relative;align-items: center;}
.pageExport{display: flex;position: absolute;right: 0;color: #0590DE;align-items: center;cursor: pointer;}
.pageExport-img{display: inline-block;width: 18px;height: 15px;margin-right: 10px;font-size: 14px;background-image: url('../../../../assets/pageExport.png');background-size: cover;}
.pageImport{right: 80px;top: 8px;font-size: 14px;}
</style>