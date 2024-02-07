import { BaseEntity } from '../model/base.js'

/**
 * Abstract interface for a base repository.
 */
export interface IBaseRepository<T extends BaseEntity> {
  /**
   * Get an instance of type T from the table by the given id.
   * @param id The id of the entity
   * @returns An entity of type T if found, otherwise undefined.
   */
  get(id: string): Promise<T | undefined>

  /**
   * Get all the entities of type T from the table.
   * @returns Get all the entities of type T from the table.
   */
  getAll(): Promise<T[]>

  /**
   * Get all paged the entities of type T from the table following the pagination arguments.
   * @param count The count for the number of items to be returned.
   * @param nextToken NextToken to use for the pagination.
   * @returns Get all the entities of type T from the table following the pagination arguments.
   */
  getPaged(count?: number | undefined, nextToken?: string | undefined): Promise<GetPagedResult<T>>

  /**
   * Create a new instance of type T on the table.
   * @param entity Instance of the entity to be created.
   * @param id Optional id for the entity. If not provided, a new id will be generated following the standards.
   * @returns The created instance of the entity.
   */
  create(entity: T, id?: string): Promise<T>

  /**
   * Update an existent entity on the table.
   * @param id The id of the entity
   * @param entity The entity instace with the values to be updated.
   * @param updateCommand An instance of UpdateCommand to be used on DynamoDb operation.
   * @returns
   */
  update(id: string, entity: T, updateModel?: UpdateModel): Promise<T>

  /**
   * Deletes an entity from the table by the given id.
   * @param id The id of the entity
   * @returns A boolean indicating if the operation succeed.
   */
  delete(id: string): Promise<boolean>

  /**
   * Perform a BatchGetCommand operation on DynamoDb in order to get a list of items by a given SKs list.
   * @param sks List of SKs to get.
   * @returns A list of items of type T.
   */
  batchGet(sks: string[]): Promise<T[]>

  /**
   * Perform a BatchWriteCommand operation on DynamoDb in order to create or update a list of items.
   * @param items list of items to create or update. Make sure you a valid entity (PK and SK) for each item. The implementation will set the indexes.
   * @returns the number of items created or updated.
   */
  batchWrite(items: T[]): Promise<number>

  /**
   * Perform a BatchWriteCommand operation on DynamoDb in order to delete a list of items by a given SKs list.
   * @param sks list of SKs to delete.
   * @returns the number of items deleted.
   */
  batchDelete(sks: string[]): Promise<number>
}

/**
 * This interface defines the structure of the object to be used as part of GetAllCommand on DynamoDb operations.
 */
export interface GetPagedResult<T> {
  items: T[]
  nextToken?: string
  count?: number
}

/**
 * This interface  defines the structure of the object to be used as part of UpdateCommand on DynamoDb operations by mapping properties to values.
 */
export interface UpdateModel {
  /**
   * Use this property to specific the properties to be updated. Each property name must start with `#` and each property value starting with `:`. All of them must be separated by comma .
   * @example "SET #name = :name, #age = :age, #address = :address"
   */
  UpdateExpression: string | undefined
  /**
   * On the `ExpressionAttributeNames` we define the mapping between the property name to the property we need. Where each property name with `#` must be mapped to the property on a valid for your DynamoDB table.
   * @example {"#name": "name", "#age": "age", "#address": "address"}
   */
  ExpressionAttributeNames: Record<string, string> | undefined
  /**
   * On the `ExpressionAttributeValues` we define the mapping between the property value to the property we need. Where each property value with `:` must be mapped to the property on a valid for your DynamoDB table.
   * @example {":name": "John Doe", ":age": 30, ":address": "123 Main St"}
   */
  ExpressionAttributeValues: Record<string, unknown> | undefined
}
