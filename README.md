# hobnob

[![npm](https://badgen.net/npm/v/hobnob)][npm-url]
[![npm: total downloads](https://badgen.net/npm/dt/hobnob)][npm-url]

[npm-url]: https://npmjs.org/package/hobnob

Simplest way to test your interactive command-line app.

## Install

```bash
npm i --save hobnob
# or
yarn add hobnob
```

## Example (Jest)

```js
import hobnob from 'hobnob'

it('test', async () => {
  const app = hobnob('my-cli-app', ['put', '--args', 'here']) // spawn

  await app.waitFor('continue?') // wait until 'continue?' appears in stdout
  expect(app.stdout).toContain('[yes/no]')

  await app.input('yes') // write 'yes' to stdin
  await app.end() // wait for the process to be completed
  expect(app.stdout).toContain('Done!')
}
```

Also, uou can just chain all of methods:

```js
const app = await hobnob(args).waitFor('continue?').input('y').end()
expect(app.stdout).toContain('Done!')
```

## API

> Help!

## Contributing

See [Contribution Guide](./CONTRIBUTING.md).
