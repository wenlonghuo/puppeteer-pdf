const browser = require('./puppeteer')
const path = require('path')
const fs = require('fs')
const queueExecAsyncFunc = require('./queue')
const pdfMerge = require('pdf-merge')

const MAX_QUEUE_LEN = 5

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

const getUniqueFilename = (() => {
  let cnt = 0
  const pid = process.pid
  return () => {
    if (cnt > 1e18) {
      cnt = 1
    }
    cnt++
    const id = parseInt(`${pid}${Date.now()}`).toString(36)
    return `pdf_${id}_${cnt}`
  }
})()

/**
 * create pdf with buffer return
 * @param {String} url a web page url to fetch
 * @param {Object}
 *  @param {Array} cookie A array with cookie Object
 *  @param {Object} pdfOptions options for puppeteer pdf options, cover the default pdf setting
 */
async function createPdfBuffer (url, { cookie, pdfOptions = {} }) {
  const options = Object.assign({}, defaultPdfOptions, pdfOptions)

  const page = await browser.open(url, {
    cookie
  })
  const buff = await page.pdf({ ...options })
  return buff
}

/**
 * create pdf with file path return
 * @param {String} url a web page url to fetch
 * @param {Object}
 *  @param {Array} cookie A array with cookie Object
 *  @param {Object} pdfOptions options for puppeteer pdf options, cover the default pdf setting
 */
async function createPdfFile (url, { cookie, pdfOptions = {} }) {
  const options = Object.assign({}, defaultPdfOptions, pdfOptions)

  const page = await browser.open(url, {
    cookie
  })
  const filename = path.join(__dirname, '../../static/', getUniqueFilename() + '.pdf')
  await page.pdf({ path: filename, ...options })
  return filename
}

async function queueCreatePdfFile (list = []) {
  const result = await queueExecAsyncFunc(createPdfFile, list, { maxLen: MAX_QUEUE_LEN })
  return result
}

async function createPdfFileMergedBuffer (list) {
  const files = await queueCreatePdfFile(list)
  return pdfMerge(files)
    .then((buffer) => {
      return Promise.all(files.map((file) => {
        return new Promise((resolve) => {
          fs.unlink(file, resolve)
        })
      })).then(() => {
        return buffer
      })
    })
}

module.exports = {
  createPdfBuffer,
  createPdfFile,
  queueCreatePdfFile,
  createPdfFileMergedBuffer,
  getUniqueFilename
}
