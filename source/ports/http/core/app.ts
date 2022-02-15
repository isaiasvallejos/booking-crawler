import express from 'express'
import { bookingRoutes } from './routes/booking'

const getHttpApplication = () => {
  const app = express()

  app.use(express.json())
  app.use(bookingRoutes)

  return app
}

export { getHttpApplication }
