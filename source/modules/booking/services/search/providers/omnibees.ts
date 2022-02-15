import { format, parseISO } from 'date-fns'
import currency from 'currency.js'

import ServiceError from '@core/errors/service'
import { Either, left, right } from '@core/logic/either'
import { Booking } from '@modules/booking/namespace'
import {
  useBrowserService,
  useElementService,
  usePageService
} from '@modules/shared/services/crawler'
import { Crawler } from '@modules/shared/services/crawler/namespace'
import logger from '@infrastructure/logger'

const createPageUrl = ({
  search,
  configuration,
  metadata
}: Booking.SearchBooking) => {
  const formatDate = (dateString: string) =>
    format(parseISO(dateString), 'ddMMyyyy')

  const currencyIdMap: Record<Booking.SearchBookingCurrency, number> = {
    BRL: 16
  }

  const currencyId = currencyIdMap[metadata.currency]

  const formattedCheckIn = formatDate(search.checkIn)
  const formattedCheckOut = formatDate(search.checkOut)

  return `https://book.omnibees.com/hotelresults?c=${configuration.clientId}&q=${configuration.hotelId}&NRooms=${search.rooms}&CheckIn=${formattedCheckIn}&CheckOut=${formattedCheckOut}&ad=${search.adults}&ch=${search.childrens}&lang=${metadata.language}&currencyId=${currencyId}`
}

export const getRoomsElements = async ({
  search,
  configuration,
  metadata
}: Booking.SearchBooking) => {
  const browserService = useBrowserService()
  const browser = await browserService.startBrowser()

  const pageService = usePageService(browser)
  const page = await pageService.createPage()

  const url = createPageUrl({ search, configuration, metadata })

  logger.info({
    message: 'Navigating to url',
    code: 'booking_search_navigate',
    data: {
      url,
      search,
      configuration
    }
  })

  await pageService.navigate(url, page)

  const roomsElements = await pageService.queryElements(
    '#hotels_grid .roomrate',
    page
  )

  return roomsElements
}

const getRoomName = async (
  roomElement: Crawler.Element
): Promise<Either<ServiceError, string>> => {
  const elementService = useElementService()

  const roomNameElement = await elementService.queryElement(
    roomElement,
    '.hotel_name'
  )

  if (!roomNameElement) {
    return left(
      new ServiceError(
        'Failed to found room name on booking search',
        'booking_search_failed'
      )
    )
  }

  const dirtyName = await elementService.evaluate<string>(
    roomNameElement,
    $ => $.textContent
  )

  const name = dirtyName.trim()

  return right(name)
}

const getRoomImage = async (
  roomElement: Crawler.Element
): Promise<Either<ServiceError, string>> => {
  const elementService = useElementService()

  const roomImageElement = await elementService.queryElement(
    roomElement,
    '.image img'
  )

  if (!roomImageElement) {
    return left(
      new ServiceError(
        'Failed to found room image on booking search',
        'booking_search_failed'
      )
    )
  }

  const image = await elementService.evaluate<string>(roomImageElement, $ =>
    $.getAttribute('src')
  )

  return right(image)
}

const getRoomPrice = async (
  roomElement: Crawler.Element
): Promise<Either<ServiceError, number>> => {
  const elementService = useElementService()

  const roomPriceElement = await elementService.queryElement(
    roomElement,
    '.price-total'
  )

  if (!roomPriceElement) {
    return left(
      new ServiceError(
        'Failed to found room price on booking search',
        'booking_search_failed'
      )
    )
  }

  const dirtyPrice = await elementService.evaluate<string>(
    roomPriceElement,
    $ => $.textContent
  )

  const price = currency(dirtyPrice ?? 0, {
    decimal: ',',
    separator: '.'
  }).value

  return right(price)
}

const getRoomDescription = async (
  roomElement: Crawler.Element
): Promise<Either<ServiceError, string>> => {
  const elementService = useElementService()

  const roomDescriptionElement = await elementService.queryElement(
    roomElement,
    '.hotel-description'
  )

  if (!roomDescriptionElement) {
    return left(
      new ServiceError(
        'Failed to found room description on booking search',
        'booking_search_failed'
      )
    )
  }

  const dirtyDescription = await elementService.evaluate<string>(
    roomDescriptionElement,
    $ => $.textContent
  )

  const description = dirtyDescription.trim().slice(0, -11)

  return right(description)
}

const getRoomAvailability = async (
  roomElement: Crawler.Element
): Promise<Either<ServiceError, boolean>> => {
  const elementService = useElementService()

  const roomAvailabilityElement = await elementService.queryElement(
    roomElement,
    '.rate_plan'
  )

  if (!roomAvailabilityElement) {
    return left(
      new ServiceError(
        'Room not available for booking',
        'booking_search_failed'
      )
    )
  }

  return right(true)
}

const useOmnibeesBookingSearchService = async ({
  search,
  configuration,
  metadata
}: Booking.SearchBooking): Promise<Booking.SearchRoom[]> => {
  const roomsElements = await getRoomsElements({
    search,
    configuration,
    metadata
  })

  const roomsPromises = roomsElements.map(async roomElement => {
    const availability = await getRoomAvailability(roomElement)
    const name = await getRoomName(roomElement)
    const image = await getRoomImage(roomElement)
    const price = await getRoomPrice(roomElement)
    const description = await getRoomDescription(roomElement)

    return {
      availability,
      name,
      image,
      price,
      description
    }
  })

  const roomsEithers = await Promise.all(roomsPromises)

  const rooms = roomsEithers.reduce((rooms: Booking.SearchRoom[], room) => {
    const { availability, name, image, price, description } = room

    const roomIsAllRight =
      availability.isRight() &&
      name.isRight() &&
      image.isRight() &&
      price.isRight() &&
      description.isRight()

    if (roomIsAllRight) {
      return [
        ...rooms,
        {
          name: name.value,
          image: image.value,
          price: price.value,
          description: description.value
        }
      ]
    }

    return rooms
  }, [])

  return rooms
}

export { useOmnibeesBookingSearchService }
