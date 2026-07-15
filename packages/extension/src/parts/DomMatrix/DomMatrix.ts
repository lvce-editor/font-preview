export interface DomMatrix {
  readonly a: number
  readonly b: number
  readonly c: number
  readonly d: number
  readonly e: number
  readonly f: number
}

export const create = (): DomMatrix => {
  return {
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    e: 0,
    f: 0,
  }
}

export const move = (matrix: DomMatrix, deltaX: number, deltaY: number): DomMatrix => {
  return {
    ...matrix,
    e: matrix.e + deltaX,
    f: matrix.f + deltaY,
  }
}

export const zoomInto = (matrix: DomMatrix, zoomFactor: number, x: number, y: number): DomMatrix => {
  return {
    a: matrix.a * zoomFactor,
    b: matrix.b * zoomFactor,
    c: matrix.c * zoomFactor,
    d: matrix.d * zoomFactor,
    e: matrix.e * zoomFactor + x * (1 - zoomFactor),
    f: matrix.f * zoomFactor + y * (1 - zoomFactor),
  }
}

export const parse = (value: unknown): DomMatrix => {
  if (typeof value !== 'string') {
    return create()
  }
  const match = /^matrix\(([^)]+)\)$/.exec(value)
  if (!match) {
    return create()
  }
  const values = match[1].split(',').map(Number)
  if (values.length !== 6 || values.some((item) => !Number.isFinite(item))) {
    return create()
  }
  const [a, b, c, d, e, f] = values
  return { a, b, c, d, e, f }
}

export const stringify = ({ a, b, c, d, e, f }: DomMatrix): string => {
  return `matrix(${a}, ${b}, ${c}, ${d}, ${e}, ${f})`
}
