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
})