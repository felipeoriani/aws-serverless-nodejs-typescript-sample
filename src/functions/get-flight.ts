import { APIGatewayProxyResult } from 'aws-lambda'
import { ok } from '../utils/response.js'
import { randomUUID } from 'crypto'

export const handler = async (): Promise<APIGatewayProxyResult> => {
  const flights = [
    {
      id: randomUUID(),
      name: 'Company A',
      startAt: new Date(),
    },
    {
      id: randomUUID(),
      name: 'Company B',
      startAt: new Date(),
    },
    {
      id: randomUUID(),
      name: 'Company C',
      startAt: new Date(),
    },
  ]

  return ok(flights)
}
