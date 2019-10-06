# Single Transferable Vote (STV) NPM library

*TypeScript implementation of STV algorithm without any runtime dependencies.*

## Getting started

Add the library into your project using either:

```bash
npm add stv
```

or

```bash
yarn add stv
```

Import it into your project:

```typescript
import { stv } from 'stv';
```

## Usage

To evaluate election using STV, invoke the algorithm by calling the `stv(opts)` function:

![](https://media.giphy.com/media/Q93l2yEDrVsGhoRauM/giphy.gif)

```typescript
const results = stv({
  seatsToFill: 2,
  candidates: ["Wonderwoman", "Superman", "Batman", "Iron Man"],
  votes: [
    {
      weight: 1,
      preferences: ["Wonderwoman", "Batman"]
    },
    {
      weight: 1,
      preferences: ["Iron Man", "Batman"]
    },
    {
      weight: 1,
      preferences: ["Iron Man"]
    }
  ],
  report: console.log
});
```

## Which STV counting method is implemented?

Currently, the [Scottish STV rules](https://www.opavote.com/methods/scottish-stv-rules) are implemented. There may be more variants in the future.

## License 📜

The `stv` library is licensed under MIT license.
