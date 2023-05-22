const allGridColumns: any = {
  // 资产负债表(结转前)
  beforeDebt: [
    { title: '项目', field: 'prjAmount', width: '150' },
    { title: '合计', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '企业养老保险基金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '失业保险基金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '工伤保险基金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '生育保险基金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '离休医疗统筹', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '就业补助资金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '城市居民低保资金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '企业军转干部补助资金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '城市医疗补助资金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '农村医疗救助资金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '新型农村合作医疗资金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '农村养老保险', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '大病互助资金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '残疾人就业保障基金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '农村居民低保资金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '未保集体企业退休人员补助资金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '城镇居民医疗保险基金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '优抚对象医疗救助资金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '孕产妇补助资金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '城镇职工基本医疗保险基金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '机关事业养老保险基金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '新型农村养老保险基金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '被征地农民社会保障基金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '城镇居民养老保险基金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '小额贷款担保基金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '其他社保资金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '一站式结算财政兜底资金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '技能提升行动', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '党员', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' }
  ],
  // 资产负债表(年末结转)
  afterDebt: [
    { title: '项目', field: 'prjAmount', width: '150' },
    { title: '合计', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '失业保险基金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '离休医疗统筹', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '就业补助资金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '企业军转干部补助资金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '城市医疗补助资金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '农村养老保险', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '残疾人就业保障基金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '未保集体企业退休人员补助资金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '优抚对象医疗救助资金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '孕产妇补助资金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '机关事业养老保险基金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '新型农村养老保险基金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '被征地农民社会保障基金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '小额贷款担保基金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '其他社保资金', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '技能提升行动', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' },
    { title: '党员', field: 'prjAmount', className: 'stateWarnColor', formatter: 'formatAmount', width: '150' }
  ]
}

export async function getGridColumns(name: string | number) {
  const columns = allGridColumns[name]
  return columns
}
