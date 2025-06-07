/* DIMENSIONLESS */

// Convert dimensionless to specified UoM for display.
export const display_x = (x: number, UoM: string) => (UoM === '%' ? x * 100 : x);
// Convert dimensionless input from specified UoM.
export const input_x = (x: number, UoM: string) => (UoM === '%' ? x / 100 : x);
// Convert vectorized dimensionless to specified UoM for display.
export const display_xy_vec = (x_vec: number[], UoM: string) => x_vec.map((T) => display_x(T, UoM));
// Convert vectorized dimensionless input from specified UoM.
export const input_x_vec = (x_vec: number[], UoM: string) => x_vec.map((T) => input_x(T, UoM));

/* TEMPERATURE */

const K2C = (T: number) => T - 273.15;
const C2K = (T: number) => T + 273.15;

const TF0 = (-5 / 9) * 459.67; // 0 K in [°F]
const F2K = (T: number) => (5 / 9) * T - TF0;
const K2F = (T: number) => (9 / 5) * (T + TF0);

// Convert temperature from K to specified UoM for display.
export const display_T = (T: number, UoM: string) => {
    if (UoM === '°F') return K2F(T);
    if (UoM === '°C') return K2C(T);
    return T; // defaulting to K
};
// Convert temperature input from specified UoM to K.
export const input_T = (T: number, UoM: string) => {
    if (UoM === '°F') return F2K(T);
    if (UoM === '°C') return C2K(T);
    return T; // defaulting to K
};
// Convert vectorized temperature from K to specified UoM for display.
export const display_T_vec = (T_vec: number[], UoM: string) => T_vec.map((T) => display_T(T, UoM));
// Convert vectorized temperature input from specified UoM to K.
export const input_T_vec = (T_vec: number[], UoM: string) => T_vec.map((T) => input_T(T, UoM));

/* PRESSURE */

// kPa is base; the ratio means "unit is this much kPa"
export const p_units = { Pa: 1000, mbar: 10, kPa: 1, bar: 0.01, MPa: 0.001, psi: 0.1450377377 };
type PressureUnitType = keyof typeof p_units;

// Convert pressure from kPa to specified UoM for display.
export const display_p = (p: number, UoM: string) => p * p_units[UoM as PressureUnitType];
// Convert pressure input from specified UoM to kPa.
export const input_p = (p: number, UoM: string) => p / p_units[UoM as PressureUnitType];

// Convert vectorized pressure from kPa to specified UoM for display.
export const display_p_vec = (p_vec: number[], UoM: string) => p_vec.map((p) => display_p(p, UoM));
// Convert vectorized pressure input from specified UoM to kPa.
export const input_p_vec = (p_vec: number[], UoM: string) => p_vec.map((p) => input_p(p, UoM));
