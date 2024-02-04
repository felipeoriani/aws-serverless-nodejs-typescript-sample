import { ValidateableResponse } from 'src/utils/validateable-response.js'
import { Flight, FlightModel, IFlightRepository, IFlightService, flightValidator } from '../domain/model/flight.js'
import { GetPagedResult } from '../domain/repository/repository.js'
import { FlightRepository } from '../infrastructure/repositories/flightRepository.js'

export class FlightService implements IFlightService {
  constructor(private flightRepository: IFlightRepository = new FlightRepository()) {}

  private map(flight: Flight): FlightModel {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { pk, gsi1pk, gsi1sk, ...model } = flight
    return model
  }

  public async get(id: string): Promise<ValidateableResponse<FlightModel>> {
    const flight = await this.flightRepository.get(id)
    if (!flight) {
      return {
        errors: [`There is not flight for the id '${id}'`],
      }
    }
    const model = this.map(flight)
    return { model }
  }

  public async getPaged(
    count?: number | undefined,
    nextToken?: string | undefined
  ): Promise<ValidateableResponse<GetPagedResult<FlightModel>>> {
    const pagedResult = await this.flightRepository.getPaged(count, nextToken)
    const items = pagedResult.items.map(this.map)
    return {
      model: {
        count: pagedResult.count,
        nextToken: pagedResult.nextToken,
        items,
      },
    }
  }

  public async create(input: FlightModel): Promise<ValidateableResponse<FlightModel>> {
    const validation = flightValidator.validate(input)
    if (validation.error) {
      const errors = validation.error.details.map((x) => x.message)
      return { errors }
    }
    const entity = await this.flightRepository.create(input as Flight)
    const model = this.map(entity)
    return { model }
  }

  public async update(id: string, input: FlightModel): Promise<ValidateableResponse<FlightModel>> {
    const validation = flightValidator.validate(input)
    if (validation.error) {
      const errors = validation.error.details.map((x) => x.message)
      return { errors }
    }
    const model = await this.flightRepository.update(id, input as Flight)
    return { model }
  }

  public async delete(id: string): Promise<ValidateableResponse<boolean>> {
    const result = await this.flightRepository.delete(id)
    return { model: result }
  }
}
