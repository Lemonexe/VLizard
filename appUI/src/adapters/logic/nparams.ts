import { NamedParams } from '../api/types/common.ts';

/**
 * Create an object from two arrays like dict(zip(keys, values)) in Python
 * @param keys array of strings
 * @param values array of numbers
 */
export const toNamedParams = (keys: string[], values: number[]) => {
    if (keys.length !== values.length) throw new Error('keys & values must have the same length');
    return keys.reduce<NamedParams>((obj, key, i) => {
        obj[key] = values[i];
        return obj;
    }, {});
};

/**
 * Create two arrays from an object
 * @param nparams
 */
export const fromNamedParams = <T extends string | number>(nparams?: Record<string, T>): [string[], T[]] =>
    nparams ? [Object.keys(nparams), Object.values(nparams)] : [[], []];
