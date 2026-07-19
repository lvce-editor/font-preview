import { mergeClassNames, text, VirtualDomElements, type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { FontPreviewState } from '../FontPreviewState/FontPreviewState.ts'
import { stringify } from '../DomMatrix/DomMatrix.ts'

interface TreeNode {
  readonly children: readonly TreeNode[]
  readonly node: VirtualDomNode
}

const node = (type: number, properties: Readonly<Record<string, unknown>>, children: readonly TreeNode[] = []): TreeNode => {
  return {
    children,
    node: {
      ...properties,
      childCount: children.length,
      type,
    },
  }
}

const textNode = (value: string): TreeNode => {
  return {
    children: [],
    node: text(value),
  }
}

const flatten = (tree: TreeNode): readonly VirtualDomNode[] => {
  return [tree.node, ...tree.children.flatMap(flatten)]
}

const sample = (className: string, value: string): TreeNode => {
  return node(VirtualDomElements.P, { className: mergeClassNames('FontPreviewSample', className) }, [textNode(value)])
}

const getFontFaceCss = (url: string): string => {
  return `@font-face { font-family: "Lvce Font Preview"; src: url(${JSON.stringify(url)}); }`
}

export const render = (state: Readonly<FontPreviewState>): readonly VirtualDomNode[] => {
  const { domMatrix, pointerDown, url } = state
  const className = pointerDown ? 'FontPreview FontPreviewDragging' : 'FontPreview'
  const fontFaceText = textNode(getFontFaceCss(url))
  const fontFace = node(VirtualDomElements.Style, {}, [fontFaceText])
  const samples = [
    sample('FontPreviewSampleLarge', 'The quick brown fox jumps over the lazy dog.'),
    sample('FontPreviewSampleMedium', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
    sample('FontPreviewSampleMedium', 'abcdefghijklmnopqrstuvwxyz'),
    sample('FontPreviewSampleSmall', '0123456789 !@#$%^&*()[]{}'),
  ]
  const content = node(
    VirtualDomElements.Div,
    {
      className: 'FontPreviewContent',
      style: `transform: ${stringify(domMatrix)}`,
    },
    samples,
  )
  const root = node(
    VirtualDomElements.Div,
    {
      className,
      onPointerDown: 'handleFontPreviewPointerDown',
      onWheel: 'handleFontPreviewWheel',
    },
    [fontFace, content],
  )
  return flatten(root)
}
