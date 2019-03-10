import { ModifierData, Modifier } from './Modifier'
import { BaseStat } from './BaseStat'

export const mockModifierData = (overrides: Partial<ModifierData> = {}): ModifierData => ({
  code: 'test-modifier',
  name: 'Test modifier',
  base: 0,
  factor: 0,
  bounds: ['test-stat'],
  ...overrides
})

describe('Modifier', () => {
  it('should return correct type name', () => {
    const mod = new Modifier(mockModifierData())
    expect(mod.typeName).toBe(Modifier.TYPE)
  })

  it('should extend base stat', () => {
    const mod = new Modifier(mockModifierData())
    expect(mod).toBeInstanceOf(BaseStat)
  })

  it('should expose factor', () => {
    const mod = new Modifier(mockModifierData({ factor: 1 }))
    expect(mod.factor).toBe(1)
  })

  it('should expose stat codes', () => {
    const mod = new Modifier(mockModifierData({ bounds: ['one', 'two'] }))
    expect(mod.bounds).toEqual(['one', 'two'])
  })

  it('should default getters to 0', () => {
    const mod = new Modifier(mockModifierData({
      base: undefined,
      factor: undefined
    }))

    expect(mod.base).toBe(0)
    expect(mod.factor).toBe(0)
  })
})
