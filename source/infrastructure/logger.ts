import pino from 'pino'

export interface Log {
  message: string
  code?: string
  data?: any
  error?: any
}

const logger =
  process.env.NODE_ENV === 'production'
    ? pino()
    : pino({
        enabled: process.env.NODE_ENV !== 'test',
        transport: {
          target: 'pino-pretty'
        }
      })

export default {
  info: (log: Log) => logger.info(log),
  warn: (log: Log) => logger.warn(log),
  error: (log: Log) => logger.error(log),
  debug: (log: Log) => logger.debug(log)
}
