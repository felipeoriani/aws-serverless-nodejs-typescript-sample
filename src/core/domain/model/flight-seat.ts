import { BaseEntity } from './base.js'

/** Flight entity that represents a flight containing all the info */
export type FlightSeat = BaseEntity & {
  flight: string
  passenger: string
  seat: string
  checkIn: boolean
}
