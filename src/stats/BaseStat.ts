export type BaseStatData = {
    code: string
    name: string
    base?: number
}
export abstract class BaseStat {
    code: string
    name: string
    base: number

    public abstract get typeName(): string

    constructor({
        code, name, base
    }: BaseStatData) {
        this.code = code
        this.name = name
        this.base = base || 0
    }

    public get value(): number {
        return this.base
    }
}