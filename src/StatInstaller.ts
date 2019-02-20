import { IStatInstaller, IStat } from "./interfaces";
import { Registry } from "./Rregistry";
import { BaseStatData } from "./stats/BaseStat";

export class StatInstaller<TStat extends IStat, TStatData extends BaseStatData> implements IStatInstaller {

    private _statData: TStatData[]
    private _statType: { new(data: TStatData): TStat }

    constructor(statType: { new(data: TStatData): TStat }, statData: TStatData[]) {
        this._statData = statData
        this._statType = statType
    }

    install(registry: Registry) {
        for (const statData of this._statData) {
            registry.add(new this._statType(statData))
        }

        return registry
    }
}