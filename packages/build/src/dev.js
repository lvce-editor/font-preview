import { spawn } from 'child_process'
import { join } from 'path'
import { root } from './root.js'

const serverPath = join(root, 'packages', 'build', 'node_modules', '@lvce-editor', 'server', 'bin', 'server.js')
const esbuildPath = join(root, 'packages', 'build', 'node_modules', '.bin', 'esbuild')

const main = () => {
  const child = spawn(serverPath, ['--only-extension=packages/extension', '--test-path=packages/e2e'], {
    stdio: 'inherit',
  })
  const child2 = spawn(
    esbuildPath,
    [
      '--format=esm',
      '--bundle',
      '--external:node:buffer',
      '--external:electron',
      '--external:ws',
      '--external:node:worker_threads',
      '--bundle',
      '--watch',
      'packages/font-preview-worker/src/fontPreviewWorkerMain.ts',
      '--outfile=packages/font-preview-worker/dist/fontPreviewWorkerMain.js',
    ],
    {
      cwd: root,
      stdio: 'inherit',
    },
  )
  const child3 = spawn(
    esbuildPath,
    [
      '--format=esm',
      '--bundle',
      '--external:node:buffer',
      '--external:electron',
      '--external:ws',
      '--external:node:worker_threads',
      '--bundle',
      '--watch',
      'packages/extension/src/fontPreviewMain.ts',
      '--outfile=packages/extension/dist/fontPreviewMain.js',
    ],
    {
      cwd: root,
      stdio: 'inherit',
    },
  )
}

main()
