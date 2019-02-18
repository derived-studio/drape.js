import { BaseStatData, BaseStat } from './BaseStat'

class TestClass extends BaseStat {
    constructor(props) {
        super(props)
    }
}

describe('BaseStat', () => {
    it('should populate when derived', () => {
        const testData = {
            code: '123',
            name: 'fake',
            base: 123
        } as BaseStatData

        const stat = new TestClass(testData)
        expect(stat.code).toBe(testData.code)
        expect(stat.name).toBe(testData.name)
        expect(stat.base).toBe(testData.base)
    })

    it('should default base to 0', () => {
        const testData = {
            code: '123',
            name: 'fake',
        } as BaseStatData

        const stat = new TestClass(testData)
        expect(stat.base).toBe(0)
        expect(stat.value).toBe(0)
    })

})