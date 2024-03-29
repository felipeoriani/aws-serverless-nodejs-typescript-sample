import { NativeAttributeValue } from '@aws-sdk/util-dynamodb'
import {
  DynamoDBDocumentClient,
  GetCommand,
  DeleteCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
  BatchWriteCommandInput,
  BatchWriteCommand,
  BatchWriteCommandOutput,
  BatchGetCommand,
  BatchGetCommandInput,
  BatchGetCommandOutput,
  QueryCommandInput,
} from '@aws-sdk/lib-dynamodb'
import { randomUUID } from 'crypto'

import { GetPagedResult, IBaseRepository, UpdateModel } from '../../../core/domain/repository/base-repository.js'
import { DynamoModel } from './dynamo-model.js'
import { BaseEntity } from '../../../core/domain/model/base.js'

const dynamoDbWriteBatchSize = 25
const dynamoDbGetBatchSize = 100
const tableName = process.env.TABLE_NAME as string

/**
 * Abstract base implementation for an IBaseRepository using DynamoDB as the data source.
 * You must override the method `getUpdateModel` for each derived repository class in order to have the correct implementation for the UpdateCommand.
 * @param T The type of the entity to be used on the repository which must be an Entity.
 * @param ddb Instance for DynamoDBDocumentClient.
 * @param pk Constant for the partition key of the table.
 * @param skPrefix Constant for the sort key prefix of the table.
 * @returns An instance of the derived repository class.
 */
export abstract class BaseDynamoRepository<T extends BaseEntity> implements IBaseRepository<T> {
  /**
   * Base constructor for a new instance of any derived base repository class.
   * @param ddb Instance for DynamoDBDocumentClient.
   * @param pk Constant for the partition key of the table.
   * @param skPrefix Prefix for the sort key of the table.
   */
  constructor(protected readonly ddb: DynamoDBDocumentClient, pk: string) {
    this.pk = pk
  }

  /** Static value for the partition key of the table. Defined at constructor by each derived repository entity. */
  protected readonly pk: string

  /**
   * Get an instance of type T from the table by the given id.
   * @param id The id of the entity
   * @returns An entity of type T if found, otherwise undefined.
   */
  public async get(id: string): Promise<T | undefined> {
    const getCommand = new GetCommand(this.getKeyModel(id))
    const result = await this.ddb.send(getCommand)
    if (result.Item) {
      return this.handleEntity(result.Item)
    }
    return undefined
  }

  /**
   * Get all the entities of type T from the table following the pagination arguments.
   * @param count The count for the number of items to be returned.
   * @param nextToken NextToken to use for the pagination.
   * @returns Get all the entities of type T from the table following the pagination arguments.
   */
  public async getAll(): Promise<T[]> {
    const result: T[] = []
    await this.getAllPages(result)
    return result
  }

  private async getAllPages(list: T[], nextToken: string | undefined = undefined): Promise<void> {
    const exclusiveStartKey = this.getExclusiveStartKey(nextToken)

    const queryCommand = new QueryCommand({
      TableName: tableName,
      ExclusiveStartKey: exclusiveStartKey,
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': this.pk,
      },
    })
    const result = await this.ddb.send(queryCommand)
    nextToken = this.getNextToken(result.LastEvaluatedKey)

    list.push(...(result.Items as T[]))

