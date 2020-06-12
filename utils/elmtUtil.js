let load = null
let msgInstance = null
module.exports = {
  msgShow(context, text = '网络异常', type = 'error') {
    if (msgInstance) return
    msgInstance = context.$message({
      message: text,
      type
    })
    msgInstance.onClose(() => {
      msgInstance = null
    })
  },
  confirmDialog(
    context,
    text,
    manConfig = {},
    type = 'warning',
    title = '提示'
  ) {
    let defaultConfig = {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: type
    }
    for (let k in manConfig) {
      defaultConfig[k] = manConfig[k]
    }
    return context.$confirm(text, title, defaultConfig)
  },
  pageShow(context, loadText = '加载中...') {
    if (load) this.pageHide()
    load = context.$loading({
      lock: true,
      text: loadText,
      spinner: 'el-icon-loading',
      background: 'rgba(0,0,0,.7)'
    })
  },
  pageHide() {
    if (load) {
      load.close()
      load = null
    }
  }
}
