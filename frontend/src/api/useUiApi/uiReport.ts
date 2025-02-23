import request from '/@/utils/request';

/**
 * 项目使用接口
 * @method getProjectList 获取项目列表
 * @method getMenuTest 获取后端动态路由菜单(test)
 */
export function useUiReportApi() {
  return {
    getList: (data?: object) => {
      return request({
        url: '/uiReport/list',
        method: 'POST',
        data,
      });
    },
    saveOrUpdate(data?: object) {
      return request({
        url: '/uiReport/saveOrUpdate',
        method: 'POST',
        data
      })
    },
    deleted: (data?: object) => {
      return request({
        url: '/uiReport/deleted',
        method: 'POST',
        data,
      });
    },
    getReportDetail: (data?: object) => {
      return request({
        url: '/uiReport/getUiReportDetail',
        method: 'POST',
        data,
      });
    },
    getReportStatistics: (data?: object) => {
      return request({
        url: '/uiReport/getUiReportStatistics',
        method: 'POST',
        data,
      });
    },
  };
}
