import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { badRequest, noContent, notFound } from '../utils/response.js'
import { FlightService } from '../core/application/flightService.js'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log(`event: ${JSON.stringify(event, null, 2)}`)

  const id = event.pathParameters?.id

  if (!id) {
    return badRequest('A flight id is required in the path parameters - /flight/:id.')
  }

  const flightService = new FlightService()
  const result = await flightService.delete(id)

  return result ? noContent() : notFound()
}
