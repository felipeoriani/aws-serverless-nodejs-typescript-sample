import { ConfigInfrastructure, EnvironmentVariable } from 'src/core/domain/utils/config-infrastructure.js'

export class Config implements ConfigInfrastructure {
  getEnvironmentVariable(name: EnvironmentVariable): string {
    if (!name) throw new Error('A environment variable name must be provided.')

    const variableValue = process.env[name]
    if (variableValue) {
      return variableValue
    }

    throw new Error(`There is no environment variable named ${name}.`)
  }
}
