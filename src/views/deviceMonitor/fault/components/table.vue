<template>
    <div class="listbox">
        <div class="list-outer-div">
            <div class="list-content-div">
                <el-table
                    :data="listData"
                    stripe
                    header-row-class-name="table-header-row"
                    row-class-name="table-row"
                    height="100%" 
                    @sort-change="sortFunc" 
                    style="width: 100%">
                    <div slot="empty" class="no-data-box">
                        <img src="../../../../assets/no-data-table.png"/>
                        <p>暂无数据</p>
                    </div>
                    <el-table-column prop="index" label="序号" type="index" align="center"></el-table-column>
                    <el-table-column prop="taskName" label="任务名称" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column width="160" prop="probeIp" label="拨测接口"></el-table-column>
                    <el-table-column width="160" prop="targetIp" label="目标地址"></el-table-column>
                    <el-table-column width="100" prop="gradeName" label="等级"></el-table-column>
                    <el-table-column width="140" prop="typeName" label="故障类型" ></el-table-column>
                    <el-table-column width="160" prop="beginTime" sortable :formatter="CommonFun.formatterTime" label="开始时间"></el-table-column>
                    <el-table-column width="160" prop="endTime" sortable :formatter="CommonFun.formatterTime" label="结束时间"></el-table-column>
                    <el-table-column width="120" prop="duration" sortable :formatter="CommonFun.formatterContinuedTime" :show-overflow-tooltip="true" label="持续时间"></el-table-column>
                    <el-table-column width="100" label="详情" align="center">
                        <template slot-scope="scope">
                            <div class="btnBox" v-if="currentButtonJurisdiction.indexOf('view') > -1" title="查看" @click="handleView(scope.row)"><i class="el-icon-view"></i></div>
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
                <!-- <el-button type="text" icon="el-icon-download" class="btn-export" @click="exportListFun">导出</el-button> -->
                <div class="pageExport" v-if="currentButtonJurisdiction.indexOf('export') > -1" @click="exportListFun"><i class="pageExport-img"></i>导出</div>
            </div>
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
            listData: [],
            currentPage: 1,
			totle: 0,
            pageSize: 20,
            currentButtonJurisdiction: CommonFun.getCurrentButtonJurisdiction('analyseNetworkDevice')
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        handleSizeChange: function(val) {
            this.currentPage = 1
            this.pageSize = val
            this.getList()
        },
        sortFunc(obj) {
            let field = '';
            switch(obj.prop) {
                case 'beginTime':
                    field = 'begin_time';
                    break;
                case 'endTime':
                    field = 'end_time';
                    break;
                case 'duration':
                    field = 'duration';
                    break;
            }
            this.searchData['sort'] = field;
            if(obj.order == "ascending") {
                this.searchData.order = 'ASC';
            }else if(obj.order == "descending") {
                this.searchData.order = 'DESC';
            }else{
                this.searchData.order = undefined;
                this.searchData.sort = undefined;
            }
            this.getList();
        },
        //查询列表
        getList(page, params) {
            let that = this;
            let loading = CommonFun.openFullScreen(that);
            let param = JSON.parse(JSON.stringify(params || that.searchData));
            param.beginTime = param.beginTime / 1000;
            param.endTime = param.endTime / 1000;
            param.page = page ? page : that.currentPage;
            param.pageSize = this.pageSize;
            axiosHttp.post(`${baseUrl.BASEURL}analyseDevice/listPage`, param).then( res => {
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
        handleView(row) {
            this.$store.commit('pushIncludeList', 'analyseFlowCongestion');
            setTimeout(() => {
                this.$router.push({path: 'faultDetail', query: {id: row.deviceId, beginTime: row.beginTime, endTime: row.endTime}});
            })
        },
        exportListFun() {
            let that = this;
            let param = JSON.parse(JSON.stringify(that.searchData));
            param.beginTime = param.beginTime / 1000;
            param.endTime = param.endTime / 1000;
            param.pageSize = undefined;
            param.page = undefined;
            let loading = CommonFun.openFullScreen(that);
            axiosHttp.post(`${baseUrl.BASEURL}analyseDevice/exportListFile`, param).then((res) => {
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
        searchData: {
            handler: function(val) {
                //this.getList();
            },
            deep: true
        }
    }
}
</script>
<style lang="scss" scoped>
.pagebox{display: flex;justify-content: center;position: relative;align-items: center;}
.pageExport{display: flex;position: absolute;right: 0;color: #0590DE;align-items: center;cursor: pointer;}
.pageExport-img{display: inline-block;width: 18px;height: 15px;margin-right: 10px;font-size: 14px;background-image: url('../../../../assets/pageExport.png');background-size: cover;}
.pageImport{right: 80px;top: 8px;font-size: 14px;}
.listbox{height: calc(100% - 70px);}
</style>