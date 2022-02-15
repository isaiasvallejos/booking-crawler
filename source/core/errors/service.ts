import ApplicationError from './application'

export default class ServiceError extends ApplicationError {
  type: string

  constructor(message: string, type: string) {
    super(message, 'service_error')
    this.type = type
  }
}
