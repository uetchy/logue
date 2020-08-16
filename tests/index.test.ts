import hobnob from '..'
import path from 'path'

function cliPath(name: string = 'cli') {
  return path.join(__dirname, 'fixtures', name + '.js')
}

it('multiple awaits', async () => {
  const app = hobnob(cliPath())

  await app.waitFor('Answer')
  expect(app.stdout).toBe('Answer?: ')
  expect(app.currentLine).toBe('Answer?: ')

  await app.input('Hi').end()
  expect(app.stdout).toBe('Answer?: Your answer is Hi!\n')
  expect(app.currentLine).toBe('Your answer is Hi!\n')
})

it('chainable', async () => {
  const app = await hobnob(cliPath()).waitFor('Answer?').input('OK').end()
  expect(app.stdout).toBe('Answer?: Your answer is OK!\n')
})

it('simple', async () => {
  const app = await hobnob(cliPath('simple')).end()
  expect(app.stdout).toBe('A\nB\n')
})
