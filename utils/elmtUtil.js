module.exports = {
  msgShow (context, text = '网络异常', type = 'error') {
    context.$message({
      message: text,
      type
    })
  },
  confirmDialog(context, text, manConfig = {}, type = 'warning', title = '提示') {
    let defaultConfig = {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: type
    }
    for (let k in manConfig) {
      defaultConfig[k] = manConfig[k]
    }
    return context.$confirm(text, title, defaultConfig)
  }
}