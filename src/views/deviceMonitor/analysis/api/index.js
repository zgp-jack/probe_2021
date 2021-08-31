import baseUrl from '@/js/baseUrl.js';
import axiosHttp from '@/js/axiosHttp.js';

/**
 * 统计分析
 * */

export default class ApiIndex {
    // 统计分析
    static statis = param =>
        axiosHttp.post(`${baseUrl.BASEURL}task/statistics/dataStatistics`, param);
}
