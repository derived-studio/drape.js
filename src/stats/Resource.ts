import { BaseStatData, BaseStat } from "./BaseStat";
import { IStat } from "../interfaces";

export type ResourceData = BaseStatData & {
    output?: IStat
    capacity?: IStat
}

export class Resource extends BaseStat {
    private _output: IStat
    private _capacity: IStat

    public static TYPE = 'Resource'
    get typeName() {
        return Resource.TYPE
    }

    constructor({
        code, name, base = 0, output, capacity
    }: ResourceData) {
        super({ code, name, base })
        this._output = output
        this._capacity = capacity
    }

    add(qty: number): number {
        const { isCapped, capacity, value } = this
        const diff = value + qty
        this._value = isCapped && diff > capacity ? capacity : diff
        return diff
    }

    yield(qty: number): boolean {
        if (this._value - qty < 0) {
            return false
        }
        this._value -= qty
        return true
    }

    dispose(qty = 0): number {
        const diff = this._value - qty
        this._value = diff >= 0 ? diff : 0
        return diff
    }

    update(deltaTime: number): number {
        this.add(this.output * deltaTime)
        return this._value
    }

    get qty(): number {
        return this._value
    }

    get output() {
        return this._output.value
    }

    get capacity() {
        return this._capacity.value
    }

    get isCapped(): boolean {
        return this.capacity > -1
    }

    get isDepleted(): boolean {
        return this._value === 0
    }

    get isFull(): boolean {
        return this._value === this.capacity
    }
}