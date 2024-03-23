import { DynamoDBDocumentClient, QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb'
import { ddb } from '../dynamo.js'
import { BaseDynamoRepository } from './base-dynamodb-repository.js'
import { IFlightRepository, Flight, FlightState } from '../../domain/model/flight.js'
import { fromISOToDate } from '../../../utils/date.js'
import { GetPagedResult } from '../../../core/domain/repository/base-repository.js'

const tableName = process.env.TABLE_NAME as string

/**
 * Implementation for IFlightRepository using DynamoDB as the data source.
 * @param ddbDocumentClient Instance for DynamoDBDocumentClient.
 * @returns An instance of the derived repository class to handle entity.
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
    model.gsi2pk = `flight#${entity.state}`
    model.gsi2sk = date
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

    const keyConditionExpression = `gsi1pk = :gsi1pk AND gsi1sk >= :gsi1skStart AND gsi1sk <= :gsi1skEnd`
    const expressionAttributeValues: Record<string, unknown> = {
      ':gsi1pk': `${from}#${to}`,
      ':gsi1skStart': startDate?.toISOString(),
      ':gsi1skEnd': endDate?.toISOString(),
    }

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

  public async getFlightsToCheckIn(date: Date): Promise<Flight[]> {
    const dateToSearch = new Date(date.getTime() + 48 * 60 * 60 * 1000)

    const keyConditionExpression = `gsi2pk = :gsi2pk AND gsi2sk <= :gsi2sk`
    const expressionAttributeValues: Record<string, unknown> = {
      ':gsi2pk': `flight#${FlightState.Awaiting}`,
      ':gsi2sk': dateToSearch.toISOString(),
    }

    const queryParam: QueryCommandInput = {
      TableName: tableName,
      IndexName: `GSI2`,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      Limit: 10,
    }

    const queryCommand = new QueryCommand(queryParam)
    const result = await this.ddb.send(queryCommand)

    const flights = (result.Items ?? []).map((x) => this.handleEntity(x))

    return flights
  }
}
