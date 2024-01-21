/**
 * Returns a number rounded to the given number of significant digits
 * @param num float or integer
 * @param sigDgts number of significant digits
 */
export const toSigDgts = (num: number, sigDgts: number): string => {
    // if number has more digits greater than sigDigits, don't use toPrecision, but round up manually to avoid exponential form
    const naturalDgts = Math.floor(Math.log10(num)) + 1;
    return naturalDgts > sigDgts
        ? (Math.round(num / 10 ** (naturalDgts - sigDgts)) * 10 ** (naturalDgts - sigDgts)).toFixed(0)
        : num.toPrecision(sigDgts);
};
