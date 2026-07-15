import { activate as activateExtensionApi, registerView } from '@lvce-editor/extension-api'
import { view } from '../FontPreviewView/FontPreviewView.ts'

const state = {
  isActivated: false,
}

export const activate = async (): Promise<void> => {
  if (state.isActivated) {
    return
  }
  state.isActivated = true
  await activateExtensionApi()
  registerView(view)
}

export const deactivate = (): void => {}
