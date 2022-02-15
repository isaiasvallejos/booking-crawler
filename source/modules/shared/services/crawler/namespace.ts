import puppeteer from 'puppeteer'

export namespace Crawler {
  export type Browser = puppeteer.Browser

  export type Page = puppeteer.Page

  export type Element = puppeteer.ElementHandle

  export type ElementEvaluateFn = puppeteer.EvaluateFn
}
