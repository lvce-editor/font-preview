import { expect, test } from '@jest/globals'
import * as DomMatrix from '../src/parts/DomMatrix/DomMatrix.ts'

test('moves a matrix', () => {
  expect(DomMatrix.move(DomMatrix.create(), 10, 20)).toEqual({
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    e: 10,
    f: 20,
  })
})

test('zooms into a point', () => {
  const result = DomMatrix.zoomInto(DomMatrix.create(), 1.13, 14, 11)
  expect(result.a).toBeCloseTo(1.13)
  expect(result.d).toBeCloseTo(1.13)
  expect(result.e).toBeCloseTo(-1.82)
  expect(result.f).toBeCloseTo(-1.43)
})

test('parses and stringifies a matrix', () => {
  const value = 'matrix(1, 0, 0, 1, 154, 160)'
  expect(DomMatrix.stringify(DomMatrix.parse(value))).toBe(value)
})

test('uses the identity matrix for invalid saved state', () => {
  expect(DomMatrix.parse('matrix(NaN, 0, 0, 1, 0, 0)')).toEqual(DomMatrix.create())
  expect(DomMatrix.parse(undefined)).toEqual(DomMatrix.create())
})
