# logue

[![npm](https://badgen.net/npm/v/logue)][npm-url]
[![npm: total downloads](https://badgen.net/npm/dt/logue)][npm-url]
[![Actions Status: test](https://github.com/uetchy/logue/workflows/test/badge.svg)](https://github.com/uetchy/logue/actions?query=test)

[npm-url]: https://npmjs.org/package/logue

The tiny yet powerful test utility for interactive command-line apps.

## Install

```bash
npm i --save logue
# or
yarn add logue
```

## Example (Jest)

```js
import logue from "logue"

it("test", async () => {
  const app = logue("./my-cli-app.js", ["put", "--args", "here"]) // spawn

  await app.waitFor("continue?") // wait until "continue?" appears in stdout
  expect(app.stdout).toContain("[yes/no]")

  await app.input("yes") // write "yes" to stdin
  await app.end() // wait for the process to be completed
  expect(app.stdout).toContain("Done!")
}
```

Also, you can just chain all of methods:

```js
const result = await logue(args).waitFor("continue?").input("y").end();
expect(result.stdout).toContain("Done!");
```

## API

> Soon

## Contributing

See [Contribution guide](./CONTRIBUTING.md).
