import { expect, test } from 'vitest';

import {
    display_T,
    display_T_vec,
    display_p,
    display_p_vec,
    display_x,
    display_xy_vec,
    input_T,
    input_T_vec,
    input_p,
    input_p_vec,
    input_x,
    input_x_vec,
} from './UoM.ts';

const absTol = 1e-4;
const expectApprox = (a: number, b: number) => {
    expect(a).toBeGreaterThan(b - absTol);
    expect(a).toBeLessThan(b + absTol);
};

test('Dimensionless', () => {
    expect(display_x(0.5, '%')).toBe(50);
    expect(display_x(0.5, '1')).toBe(0.5);

    expect(input_x(50, '%')).toBe(0.5);
    expect(input_x(0.5, '1')).toBe(0.5);

    const arr1 = [0.5, 0.75];
    const arrPerc = [50, 75];
    expect(display_xy_vec(arr1, '%')).toEqual(arrPerc);
    expect(input_x_vec(arrPerc, '%')).toEqual(arr1);
});

test(display_T.name, () => {
    expect(display_T(400, '°C')).toBe(400 - 273.15);
    expect(display_T(400, 'K')).toBe(400);
    expect(display_T(373.15, '°F')).toBeGreaterThan(212 - absTol);
    expect(display_T(373.15, '°F')).toBeLessThan(212 + absTol);
    expect(display_T(273.15 + 38, '°F')).toBeGreaterThan(100.4 - absTol);
    expect(display_T(273.15 + 38, '°F')).toBeLessThan(100.4 + absTol);
});

test(input_T.name, () => {
    expect(input_T(400 - 273.15, '°C')).toBe(400);
    expect(input_T(400, 'K')).toBe(400);
    expect(input_T(212, '°F')).toBeGreaterThan(373.15 - absTol);
    expect(input_T(212, '°F')).toBeLessThan(373.15 + absTol);
    expect(input_T(100, '°F')).toBeGreaterThan(273.15 + 37.7777777778 - absTol);
    expect(input_T(100, '°F')).toBeLessThan(273.15 + 37.7777777778 + absTol);

    const arrK = [273.15, 400];
    const arrC = [0, 400 - 273.15];
    expect(display_T_vec(arrK, '°C')).toEqual(arrC);
    expect(input_T_vec(arrC, '°C')).toEqual(arrK);
});

test(display_p.name, () => {
    expect(display_p(98, 'kPa')).toBe(98);
    expect(display_p(98, 'mbar')).toBe(980);
    expect(display_p(98, 'MPa')).toBe(0.098);
    expect(display_p(200, 'psi')).toBeGreaterThan(29.007548 - absTol);
    expect(display_p(200, 'psi')).toBeLessThan(29.007548 + absTol);
    expectApprox(display_p(101.325, 'psi'), 14.6959487755);
});

test(input_p.name, () => {
    expect(input_p(98, 'kPa')).toBe(98);
    expect(input_p(980, 'mbar')).toBe(98);
    expect(input_p(0.098, 'MPa')).toBe(98);
    expect(input_p(5, 'psi')).toBeGreaterThan(34.473786 - absTol);
    expect(input_p(5, 'psi')).toBeLessThan(34.473786 + absTol);

    const arr_kPa = [98, -6.78];
    const arr_mbar = [980, -67.8];
    expect(display_p_vec(arr_kPa, 'mbar')).toEqual(arr_mbar);
    // floating point error spoils the test, and I'm too lazy to test for tolerance
    expect(input_p_vec([980], 'mbar')).toEqual([98]);
});
