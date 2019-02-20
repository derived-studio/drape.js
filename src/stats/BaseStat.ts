import { IStat } from "../interfaces";

export type BaseStatData = {
    code: string
    name: string
    base?: number
}
export abstract class BaseStat implements IStat {
    readonly code: string
    readonly name: string
    readonly base: number

    protected _value: number
    public get value(): number { return this._value }

    public abstract get typeName(): string

    constructor({
        code, name, base = 0
    }: BaseStatData) {
        this.code = code
        this.name = name
        this.base = base
        this._value = base
    }


}