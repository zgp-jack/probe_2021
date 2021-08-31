import baseUrl from '@/js/baseUrl.js';
import axiosHttp from '@/js/axiosHttp.js';

/**
 * 探针管理
 * */

export default class ApiTaskDiaTest {
    // 列表
    static list = param =>
        axiosHttp.post(`${baseUrl.BASEURL}taskManagerSpecialLine/listPage`, param);
    // 删除
    static delete = param =>
        axiosHttp.delete(`${baseUrl.BASEURL}taskManagerSpecialLine/delete`, {data: param});
    // 保存
    static save = param =>
        axiosHttp.post(`${baseUrl.BASEURL}taskManagerSpecialLine/save`, param);
    // 启用-停用
    static status = param =>
        axiosHttp.post(`${baseUrl.BASEURL}taskManagerSpecialLine/setStatus`, param);
    // 下发
    static send = param =>
        axiosHttp.post(`${baseUrl.BASEURL}taskManagerSpecialLine/sendTask`, param);
    // 根据探针IP查找接口IP
    static listSpecialLine = param =>
        axiosHttp.post(`${baseUrl.BASEURL}taskManagerSpecialLine/listPage`, param);
}
