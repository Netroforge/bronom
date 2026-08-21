import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { closeBronom, expect, launchBronom, test } from './fixtures.js'

test('waits for the persistent browser profile to flush before exiting', async ({
  profileDirectory,
  mcpPort
}) => {
  const markerPath = join(profileDirectory, 'profile-flush-marker.txt')
  const instance = await launchBronom(profileDirectory, mcpPort)
  const child = instance.app.process()

  try {
    await instance.app.evaluate(({ app, session }, marker) => {
      const { appendFileSync } = process.getBuiltinModule('node:fs') as typeof import('node:fs')
      const browserSession = session.fromPartition('persist:bronom', { cache: true })
      const originalFlush = browserSession.flushStorageData.bind(browserSession)
      browserSession.flushStorageData = async () => {
        appendFileSync(marker, 'started\n')
        await new Promise((resolve) => setTimeout(resolve, 1_000))
        await originalFlush()
        appendFileSync(marker, 'finished\n')
      }
      setImmediate(() => app.quit())
    }, markerPath)

    if (child.exitCode === null) {
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => {
          child.off('exit', onExit)
          reject(new Error('Bronom did not exit after flushing its persistent browser profile'))
        }, 5_000)
        const onExit = (): void => {
          clearTimeout(timer)
          resolve()
        }
        child.once('exit', onExit)
      })
    }

    expect(await readFile(markerPath, 'utf8')).toBe('started\nfinished\n')
  } finally {
    await closeBronom(instance.app)
  }
})
