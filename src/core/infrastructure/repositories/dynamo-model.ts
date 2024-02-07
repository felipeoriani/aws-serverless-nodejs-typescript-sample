import { BaseEntity } from '../../domain/model/base.js'

/**
 * Base model for all entities.
 */
export type DynamoModel = BaseEntity & {
  /** Partition Key of the item. It can be use to seggregate objects by Partition Key. */
  pk: string
  /** Partition Key for Global Secondary Index 1. */
  gsi1pk?: string
  /** Sort Key for Global Secondary Index 1 */
  gsi1sk?: string
}
