import express from 'express'
import { searchController } from '../controllers/search'

const bookingRoutes = express.Router()

bookingRoutes.post('/search', (request, response) =>
  searchController(request, response)
)

export { bookingRoutes }
