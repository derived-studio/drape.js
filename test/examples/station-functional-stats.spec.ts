/**
 * Functional approach
 *
 * PROS
 *  - creating arrays with object litterals is faster
 *  - code is based on pure functions without mutations
 *  - functional updates are faster than prototypal
 *  - accessing values doesn't require .value
 *
 * CONS
 *  - a lot of boilerplate code which can be avoied with library API
 *  - need for destructing state all over the place
 *  - complex stats become cumbersome ( resources with output and capacity stored in attributes )
 *  - modifiers are isolated from stats ( lots of boilerplate
 *  - increased code complexity with added reducers and maps
 *  - lack of modular encapsulation
 *  - no caching
 */

describe.skip('Statiion - functional stats', () => {
  type Dictionary<T> = { [key: string]: T }

  type StatModifier = {
    code: string
    value?: number
    factor?: number
  }

  type StationModule = {
    code: string
    modifiers: Dictionary<StatModifier>
  }

  type StationResources = Dictionary<number>
  type StationAttributes = Dictionary<number>

  type StationDefaults = {
    resources: StationResources
    attributes: StationAttributes
    modules: StationModule[]
  }

  type Station = StationDefaults & {
    name: string
  }

  const getResourceOutputCode = (resourceCode: string) => `${resourceCode}-output`
  const getResourceCapacityCode = (resourceCode: string) => `${resourceCode}-capacity`

  const OXYGEN = 'oxygen'
  const ENERGY = 'energy'

  const OXYGEN_OUTPUT = getResourceOutputCode(OXYGEN)
  const ENERGY_OUTPUT = getResourceOutputCode(ENERGY)
  const ENERGY_CAPACITY = getResourceCapacityCode(ENERGY)

  const getResourceDefaultCapacity = (): number => 100

  const getStationDefaultResources = (overrides: StationResources = {}): StationResources => ({
    energy: 10,
    oxygen: 100,
    minerals: 100,
    food: 200,
    water: 20,
    ...overrides
  })

  const getStationDefaultResourceCacities = (
    overrides: StationAttributes = {}
  ): StationAttributes => {
    const resourceCodes = Object.keys(getStationDefaultResources())

    return resourceCodes.reduce((attrubutes: StationAttributes, code: string) => {
      const capacityCode = getResourceCapacityCode(code)
      return {
        ...attrubutes,
        [capacityCode]: overrides[capacityCode]
          ? overrides[capacityCode]
          : getResourceDefaultCapacity()
      }
    }, {})
  }

  const getStationDefaultAttributes = (overrides: StationAttributes = {}): StationAttributes => ({
    hitpoints: 1000,
    ...getStationDefaultResourceCacities(),
    ...overrides
  })

  const STATION_CORE_MODULE: StationModule = {
    code: 'station-core',
    modifiers: {
      [OXYGEN_OUTPUT]: { code: OXYGEN_OUTPUT, value: 1 },
      [ENERGY_OUTPUT]: { code: ENERGY_OUTPUT, value: 2 }
    }
  }

  const STATION_SOLAR_PANEL_MODULE: StationModule = {
    code: 'station-solar-panel',
    modifiers: { [ENERGY_OUTPUT]: { code: ENERGY_OUTPUT, value: 2 } }
  }

  const STATION_WATER_RECLAIMER: StationModule = {
    code: 'station-water-reclaimer',
    modifiers: { [ENERGY_OUTPUT]: { code: ENERGY_OUTPUT, value: -1 } }
  }

  const getStationDefaultModules = (): StationModule[] => [
    STATION_CORE_MODULE,
    STATION_SOLAR_PANEL_MODULE,
    STATION_WATER_RECLAIMER
  ]

  const getStationDefaults = (overrides: Partial<StationDefaults> = {}): StationDefaults => ({
    resources: getStationDefaultResources(),
    attributes: getStationDefaultAttributes(),
    modules: getStationDefaultModules(),
    ...overrides
  })

  const reduceStatModifiersByCode = (
    previous: StatModifier,
    current: StatModifier
  ): StatModifier => {
    const code = previous.code
    const { value, factor } = previous

    if (current.code !== code) {
      return previous
    }

    const addedValue = current.value !== undefined ? current.value : 0
    const addedFactor = current.factor !== undefined ? current.factor : 0

    return {
      code,
      value: value + addedValue,
      factor: factor + addedFactor
    }
  }

  const addStationModule = (station: Station, stationModule: StationModule): Station => ({
    ...station,
    modules: [...station.modules, { ...stationModule }]
  })

  const addStationModules = (station: Station, stationModules: StationModule[]): Station =>
    stationModules.reduce(addStationModule, station)

  const createStation = (
    name: string,
    { resources, attributes, modules } = getStationDefaults()
  ): Station => ({
    name,
    resources,
    attributes,
    modules
  })

  const updateStationResources = (
    delta: number,
    stationResources: Dictionary<number>,
    stationModifiers: StatModifier[] = [],
    globalModifiers: StatModifier[] = []
  ): Dictionary<number> =>
    Object.keys(stationResources).reduce((retRes: Dictionary<number>, resourceCode: string) => {
      const outputCode = getResourceOutputCode(resourceCode)
      const globalMod: StatModifier = globalModifiers.reduce(reduceStatModifiersByCode, {
        code: outputCode,
        value: 0,
        factor: 0
      })

      const stationMod: StatModifier = stationModifiers.reduce(reduceStatModifiersByCode, {
        code: outputCode,
        value: 0,
        factor: 0
      })

      const currentValue = stationResources[resourceCode]
      const outputValue = globalMod.value + stationMod.value
      const outputFactor = 1 + stationMod.factor + globalMod.factor
      const newValue = currentValue + outputValue * outputFactor * delta

      return {
        ...retRes,
        [resourceCode]: newValue
      }
    }, {})

  const getActiveStationModifiers = (stationModules: StationModule[]): StatModifier[] =>
    stationModules.reduce((modifiers: StatModifier[], stationModule: StationModule) => {
      const moduleModifiers: StatModifier[] = Object.values(stationModule.modifiers)
      return [...modifiers, ...moduleModifiers]
    }, [])

  const updateStation = (
    delta: number,
    station: Station,
    globalModifiers: StatModifier[] = []
  ): Station => {
    const resources: StationResources = updateStationResources(
      delta,
      station.resources,
      getActiveStationModifiers(station.modules),
      globalModifiers
    )
    return {
      ...station,
      resources
    }
  }

  it('creates station with defaults', () => {
    const testStation = createStation('test station')
    expect(testStation.resources).toEqual(getStationDefaultResources())
    expect(testStation.attributes).toEqual(getStationDefaultAttributes())
    expect(testStation.modules).toEqual(getStationDefaultModules())
  })

  it('updates station resources', () => {
    const stationSetup = getStationDefaults({ modules: [] })
    const testStation = createStation('test station', stationSetup)
    const defaultResources = getStationDefaultResources()

    const stationModules: StationModule[] = Array(3).fill(STATION_SOLAR_PANEL_MODULE) // 2 x 3
    const upgradedStationOne = addStationModules(testStation, stationModules)
    expect(updateStation(1, upgradedStationOne).resources).toEqual({
      ...defaultResources,
      energy: 16
    })
  })

  it('update resources to maximum capacity', () => {
    const resources = getStationDefaultResources({ [ENERGY]: 100 })
    const attributes = getStationDefaultAttributes({ [ENERGY_CAPACITY]: 110 })
    const stationSetup = getStationDefaults({ resources, attributes, modules: [] })
    const station = createStation('test station', stationSetup)

    expect(station.resources[ENERGY]).toEqual(resources[ENERGY])
    expect(station.attributes[ENERGY_CAPACITY]).toEqual(attributes[ENERGY_CAPACITY])

    const stationModules: StationModule[] = Array(20).fill(STATION_SOLAR_PANEL_MODULE) // 2 x 20
    const upgradedStationOne = addStationModules(station, stationModules)

    // todo: how do we keep resource output & capacity cached
    expect(updateStation(1, upgradedStationOne).resources).toEqual({
      ...resources,
      [ENERGY]: attributes[ENERGY_CAPACITY]
    })
  })

  it('update attributes with global modifiers', () => {
    // how do we do that? where do we store global values, how do we pass it to update functions
  })

  it('update resources with global modifiers', () => {
    // how do we do that? even more complexity than with updating attributes (above)
  })
})
