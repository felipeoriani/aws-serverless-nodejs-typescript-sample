import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { ddb } from '../dynamo.js'
import { BaseDynamoRepository } from './base-dynamodb-repository.js'
import { fromISOToDate } from '../../../utils/date.js'
import { IPassengerRepository, Passenger } from '../../../core/domain/model/passenger.js'
import { GetPagedResult } from '../../../core/domain/repository/base-repository.js'
import { Flight } from '../../../core/domain/model/flight.js'

/**
 * Implementation for IPassengerRepository using DynamoDB as the data source.
 * @param ddbDocumentClient Instance for DynamoDBDocumentClient.
 * @returns An instance of the derived repository class to handle entity.
 * @see BaseDynamoRepository
 * @see IPassengerRepository
 * @see Passenger
 */

export class PassengerRepository extends BaseDynamoRepository<Passenger> implements IPassengerRepository {
  constructor(ddbDocumentClient: DynamoDBDocumentClient = ddb) {
    super(ddbDocumentClient, 'passenger')
  }

  protected override mapEntity(record: Record<string, unknown>): Passenger {
    record.birthday = fromISOToDate(record.birthday as string)
    return record as Passenger
  }

  protected override handleModel(entity: Passenger): Passenger {
    const model = entity as Record<string, unknown>
    const date = entity.birthday.toISOString()
    model.date = date
    model.gsi1pk = `${entity.id}`
    model.gsi1sk = entity.birthday
    return entity as Passenger
  }

  public async getFlights(passengerId: string): Promise<GetPagedResult<Flight>> {
    console.log(passengerId)
    return {
      items: [],
    }
  }
}
