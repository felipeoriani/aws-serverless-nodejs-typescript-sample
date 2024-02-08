import { ValidateableResponse } from 'src/utils/validateable-response.js'
import { GetPagedResult, IBaseRepository } from '../repository/base-repository.js'
import { BaseEntity } from './base.js'
import joi from 'joi'

/** FLight entity that represents a flight containing all the info */
export type Flight = BaseEntity & {
  code: string
  from: string
  to: string
  date: Date
  airline: string
}

export interface IFlightRepository extends IBaseRepository<Flight> {}

export interface IFlightService {
  get(id: string): Promise<ValidateableResponse<Flight>>
  getPaged(
    startDate?: string,
    endDate?: string,
    from?: string,
    to?: string,
    count?: number,
    nextToken?: string
  ): Promise<ValidateableResponse<GetPagedResult<Flight>>>
  create(input: Flight): Promise<ValidateableResponse<Flight>>
  update(id: string, input: Flight): Promise<ValidateableResponse<Flight>>
  delete(id: string): Promise<ValidateableResponse<boolean>>
}

export const flightValidator = joi.object<Flight>().keys({
  code: joi.string().required().alphanum().min(3).max(12),
  from: joi.string().required().min(3).max(100),
  to: joi.string().required().min(3).max(100),
  date: joi.date().required(),
  airline: joi.string().required().max(50),
})
