import { RegistryFactory } from "./RegistryFactory";
import { StatInstaller } from "./StatInstaller";
import { TestStat, testStatData } from "./Registry.spec";

describe('RegistryFactory', () => {
    it('should create new registry from single installer', () => {
        const installer = new StatInstaller(TestStat, testStatData)
        const factory = new RegistryFactory(installer)
        const registry = factory.create()

        const stat0: TestStat = registry.get('stat-one') as TestStat
        expect(stat0.info).toBe(testStatData[0].info)

        const stat1: TestStat = registry.get('stat-2') as TestStat
        expect(stat1.info).toBe(testStatData[1].info)
    })

    it('should create new registry from installer array', () => {
        const installer = new StatInstaller(TestStat, testStatData)
        const factory = new RegistryFactory([installer])
        const registry = factory.create()

        const stat0: TestStat = registry.get('stat-one') as TestStat
        expect(stat0.info).toBe(testStatData[0].info)

        const stat1: TestStat = registry.get('stat-2') as TestStat
        expect(stat1.info).toBe(testStatData[1].info)
    })
})