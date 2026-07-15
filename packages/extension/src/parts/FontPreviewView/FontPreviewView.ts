import type { View } from '@lvce-editor/extension-api'
import { createInstance, type FontPreviewViewInstance } from '../FontPreviewViewInstance/FontPreviewViewInstance.ts'

export const viewId = 'builtin.font-preview'

export const view: View<FontPreviewViewInstance> = {
  create: createInstance,
  eventListeners: [
    {
      name: 'handleFontPreviewPointerDown',
      params: ['handleContextMenu', 'pointerdown', 'event.clientX', 'event.clientY'],
      preventDefault: true,
      trackPointerEvents: ['handleFontPreviewPointerMove', 'handleFontPreviewPointerUp'],
    },
    {
      name: 'handleFontPreviewPointerMove',
      params: ['handleContextMenu', 'pointermove', 'event.clientX', 'event.clientY'],
      preventDefault: true,
    },
    {
      name: 'handleFontPreviewPointerUp',
      params: ['handleContextMenu', 'pointerup', 'event.clientX', 'event.clientY'],
      preventDefault: true,
    },
    {
      name: 'handleFontPreviewWheel',
      params: ['handleContextMenu', 'wheel', 'event.deltaY', 'event.deltaMode'],
      preventDefault: true,
    },
  ],
  id: viewId,
  kind: 'virtualDom',
  title: 'Font Preview',
}
