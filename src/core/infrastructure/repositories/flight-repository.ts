import { DynamoDBDocumentClient, QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb'
import { ddb } from '../dynamo.js'
import { BaseDynamoRepository } from './base-dynamodb-repository.js'
import { IFlightRepository, Flight } from '../../domain/model/flight.js'
import { fromISOToDate } from '../../../utils/date.js'
import { GetPagedResult } from 'src/core/domain/repository/base-repository.js'

const tableName = process.env.TABLE_NAME as string

/**
 * Implementation for IFlightRepository using DynamoDB as the data source.
 * @param ddbDocumentClient Instance for DynamoDBDocumentClient.
 * @returns An instance of the derived repository class to handle Task entity.
 * @see BaseDynamoRepository
 * @see IFlightRepository
 * @see Flight
 */

export class FlightRepository extends BaseDynamoRepository<Flight> implements IFlightRepository {
  constructor(ddbDocumentClient: DynamoDBDocumentClient = ddb) {
    super(ddbDocumentClient, 'flight')
  }

  protected override mapEntity(record: Record<string, unknown>): Flight {
    record.date = fromISOToDate(record.date as string)
    return record as Flight
  }

  protected override handleModel(entity: Flight): Flight {
    const model = entity as Record<string, unknown>
    const date = entity.date.toISOString()
    model.date = date
    model.gsi1pk = `${entity.from}#${entity.to}`
    model.gsi1sk = date
    return entity as Flight
  }

  public async getPagedByFilters(
    startDate?: Date,
    endDate?: Date,
    from?: string,
    to?: string,
    count?: number,
    nextToken?: string
  ): Promise<GetPagedResult<Flight>> {
    const exclusiveStartKey = this.getExclusiveStartKey(nextToken)

    const expressionAttributeValues: Record<string, unknown> = {}

    const keyConditionExpression = `gsi1pk = :gsi1pk AND gsi1sk >= :gsi1skStart AND gsi1sk <= :gsi1skEnd`

    expressionAttributeValues[':gsi1pk'] = `${from}#${to}`
    expressionAttributeValues[':gsi1skStart'] = startDate?.toISOString()
    expressionAttributeValues[':gsi1skEnd'] = endDate?.toISOString()

    const queryParam: QueryCommandInput = {
      TableName: tableName,
      IndexName: `GSI1`,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    }

    if (count) {
      queryParam.Limit = count
      queryParam.ExclusiveStartKey = exclusiveStartKey
    }

    const queryCommand = new QueryCommand(queryParam)
    const result = await this.ddb.send(queryCommand)
    nextToken = this.getNextToken(result.LastEvaluatedKey)

    return {
      items: (result.Items ?? []).map((x) => this.handleEntity(x)),
      count: result.Count,
      nextToken: nextToken,
    }
  }
}
