import { IStat, IRegistry } from "./interfaces";

export class Registry implements IRegistry {
  private _stats: { [code: string]: IStat } = {}
  private _typeDict: { [typeName: string]: Set<string> } = {}

  get statCount(): number { return Object.keys(this._stats).length }

  add(stat: IStat) {
    const { _stats, _typeDict } = this

    if (_stats[stat.code]) {
      throw new Error(`Stat with ${stat.code} already exists`)
    }
    _stats[stat.code] = stat

    if (!_typeDict[stat.typeName]) {
      _typeDict[stat.typeName] = new Set<string>()
    }

    _typeDict[stat.typeName].add(stat.code)
  }

  get(statCode: string): IStat
  get<T=IStat>(statCode: string): T {
    return this._stats[statCode] ? this._stats[statCode] as any as T : undefined
  }

  getByType(typeName: string): ReadonlyArray<IStat>
  getByType<T=IStat>(typeName: string): ReadonlyArray<T> {
    if (!this._typeDict[typeName]) {
      return []
    }

    return Array.from(this._typeDict[typeName]).reduce((stats, code) => {
      stats.push(this._stats[code])
      return stats
    }, [])
  }
}
