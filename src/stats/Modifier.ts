import { BaseStatData, BaseStat } from "./BaseStat";

export type ModifierData = BaseStatData & {
    factor?: number
    bounds?: string | string[]
    limit?: number
}

export class Modifier extends BaseStat {
    private _factor: number
    private _limit: number
    private _bounds: Array<string>

    public static TYPE = 'Modifier'
    get typeName() {
        return Modifier.TYPE
    }

    constructor({
        code, name, base = 0, factor = 0, bounds = [], limit = 0
    }: ModifierData) {
        super({ code, name, base })
        this._factor = factor
        this._bounds = typeof bounds === 'string' ? [bounds] : bounds
        this._limit = limit
    }

    get factor() {
        return this._factor
    }

    get limit() {
        return this._limit
    }

    get bounds() {
        return this._bounds
    }
}