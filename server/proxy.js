const express = require('express')

const router = express.Router()

const app = express()

const hptl = require('../utils/httpUtil')
// const proxyUrl = 'https://showcase.thinkingsam.cn/syun-backend/api/'
// const proxyUrl = 'http://deploy.thinkingsam.cn/syun-backend-dev/'
// const proxyUrl = 'http://172.16.120.242:7786/'
// const proxyUrl = 'http://172.16.16.193:7786/'
// const proxyUrl = 'http://localhost:7786/'
// const proxyUrl = 'http://172.16.120.225:7786/'
const proxyUrl = 'http://192.168.80.200:8080/crmserver/'


router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
})

router.get('/test', (req, res) => {
  console.log('backend test')
  hptl.httpGet(proxyUrl + '/test').then(({data}) => {
    res.json(data)
  }, err => {
    console.log(err)
    res.json({returnCode: -1, errMsg: '网络异常'})
  })
})

router.post('/test', (req, res) => {
  console.log('test post:' + JSON.stringify(req.body))
  hptl.httpPost(proxyUrl + 'test', {name: '测试'}).then(({data}) => {
    console.log(data)
    res.json({returnCode: 0})
  })
})

router.post('/logout', (req, res) => {
  if (req.session.currentUser) delete req.session.currentUser
  res.json({returnCode: 0})
})

const multipart = require('connect-multiparty')
const multipartMiddleware = multipart()
const fs = require('fs')
const rqt = require('request')
const url = require('url')
// ueditor config
const ueConfig = require('./ueditorConfig.js')

router.get('/fileUpload', (req, res) => {
  console.log(req.url)
  const url_parts = url.parse(req.url, true)
  console.log(url_parts)
  if (url_parts.query.action === 'config')
    res.json(ueConfig)
  else
    res.json({})

})

router.post('/fileUpload', multipartMiddleware, (req, res) => {
  console.log(req.url)
  const url_parts = url.parse(req.url, true)
  var action = ''
  if (req.body.action) {
    action = req.body.action
  } else {
    action = url_parts.query.action
  }
  // var formData = new FormData()
  // formData.append('action', req.body.action)
  // formData.append('upfile', fs.createReadStream(req.files.upfile.path))
  const formData = {
    action: action,
    upfile: fs.createReadStream(req.files.upfile.path)
  }
  if (req.body.dataType) formData.dataType = req.body.dataType
  if (req.body.sheetIdx) formData.sheetIdx = req.body.sheetIdx
  rqt.post({url: proxyUrl + 'file/uedit/upload', formData: formData, headers: {'zhdcrm-proxy-token': hptl.proxyToken('zhdcrm')}}, function (err, resp, body) {
    console.log('err:>>', err)
    console.log('body:>>', typeof body)
    fs.unlink(req.files.upfile.path, function(err) {
      if (err)
        console.error(err)
      else
        console.log('temp file delete success')
    })
    res.send(body)
  })
})

router.post('/common/post', (req, res) => {
  const body = req.body
  console.log(body)
  hptl.httpPost(proxyUrl + body.url, body.params).then(({data}) => {
    if ((body.url === 'login' || body.url === 'setting/acct/updateProfile') && data.returnCode === 0) {
      let currentUser = data.currentUser
      req.session.currentUser = currentUser
    }
    res.json(data)
  }, err => {
    console.log(err)
    res.json({returnCode: -1, errMsg: '网络异常'})
  })
})

router.post('/common/get', (req, res) => {
  const body = req.body
  hptl.httpGet(proxyUrl + body.url).then(({data}) => {
    res.json(data)
  }, err => {
    console.log(err)
    resj.json({returnCode: -1, errMsg: '网络异常'})
  })
})

router.post('/common/del', (req, res) => {
  const body = req.body
  hptl.httpDelete(proxyUrl + body.url, body.params).then(({data}) => {
    res.json(data)
  }, err => {
    console.log(err)
    res.json({returnCode: -1, errMsg: '网络异常'})
  })
})

module.exports = {
  path: '/proxy',
  handler: router
}