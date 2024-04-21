import { useMemo } from 'react';
import { useConfig } from '../../contexts/ConfigContext.tsx';

export const K2C = (T: number) => T - 273.15; // Kelvin to Celsius

/**
 * Returns a function that converts temperature from Kelvin to a unit of user's choice (from settings).
 * @returns (T: number) => number
 */
export const useUoM_T = () => {
    const { UoM_T } = useConfig();
    const convert_T = (T: number) => (UoM_T === 'K' ? T : K2C(T));
    const convert_T_vec = (T: number[]) => T.map(convert_T);
    return useMemo(() => ({ convert_T, convert_T_vec, UoM_T }), [UoM_T]);
};

export const pUnits = { Pa: 1000, kPa: 1, bar: 0.01, MPa: 0.001 };

/**
 * Returns a function that converts pressure from kPa to a unit of user's choice (from settings).
 * @returns (p: number) => number
 */
export const useUoM_p = () => {
    const { UoM_p } = useConfig();
    const convert_p = (p: number) => p * pUnits[UoM_p as keyof typeof pUnits];
    const convert_p_vec = (p: number[]) => p.map(convert_p);
    return useMemo(() => ({ convert_p, convert_p_vec, UoM_p }), [UoM_p]);
};
