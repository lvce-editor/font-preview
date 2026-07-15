import { expect, test } from '@jest/globals'
import { VirtualDomElements, type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { create } from '../src/parts/DomMatrix/DomMatrix.ts'
import { render } from '../src/parts/RenderFontPreview/RenderFontPreview.ts'

const getText = (dom: readonly VirtualDomNode[]): string => {
  return dom
    .filter((node) => node.type === VirtualDomElements.Text)
    .map((node) => node.text)
    .join('\n')
}

test('renders a font face and specimen text', () => {
  const dom = render({
    domMatrix: create(),
    pointerDown: false,
    pointerOffsetX: 0,
    pointerOffsetY: 0,
    uri: '/workspace/font.ttf',
    url: '/remote//workspace/font.ttf',
  })

  expect(dom[0]).toMatchObject({
    childCount: 2,
    className: 'FontPreview',
    onPointerDown: 'handleFontPreviewPointerDown',
    onWheel: 'handleFontPreviewWheel',
    type: VirtualDomElements.Div,
  })
  expect(dom[1]).toMatchObject({ childCount: 1, type: VirtualDomElements.Style })
  expect(getText(dom)).toContain('@font-face')
  expect(getText(dom)).toContain('url("/remote//workspace/font.ttf")')
  expect(getText(dom)).toContain('The quick brown fox jumps over the lazy dog.')
  expect(getText(dom)).toContain('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
})

test('renders the dragging state and transform', () => {
  const dom = render({
    domMatrix: { a: 2, b: 0, c: 0, d: 2, e: 10, f: 20 },
    pointerDown: true,
    pointerOffsetX: 0,
    pointerOffsetY: 0,
    uri: '',
    url: '',
  })

  expect(dom[0].className).toBe('FontPreview FontPreviewDragging')
  expect(dom.find((node) => node.className === 'FontPreviewContent')?.style).toBe('transform: matrix(2, 0, 0, 2, 10, 20)')
})
