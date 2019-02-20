import { BaseStatData, BaseStat } from "./BaseStat";
import { Modifier, ModifierData } from "./Modifier";

export type StatData = BaseStatData & {
}

export class Stat extends BaseStat {
    private _modList: Modifier[] = []
    private _modCounter: { [key: string]: number } = {}

    constructor(props: StatData) {
        super(props)
    }

    public static TYPE = 'Stat'
    public get typeName(): string {
        return Stat.TYPE
    }

    public get modifiers(): Array<Partial<ModifierData>> {
        return this._modList.map(mod => ({ ...mod }))
    }

    public get value(): number {
        return this._value
    }

    public apply(modifier: Modifier) {
        const count = this._modCounter[modifier.code] || 0

        if (modifier.bounds.length > 0 && !modifier.bounds.includes(this.code)) {
            throw new Error(`Stat ${this.code} can't accept ${modifier.code} modifier limited to: ${modifier.bounds.join(',')}`)
        }

        if (modifier.limit && count >= modifier.limit) {
            throw new Error(`Modifier ${modifier.code} can only be applied ${modifier.limit} time`)
        }

        if (!count) {
            this._modList.push(modifier)
        }

        this._modCounter[modifier.code] = count + 1

        this.updateCachedValue()
    }

    public remove(modifier: Modifier) {
        const count = this._modCounter[modifier.code] || 0
        this._modCounter[modifier.code] = count - 1


        if (this._modCounter[modifier.code] <= 0) {
            this._modList.filter(mod => mod.code != modifier.code)
        }

        this.updateCachedValue()
    }

    public getModifierCount(modifier: Modifier | string): number {
        const code = modifier instanceof Modifier ? modifier.code : modifier
        return this._modCounter[code] || 0
    }

    private updateCachedValue(): void {
        const { baseSum, factorSum } = this._modList.reduce(({ baseSum, factorSum }, curr: Modifier) => ({
            baseSum: baseSum + curr.base * this._modCounter[curr.code],
            factorSum: factorSum + curr.factor * this._modCounter[curr.code]
        }), { baseSum: 0, factorSum: 0 })
        this._value = (this.base + baseSum) * (1 + factorSum)
    }
}