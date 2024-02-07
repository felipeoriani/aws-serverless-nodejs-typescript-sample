import { ValidateableResponse } from 'src/utils/validateable-response.js'
import { Flight, IFlightRepository, IFlightService, flightValidator } from '../domain/model/flight.js'
import { GetPagedResult } from '../domain/repository/base-repository.js'
import { FlightRepository } from '../infrastructure/repositories/flight-repository.js'

export class FlightService implements IFlightService {
  constructor(private flightRepository: IFlightRepository = new FlightRepository()) {}

  public async get(id: string): Promise<ValidateableResponse<Flight>> {
    const model = await this.flightRepository.get(id)
    if (!model) {
      return {
        errors: [`There is not flight for the id '${id}'`],
      }
    }
    return { model }
  }

  public async getPaged(
    count?: number | undefined,
    nextToken?: string | undefined
  ): Promise<ValidateableResponse<GetPagedResult<Flight>>> {
    const pagedResult = await this.flightRepository.getPaged(count, nextToken)
    return {
      model: {
        count: pagedResult.count,
        nextToken: pagedResult.nextToken,
        items: pagedResult.items,
      },
    }
  }

  public async create(input: Flight): Promise<ValidateableResponse<Flight>> {
    const validation = flightValidator.validate(input)
    if (validation.error) {
      const errors = validation.error.details.map((x) => x.message)
      return { errors }
    }
    const model = await this.flightRepository.create(input)
    return { model }
  }

  public async update(id: string, input: Flight): Promise<ValidateableResponse<Flight>> {
    const validation = flightValidator.validate(input)
    if (validation.error) {
      const errors = validation.error.details.map((x) => x.message)
      return { errors }
    }
    const model = await this.flightRepository.update(id, input)
    return { model }
  }

  public async delete(id: string): Promise<ValidateableResponse<boolean>> {
    const result = await this.flightRepository.delete(id)
    return { model: result }
  }
}
