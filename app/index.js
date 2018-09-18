const Koa = require('koa')
const koaBody = require('koa-body')
const router = require('koa-router')()
const nodeUrl = require('url')
const send = require('koa-send')
const path = require('path')

const staticOptions = {
  root: path.join(__dirname, '../example/dist'),
  index: 'index.html'
}

const pdf = require('./lib/pdf.js')
const createPdfBuffer = pdf.createPdfBuffer
const createPdfFileMergedBuffer = pdf.createPdfFileMergedBuffer

router.post('/pdf/create/files', async (ctx, next) => {
  const { cookie, pdfOptions, list = [] } = ctx.request.body
  const filename = encodeURIComponent(ctx.request.body.filename || 'collectionofpdf')
  const queryList = list.map((item) => {
    const hostname = nodeUrl.parse(item.url).hostname
    return [
      item.url,
      {
        cookie: findCookie(ctx, hostname, item.cookie || cookie || '') || [],
        pdfOptions: item.pdfOptions || pdfOptions
      }
    ]
  })
  const pdfBuffer = await createPdfFileMergedBuffer(queryList)
  ctx.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment;filename="${filename}.pdf"`,
    'Content-Length': `${pdfBuffer.length}`
  })
  ctx.body = pdfBuffer
})

router.get('/pdf/create/download', async (ctx, next) => {
  const { url, cookie, pdfOptions } = ctx.request.query
  const filename = encodeURIComponent(ctx.request.query.filename || 'newpdf')
  const hostname = nodeUrl.parse(url).hostname
  const pdfBuffer = await createPdfBuffer(url, {
    cookie: findCookie(ctx, hostname, cookie),
    pdfOptions
  })

  ctx.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment;filename="${filename}.pdf"`,
    'Content-Length': `${pdfBuffer.length}`
  })
  ctx.body = pdfBuffer
})

const app = new Koa()
app.use(koaBody())
app.use(router.routes())

// 静态文件服务，提供示例
app.use(async (ctx, next) => {
  if (ctx.path.indexOf('/example') !== 0 && ctx.path !== '/') {
    return next()
  }
  const dir = ctx.path.slice(8) || '/'
  await send(ctx, dir, staticOptions)
})

app.listen(19898, () => {
  console.log(`server is started at 19898`)
})

function findCookie (ctx, hostname, cookie) {
  let cookies = cookie || ctx.get('Cookie')
  if (Array.isArray(cookies)) {
    cookies = cookies.join('; ')
  }
  const result = []
  if (cookies) {
    const list = cookies.split('; ')
    list.forEach((item) => {
      const [ name, value ] = item.split('=')
      result.push({
        name,
        value,
        domain: hostname
      })
    })
  }
  return result
}
