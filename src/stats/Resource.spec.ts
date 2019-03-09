import { Resource, ResourceData } from "./Resource";
import { Attribute } from "./Attribute";

const testResource = ({
    name = 'test resource',
    base = 0,
    capacity = 0,
    output = 0
} = {}) => new Resource({
    base,
    name,
    capacity: new Attribute({ name: `${name} capacity`, base: capacity }),
    output: new Attribute({ name: `${name} output`, base: output })
})

describe('Resource', () => {
    it('creates with initial values', () => {
        const values = { base: 100, capacity: 1000, output: 5 }
        const res = testResource(values)
        expect(res.value).toBe(values.base)
        expect(res.capacity).toBe(values.capacity)
        expect(res.output).toBe(values.output)
    })

    it('has qunatity alias', () => {
        const base = 10
        const res = testResource({ base })
        expect(res.value).toBe(res.qty)
        expect(res.qty).toBe(base)
    })

    it('adds quantity', () => {
        const res = testResource({ capacity: 100 })
        expect(res.add(100)).toBe(100)
        expect(res.value).toBe(100)
    })

    it('adds quantity limiting by capacity', () => {
        const res = testResource({ capacity: 100 })
        expect(res.add(200)).toBe(200)
        expect(res.value).toBe(100)
    })

    it('yield quantity', () => {
        const res = testResource({ base: 100 })
        expect(res.yield(100)).toBeTruthy()
        expect(res.value).toBe(0)
    })

    it('prevents yielding not enough QTY', () => {
        const res = testResource({ base: 100 })
        expect(res.yield(200)).toBeFalsy()
        expect(res.value).toBe(100)
    })

    it('disposes resource', () => {
        const res = testResource({ capacity: 100 })
        expect(res.add(100)).toBe(100)

        expect(res.dispose(60)).toBe(40)
        expect(res.value).toBe(40)

        expect(res.dispose(60)).toBe(-20)
        expect(res.value).toBe(0)
    })

    it('reports depleted', () => {
        const res = testResource({ base: 0, capacity: 100 })
        expect(res.isDepleted).toBeTruthy()
        res.add(10)
        expect(res.isDepleted).toBeFalsy()
    })

    it('reports full', () => {
        const res = testResource({ base: 0, capacity: 100 })
        expect(res.isFull).toBeFalsy()
        res.add(100)
        expect(res.isFull).toBeTruthy()
    })


    it('updates with output', () => {
        const res = testResource({ base: 0, capacity: 100, output: 100 })
        expect(res.update(0.5)).toBe(50)
        expect(res.isFull).toBeFalsy()

        expect(res.update(0.1)).toBe(60)
        expect(res.value).toBe(60)

        expect(res.update(0.5)).toBe(100)
        expect(res.value).toBe(100)

        expect(res.isFull).toBeTruthy()
    })
})