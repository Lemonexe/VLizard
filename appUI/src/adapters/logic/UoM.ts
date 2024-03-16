import { useConfig } from '../../contexts/ConfigContext.tsx';

export const K2C = (T: number) => T - 273.15; // Kelvin to Celsius

/**
 * Returns a function that converts temperature from Kelvin to a unit of user's choice (from settings).
 * @returns (T: number) => number
 */
export const useUoM_T = () => {
    const { UoM_T } = useConfig();
    return {
        convert_T: (T: number) => (UoM_T === 'K' ? T : K2C(T)),
        unit_T: UoM_T,
    };
};
