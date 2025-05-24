import axios from 'axios';

import { hostName } from './helpers/hostName.ts';

const PING_TIMEOUT = 2000; // [ms]
export const PING_INTERVAL = 2500; // [ms]
export const PING_INIT_INTERVAL = 500; // [ms]

export const ping = async (): Promise<boolean> =>
    axios
        .get(hostName + '/is_it_up', { timeout: PING_TIMEOUT })
        .then(() => true)
        .catch(() => false);
