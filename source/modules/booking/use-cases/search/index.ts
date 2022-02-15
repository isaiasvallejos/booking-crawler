import logger from '@infrastructure/logger'

import { Booking } from '@modules/booking/namespace'
import { useOmnibeesBookingSearchService } from '@modules/booking/services/search'
import { Core } from '@core/namespace'
import { searchBookingCommandFactory } from './command'

type BookingSearchService = (
  command: Core.Command<Booking.SearchBooking>
) => Promise<Booking.SearchRoom[]>

const searchBooking = async (
  command: Core.Command<Booking.SearchBooking>
): Promise<Booking.SearchRoom[]> => {
  const { search, configuration } = command

  const bookingSearchServiceMap: Record<
    Booking.BookingProvider,
    BookingSearchService
  > = {
    [Booking.BookingProvider.Omnibees]: useOmnibeesBookingSearchService
  }

  const providerService = bookingSearchServiceMap[configuration.provider]

  logger.info({
    message: 'Starting booking search...',
    code: 'booking_search_start',
    data: {
      search,
      configuration
    }
  })

  const rooms = await providerService(command)

  logger.info({
    message: 'Finished booking search',
    code: 'booking_search_finish',
    data: {
      search,
      configuration
    }
  })

  return rooms
}

const searchBookingUseCase: Core.UseCase<
  Booking.SearchBooking,
  Promise<Booking.SearchRoom[]>
> = {
  createCommand: searchBookingCommandFactory,
  execute: searchBooking
}

export default searchBookingUseCase
