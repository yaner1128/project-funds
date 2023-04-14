/**
 * @description 系统全局配置
 */
const globalConfig = {
  /**
   * @description 记住密码状态下的token在Cookie中存储的天数，默认1天
   */
  tokenCookieExpires: 1,
  /**
   * @description 记住密码状态下的密码在Cookie中存储的天数，默认1天
   */
  passCookieExpires: 1,

  /**
   * @description 是否只保持一个子菜单的展开
   */
  uniqueOpened: true,
  /**
   * @description token key
   */
  TokenKey: 'JK-TOKEN',

  /**
   * @description 请求超时时间，毫秒（默认2分钟）
   */
  timeout: 1200000,

  /**
   * @description 是否显示 tagsView
   */
  tagsView: true,

  /**
   * @description 固定头部
   */
  fixedHeader: false,

  /**
   * @description 是否显示logo
   */
  sidebarLogo: true,

  /**
   * 是否显示设置的悬浮按钮
   */
  settingBtn: false,

  /**
     * @description 此处修改网站名称
     */
   webName: '专项资金管理系统',


  /**
  * 年份数组的初始年份
  */
  defaultYear: '2018',

  /**
  * 选择的默认年份配置
  */
  selectYear: '2022',

  /**
   * serverId
   */
   serverId: 'ds-cz-datacenter-special-funds'
}
