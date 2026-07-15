import { expect, test } from '@jest/globals'
import { view, viewId } from '../src/parts/FontPreviewView/FontPreviewView.ts'

test('registers a virtual dom font preview view', () => {
  expect(viewId).toBe('builtin.font-preview')
  expect(view).toMatchObject({
    id: 'builtin.font-preview',
    kind: 'virtualDom',
    title: 'Font Preview',
  })
  expect(view.eventListeners).toHaveLength(4)
})
