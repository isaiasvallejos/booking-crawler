import { Request, Response } from 'express'
import { Http } from '@ports/http/namespace'

import ApplicationError from '@core/errors/application'
import InvalidSchemaError from '@core/errors/invalid-schema'
import logger from '@infrastructure/logger'

const respondsInternalError = (response: Response) => {
  return response.status(500).json({
    message: 'Internal error',
    code: 'internal_error'
  })
}

const respondsClientError = (response: Response, error: ApplicationError) => {
  return response.status(400).json({
    message: error.message,
    code: error.code,
    data: error.data
  })
}

const respondsError = (response: Response, error: ApplicationError) => {
  if (error instanceof InvalidSchemaError) {
    return respondsClientError(response, error)
  }

  return respondsInternalError(response)
}

const useController = (controller: Http.Controller) => {
  return async (request: Request, response: Response) => {
    try {
      const { body, statusCode, error } = await controller.handle({
        body: request.body,
        headers: request.headers as Record<string, any>,
        query: request.query
      })

      if (error) return respondsError(response, error)

      return response.status(statusCode || 200).json(body)
    } catch (error) {
      logger.error({
        message: 'Internal error',
        code: 'http_internal_error',
        error
      })

      return respondsInternalError(response)
    }
  }
}

export { useController }
