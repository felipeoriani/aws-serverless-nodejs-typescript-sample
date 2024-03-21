import { ValidateableResponse } from 'src/utils/validateable-response.js'
import { IBaseRepository } from '../repository/base-repository.js'
import { BaseEntity } from './base.js'
import joi from 'joi'

/** Seat of a Passenger on a Flight */
export type Seat = BaseEntity & {
  seat: string
  checkIn: boolean
}

export interface ISeatRepository extends IBaseRepository<Seat> {}

export interface ISeatService {
  get(id: string): Promise<ValidateableResponse<Seat>>
  checkIn(flightId: string, passenger: string): Promise<boolean>
}

export const seatValidator = joi.object<Seat>().keys({
  seat: joi.string().required().alphanum().min(2).max(5),
  checkIn: joi.bool().required(),
})
