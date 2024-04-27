import { useMemo } from 'react';
import { expect, test, vi } from 'vitest';
import { convert_p, convert_p_vec, convert_T, convert_T_vec, useUoM_p, useUoM_T } from './UoM.ts';
import { useConfig } from '../../contexts/ConfigContext.tsx';
import { Config } from '../api/types/configTypes.tsx';

vi.mock('../../contexts/ConfigContext.tsx', () => ({ useConfig: vi.fn() }));
vi.mocked(useConfig).mockReturnValue({ UoM_T: '°C', UoM_p: 'mbar' } as Config);

vi.mock('react', () => ({ useMemo: vi.fn() }));
vi.mocked(useMemo).mockImplementation((fn) => fn());

test('useUoM_T', () => {
    const memo = useUoM_T();
    expect(memo.UoM_T).toBe('°C');

    expect(memo.convert_T(400)).toBe(400 - 273.15);
    expect(memo.convert_T(400)).toBe(convert_T('°C', 400));

    const arr = [273.15, 400];
    expect(memo.convert_T_vec(arr)).toEqual([0, 400 - 273.15]);
    expect(memo.convert_T_vec(arr)).toEqual(convert_T_vec('°C', arr));
});

test('useUoM_p', () => {
    const memo = useUoM_p();
    expect(memo.UoM_p).toBe('mbar');

    expect(memo.convert_p(98)).toBe(980);
    expect(memo.convert_p(98)).toBe(convert_p('mbar', 98));

    const arr = [98, -6.78];
    expect(memo.convert_p_vec(arr)).toEqual([980, -67.8]);
    expect(memo.convert_p_vec(arr)).toEqual(convert_p_vec('mbar', arr));
});
