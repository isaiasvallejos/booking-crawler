import ApplicationError from './application'

export interface SchemaError {
  path: (string | number)[]
  type: string
}

export default class InvalidSchemaError extends ApplicationError {
  constructor(errors: SchemaError[]) {
    super('Invalid schema error', 'invalid_schema')
    this.data = errors
  }
}
