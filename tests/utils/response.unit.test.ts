import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  ProblemDetails,
  badRequest,
  created,
  notFound,
  ok,
  unprocessableEntity as unprocessableContent,
} from '../../src/utils/response.js'
import { randomUUID } from 'node:crypto'

describe('response must be in the API Gateway format', () => {
  const contentType = 'Content-Type'
  const applicationJson = 'application/json'
  const applicationProblemJson = 'application/problem+json'

  it('Should prepare the response instance to 200 - Ok', () => {
    // arrange
    const data = { id: randomUUID(), name: 'John Doe' }

    // act
    const result = ok(data)

    // assert
    assert.ok(result, 'The instance of the response is not valid.')
    assert.equal(result.statusCode, 200)
    assert.ok(result.headers)
    assert.equal(result.headers[contentType], applicationJson)
    assert.equal(result.body, JSON.stringify(data))
  })

  it('Should prepare the response instance to 201 - Created', () => {
    // arrange
    const data = { id: randomUUID(), name: 'John Doe' }
    const location = `/person/${data.id}`

    // act
    const result = created(data, location)

    // assert
    assert.ok(result, 'The instance of the response is not valid.')
    assert.equal(result.statusCode, 201)
    assert.ok(result.headers)
    assert.equal(result.headers.Location, location)
    assert.equal(result.headers[contentType], applicationJson)
    assert.equal(result.body, JSON.stringify(data))
  })

  it('Should prepare the response instance to 400 - Bad Request', () => {
    // arrange
    const data = { error: 'The argument is not in the correct format.' }

    // act
    const result = badRequest(data)
    const problemDetails = JSON.parse(result.body) as ProblemDetails

    // assert
    assert.ok(result, 'The instance of the response is not valid.')
    assert.equal(result.statusCode, 400)
    assert.ok(result.headers)
    assert.equal(result.headers[contentType], applicationProblemJson)
    assert.equal(problemDetails.status, 400)
    assert.deepEqual(problemDetails.detail, data, 'The problem details does not hold the error.')
  })

  it('Should prepare the response instance to 404 - Not Found', () => {
    // arrange
    const data = undefined

    // act
    const result = notFound(data)
    const problemDetails = JSON.parse(result.body) as ProblemDetails

    // assert
    assert.ok(result, 'The instance of the response is not valid.')
    assert.strictEqual(result.statusCode, 404)
    assert.ok(result.headers)
    assert.strictEqual(result.headers[contentType], applicationProblemJson)
    assert.equal(problemDetails.status, 404)
    assert.deepEqual(problemDetails.detail, undefined, 'The problem details does not hold the error.')
  })

  it('Should prepare the response instance to 422 - Unprocessable Content', () => {
    // arrange
    const data = { error: 'The field is required.' }

    // act
    const result = unprocessableContent(data)
    const problemDetails = JSON.parse(result.body) as ProblemDetails

    // assert
    assert.ok(result, 'The instance of the response is not valid.')
    assert.strictEqual(result.statusCode, 422)
    assert.ok(result.headers)
    assert.strictEqual(result.headers[contentType], applicationProblemJson)
    assert.equal(problemDetails.status, 422)
    assert.deepEqual(problemDetails.detail, data, 'The problem details does not hold the error.')
  })
})
