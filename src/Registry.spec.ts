import { BaseStatData, BaseStat } from "./stats/BaseStat";
import { Registry } from "./Registry";

export type TestStatData = BaseStatData & {
    info: string
}

export class TestStat extends BaseStat {
    static TYPE = 'TestStat'
    get typeName() { return TestStat.TYPE }

    info: string = ''

    constructor(props: TestStatData) {
        super(props)
        this.info = props.info
    }
}

export const testStatData: TestStatData[] = [
    { name: 'stat 1', code: 'stat-one', base: 1, info: 'stat with code' },
    { name: 'stat 2', base: 1, info: 'stat with code auto generated' }
]

describe('Registry', () => {

    it('should create empty registry', () => {
        const registry = new Registry()
        expect(registry.statCount).toBe(0)
    })

    it('should allow to get added stats', () => {
        const registry = new Registry()
        const statData = { name: 'stat 1', code: 'stat-one', base: 1, info: 'stat with code' }
        registry.add(new TestStat(statData))
        const stat = registry.get('stat-one') as TestStat

        expect(registry.statCount).toBe(1)
        expect(stat.name).toBe(statData.name)
        expect(stat.code).toBe(statData.code)
        expect(stat.info).toBe(statData.info)
        expect(stat.value).toBe(statData.base)
    })

    it('should allow to get stats by type', () => {
        const registry = new Registry()
        for (let statData of testStatData) {
            registry.add(new TestStat(statData))
        }

        expect(registry.statCount).toBe(2)
        const stats: TestStat[] = registry.getByType(TestStat.TYPE) as TestStat[]
        expect(stats).toHaveLength(2)
    })

})