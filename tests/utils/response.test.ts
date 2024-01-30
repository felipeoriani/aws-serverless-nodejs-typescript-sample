import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { badRequest, created, ok, unprocessableEntity as unprocessableContent } from '../../src/utils/response.js'
import { randomUUID } from 'node:crypto'

describe('response must be in the API Gateway format', () => {
  it('Should prepare the response instance to 200 - Ok', () => {
    // arrange
    const data = { id: randomUUID(), name: 'John Doe' }

    // act
    const result = ok(data)

    // assert
    assert.ok(result, 'The instance of the response is not valid.')
    assert.strictEqual(result.statusCode, 200)
    assert.strictEqual(result.body, JSON.stringify(data))
  })

  it('Should prepare the response instance to 201 - Created', () => {
    // arrange
    const data = { id: randomUUID(), name: 'John Doe' }
    const location = `/person/${data.id}`

    // act
    const result = created(data, location)

    // assert
    assert.ok(result, 'The instance of the response is not valid.')
    assert.strictEqual(result.statusCode, 201)
    assert.ok(result.headers)
    assert.strictEqual(result.headers.location, location)
    assert.strictEqual(result.body, JSON.stringify(data))
  })

  it('Should prepare the response instance to 400 - Bad Request', () => {
    // arrange
    const data = { error: 'The argument is not in the correct format.' }

    // act
    const result = badRequest(data)

    // assert
    assert.ok(result, 'The instance of the response is not valid.')
    assert.strictEqual(result.statusCode, 400)
    assert.equal(result.headers, undefined)
    assert.strictEqual(result.body, JSON.stringify(data))
  })

  it('Should prepare the response instance to 422 - Unprocessable Content', () => {
    // arrange
    const data = { error: 'The field is required.' }

    // act
    const result = unprocessableContent(data)

    // assert
    assert.ok(result, 'The instance of the response is not valid.')
    assert.strictEqual(result.statusCode, 422)
    assert.equal(result.headers, undefined)
    assert.strictEqual(result.body, JSON.stringify(data))
  })
})
