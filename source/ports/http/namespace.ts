import ApplicationError from '@core/errors/application'

export namespace Http {
  export interface Request {
    headers: Record<string, string | number>
    query: Record<string, any>
    body: Record<string, any>
  }

  export interface Response {
    statusCode?: number
    body?: unknown
    error?: ApplicationError
  }

  export interface Controller {
    handle: (request: Http.Request) => Promise<Http.Response>
  }
}
