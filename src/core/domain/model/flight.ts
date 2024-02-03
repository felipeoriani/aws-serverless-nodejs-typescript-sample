import { ValidateableResponse } from 'src/utils/validateable-response.js'
import { GetPagedResult, IBaseRepository } from '../repository/repository.js'
import { Entity } from './base.js'
import joi from 'joi'

export interface Flight extends Entity {
  from: string
  to: string
  date: Date
}

export interface IFlightRepository extends IBaseRepository<Flight> {}

export interface IFlightService {
  get(id: string): Promise<ValidateableResponse<Flight>>
  getPaged(
    count?: number | undefined,
    nextToken?: string | undefined
  ): Promise<ValidateableResponse<GetPagedResult<Flight>>>
  create(input: Flight): Promise<ValidateableResponse<Flight>>
  update(id: string, input: Flight): Promise<ValidateableResponse<Flight>>
  delete(id: string): Promise<ValidateableResponse<boolean>>
}

export const flightValidator = joi.object<Flight>().keys({
  from: joi.string().required().min(3).max(100),
  to: joi.string().required().min(3).max(100),
  date: joi.date().required(),
})
