import logue from '..'
import path from 'path'

function cliPath(name: string = 'cli') {
  return path.join(__dirname, 'fixtures', name + '.js')
}

it('multiple awaits', async () => {
  const app = logue(cliPath())
  expect(app.status).toBe('running')
  expect(app.line).toBe('')

  await app.waitFor('Answer')
  expect(app.status).toBe('running')
  expect(app.stdout).toBe('Answer?: ')
  expect(app.line).toBe('Answer?: ')

  await app.input('Hi').end()
  expect(app.status).toBe('settled')
  expect(app.stdout).toBe('Answer?: Your answer is Hi!\n')
  expect(app.line).toBe('Your answer is Hi!\n')
})

it('chainable', async () => {
  const app = await logue(cliPath()).waitFor('Answer?').input('OK').end()
  expect(app.stdout).toBe('Answer?: Your answer is OK!\n')
})

it('simple', async () => {
  const app = await logue(cliPath('simple'))
  expect(app.stdout).toBe('A\nB\n')
})
