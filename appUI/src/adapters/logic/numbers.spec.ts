import { expect, test } from 'vitest';
import { toSigDgts } from './numbers';

test('toSigDgts', () => {
    expect(toSigDgts(1, 1)).toBe('1');
    expect(toSigDgts(1, 3)).toBe('1.00');
    expect(toSigDgts(1 / 700, 4)).toBe('0.001429');
    expect(toSigDgts(98765, 1)).toBe('100000');
    expect(toSigDgts(98765, 3)).toBe('98800');
    expect(toSigDgts(98765, 5)).toBe('98765');
    expect(toSigDgts(98765, 7)).toBe('98765.00');
});
