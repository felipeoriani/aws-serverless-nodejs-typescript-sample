import { APIGatewayProxyResult } from 'aws-lambda'

type Model = unknown | undefined

export interface ProblemDetails {
  type: string
  title: string
  status: number
  detail?: object
}

const badRequestProblemDetails = {
  type: 'https://tools.ietf.org/html/rfc7231#section-6.5.1',
  title: 'Invalid request.',
  status: 400,
}

const unprocessableEntityProblemDetails = {
  type: 'https://tools.ietf.org/html/rfc7231#section-6.5',
  title: 'Unprocessable entity.',
  status: 422,
}

const notFoundProblemDetails = {
  type: 'https://tools.ietf.org/html/rfc7231#section-6.5.4',
  title: 'The specified resource was not found.',
  status: 404,
}

const contentType = { 'Content-Type': 'application/json' }
const contentTypeProblemDetails = { 'Content-Type': 'application/problem+json' }

/**
 * Create an instance of APIGatewayProxyResult.
 * @param statusCode Status code to be defined on the response body.
 * @param data Content to be sent in the response body.
 * @param headers Headers to be sent in the response body.
 * @returns Api Gateway message in the specified format.
 */
export const statusCode = (
  statusCode: number,
  data?: Model | ProblemDetails,
  headers?: {
    [header: string]: boolean | number | string
  }
): APIGatewayProxyResult => {
  const body = data ? JSON.stringify(data) : ''

  return {
    statusCode,
    body,
    headers,
  }
}

/**
 * 200 OK success status response code indicates that the request has succeeded. A 200 response is cacheable by default.
 * @param data Content to be sent in the response body.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
 * @returns Api Gateway message in a 200 Ok format.
 */
export const ok = (data: Model): APIGatewayProxyResult => statusCode(200, data, contentType)

/**
 * 201 Created success status response code indicates that the request has succeeded and has led to the creation of a resource. The new resource, or a description and link to the new resource, is effectively created before the response is sent back and the newly created items are returned in the body of the message, located at either the URL of the request, or at the URL in the value of the Location header.
 * @param data Content to be sent in the response body.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
 * @returns Api Gateway message in a 201 Created format.
 */
export const created = (data: Model, location?: string): APIGatewayProxyResult => {
  let header = data ? contentType : {}
  if (location) {
    header = { ...header, Location: location }
  }
  return statusCode(201, data, header)
}

/**
 * 204 No Content success status response code indicates that a request has succeeded, but that the client doesn't need to navigate away from its current page.
 * @param data Content to be sent in the response body.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
 * @returns Api Gateway message in a 204 No Content format.
 */
export const noContent = (data?: Model): APIGatewayProxyResult => statusCode(204, data, data ? contentType : undefined)

/**
 * 400 Bad Request response status code indicates that the server cannot or will not process the request due to something that is perceived to be a client error (for example, malformed request syntax, invalid request message framing, or deceptive request routing).
 * @param detail Content to be sent in the response body.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
 * @returns Api Gateway message in a 400 Bad Request format.
 */
export const badRequest = (detail?: Model): APIGatewayProxyResult =>
  statusCode(400, { ...badRequestProblemDetails, detail }, contentTypeProblemDetails)

/**
 * 404 Not Found status response code indicates that a request has not found the resource give the arguments.
 * @param detail Content to be sent in the response body.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
 * @returns Api Gateway message in a 404 Not Found format.
 */
export const notFound = (detail?: Model): APIGatewayProxyResult =>
  statusCode(404, { ...notFoundProblemDetails, detail }, contentTypeProblemDetails)

/**
 * 422 Unprocessable Content response status code indicates that the server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions.
 * @param detail Content to be sent in the response body.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422
 * @returns Api Gateway message in a 422 Unprocessable Content format.
 */
export const unprocessableEntity = (detail?: Model): APIGatewayProxyResult =>
  statusCode(422, { ...unprocessableEntityProblemDetails, detail }, contentTypeProblemDetails)
