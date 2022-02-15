import searchBookingUseCase from '@modules/booking/use-cases/search'
import { useController } from '@ports/http/adapters/controllers'

const searchController = useController({
  async handle({ body }) {
    const command = searchBookingUseCase.createCommand({
      search: {
        checkIn: body.checkIn,
        checkOut: body.checkOut
      }
    })

    if (command.isRight()) {
      const result = await searchBookingUseCase.execute(command.value)
      return { body: result }
    }

    return { error: command.value }
  }
})

export { searchController }
