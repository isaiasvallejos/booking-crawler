import Joi from 'joi'
import { createCommandFactory } from '@core/commands'
import { Booking } from '../../namespace'

const searchBookingCommandFactory = createCommandFactory<Booking.SearchBooking>(
  {
    schema: Joi.object({
      search: {
        checkIn: Joi.date().iso().less(Joi.ref('checkOut')).required(),
        checkOut: Joi.date().iso().required(),
        adults: Joi.number().required(),
        childrens: Joi.number().required(),
        rooms: Joi.number().required()
      },
      metadata: {
        currency: Joi.string()
          .valid(...Object.values(Booking.SearchBookingCurrency))
          .required(),
        language: Joi.string()
          .valid(...Object.values(Booking.SearchBookingLanguage))
          .required()
      },
      configuration: {
        provider: Joi.string()
          .valid(...Object.values(Booking.BookingProvider))
          .required(),
        clientId: Joi.string().required(),
        hotelId: Joi.string().required()
      }
    }),
    defaults: {
      search: {
        adults: 1,
        childrens: 1,
        rooms: 1
      },
      metadata: {
        currency: Booking.SearchBookingCurrency.BRL,
        language: Booking.SearchBookingLanguage.PT_BR
      },
      configuration: {
        provider: Booking.BookingProvider.Omnibees,
        clientId: '2983',
        hotelId: '5462'
      }
    }
  }
)

export { searchBookingCommandFactory }
