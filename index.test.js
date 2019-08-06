'use strict'

const test = require('tape')
const { cloneableGenerator } = require('.')

test('cloneableGenerator', async t => {
  const genFunc = function * (num1, num2) {
    yield num1 * num2
    const num3 = yield
    const add = num1 + num2

    if (num3 > add) {
      yield num3 - add
    } else if (num3 === add) {
      yield 'you win'
    } else {
      yield add - num3
    }
  }

  const cloneableGen = cloneableGenerator(genFunc)(2, 3)

  t.deepEqual(
    cloneableGen.next(),
    {
      value: 6,
      done: false
    }
  )

  t.deepEqual(
    cloneableGen.next(),
    {
      value: undefined,
      done: false
    }
  )

  const cloneElseIf = cloneableGen.clone()
  const cloneElse = cloneElseIf.clone()

  t.deepEqual(
    cloneableGen.next(13),
    {
      value: 8,
      done: false
    }
  )

  t.deepEqual(
    cloneableGen.next(),
    {
      value: undefined,
      done: true
    }
  )

  t.deepEqual(
    cloneElseIf.next(5),
    {
      value: 'you win',
      done: false
    }
  )

  t.deepEqual(
    cloneElseIf.next(),
    {
      value: undefined,
      done: true
    }
  )

  t.deepEqual(
    cloneElse.next(2),
    {
      value: 3,
      done: false
    }
  )

  const cloneReturn = cloneElse.clone()
  const cloneThrow = cloneElse.clone()

  t.deepEqual(
    cloneElse.next(),
    {
      value: undefined,
      done: true
    }
  )

  t.deepEqual(
    cloneReturn.return('toto'),
    {
      value: 'toto',
      done: true
    }
  )

  t.throws(() => cloneThrow.throw('throws an exception'))

  t.end()
})
