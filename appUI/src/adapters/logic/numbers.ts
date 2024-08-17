import { localizeNumStr } from '../locale.ts';

export const sigDgtsDefault = 4; // sigDgts for normal calculated values (tabular physical quantities)
export const sigDgtsCrit = 2; // sigDgts for arbitrary criteria
export const sigDgtsMetrics = 3; // sigDgts for statistical metrics (e.g. residuals)
export const sigDgtsParams = 6; // sigDgts for model parameters

/**
 * Returns how many digits does a number naturally have
 */
export const getNaturalDgts = (num: number): number => Math.floor(Math.log10(num)) + 1; // can't use ceil because of numbers such as 1000

/**
 * Returns number rounded to the given number of significant digits
 * @param num float or integer
 * @param diffDgts integer order of magnitude to round by (number of digits to round away, 1 is normal rounding)
 */
export const roundByOrder = (num: number, diffDgts: number): number =>
    Math.round(num / 10 ** diffDgts) * 10 ** diffDgts;

/**
 * Returns string from number rounded to the given number of significant digits
 * @param num float or integer
 * @param sigDgts integer number of significant digits, defaults to 4
 * @param localize boolean whether to localize the result, defaults to true
 */
export const toSigDgts = (num: number, sigDgts = sigDgtsDefault, localize = true): string => {
    // if number has more digits greater than sigDigits, don't use toPrecision, but round up manually to avoid exponential form
    const naturalDgts = getNaturalDgts(num);
    const diffDgts = naturalDgts - sigDgts;
    const formattedNumStr = naturalDgts > sigDgts ? roundByOrder(num, diffDgts).toFixed(0) : num.toPrecision(sigDgts);
    return localize ? localizeNumStr(formattedNumStr) : formattedNumStr;
};

/**
 * Returns number rounded to the given number of significant digits
 * @param num float or integer
 * @param sigDgts integer number of significant digits, defaults to 4
 */
export const truncateSigDgts = (num: number, sigDgts?: number): number => parseFloat(toSigDgts(num, sigDgts, false));

/**
 * Wrapper for toFixed that localizes the result
 * @param num float or integer
 * @param precision integer number of decimal places, defaults to 2
 */
export const toFixed = (num: number, precision = sigDgtsCrit): string => localizeNumStr(num.toFixed(precision));

/**
 * Returns a number rounded to the given number of decimal places (fixed point)
 * @param num float or integer
 * @param precision integer number of decimal places
 */
export const toPercent = (num: number, precision = 0): string => localizeNumStr((num * 100).toFixed(precision)) + '%';
export const toPercentSigned = (num: number, precision = 0): string => (num > 0 ? '+' : '') + toPercent(num, precision);

/**
 * Prepare a string to be cast as Number by sanitizing it.
 */
export const sanitizeNumStr = (str: string): string => str.trim().replace(',', '.').replace(/%$/, '');
