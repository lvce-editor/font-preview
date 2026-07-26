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
  readonly handleFontPreviewPointerDown: (x: unknown, y: unknown) => void
  readonly handleFontPreviewPointerMove: (x: unknown, y: unknown) => void
  readonly handleFontPreviewPointerUp: (x: unknown, y: unknown) => void
  readonly handleFontPreviewWheel: (deltaY: unknown, deltaMode: unknown) => void
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

  const handlePointerDown = (x: unknown, y: unknown): void => {
    state = {
      ...state,
      pointerDown: true,
      pointerOffsetX: getNumber(x),
      pointerOffsetY: getNumber(y),
    }
  }

  const handlePointerMove = (x: unknown, y: unknown): void => {
    const { domMatrix: currentDomMatrix, pointerDown, pointerOffsetX, pointerOffsetY } = state
    if (!pointerDown) {
      return
    }
    const pointerX = getNumber(x)
    const pointerY = getNumber(y)
    state = {
      ...state,
      domMatrix: DomMatrix.move(currentDomMatrix, pointerX - pointerOffsetX, pointerY - pointerOffsetY),
      pointerOffsetX: pointerX,
      pointerOffsetY: pointerY,
    }
  }

  const handlePointerUp = (_x: unknown, _y: unknown): void => {
    state = {
      ...state,
      pointerDown: false,
    }
  }

  const handleWheel = (deltaYValue: unknown, _deltaMode: unknown): void => {
    const deltaY = getNumber(deltaYValue)
    if (deltaY === 0) {
      return
    }
    const { domMatrix } = state
    const zoomFactor = deltaY < 0 ? 1 + Math.abs(deltaY) / 200 : 1 / (1 + Math.abs(deltaY) / 200)
    state = {
      ...state,
      domMatrix: DomMatrix.zoomInto(domMatrix, zoomFactor, 0, 0),
    }
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
          handlePointerDown(x, y)
          break
        case 'pointermove':
          handlePointerMove(x, y)
          break
        case 'pointerup':
          handlePointerUp(x, y)
          break
        case 'wheel':
          handleWheel(x, y)
          break
      }
    },
    handleFontPreviewPointerDown: handlePointerDown,
    handleFontPreviewPointerMove: handlePointerMove,
    handleFontPreviewPointerUp: handlePointerUp,
    handleFontPreviewWheel: handleWheel,
    render(): readonly VirtualDomNode[] {
      return render(state)
    },
    saveState(): SavedState {
      const { domMatrix } = state
      return {
        domMatrix: DomMatrix.stringify(domMatrix),
        uri,
      }
    },
  }
}
