import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'font-preview-virtual-dom'

export const skip = 1

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.ttf`, 'invalid font data is sufficient to exercise the view')
  await Workspace.setPath(tmpDir)

  await Main.openUri(`${tmpDir}/test.ttf`)

  const preview = Locator('.FontPreview')
  await expect(preview).toBeVisible()
  const sample = Locator('.FontPreviewSampleLarge')
  await expect(sample).toHaveText('The quick brown fox jumps over the lazy dog.')
}
