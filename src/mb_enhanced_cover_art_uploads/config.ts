import { ConfigProperty } from '@lib/config';

export const CONFIG = {
    fetchFrontOnly: new ConfigProperty('fetchFrontOnly', 'Fetch front image only', false),
} as const;
