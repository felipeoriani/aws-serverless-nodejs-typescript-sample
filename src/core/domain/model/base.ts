export type BaseEntity = {
  /** Sort Key of the item. Generally used as the identifier of the object. */
  id: string
}

/**
 * Base model for all entities.
 */
export type Entity = BaseEntity & {
  /** Partition Key of the item. It can be use to seggregate objects by Partition Key. */
  pk: string
  /** Partition Key for Global Secondary Index 1. */
  gsi1pk?: string
  /** Sort Key for Global Secondary Index 1 */
  gsi1sk?: string
}
