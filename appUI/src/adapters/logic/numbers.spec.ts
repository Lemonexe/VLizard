import { expect, test } from 'vitest';
import { toSigDgts, truncateSigDgts } from './numbers';

test('toSigDgts', () => {
    expect(toSigDgts(1, 1)).toBe('1');
    expect(toSigDgts(1, 3)).toBe('1.00');
    expect(toSigDgts(1 / 700, 4)).toBe('0.001429');
    expect(toSigDgts(98765, 1)).toBe('100000');
    expect(toSigDgts(98765, 3)).toBe('98800');
    expect(toSigDgts(98765, 5)).toBe('98765');
    expect(toSigDgts(98765, 7)).toBe('98765.00');
});

test('truncateSigDgts', () => {
    expect(truncateSigDgts(1, 1)).toBe(1);
    expect(truncateSigDgts(123.45, 8)).toBe(123.45);
    expect(truncateSigDgts(1 / 700, 4)).toBe(0.001429);
    expect(truncateSigDgts(123456789.111111, 12)).toBe(123456789.111);
    const err = 364.84999999999997;
    const corr = 364.85;
    expect(truncateSigDgts(err, 10)).toBe(corr);
    expect(truncateSigDgts(err, 5)).toBe(corr);
});
