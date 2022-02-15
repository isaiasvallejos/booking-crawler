import Joi from 'joi'

import InvalidSchemaError from '@core/errors/invalid-schema'
import { Either } from '@core/logic/either'

export namespace Core {
  type DeepPartial<T> = T extends object
    ? {
        [P in keyof T]?: DeepPartial<T[P]>
      }
    : T

  export interface CommandOptions<T> {
    schema?: Joi.Schema
    defaults?: DeepPartial<T>
  }

  export type CommandFactory<T> = (
    data: DeepPartial<T>
  ) => Either<InvalidSchemaError, Command<T>>

  export type Command<T> = T

  export interface UseCase<T, R> {
    createCommand: CommandFactory<T>
    execute: (command: T) => R
  }
}
