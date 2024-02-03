/**
 * Response model including validation.
 */
export interface ValidateableResponse<TModel> {
  errors?: string[]
  model?: TModel | TModel[]
}
