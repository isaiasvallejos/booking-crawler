import { getHttpApplication } from '@ports/http/core/app'
import { addDays, addMonths, formatISO } from 'date-fns'
import request from 'supertest'

describe('POST /search', function () {
  const app = getHttpApplication()

  describe('with invalid body', () => {
    let response: request.Response

    beforeAll(
      /* create request */ async () => {
        response = await request(app)
          .post('/search')
          .set('Accept', 'application/json')
      }
    )

    it('responds with status code "400 bad request"', async function () {
      expect(response.statusCode).toBe(400)
    })

    it('responds with "invalid schema" code', async function () {
      expect(response.body.code).toBe('invalid_schema')
    })

    it('responds with schema errors data', async function () {
      expect(response.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: expect.any(Array),
            type: expect.any(String)
          })
        ])
      )
    })
  })

  describe('with valid body', () => {
    jest.setTimeout(15000)

    let response: request.Response

    beforeAll(
      /* create request */ async () => {
        /**
         * TODO: Mock response from crawler to ensure that tests will not fail due real booking dates
         */
        const checkIn = formatISO(addMonths(new Date(), 6))
        const checkOut = formatISO(addDays(addMonths(new Date(), 6), 3))

        response = await request(app)
          .post('/search')
          .send({
            checkIn,
            checkOut
          })
          .set('Accept', 'application/json')
      }
    )

    it('responds with status code "200 ok"', async function () {
      expect(response.statusCode).toBe(200)
    })

    it('responds with search data', async function () {
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: expect.any(String),
            image: expect.any(String),
            price: expect.any(Number),
            description: expect.any(String)
          })
        ])
      )
    })
  })
})
