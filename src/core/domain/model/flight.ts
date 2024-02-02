import { GetPagedResult, IBaseRepository } from '../repository/repository.js'
import { BaseEntity } from './base.js'

export const flightPk = 'flight'

export interface Flight extends BaseEntity {
  source: string
  destionation: string
  date: Date
  company: string
}

export interface IFlightRepository extends IBaseRepository<Flight> {}

export interface IFlightService {
  get(id: string): Promise<Flight | undefined>
  getPaged(count?: number | undefined, nextToken?: string | undefined): Promise<GetPagedResult<Flight>>
  create(model: Flight): Promise<Flight>
  update(id: string, model: Flight): Promise<Flight>
  delete(id: string): Promise<boolean>
}
