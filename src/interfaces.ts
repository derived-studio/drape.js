export interface IStat {
    readonly code: string
    readonly name: string
    readonly value: number
    readonly typeName: string
}

export interface IRegistry {
    add(stat: IStat): void
    get(statCode: string): IStat
    get<T extends IStat>(statCode: string): T
    getByType(typeName): ReadonlyArray<IStat>
}

export interface IRegistryFactory {
    create(installers: IStatInstaller | IStatInstaller[]): IRegistry
}

export interface IStatInstaller {
    install(registry: IRegistry): IRegistry
}