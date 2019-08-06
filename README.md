cloneable-generator
===================

[![npm](https://img.shields.io/npm/v/@wmakeev/cloneable-generator.svg?maxAge=1800&style=flat-square)](https://www.npmjs.com/package/@wmakeev/cloneable-generator)
[![Travis](https://img.shields.io/travis/wmakeev/cloneable-generator.svg?maxAge=1800&style=flat-square)](https://travis-ci.org/wmakeev/cloneable-generator)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)

> This code taken from [redux-saga](https://github.com/redux-saga/redux-saga) [testing-utils](https://github.com/redux-saga/redux-saga/blob/master/packages/testing-utils/src/index.js) module. Just `cloneableGenerator` function without any other dependencies.

## Install

```
npm install @wmakeev/cloneable-generator
```

## Example

Takes a generator function (function*) and returns a generator function.
All generators instanciated from this function will be cloneable.
For testing purpose only.

This is useful when you want to test a different branch of generator function without having to replay the steps that lead to it.

```js
import { cloneableGenerator } from '@wmakeev/cloneable-generator';

function* oddOrEven() {
  // some stuff are done here
  yield 1;
  yield 2;
  yield 3;

  const userInput = yield 'enter a number';
  if (userInput % 2 === 0) {
    yield 'even';
  } else {
    yield 'odd'
  }
}

test('my oddOrEven', assert => {
  const data = {};
  data.gen = cloneableGenerator(oddOrEven)();

  assert.equal(
    data.gen.next().value,
    1,
    'it should yield 1'
  );

  assert.equal(
    data.gen.next().value,
    2,
    'it should yield 2'
  );

  assert.equal(
    data.gen.next().value,
    3,
    'it should yield 3'
  );

  assert.equal(
    data.gen.next().value,
    'enter a number',
    'it should ask for a number'
  );

  assert.test('even number is given', a => {
    // we make a clone of the generator before giving the number;
    data.clone = data.gen.clone();

    a.equal(
      data.gen.next(2).value,
      'even',
      'it should yield "even"'
    );

    a.equal(
      data.gen.next().done,
      true,
      'it should be done'
    );

    a.end();
  });

  assert.test('odd number is given', a => {

    a.equal(
      data.clone.next(1).value,
      'odd',
      'it should yield "odd"'
    );

    a.equal(
      data.clone.next().done,
      true,
      'it should be done'
    );

    a.end();
  });

  assert.end();
});
```
