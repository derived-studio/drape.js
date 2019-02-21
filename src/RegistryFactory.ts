import { Registry } from './Registry';
import { IStatInstaller, IRegistryFactory } from './interfaces';

export class RegistryFactory implements IRegistryFactory {
    readonly _installers: ReadonlyArray<IStatInstaller>

    constructor(installers: IStatInstaller | IStatInstaller[]) {
        this._installers = installers instanceof Array ? installers : [installers]
    }

    create() {
        const registry = new Registry()
        for (const installer of this._installers) {
            installer.install(registry);
        }
        return registry;
    }
}