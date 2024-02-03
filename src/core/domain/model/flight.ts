import { GetPagedResult, IBaseRepository } from '../repository/repository.js'
import { BaseEntity } from './base.js'
import joi from 'joi'

export interface Flight extends BaseEntity {
  from: string
  to: string
  date: Date
}

export interface IFlightRepository extends IBaseRepository<Flight> {}

export interface IFlightService {
  get(id: string): Promise<Flight | undefined>
  getPaged(count?: number | undefined, nextToken?: string | undefined): Promise<GetPagedResult<Flight>>
  create(model: Flight): Promise<Flight>
  update(id: string, model: Flight): Promise<Flight>
  delete(id: string): Promise<boolean>
}

export const flightValidator = joi.object<Flight>().keys({
  from: joi.string().required().min(3).max(100),
  to: joi.string().required().min(3).max(100),
  date: joi.date().required(),
})
