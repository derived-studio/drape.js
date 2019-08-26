const ARRAY_SIZE = 100 * 1000

function hrtime2ms(hrtime) {
  const nanoseconds = hrtime[0] * 1e9 + hrtime[1]
  return nanoseconds / 1e6
}

function run(cb) {
  const time = process.hrtime()
  cb()
  const diff = process.hrtime(time)
  return hrtime2ms(diff)
}

function measure({ info, setup = () => {}, test, runs = 10 }) {
  console.log(`\n${info}`)

  const setupData = setup()
  const times = [...Array(runs).keys()].map(() => run(() => test(setupData)))
  const total = times.reduce((a, b) => a + b, 0).toFixed(2)
  const average = (total / runs).toFixed(2)

  const report = { runs, total, average }
  console.log('>', report)
}

class TestClass {
  /**
   * @param {number} value
   */
  constructor(value) {
    this.value = value
  }
}

function fillArrayWithNewObjects() {
  return (arr = [...Array(ARRAY_SIZE).keys()].map(value => new TestClass(value)))
}

function fillArrayWitObjectLiterals() {
  return [...Array(ARRAY_SIZE).keys()].map(value => ({ value }))
}

function updateValuesWithPrototype(arr) {
  TestClass.prototype.add = function(value) {
    this.value += value
  }
  const value = Math.round(Math.random() * 10)
  arr.map(obj => obj.add(value))
}

function updateValuesWithExternalMethod(arr) {
  const newValue = Math.round(Math.random() * 10)
  arr.map(({ value }) => {
    value: value + newValue
  })
}

console.log('\nClasses')

measure({
  info: `fill array with ${ARRAY_SIZE} objects using new key`,
  test: fillArrayWithNewObjects
})

measure({
  info: `updating ${ARRAY_SIZE} objects with prototype method`,
  setup: fillArrayWithNewObjects,
  test: updateValuesWithPrototype
})

measure({
  info: `updating ${ARRAY_SIZE} objects with prototype method`,
  setup: fillArrayWitObjectLiterals,
  test: updateValuesWithExternalMethod
})

console.log('\nObject literals')

measure({
  info: `fill array with ${ARRAY_SIZE} objects using literals`,
  test: fillArrayWitObjectLiterals
})

measure({
  info: `updating ${ARRAY_SIZE} objects with external function`,
  setup: fillArrayWitObjectLiterals,
  test: updateValuesWithExternalMethod
})
