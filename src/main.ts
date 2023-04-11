import { createApp } from 'vue'
import App from './App.vue'
import store from './store'

import '@/mock'

import router from '@/router/routers'
import './router/index'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import Print from 'vue3-print-nb'

import '@/icons' // icon
import SvgIcon from '@/components/SvgIcon/index.vue' // svg组件

import XEUtils from 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
// 全局默认参数
VXETable.setup({
  table: {
    size: 'mini'
  }
})
// 自定义全局的格式化处理函数
VXETable.formats.mixin({
  // 格式化金额
  formatAmount({ cellValue }, digits = 2) {
    return XEUtils.commafy(XEUtils.toNumber(cellValue), { digits })
  },
  formatBoolean({ cellValue }) {
    if (cellValue) {
      return '是'
    } else {
      return '否'
    }
  }
})
function useTable(app: any) {
  app.use(VXETable)
  // 给 vue 实例挂载内部对象，例如：
  // app.config.globalProperties.$XModal = VXETable.modal
  // app.config.globalProperties.$XPrint = VXETable.print
  // app.config.globalProperties.$XSaveFile = VXETable.saveFile
  // app.config.globalProperties.$XReadFile = VXETable.readFile
}
import './components/filterMode/index.tsx'// 表格组件优化自定义筛选
import { CaretBottom, Search, RefreshRight, Download, Sort, CircleClose, Plus, Minus, View, Right, UserFilled, User, Unlock, EditPen, Delete, MoreFilled, Upload, Check, Lock, QuestionFilled } from '@element-plus/icons-vue'

import './styles/index.scss'

const app = createApp(App)
// import global directive
import directive from '@/components/permission/index'
directive(app)

app.component('SvgIcon', SvgIcon)

app.component('UserFilled', UserFilled)
app.component('Lock', Lock)
app.component('CaretBottom', CaretBottom)
app.component('Search', Search)
app.component('RefreshRight', RefreshRight)
app.component('Download', Download)
app.component('Sort', Sort)
app.component('CircleClose', CircleClose)
app.component('Plus', Plus)
app.component('Minus', Minus)
app.component('View', View)
app.component('Right', Right)
app.component('User', User)
app.component('Unlock', Unlock)
app.component('EditPen', EditPen)
app.component('Delete', Delete)
app.component('MoreFilled', MoreFilled)
app.component('Upload', Upload)
app.component('Check', Check)
app.component('QuestionFilled', QuestionFilled)

app.use(Print)
app.use(ElementPlus)
app.use(useTable)
app.use(router)
app.use(store)
app.mount('#app')
