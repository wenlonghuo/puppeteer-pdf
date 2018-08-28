const browser = require('./puppeteer')

const defaultPdfOptions = {
  displayHeaderFooter: true,
  format: 'A4',
  headerTemplate: `<p class="date"></p>`,
  footerTemplate: `<p>date</p>`,
  margin: {
    top: '1.27cm',
    right: '1.27cm',
    bottom: '1.17cm',
    left: '1.27cm',
  }
}

async function createPdf (url, { cookie, pdfOptions = {} }) {
  const options = Object.assign({}, defaultPdfOptions, pdfOptions)

  const page = await browser.open(url, {
    cookie
  })
  const buff = await page.pdf({ ...options })
  return buff
}

module.exports = createPdf
