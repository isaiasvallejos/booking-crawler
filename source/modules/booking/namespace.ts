export namespace Booking {
  export enum BookingProvider {
    Omnibees = 'omnibees'
  }

  export enum SearchBookingLanguage {
    PT_BR = 'pt-BR'
  }

  export enum SearchBookingCurrency {
    BRL = 'BRL'
  }

  export interface SearchBookingConfiguration {
    provider: BookingProvider
    clientId: string
    hotelId: string
  }

  export interface SearchBookingMetadata {
    provider: BookingProvider
    language: SearchBookingLanguage
    currency: SearchBookingCurrency
  }

  export interface SearchBookingData {
    checkIn: string
    checkOut: string
    adults: number
    childrens: number
    rooms: number
  }

  export interface SearchBooking {
    search: SearchBookingData
    metadata: SearchBookingMetadata
    configuration: SearchBookingConfiguration
  }

  export interface SearchRoom {
    name: string
    image: string
    price: number
    description: string
  }
}
