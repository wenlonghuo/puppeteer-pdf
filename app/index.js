const Koa = require('koa')
const koaBody = require('koa-body')
const router = require('koa-router')()
const nodeUrl = require('url')

const createPdf = require('./lib/pdf.js')

router.post('/pdf/create/req', async (ctx, next) => {
  const { url, cookie, pdfOptions } = ctx.request.body
  const hostname = nodeUrl.parse(url).hostname

  const pdfBuffer = await createPdf(url, {
    cookie: findCookie(ctx, hostname, cookie),
    pdfOptions
  })

  ctx.body = pdfBuffer
})

router.get('/pdf/create/download', async (ctx, next) => {
  const { url, cookie, pdfOptions } = ctx.request.query
  const filename = ctx.request.query.filename || 'newpdf'
  const hostname = nodeUrl.parse(url).hostname
  const pdfBuffer = await createPdf(url, {
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
app.listen(19898, () => {
  console.log('server started')
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
