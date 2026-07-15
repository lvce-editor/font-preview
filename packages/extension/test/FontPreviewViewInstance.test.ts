import type { ViewContext, ViewEvent } from '@lvce-editor/extension-api'
import { expect, test } from '@jest/globals'
import { createInstance } from '../src/parts/FontPreviewViewInstance/FontPreviewViewInstance.ts'

const context = {
  requestRerender: async () => {},
  showContextMenu: async () => {},
  state: {
    domMatrix: 'matrix(1, 0, 0, 1, 5, 6)',
  },
  uid: 1,
  uri: '/workspace/font.woff2',
  viewId: 'builtin.font-preview',
} satisfies ViewContext & { readonly uri: string }

const event = (name: string, x: number, y: number): ViewEvent => {
  return {
    name,
    type: 'contextmenu',
    x,
    y,
  }
}

test('restores state and renders the remote font url', () => {
  const instance = createInstance(context)
  const dom = instance.render()

  expect(dom.some((node) => node.text?.includes('/remote//workspace/font.woff2'))).toBe(true)
  expect(dom.find((node) => node.className === 'FontPreviewContent')?.style).toBe('transform: matrix(1, 0, 0, 1, 5, 6)')
  expect(instance.saveState?.()).toEqual({
    domMatrix: 'matrix(1, 0, 0, 1, 5, 6)',
    uri: '/workspace/font.woff2',
  })
})

test('handles pointer and wheel events without a separate worker', () => {
  const instance = createInstance(context)

  instance.handleEvent?.(event('pointerdown', 10, 20))
  expect(instance.render()[0].className).toBe('FontPreview FontPreviewDragging')

  instance.handleEvent?.(event('pointermove', 15, 30))
  expect(instance.render().find((node) => node.className === 'FontPreviewContent')?.style).toBe(
    'transform: matrix(1, 0, 0, 1, 10, 16)',
  )

  instance.handleEvent?.(event('pointerup', 15, 30))
  expect(instance.render()[0].className).toBe('FontPreview')

  instance.handleEvent?.(event('wheel', -20, 0))
  expect(instance.render().find((node) => node.className === 'FontPreviewContent')?.style).toBe(
    'transform: matrix(1.1, 0, 0, 1.1, 11, 17.6)',
  )
})
