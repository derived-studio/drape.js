import { StatInstaller } from "./StatInstaller";
import { BaseStat, BaseStatData } from "./stats/BaseStat";
import { Registry } from "./Registry";

class TestStat extends BaseStat {
    readonly typeName = 'MockStat'
    constructor(props: BaseStatData) {
        super(props)
    }
}

describe('StatInstaller', () => {
    it('intalls stat onto the registry', () => {
        const registry = new Registry()
        const installer = new StatInstaller<TestStat, BaseStatData>(TestStat, [
            { name: 'test stat 1', code: 'test-stat-1', base: 111 },
            { name: 'test stat 2', base: 222 }
        ])

        installer.install(registry)

        expect(registry.get('test-stat-1').value).toBe(111)
        expect(registry.get('test-stat-2').value).toBe(222)
    })
})