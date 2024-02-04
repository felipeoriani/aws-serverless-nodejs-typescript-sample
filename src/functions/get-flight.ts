import { APIGatewayProxyResult } from 'aws-lambda'
import { ok } from '../utils/response.js'
import { FlightService } from '../core/application/flight-service.js'

export const handler = async (): Promise<APIGatewayProxyResult> => {
  const flightService = new FlightService()
  const result = await flightService.getPaged()
  return ok(result.model)
}
