/**
 * @description 系统全局配置
 */
const customConfig = {
  development: {
    /**
     * @description 此处修改网站名称
     */
    webName: '专项资金管理系统--开发环境'
  },
  production: {
    /**
     * @description 此处修改网站名称
     */
    webName: '专项资金管理系统'
  },
  demo: {
    /**
     * @description 此处修改网站名称
     */
    webName: '专项资金管理系统-演示环境'
  }
}

export default Object.assign({}, globalConfig, customConfig[process.env.NODE_ENV || 'production'])
