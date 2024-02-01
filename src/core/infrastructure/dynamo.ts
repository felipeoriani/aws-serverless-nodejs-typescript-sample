import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

const { AWS_REGION } = process.env

export const ddb = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    apiVersion: '2012-08-10',
    region: AWS_REGION,
  })
)
