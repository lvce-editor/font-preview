import type { ViewContext, ViewEvent, VirtualDomViewInstance } from '@lvce-editor/extension-api'
import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { FontPreviewState } from '../FontPreviewState/FontPreviewState.ts'
import * as DomMatrix from '../DomMatrix/DomMatrix.ts'
import { getRemoteUrl } from '../GetRemoteUrl/GetRemoteUrl.ts'
import { render } from '../RenderFontPreview/RenderFontPreview.ts'

interface FontPreviewViewContext extends ViewContext {
  readonly uri?: string
}

interface SavedState {
  readonly domMatrix?: unknown
  readonly uri?: unknown
}

export interface FontPreviewViewInstance extends VirtualDomViewInstance {
  readonly render: () => readonly VirtualDomNode[]
}

const getUri = (context: FontPreviewViewContext | undefined): string => {
  if (typeof context?.uri === 'string') {
    return context.uri
  }
  const savedState = context?.state as SavedState | undefined
  return typeof savedState?.uri === 'string' ? savedState.uri : ''
}

const getNumber = (value: unknown): number => {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

export const createInstance = (context?: ViewContext): FontPreviewViewInstance => {
  const viewContext: FontPreviewViewContext | undefined = context
  const savedState = context?.state as SavedState | undefined
  const uri = getUri(viewContext)
  let state: FontPreviewState = {
    domMatrix: DomMatrix.parse(savedState?.domMatrix),
    pointerDown: false,
    pointerOffsetX: 0,
    pointerOffsetY: 0,
    uri,
    url: getRemoteUrl(uri),
  }

  return {
    handleEvent(event: Readonly<ViewEvent>): void {
      if (event.type !== 'contextmenu') {
        return
      }
      const x = getNumber(event.x)
      const y = getNumber(event.y)
      switch (event.name) {
        case 'pointerdown':
          state = {
            ...state,
            pointerDown: true,
            pointerOffsetX: x,
            pointerOffsetY: y,
          }
          break
        case 'pointermove': {
          if (!state.pointerDown) {
            break
          }
          const domMatrix = DomMatrix.move(state.domMatrix, x - state.pointerOffsetX, y - state.pointerOffsetY)
          state = {
            ...state,
            domMatrix,
            pointerOffsetX: x,
            pointerOffsetY: y,
          }
          break
        }
        case 'pointerup':
          state = {
            ...state,
            pointerDown: false,
          }
          break
        case 'wheel': {
          const deltaY = x
          if (deltaY === 0) {
            break
          }
          const zoomFactor = deltaY < 0 ? 1 + Math.abs(deltaY) / 200 : 1 / (1 + Math.abs(deltaY) / 200)
          state = {
            ...state,
            domMatrix: DomMatrix.zoomInto(state.domMatrix, zoomFactor, 0, 0),
          }
          break
        }
      }
    },
    render(): readonly VirtualDomNode[] {
      return render(state)
    },
    saveState(): SavedState {
      return {
        domMatrix: DomMatrix.stringify(state.domMatrix),
        uri,
      }
    },
  }
}
