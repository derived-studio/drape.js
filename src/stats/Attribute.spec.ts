import { Attribute, AttributeData } from './Attribute'
import { BaseStat } from './BaseStat';
import { Modifier } from './Modifier';
import { mockModifierData } from './Modifier.spec';

const mockStatData = (overrides = {}): AttributeData => ({
  name: 'Test stat',
  code: 'test-stat',
  base: 123,
  ...overrides
} as AttributeData)

describe('Stat', () => {

  it('should return correct type name', () => {
    const stat = new Attribute(mockStatData())
    expect(stat.typeName).toBe(Attribute.TYPE)
  })

  it('should extend base stat', () => {
    const stat = new Attribute(mockStatData())
    expect(stat).toBeInstanceOf(BaseStat)
  })

  it('should return value as base', () => {
    const data = mockStatData({ base: 101 });
    const stat = new Attribute(data)
    expect(stat.base).toBe(101)
  })

  describe.each([['base'], ['factor']])('%s modifier', (modType) => {
    it(`should apply all unbounded modifiers`, () => {
      const modifier = new Modifier(mockModifierData({
        code: 'test-modifier',
        base: 1,
        bounds: undefined
      }))

      const statData = mockStatData({ base: 1 })
      const stat = new Attribute(statData)

      stat.apply(modifier)
      stat.apply(modifier)
      expect(stat.getModifierCount(modifier.code)).toBe(2)
    })

    it(`should apply bounded modifier for matching string bounds`, () => {
      const statData = mockStatData({ code: 'test-stat' })
      const stat = new Attribute(statData)

      const modifier = new Modifier(mockModifierData({
        code: 'test-modifier',
        bounds: stat.code
      }))
      stat.apply(modifier)
      stat.apply(modifier)
      expect(stat.getModifierCount(modifier.code)).toBe(2)
    })

    it(`should apply bounded modifiers if match exists within bounds array`, () => {
      const statData = mockStatData({ code: 'test-stat' })
      const stat = new Attribute(statData)

      const modifier = new Modifier(mockModifierData({
        code: 'test-modifier',
        bounds: ['stat-x', stat.code, 'stat-y']
      }))

      stat.apply(modifier)
      stat.apply(modifier)
      expect(stat.getModifierCount(modifier.code)).toBe(2)
    })

    it(`should not apply bounded non-matching modifier`, () => {
      const modifier = new Modifier(mockModifierData({
        base: 1,
        bounds: ['invalid-stat-code']
      }))

      const statData = mockStatData({ code: 'stat-code', base: 1 })
      const stat = new Attribute(statData)

      expect(() => stat.apply(modifier)).toThrowError()
      expect(stat.value).toBe(1)
    })
  })
})
