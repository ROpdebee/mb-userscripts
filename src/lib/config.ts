import { GMdeleteValue, GMgetValue, GMsetValue } from '@lib/compat';
import { LOGGER } from '@lib/logging/logger';

export class ConfigProperty<T> {
    public readonly name: string;
    public readonly description: string;
    private readonly defaultValue: T;

    public constructor(name: string, description: string, defaultValue: T) {
        this.name = name;
        this.description = description;
        this.defaultValue = defaultValue;
    }

    public async get(): Promise<T> {
        const storedValue = await GMgetValue(this.name);
        if (storedValue === undefined) {
            return this.defaultValue;
        }

        if (typeof storedValue !== 'string') {
            LOGGER.error(`Invalid stored configuration data for property ${this.name}: expected a string, got ${storedValue}.`);
            await GMdeleteValue(this.name);
            return this.defaultValue;
        }

        try {
            return JSON.parse(storedValue) as T;
        } catch (error) {
            LOGGER.error(`Invalid stored configuration data for property ${this.name}: Failed to parse JSON data: ${error}.`);
            await GMdeleteValue(this.name);
            return this.defaultValue;
        }
    }

    public set(value: T): Promise<void> {
        return GMsetValue(this.name, JSON.stringify(value));
    }
}
