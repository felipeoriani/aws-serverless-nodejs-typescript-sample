import { ValidateableResponse } from 'src/utils/validateable-response.js'
import { GetPagedResult, IBaseRepository } from '../repository/base-repository.js'
import { Entity } from './base.js'
import joi from 'joi'

/** FLight entity that represents a flight containing all the info */
export type Flight = Entity & {
  from: string
  to: string
  date: Date
}

/** Flight Model to responde from the UseCases services for the application */
export type FlightModel = Omit<Flight, Exclude<keyof Entity, 'id'>>

export interface IFlightRepository extends IBaseRepository<Flight> {}

export interface IFlightService {
  get(id: string): Promise<ValidateableResponse<FlightModel>>
  getPaged(
    count?: number | undefined,
    nextToken?: string | undefined
  ): Promise<ValidateableResponse<GetPagedResult<FlightModel>>>
  create(input: FlightModel): Promise<ValidateableResponse<FlightModel>>
  update(id: string, input: FlightModel): Promise<ValidateableResponse<FlightModel>>
  delete(id: string): Promise<ValidateableResponse<boolean>>
}

export const flightValidator = joi.object<Flight>().keys({
  from: joi.string().required().min(3).max(100),
  to: joi.string().required().min(3).max(100),
  date: joi.date().required(),
})
