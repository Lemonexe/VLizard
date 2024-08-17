const getDecimalSep = () => {
    const TESTING_NUMBER = 1.1;
    return TESTING_NUMBER.toLocaleString().replace(/1/g, '');
};

export const DECIMAL_SEP = getDecimalSep();

export const localizeNumStr = (numStr: string): string => numStr.replace('.', DECIMAL_SEP);
