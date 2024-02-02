import { APIGatewayProxyResult } from 'aws-lambda'

type Model = unknown | undefined

const contentType = { 'Content-Type': 'application/json' }

/**
 * Create an instance of APIGatewayProxyResult.
 * @param statusCode Status code to be defined on the response body.
 * @param data Content to be sent in the response body.
 * @param headers Headers to be sent in the response body.
 * @returns Api Gateway message in the specified format.
 */
export const statusCode = (
  statusCode: number,
  data?: Model,
  headers?: {
    [header: string]: boolean | number | string
  }
): APIGatewayProxyResult => {
  const body = data ? JSON.stringify(data) : ''

  if (body) {
    headers = { ...(headers ?? {}), ...contentType }
  }

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
export const ok = (data: Model): APIGatewayProxyResult => statusCode(200, data)

/**
 * 201 Created success status response code indicates that the request has succeeded and has led to the creation of a resource. The new resource, or a description and link to the new resource, is effectively created before the response is sent back and the newly created items are returned in the body of the message, located at either the URL of the request, or at the URL in the value of the Location header.
 * @param data Content to be sent in the response body.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
 * @returns Api Gateway message in a 201 Created format.
 */
export const created = (data: Model, location?: string): APIGatewayProxyResult =>
  statusCode(201, data, location ? { Location: location } : undefined)

/**
 * 204 No Content success status response code indicates that a request has succeeded, but that the client doesn't need to navigate away from its current page.
 * @param data Content to be sent in the response body.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
 * @returns Api Gateway message in a 204 No Content format.
 */
export const noContent = (data?: Model): APIGatewayProxyResult => statusCode(204, data)

/**
 * 400 Bad Request response status code indicates that the server cannot or will not process the request due to something that is perceived to be a client error (for example, malformed request syntax, invalid request message framing, or deceptive request routing).
 * @param data Content to be sent in the response body.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
 * @returns Api Gateway message in a 400 Bad Request format.
 */
export const badRequest = (data?: Model): APIGatewayProxyResult => statusCode(400, data)

/**
 * 404 Not Found status response code indicates that a request has not found the resource give the arguments.
 * @param data Content to be sent in the response body.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
 * @returns Api Gateway message in a 404 Not Found format.
 */
export const notFound = (data?: Model): APIGatewayProxyResult => statusCode(404, data)

/**
 * 422 Unprocessable Content response status code indicates that the server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions.
 * @param data Content to be sent in the response body.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422
 * @returns Api Gateway message in a 422 Unprocessable Content format.
 */
export const unprocessableEntity = (data?: Model): APIGatewayProxyResult => statusCode(422, data)
