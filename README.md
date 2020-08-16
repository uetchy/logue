# logue

[![npm](https://badgen.net/npm/v/logue)][npm-url]
[![npm: total downloads](https://badgen.net/npm/dt/logue)][npm-url]

[npm-url]: https://npmjs.org/package/logue

Simplest way to test your interactive command-line app.

## Install

```bash
npm i --save logue
# or
yarn add logue
```

## Example (Jest)

```js
import logue from 'logue'

it('test', async () => {
  const app = logue('my-cli-app', ['put', '--args', 'here']) // spawn

  await app.waitFor('continue?') // wait until 'continue?' appears in stdout
  expect(app.stdout).toContain('[yes/no]')

  await app.input('yes') // write 'yes' to stdin
  await app.end() // wait for the process to be completed
  expect(app.stdout).toContain('Done!')
}
```

Also, uou can just chain all of methods:

```js
const app = await logue(args).waitFor('continue?').input('y').end()
expect(app.stdout).toContain('Done!')
```

## API

> Help!

## Contributing

See [Contribution Guide](./CONTRIBUTING.md).
