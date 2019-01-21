import { BaseStatData, BaseStat } from './BaseStat'

describe('BaseStat', () => {
    it('should populate when derived', () => {
        class TestClass extends BaseStat {
            constructor(props) {
                super(props)
            }
        }

        const data = {
            code: '123',
            name: 'fake',
            base: 123
        } as BaseStatData

        const stat = new TestClass(data)
        expect(stat.code).toBe(data.code)
        expect(stat.name).toBe(data.name)
        expect(stat.base).toBe(data.base)
    })
})