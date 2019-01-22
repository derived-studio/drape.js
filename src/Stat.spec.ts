import { Stat, StatData } from './Stat'
import { BaseStat } from './BaseStat';
import { Modifier } from './Modifier';
import { mockModifierData } from './Modifier.spec';

const mockStatData = (overrides = {}): StatData => ({
    name: 'Test stat',
    code: 'test-stat',
    base: 123,
    ...overrides
} as StatData)

describe('Stat', () => {

    it('should extend base stat', () => {
        const mod = new Stat(mockStatData())
        expect(mod).toBeInstanceOf(BaseStat)
    })

    it('should return value as base', () => {
        const data = mockStatData({ base: 101 });
        const stat = new Stat(data)
        expect(stat.base).toBe(101)
    })

    describe('base modifier', () => {
        it('should apply non-restricted modifiers', () => {
            const modifier = new Modifier(mockModifierData({
                base: 1,
                bounds: undefined
            }))

            const statData = mockStatData({ base: 1 })
            const stat = new Stat(statData)

            stat.apply(modifier)
            expect(stat.value).toBe(2)

            stat.apply(modifier)
            expect(stat.value).toBe(3)
        })

        it('should apply restricted modifier', () => {
            const statCode = 'test-stat'
            const modifier = new Modifier(mockModifierData({
                base: 1,
                bounds: statCode
            }))

            const statData = mockStatData({ base: 1, code: statCode })
            const stat = new Stat(statData)

            stat.apply(modifier)
            expect(stat.value).toBe(2)

            stat.apply(modifier)
            expect(stat.value).toBe(3)
        })

        it('should not apply multi-restricted modifiers', () => {
            const statCode = 'test-stat'
            const modifier = new Modifier(mockModifierData({
                base: 1,
                bounds: [statCode, 'another-stat']
            }))

            const statData = mockStatData({ base: 1 })
            const stat = new Stat(statData)

            stat.apply(modifier)
            expect(stat.value).toBe(2)

            stat.apply(modifier)
            expect(stat.value).toBe(3)
        })

        it('should not apply restricted non-matching modifier', () => {
            const modifier = new Modifier(mockModifierData({
                base: 1,
                bounds: ['non-matching-stat']
            }))

            const statData = mockStatData({ base: 1 })
            const stat = new Stat(statData)

            expect(() => stat.apply(modifier)).toThrowError()
            expect(stat.value).toBe(1)
        })
    })

    it('should apply factor modifiers', () => {

    })

    it('should remove modifiers', () => {

    })
})