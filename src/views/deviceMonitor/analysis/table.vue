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
                    <img src="../../../assets/no-data-table.png"/>
                    <p>暂无数据</p>
                </div>
			    <el-table-column prop="index" label="序号" type="index" align="center"></el-table-column>
                <el-table-column prop="companyName" label="机构名称" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column width="160" prop="dialNumber" sortable="custom" label="拨测任务数"></el-table-column>
                <el-table-column width="160" prop="relayNumber" sortable="custom" label="接口任务数"></el-table-column>
                <el-table-column width="160" prop="specialLineNumber" sortable="custom" label="专线任务数"></el-table-column>
                <el-table-column width="160" prop="deviceNumber" sortable="custom" label="设备任务数"></el-table-column>
                <el-table-column width="160" prop="faultRate" sortable="custom" label="故障率">
                    <template slot-scope="scope">
                        {{scope.row.faultRate}}%
                    </template>
                </el-table-column>
                <el-table-column width="160" prop="webHealthRate" sortable="custom" label="链路健康度">
                    <template slot-scope="scope">
                        {{scope.row.webHealthRate}}%
                    </template>
                </el-table-column>
                <el-table-column width="160" prop="webOnlineRate" sortable="custom" label="链路在线率">
                    <template slot-scope="scope">
                        {{scope.row.webOnlineRate}}%
                    </template>
                </el-table-column>
                <el-table-column width="160" prop="deviceHealthRate" sortable="custom" label="设备健康度">
                    <template slot-scope="scope">
                        {{scope.row.deviceHealthRate}}%
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
            <div v-if="currentButtonJurisdiction.indexOf('export')>-1" class="pageExport" @click="exportListFun"><i class="pageExport-img"></i>导出</div>
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
            currentButtonJurisdiction: CommonFun.getCurrentButtonJurisdiction('analyseStatistical'),
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
            switch(obj.prop) {
                case 'dialNumber':
                    this.searchData['sort'] = 'dial_number';
                    break;
                case 'relayNumber':
                    this.searchData['sort'] = 'relay_number';
                    break;
                case 'specialLineNumber':
                    this.searchData['sort'] = 'special_line_number';
                    break;
                case 'deviceNumber':
                    this.searchData['sort'] = 'device_number';
                    break;
                case 'faultRate':
                    this.searchData['sort'] = 'fault_rate';
                    break;
                case 'webHealthRate':
                    this.searchData['sort'] = 'web_health_rate';
                    break;
                case 'webOnlineRate':
                    this.searchData['sort'] = 'web_online_rate';
                    break;
                case 'deviceHealthRate':
                    this.searchData['sort'] = 'device_health_rate';
                    break;
            }
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
        getList(page) {
            let that = this;
            that.loading = true;
            let param = JSON.parse(JSON.stringify(that.searchData));
            if(param.beginTime && param.endTime) {
                param.beginTime = new Date(param.beginTime).getTime() / 1000;
                param.endTime = new Date(param.endTime).getTime() / 1000;
            }
            param.page = page ? page : that.currentPage;
            param.pageSize = this.pageSize;
            axiosHttp.post(`${baseUrl.BASEURL}task/statistics/listPage`, param).then( res => {
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
        exportListFun() {
            let that = this;
            let param = JSON.parse(JSON.stringify(that.searchData));
            param.beginTime = param.beginTime / 1000;
            param.endTime = param.endTime / 1000;
            let loading = CommonFun.openFullScreen(that);
            //TODO
            axiosHttp.post(`${baseUrl.BASEURL}task/statistics/exportListFile`, param).then((res) => {
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
.pageExport-img{display: inline-block;width: 18px;height: 15px;margin-right: 10px;font-size: 14px;background-image: url('../../../assets/pageExport.png');background-size: cover;}
.pageImport{right: 80px;top: 8px;font-size: 14px;}
</style>