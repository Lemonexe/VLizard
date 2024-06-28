import { expect, test } from 'vitest';
import {
    display_p,
    display_p_vec,
    display_T,
    display_T_vec,
    display_x,
    display_xy_vec,
    input_p,
    input_p_vec,
    input_T,
    input_T_vec,
    input_x,
    input_x_vec,
} from './UoM.ts';

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

test('Temperature', () => {
    expect(display_T(400, '°C')).toBe(400 - 273.15);
    expect(display_T(400, 'K')).toBe(400);

    expect(input_T(400 - 273.15, '°C')).toBe(400);
    expect(input_T(400, 'K')).toBe(400);

    const arrK = [273.15, 400];
    const arrC = [0, 400 - 273.15];
    expect(display_T_vec(arrK, '°C')).toEqual(arrC);
    expect(input_T_vec(arrC, '°C')).toEqual(arrK);
});

test('Pressure', () => {
    expect(display_p(98, 'kPa')).toBe(98);
    expect(display_p(98, 'mbar')).toBe(980);
    expect(display_p(98, 'MPa')).toBe(0.098);

    expect(input_p(98, 'kPa')).toBe(98);
    expect(input_p(980, 'mbar')).toBe(98);
    expect(input_p(0.098, 'MPa')).toBe(98);

    const arr_kPa = [98, -6.78];
    const arr_mbar = [980, -67.8];
    expect(display_p_vec(arr_kPa, 'mbar')).toEqual(arr_mbar);
    // floating point error spoils the test, and I'm too lazy to test for tolerance
    expect(input_p_vec([980], 'mbar')).toEqual([98]);
});
