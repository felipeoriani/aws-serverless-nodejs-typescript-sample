import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { badRequest, notFound, ok } from '../utils/response.js'
import { FlightService } from '../core/application/flightService.js'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id

  if (!id) {
    return badRequest('A flight id is required in the path parameters - /flight/:id.')
  }

  const flightService = new FlightService()
  const result = await flightService.get(id)

  if (!result) {
    return notFound()
  }

  return ok(result)
}
