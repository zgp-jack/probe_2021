import baseUrl from '@/js/baseUrl.js';
import axiosHttp from '@/js/axiosHttp.js';

/**
 * 主页
 * */

export default class ApiIndex {
    // 任务类型与级别区分统计告警数量
    static homeReportLevelStatistics = param =>
        axiosHttp.post(`${baseUrl.BASEURL}analyseTask/homeReportLevelStatistics`, param);
    // 地图
    static mapFalutTypeCout = param =>
        axiosHttp.get(`${baseUrl.BASEURL}home/mapFalutTypeCout?level=${param.level}&name=${param.name}`);
    // 丢包，时延，网络故障趋势
    static homeWebFaultDistribution = param =>
        axiosHttp.post(`${baseUrl.BASEURL}analyseTask/homeWebFaultDistribution`, param);
    // 设备故障趋势
    static deviceDayFaultStatistics = param =>
        axiosHttp.post(`${baseUrl.BASEURL}analyseDevice/deviceDayFaultStatistics`, param);
    // 设备故障机构top8
    static deviceFaultTopStatistics = param =>
        axiosHttp.post(`${baseUrl.BASEURL}analyseDevice/deviceFaultTopStatistics`, param);
    // 网络故障机构top8
    static webFaultTopStatistics = param =>
        axiosHttp.post(`${baseUrl.BASEURL}analyseTask/webFaultTopStatistics`, param);
    // 网络故障故障类型分布
    static webFaultTypeStatistics = param =>
        axiosHttp.post(`${baseUrl.BASEURL}analyseTask/webFaultTypeStatistics`, param);
    // 统计集合
    static homeDataStatistics = param =>
        axiosHttp.post(`${baseUrl.BASEURL}home/homeDataStatistics`, param);
    // 设备故障故障类型分布
    static deviceFaultTypeStatistics = param =>
        axiosHttp.post(`${baseUrl.BASEURL}analyseDevice/deviceFaultTypeStatistics`, param);
    // 接口下拉框
    static interfaceDropDown = param =>
        axiosHttp.post(`${baseUrl.BASEURL}home/interfaceDropDown`, param);
    // 流量趋势
    static queryDeviceInterfaceDatumNew = param =>
        axiosHttp.post(`${baseUrl.BASEURL}analyseDevice/queryDeviceInterfaceDatumNew`, param);
}
