import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { badRequest, created, unprocessableEntity } from '../utils/response.js'
import { FlightService } from '../core/application/flight-service.js'

import { formatBody } from '../utils/request.js'
import { Flight } from '../core/domain/model/flight.js'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    return badRequest('A flight is required in the request body.')
  }

  const flight = formatBody<Flight>(event.body)

  console.log(`Flight: ${JSON.stringify(flight)}`)

  const flightService = new FlightService()
  const result = await flightService.create(flight)

  if (result.errors) {
    return unprocessableEntity(result.errors)
  }

  return created(result.model, `flight/${flight.id}`)
}
