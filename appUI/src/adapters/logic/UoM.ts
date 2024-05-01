import { useMemo } from 'react';
import { useConfig } from '../../contexts/ConfigContext.tsx';

export const K2C = (T: number) => T - 273.15; // Kelvin to Celsius

export const convert_T = (UoM_T: string, T: number) => (UoM_T === 'K' ? T : K2C(T));
export const convert_T_vec = (UoM_T: string, T_vec: number[]) => T_vec.map((T) => convert_T(UoM_T, T));
/**
 * Returns a function that converts temperature from Kelvin to a unit of user's choice (from settings).
 * @returns (T: number) => number
 */
export const useUoM_T = () => {
    const { UoM_T } = useConfig();
    return useMemo(
        () => ({
            convert_T: (T: number) => convert_T(UoM_T, T),
            convert_T_vec: (T_vec: number[]) => convert_T_vec(UoM_T, T_vec),
            UoM_T,
        }),
        [UoM_T],
    );
};

export const pUnits = { Pa: 1000, mbar: 10, kPa: 1, bar: 0.01, MPa: 0.001 };
export type PUnit = keyof typeof pUnits;

export const convert_p = (UoM_p: string, p: number) => p * pUnits[UoM_p as PUnit];
export const convert_p_vec = (UoM_p: string, p_vec: number[]) => p_vec.map((p) => convert_p(UoM_p, p));
/**
 * Returns a function that converts pressure from kPa to a unit of user's choice (from settings).
 * @returns (p: number) => number
 */
export const useUoM_p = () => {
    const { UoM_p } = useConfig();
    return useMemo(
        () => ({
            convert_p: (p: number) => convert_p(UoM_p, p),
            convert_p_vec: (p_vec: number[]) => convert_p_vec(UoM_p, p_vec),
            UoM_p,
        }),
        [UoM_p],
    );
};
