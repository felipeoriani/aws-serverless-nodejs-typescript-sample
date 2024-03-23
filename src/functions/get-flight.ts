import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { badRequest, ok } from '../utils/response.js'
import { FlightService } from '../core/application/flight-service.js'
import { IFlightService } from '../core/domain/model/flight.js'
import { isDate } from '../utils/date.js'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (!event.queryStringParameters) {
    return badRequest('Filter must be provided to request the flights.')
  }

  const { startDate, endDate, from, to, nextToken } = event.queryStringParameters

  if (!startDate) {
    return badRequest('The startDate query parameter is required.')
  }

  if (isDate(startDate)) {
    return badRequest('The startDate query parameter must be a valid date.')
  }

  if (!endDate) {
    return badRequest('The endDate query parameter is required.')
  }

  if (isDate(endDate)) {
    return badRequest('The endDate query parameter must be a valid date.')
  }

  if (!from) {
    return badRequest('The from airport query parameter is required.')
  }

  if (!to) {
    return badRequest('The to airport query parameter is required.')
  }

  const flightService: IFlightService = new FlightService()
  const result = await flightService.getPaged(startDate, endDate, from, to, 10, nextToken)
  return ok(result.model)
}
