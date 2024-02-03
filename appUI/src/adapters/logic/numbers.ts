/**
 * Returns a number rounded to the given number of significant digits
 * @param num float or integer
 * @param sigDgts integer number of significant digits
 */
export const toSigDgts = (num: number, sigDgts: number): string => {
    // if number has more digits greater than sigDigits, don't use toPrecision, but round up manually to avoid exponential form
    const naturalDgts = Math.floor(Math.log10(num)) + 1;
    return naturalDgts > sigDgts
        ? (Math.round(num / 10 ** (naturalDgts - sigDgts)) * 10 ** (naturalDgts - sigDgts)).toFixed(0)
        : num.toPrecision(sigDgts);
};

/**
 * Returns a number rounded to the given number of decimal places (fixed point)
 * @param num float or integer
 * @param precision integer number of decimal places
 */
export const toPercent = (num: number, precision = 0): string => (num * 100).toFixed(precision) + ' %';
