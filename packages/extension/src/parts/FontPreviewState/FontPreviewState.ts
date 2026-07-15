import type { DomMatrix } from '../DomMatrix/DomMatrix.ts'

export interface FontPreviewState {
  readonly domMatrix: DomMatrix
  readonly pointerDown: boolean
  readonly pointerOffsetX: number
  readonly pointerOffsetY: number
  readonly uri: string
  readonly url: string
}
