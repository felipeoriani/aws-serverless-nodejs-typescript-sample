import { APIGatewayProxyResult } from 'aws-lambda'
import { created } from '../utils/response.js'
import { randomUUID } from 'crypto'

export const handler = async (): Promise<APIGatewayProxyResult> => {
  const flight = {
    id: randomUUID(),
    name: 'Company A',
    startAt: new Date(),
  }
  return created(flight, `flight/${flight.id}`)
}
