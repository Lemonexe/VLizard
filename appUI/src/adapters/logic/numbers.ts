export const sigDgtsDefault = 4; // sigDgts for normal calculated values (tabular physical quantities)
export const sigDgtsCrit = 2; // sigDgts for arbitrary criteria
export const sigDgtsMetrics = 3; // sigDgts for statistical metrics (e.g. residuals)
export const sigDgtsParams = 6; // sigDgts for model parameters

/**
 * Returns string from number rounded to the given number of significant digits
 * @param num float or integer
 * @param sigDgts integer number of significant digits, defaults to 4
 */
export const toSigDgts = (num: number, sigDgts = sigDgtsDefault): string => {
    // if number has more digits greater than sigDigits, don't use toPrecision, but round up manually to avoid exponential form
    const naturalDgts = Math.floor(Math.log10(num)) + 1;
    return naturalDgts > sigDgts
        ? (Math.round(num / 10 ** (naturalDgts - sigDgts)) * 10 ** (naturalDgts - sigDgts)).toFixed(0)
        : num.toPrecision(sigDgts);
};

/**
 * Returns number rounded to the given number of significant digits
 * @param num float or integer
 * @param sigDgts integer number of significant digits, defaults to 4
 */
export const truncateSigDgts = (num: number, sigDgts?: number): number => parseFloat(toSigDgts(num, sigDgts));

/**
 * Returns a number rounded to the given number of decimal places (fixed point)
 * @param num float or integer
 * @param precision integer number of decimal places
 */
export const toPercent = (num: number, precision = 0): string => (num * 100).toFixed(precision) + '%';
export const toPercentSigned = (num: number, precision = 0): string => (num > 0 ? '+' : '') + toPercent(num, precision);

/**
 * Prepare a string to be cast as Number by sanitizing it.
 */
export const sanitizeNumStr = (str: string): string => str.trim().replace(',', '.').replace(/%$/, '');