    if (nextToken) {
      await this.getAllPages(list, nextToken)
    }
  }

  /**
   * Get all the entities of type T from the table following the pagination arguments.
   * @param count The count for the number of items to be returned.
   * @param nextToken NextToken to use for the pagination.
   * @returns Get all the entities of type T from the table following the pagination arguments.
   */
  public async getPaged(count?: number | undefined, nextToken?: string | undefined): Promise<GetPagedResult<T>> {
    const limit = count ? count : 10
    const exclusiveStartKey = this.getExclusiveStartKey(nextToken)

    const queryCommand = new QueryCommand({
      TableName: tableName,
      ExclusiveStartKey: exclusiveStartKey,
      Limit: limit,
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': this.pk,
      },
    })

    const result = await this.ddb.send(queryCommand)

    if (!result.Items) {
      return {
        items: [],
      }
    }

    const items = result.Items.map((item) => this.handleEntity(item))
    count = result.Count
    nextToken = this.getNextToken(result.LastEvaluatedKey)

    return {
      items,
      count,
      nextToken,
    }
  }

  /**
   * Create a new instance of type T on the table.
   * @param entity Instance of the entity to be created.
   * @param id Optional id for the entity. If not provided, a new id will be generated following the standards.
   * @returns The created instance of the entity.
   */
  public async create(entity: T, id: string | undefined = undefined): Promise<T> {
    const dynamoModel = entity as unknown as DynamoModel
    // set the PartitionKey
    dynamoModel.pk = this.pk
    // set the SortedKey
    dynamoModel.id = id ? id : this.generateId()
    // handle custom fields
    const model = this.handleModel(dynamoModel as unknown as T)
    const putCommand = new PutCommand({
      TableName: tableName,
      Item: model,
    })
    await this.ddb.send(putCommand)
    return this.handleEntity(entity)
  }

  /**
   * Update an existent entity on the table.
   * @param id The id of the entity
   * @param entity The entity instace with the values to be updated.
   * @param updateCommand An instance of UpdateCommand to be used on DynamoDb operation.
   * @returns
   */
  public async update(id: string, entity: T, updateModel: UpdateModel | undefined): Promise<T> {
    const currentItem = await this.get(id)
    if (!currentItem) {
      throw new ItemNotFoundError(`Item with id ${id} not found`)
    }
    const model = this.handleModel(entity)
    if (!updateModel) {
      updateModel = this.getUpdateModel(model)
    }
    const keyModel = this.getKeyModel(id)
    const updateCommand = new UpdateCommand({
      ...keyModel,
      ...updateModel,
    })
    await this.ddb.send(updateCommand)
    return this.handleEntity(entity)
  }

  /**
   * Perform a BatchGetCommand operation on DynamoDb in order to get a list of items by a given SKs list.
   * @param sks List of SKs to get.
   * @returns A list of items of type T.
   */
  public async batchGet(sks: string[]): Promise<T[]> {
    const batches = []
    for (let i = 0; i < sks.length; i += dynamoDbGetBatchSize) {
      batches.push(sks.slice(i, i + dynamoDbGetBatchSize))
    }

    if (batches.length === 0) return Promise.resolve([])
    const batchPromises: Promise<unknown>[] = []
    for (const batch of batches) {
      const batchGetInput: BatchGetCommandInput = {
        RequestItems: {
          [tableName]: {
            Keys: batch.map((sk) => ({
              pk: this.pk,
              sk: sk,
            })),
          },
        },
      }

      const batchGetCommand = new BatchGetCommand(batchGetInput)
      batchPromises.push(this.ddb.send(batchGetCommand))
    }

    const batchResults = (await Promise.all(batchPromises)) as BatchGetCommandOutput[]
    const hasError = !batchResults.every((result) => result.$metadata.httpStatusCode === 200)
    if (hasError) {
      throw new Error('Error on batch get operation on base repository.')
    }

    const result: T[] = []

    for (const getBatchResult of batchResults) {
      getBatchResult.Responses?.[tableName]?.forEach((item) => {
        result.push(this.mapEntity(item))
      })
    }

    return result
  }

  /**
   * Perform a BatchWriteCommand operation on DynamoDb in order to create or update a list of items.
   * If you want to completely customize the instance of the object been passed to DynamoDb, override the method `getBatchWriteItem`.
   * @param items list of items to create or update. Make sure you a valid entity (PK and SK) for each item. The implementation will set the indexes.
   * @returns the number of items created or updated.
   */
  public async batchWrite(items: T[]): Promise<number> {
    const batches = []
    for (let i = 0; i < items.length; i += dynamoDbWriteBatchSize) {
      batches.push(items.slice(i, i + dynamoDbWriteBatchSize))
    }

    if (batches.length === 0) return Promise.resolve(0)

    const batchPromises: Promise<unknown>[] = []
    for (const batch of batches) {
      const commandInput: BatchWriteCommandInput = {
        RequestItems: {
          [tableName]: batch.map((item) => ({
            PutRequest: {
              Item: item,
            },
          })),
        },
      }
      const batchWriteCommand = new BatchWriteCommand(commandInput)
      batchPromises.push(this.ddb.send(batchWriteCommand))
    }

    const results = (await Promise.all(batchPromises)) as BatchWriteCommandOutput[]
    const hasError = !results.every((result) => result.$metadata.httpStatusCode === 200)
    if (hasError) {
      throw new Error('Error on batch write operation on base repository.')
    }

    return items.length
  }

  /**
   * Perform a BatchWriteCommand operation on DynamoDb in order to delete a list of items by a given SKs list.
   * @param sks list of SKs to delete.
   * @returns the number of items deleted.
   */
  public async batchDelete(sks: string[]): Promise<number> {
    const batches = []
    for (let i = 0; i < sks.length; i += dynamoDbWriteBatchSize) batches.push(sks.slice(i, i + dynamoDbWriteBatchSize))

    if (batches.length === 0) return Promise.resolve(0)

    const batchPromises: Promise<unknown>[] = []
    for (const batch of batches) {
      const commandInput: BatchWriteCommandInput = {
        RequestItems: {
          [tableName]: batch.map((sk) => ({
            DeleteRequest: {
              Key: {
                pk: this.pk,
                sk: sk,
              },
            },
          })),
        },
      }
      const batchWriteCommand = new BatchWriteCommand(commandInput)
      batchPromises.push(this.ddb.send(batchWriteCommand))
    }

    const results = (await Promise.all(batchPromises)) as BatchWriteCommandOutput[]
    console.log(`result ${JSON.stringify(results)}`)
    const hasError = !results.every((result) => result.$metadata.httpStatusCode === 200)
    if (hasError) {
      throw new Error('Error on batch write operation on base repository.')
    }

    return sks.length
  }

  /**
   * Deletes an entity from the table by the given id.
   * @param id The id of the entity
   * @returns A boolean indicating if the operation succeed.
   */
  public async delete(id: string): Promise<boolean> {
    const deleteCommand = new DeleteCommand(this.getKeyModel(id))
    const result = await this.ddb.send(deleteCommand)
    console.log(`delete dynamo: ${JSON.stringify(result, null, 2)}`)
    return result.$metadata.httpStatusCode === 200
  }

  /**
   * Run a DynamoDb query command using an index. On our project the indexes are defined as GSIx, where `x` is a number.
   * @param index Index number.
   * @param gsipk Value to search on the PK of the index.
   * @param gsisk Value to search on the SK of the index. It is optional and will not be used if not provided.
   * @param count Number of items to be returned.
   * @param nextToken NextToken to use for the pagination.
   * @returns Get all the entities of type T from the table following the filter index and pagination arguments.
   */
  protected async getByGSI(
    index: number,
    gsipk: string,
    gsisk?: string | undefined,
    count?: number | undefined,
    nextToken?: string | undefined
  ): Promise<GetPagedResult<T>> {
    const exclusiveStartKey = this.getExclusiveStartKey(nextToken)

    let keyConditionExpression = `gsi${index}pk = :gsipk`
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const expressionAttributeValues: Record<string, any> = { ':gsipk': gsipk }

    if (gsisk) {
      keyConditionExpression += ` AND gsi${index}sk = :gsisk`
      expressionAttributeValues[':gsisk'] = gsisk
    }

    const queryParam: QueryCommandInput = {
      TableName: tableName,
      IndexName: `GSI${index}`,
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

  /**
   * Get the exclusive start key for the `ScanCommand` on DynamoDb.
   * @param nextToken Token returned from the previous operation when available.
   * @returns The generated result token can be used to start point on the `ScanCommand` operation.
   */
  protected getExclusiveStartKey(nextToken: string | undefined): Record<string, NativeAttributeValue> | undefined {
    if (!nextToken) return undefined
    const nextTokenJson = Buffer.from(nextToken, 'base64').toString('ascii')
    const exclusiveStartKey = JSON.parse(nextTokenJson) as Record<string, NativeAttributeValue>
    return exclusiveStartKey
  }

  /**
   * Get the next token for the `ScanCommand` on DynamoDb to be used as part of the pagination result.
   * @param lastEvaluatedKey The generated token for the last evaluated key on the `ScanCommand` operation.
   * @returns The next token to be used as part of the pagination result.
   */
  protected getNextToken(lastEvaluatedKey: Record<string, NativeAttributeValue> | undefined): string | undefined {
    if (!lastEvaluatedKey) return undefined
    const json = JSON.stringify(lastEvaluatedKey)
    return Buffer.from(json, 'ascii').toString('base64')
  }

  /**
   * This is a dynamic implementation to get an instance of UpdateModel containing all the properties to perform an updated on the table.
   * Override this method in case you need to customize the UpdateCommand operation.
   * @param entity entity to be used to define UpdateModel for DynamoDb UpdateCommand operation.
   */
  protected getUpdateModel(entity: T): UpdateModel {
    const updateExpression: string[] = []
    const expressionAttributeNames: Record<string, string> = {}
    const expressionAttributeValues: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(entity)) {
      if (key === 'pk' || key === 'id' || key === 'id') continue
      updateExpression.push(`#${key} = :${key}`)
      expressionAttributeNames[`#${key}`] = `${key}`
      expressionAttributeValues[`:${key}`] = value ?? null
    }

    return {
      UpdateExpression: `SET ${updateExpression.join(',')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    }
  }

  protected mapEntity(record: Record<string, unknown>): T {
    return record as unknown as T
  }

  protected handleModel(entity: T): T {
    return entity
  }

  protected handleEntity(record: Record<string, unknown>): T {
    const model = record as unknown as DynamoModel
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { pk, gsi1pk, gsi1sk, gsi2pk, gsi2sk, ...rest } = model
    return this.mapEntity(rest)
  }

  private generateId(): string {
    return randomUUID()
  }

  /**
   * This method returns an object to be used as part of GetCommand and DeleteCommand on DynamoDb operations.
   * @param id The id of the entity
   * @returns An instance to use as a basic search by PK (partition key) and SK (sorted key) on DynamoDb operations.
   */
  private getKeyModel(id: string): KeyModel {
    return {
      TableName: tableName,
      Key: {
        pk: this.pk,
        id: id,
      },
    }
  }
}

/**
 * This interface defines the structure to identiy an object on a DynamoDB table operations such as `ScanCommand`, `UpdateCommand`, `DeleteCommand` and other.
 */
export interface KeyModel {
  /** Table name to be defined at the runtime */
  TableName: string | undefined
  /** Partition key and Sort key to be defined to search by an item on DynamoDB table. */
  Key: Record<string, unknown>
}

export class ItemNotFoundError extends Error {}
