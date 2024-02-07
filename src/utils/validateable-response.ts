/**
 * Response model including validation.
 */
export type ValidateableResponse<TModel> = {
  errors?: string[]
  model?: TModel | TModel[]
}
