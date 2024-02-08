import { APIGatewayProxyResult } from 'aws-lambda'
import { ok } from '../utils/response.js'
import { FlightService } from '../core/application/flight-service.js'
import { IFlightService } from 'src/core/domain/model/flight.js'

export const handler = async (): Promise<APIGatewayProxyResult> => {
  const flightService: IFlightService = new FlightService()
  const result = await flightService.getPaged()
  return ok(result.model)
}
