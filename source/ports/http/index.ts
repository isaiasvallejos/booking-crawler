import logger from '@infrastructure/logger'
import { getHttpApplication } from './core/app'

const startHttp = () => {
  const app = getHttpApplication()

  const port = process.env.PORT || 8080

  app.listen(port, () =>
    logger.info({
      message: `Running 'http' on port ${port}...`,
      code: 'application_started',
      data: {
        port,
        type: 'http'
      }
    })
  )

  return app
}

startHttp()
