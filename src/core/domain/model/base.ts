/**
 * Base model for all entities.
 */
export interface BaseEntity {
  /** Partition Key of the item. It can be use to seggregate objects by Partition Key. */
  pk: string
  /** Sort Key of the item. Generally used as the identifier of the object. */
  sk: string

  /** Partition Key for Global Secondary Index 1.
   * @example `${this.entityId}#${this.anotherProperty}`
   */
  gsi1pk?: string
  /** Sort Key for Global Secondary Index 1 */
  gsi1sk?: string
}
