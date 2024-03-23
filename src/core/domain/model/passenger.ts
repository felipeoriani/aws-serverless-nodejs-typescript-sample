import { ValidateableResponse } from '../../../utils/validateable-response.js'
import { GetPagedResult, IBaseRepository } from '../repository/base-repository.js'
import { BaseEntity } from './base.js'
import joi from 'joi'
import { Flight } from './flight.js'

/** Passenger entity */
export type Passenger = BaseEntity & {
  name: string
  email: string
  birthday: Date
}

export interface IPassengerRepository extends IBaseRepository<Passenger> {
  getFlights(passengerId: string): Promise<GetPagedResult<Flight>>
}

export interface IPassengerService {
  get(id: string): Promise<ValidateableResponse<Passenger>>
  create(input: Passenger): Promise<ValidateableResponse<Passenger>>
  update(id: string, input: Passenger): Promise<ValidateableResponse<Passenger>>
  delete(id: string): Promise<ValidateableResponse<boolean>>
  getFlights(passengerId: string): Promise<GetPagedResult<Flight>>
  checkIn(flightId: string, passenger: string): Promise<boolean>
}

export const passengerValidator = joi.object<Passenger>().keys({
  name: joi.string().required().alphanum().min(3).max(250),
  email: joi.string().required().email().min(3).max(100),
  birthday: joi.date().required(),
})
