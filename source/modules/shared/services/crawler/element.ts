import { Crawler } from './namespace'

export interface ElementService {
  queryElement: (
    element: Crawler.Element,
    query: string
  ) => Promise<Crawler.Element | null>
  evaluate: <T = any>(
    element: Crawler.Element,
    fn: Crawler.ElementEvaluateFn
  ) => Promise<T>
}

const useElementService = (): ElementService => ({
  queryElement(element, query) {
    return element.$(query)
  },
  evaluate(element, fn) {
    return element.evaluate(fn)
  }
})

export { useElementService }
