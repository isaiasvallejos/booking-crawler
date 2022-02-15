import { Crawler } from './namespace'

export interface PageService {
  createPage: () => Promise<Crawler.Page>
  navigate: (url: string, page: Crawler.Page) => Promise<void>
  queryElements: (
    query: string,
    page: Crawler.Page
  ) => Promise<Crawler.Element[]>
}

const usePageService = (browser: Crawler.Browser): PageService => ({
  createPage() {
    return browser.newPage()
  },
  async navigate(url: string, page: Crawler.Page) {
    await page.goto(url, {
      waitUntil: 'networkidle2'
    })
  },
  queryElements(query: string, page: Crawler.Page) {
    return page.$$(query)
  }
})

export { usePageService }
