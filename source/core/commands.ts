import merge from 'merge-deep'

import { Core } from './namespace'
import InvalidSchemaError from '@core/errors/invalid-schema'
import { left, right } from '@core/logic/either'

const createCommandFactory = <T>(
  options: Core.CommandOptions<T>
): Core.CommandFactory<T> => {
  const { schema, defaults } = options

  return function createCommand(data) {
    const dataWithDefaults = merge(defaults, data) as T

    if (schema) {
      const { error } = schema.validate(dataWithDefaults)

      if (error) {
        const errors = error.details.map(errorDetail => ({
          path: errorDetail.path,
          type: errorDetail.type
        }))

        return left(new InvalidSchemaError(errors))
      }
    }

    return right(dataWithDefaults)
  }
}

export { createCommandFactory }
