import { useMemo } from 'react';
import { expect, test, vi } from 'vitest';
import { useUoM_p, useUoM_T } from './UoM.ts';
import { useConfig } from '../../contexts/ConfigContext.tsx';
import { Config } from '../api/types/configTypes.tsx';

vi.mock('../../contexts/ConfigContext.tsx', () => ({ useConfig: vi.fn() }));
vi.mocked(useConfig).mockReturnValue({ UoM_T: '°C', UoM_p: 'mbar' } as Config);

vi.mock('react', () => ({ useMemo: vi.fn() }));
vi.mocked(useMemo).mockImplementation((fn) => fn());

test('useUoM_T', () => {
    const { convert_T, convert_T_vec, UoM_T } = useUoM_T();
    const zeroC = 273.15; // [K]
    const T = 400; // [K]
    expect(UoM_T).toBe('°C');
    expect(convert_T(T)).toBe(T - zeroC);
    expect(convert_T_vec([zeroC, T])).toEqual([0, T - zeroC]);
});

test('useUoM_p', () => {
    const { convert_p, convert_p_vec, UoM_p } = useUoM_p();
    expect(UoM_p).toBe('mbar');
    expect(convert_p(98)).toBe(980);
    expect(convert_p_vec([98, -6.78])).toEqual([980, -67.8]);
});
