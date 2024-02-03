import { Flight, IFlightRepository, IFlightService, flightValidator } from '../domain/model/flight.js'
import { GetPagedResult } from '../domain/repository/repository.js'
import { FlightRepository } from '../infrastructure/repositories/flightRepository.js'

export class FlightService implements IFlightService {
  constructor(private flightRepository: IFlightRepository = new FlightRepository()) {}

  public async get(id: string): Promise<Flight | undefined> {
    const flight = await this.flightRepository.get(id)
    if (!flight) {
      return undefined
    }
    return flight
  }

  public getPaged(count?: number | undefined, nextToken?: string | undefined): Promise<GetPagedResult<Flight>> {
    return this.flightRepository.getPaged(count, nextToken)
  }

  public create(model: Flight): Promise<Flight> {
    const validation = flightValidator.validate(model)
    if (validation.error) {
      throw new Error(validation.error.message)
    }
    return this.flightRepository.create(model)
  }

  public update(id: string, model: Flight): Promise<Flight> {
    const validation = flightValidator.validate(model)
    if (validation.error) {
      throw new Error(validation.error.message)
    }
    return this.flightRepository.update(id, model)
  }

  public delete(id: string): Promise<boolean> {
    return this.flightRepository.delete(id)
  }
}
