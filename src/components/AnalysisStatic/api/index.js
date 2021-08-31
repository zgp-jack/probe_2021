import baseUrl from '@/js/baseUrl.js';
import axiosHttp from '@/js/axiosHttp.js';

/**
 * 探针管理
 * */

export default class ApiAnalysisStatic {
    // 故障类型-任务
    static typeTask = param =>
        axiosHttp.post(`${baseUrl.BASEURL}analyseTask/typeStatistics`, param);
    // 故障等级-任务
    static gradeTask = param =>
        axiosHttp.post(`${baseUrl.BASEURL}analyseTask/gradeStatistics`, param);
    // 故障类型
    static type = param =>
        axiosHttp.post(`${baseUrl.BASEURL}analyseDevice/taskFaultTypeStatisticsPage`, param);
    // 故障等级
    static grade = param =>
        axiosHttp.post(`${baseUrl.BASEURL}analyseDevice/taskFaultGradeStatisticsPage`, param);
    // 趋势图
    static typeTrend = param =>
        axiosHttp.post(`${baseUrl.BASEURL}analyseDevice/typeTrendStatistics`, param);
    // 专题分析趋势图
    static faultTrend = param =>
        axiosHttp.post(`${baseUrl.BASEURL}analyseTask/faultTrendStatistics`, param);
    // 专线分析趋势图
    static specialLineTrend = param =>
        axiosHttp.post(`${baseUrl.BASEURL}analyseTask/specialLineFaultTrendStatistics`, param);
    // 故障任务TOP8
    static faultTaskTop = param =>
        axiosHttp.post(`${baseUrl.BASEURL}analyseDevice/deviceStatisticsTop`, param);
    // 专题分析故障任务TOP8
    static exportTop = param =>
        axiosHttp.post(`${baseUrl.BASEURL}analyseTask/exportTopStatistics`, param);
}
