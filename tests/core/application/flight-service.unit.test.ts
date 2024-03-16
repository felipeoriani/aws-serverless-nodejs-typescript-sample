import assert from 'node:assert/strict'
import { describe, it, beforeEach, mock } from 'node:test'

import { Flight, IFlightRepository, IFlightService } from '../../../src/core/domain/model/flight.js'
import { FlightService } from '../../../src/core/application/flight-service.js'
import { randomUUID } from 'node:crypto'

describe('flight service', () => {
  let flightRepositoryMock: IFlightRepository
  let flightService: IFlightService

  beforeEach(() => {
    flightRepositoryMock = {} as IFlightRepository
    flightService = new FlightService(flightRepositoryMock)
  })

  it('should require a code for a flight instance', async () => {
    // arrange
    const data = {} as Flight

    // act
    const result = await flightService.create(data)

    // assert
    assert.ok(result, 'The instance of the response is not valid.')
    assert.ok(result.errors, 'The instance of the response should contains errors.')
    assert.strictEqual(result.errors[0], '"code" is required')
  })

  it('should validate the min length for the code of a flight instance', async () => {
    // arrange
    const data = { code: '1' } as Flight

    // act
    const result = await flightService.create(data)

    // assert
    assert.ok(result, 'The instance of the response is not valid.')
    assert.ok(result.errors, 'The instance of the response is not valid.')
    assert.strictEqual(result.errors[0], '"code" length must be at least 3 characters long')
  })

  it('should not get a flight for an id', async () => {
    // arrange
    const id = randomUUID()
    flightRepositoryMock = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      get: async (id: string) => undefined,
    } as IFlightRepository

    const flightService: IFlightService = new FlightService(flightRepositoryMock)

    // act
    const result = await flightService.get(id)

    // assert
    assert.ok(result, 'The instance of the response is not valid.')
    assert.ok(result.errors, 'The model instance on the response is not valid.')
    assert.strictEqual(result.errors[0], `There is not a flight for the id '${id}'.`)
  })

  it('should get a flight for an id', async () => {
    // arrange
    const id = randomUUID()
    const fakeFlight = {
      code: 'NL4850UK',
      airline: 'Arlines Company',
      date: new Date(),
      from: 'Amsterdam',
      to: 'London',
      id,
    } as Flight

    flightRepositoryMock = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      get: async (id: string) => fakeFlight,
    } as IFlightRepository

    const flightService: IFlightService = new FlightService(flightRepositoryMock)

    // act
    const result = await flightService.get(id)

    // assert
    assert.ok(result, 'The instance of the response is not valid.')
    assert.ok(!result.errors, 'There are errors in the response')
    assert.ok(result.model, 'The model is not valid')
    assert.strictEqual(result.model, fakeFlight, `The model on the response it not the returned mock.`)
  })

  it('should create a flight instance successfully', async () => {
    // arrange
    const fakeFlight = {
      code: 'NL4850UK',
      airline: 'Arlines Company',
      date: new Date(),
      from: 'Amsterdam',
      to: 'London',
    } as Flight

    flightRepositoryMock = {
      create: async (entity: Flight) => {
        entity.id = randomUUID()
        return entity
      },
    } as IFlightRepository

    const flightService: IFlightService = new FlightService(flightRepositoryMock)

    // act
    const result = await flightService.create(fakeFlight)

    // assert
    assert.ok(result, 'The instance of the response is not valid.')
    assert.ok(result.model, 'The model instance on the response is not valid.')
    assert.strictEqual(result.model, fakeFlight, 'The Flight instance is not valid.')
  })
})
