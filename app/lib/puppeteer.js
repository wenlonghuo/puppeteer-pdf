'use strict'
const puppeteer = require('puppeteer')

class Browser {
  constructor (option) {
    this.option = {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      ignoreHTTPSErrors: true,
      dumpio: false,
      ...option
    }
  }
  async start () {
    if (!this.browser) {
      this.browser = await puppeteer.launch(this.option)
      this.browser.once('disconnected', () => {
        this.browser = undefined
      })
    }
    return this.browser
  }
  async exit () {
    if (!this.browser) {
      return
    }
    await this.browser.close()
  }
  async open (url, { cookie }) {
    await this.start()
    const page = await this.browser.newPage()
    // 缓存状态下多页面可能不正常
    await page.setCacheEnabled(false)
    // await page.goto('about:blank', {waitUntil: 'networkidle0'})
    if (cookie) {
      const cookies = Array.isArray(cookie) ? cookie : [cookie]
      await page.setCookie(...cookies)
    }

    await page.goto(url, {
      waitUntil: 'networkidle0'
    })
    return page
  }
}

const browser = new Browser({
  headless: true
})

process.on('exit', () => {
  browser.exit()
})

module.exports = browser
