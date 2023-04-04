import VXETable from 'vxe-table'
import FilterInput from "../filterMode/FilterInput.vue"

// 创建一个简单的输入框筛选
VXETable.renderer.add('FilterInput', {
  // 筛选模板
  renderFilter (renderOpts, params) {
    return [
      <FilterInput params={ params }></FilterInput>
    ]
  },
  // 重置数据方法
  filterResetMethod (params) {
    const { options } = params
    options.forEach((option) => {
      option.data = ''
    })
  },
  // 重置筛选复原方法（当未点击确认时，该选项将被恢复为默认值）
  filterRecoverMethod ({ option }) {
    option.data = ''
  },
  // 筛选方法
  filterMethod (params) {
    const { option, row, column } = params
    const { data } = option
    const cellValue = row[column.field]
    if (cellValue) {
      return cellValue.indexOf(data) > -1
    }
    return false
  }
})
