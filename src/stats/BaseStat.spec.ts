import { BaseStatData, BaseStat } from './BaseStat'

class TestStat extends BaseStat {
    constructor(props) {
        super(props)
    }

    static TYPE = 'BaseStat'
    get typeName(): string {
        return TestStat.TYPE
    }
}

describe('BaseStat', () => {
    it('should have correct type name', () => {
        var stat = new TestStat({
            code: '123',
            name: 'fake',
            base: 123
        })
        expect(stat.typeName).toBe(TestStat.TYPE)
    })

    it('should populate when derived', () => {
        const testData = {
            code: '123',
            name: 'fake',
            base: 123
        }

        const stat = new TestStat(testData)
        expect(stat.code).toBe(testData.code)
        expect(stat.name).toBe(testData.name)
        expect(stat.base).toBe(testData.base)
    })

    it('should default base to 0', () => {
        const testData = {
            code: '123',
            name: 'fake',
        }

        const stat = new TestStat(testData)
        expect(stat.base).toBe(0)
        expect(stat.value).toBe(0)
    })

    it('should generate code slug from name', () => {
        const stat1 = new TestStat({ name: 'Some test stat 1' })
        expect(stat1.code).toBe('some-test-stat-1')

        const stat2 = new TestStat({ name: 'damage & growth' })
        expect(stat2.code).toBe('damage-and-growth')

        const stat3 = new TestStat({ name: 'growth 10% boost' })
        expect(stat3.code).toBe('growth-10percent-boost')

        const stat4 = new TestStat({ name: 'doom---and---gloom' })
        expect(stat4.code).toBe('doom-and-gloom')

        const stat5 = new TestStat({ name: 'speed +1' })
        expect(stat5.code).toBe('speed-plus1')
    })
})