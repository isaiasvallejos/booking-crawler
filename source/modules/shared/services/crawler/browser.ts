import puppeteer from 'puppeteer'
import { Crawler } from './namespace'

export interface BrowserService {
  startBrowser: () => Promise<Crawler.Browser>
  closeBrowser: (browser: Crawler.Browser) => Promise<void>
}

const useBrowserService = (): BrowserService => ({
  startBrowser() {
    return puppeteer.launch()
  },
  closeBrowser(browser) {
    return browser.close()
  }
})

export { useBrowserService }
