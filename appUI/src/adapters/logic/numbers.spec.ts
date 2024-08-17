import { expect, test } from 'vitest';
import { getNaturalDgts, roundByOrder, toSigDgts, truncateSigDgts } from './numbers';

test('toSigDgts', () => {
    expect(toSigDgts(1, 1)).toBe('1');
    expect(toSigDgts(1)).toBe('1.000');
    expect(toSigDgts(1, 3)).toBe('1.00');
    expect(toSigDgts(1 / 700, 4)).toBe('0.001429');
    expect(toSigDgts(1 / 700)).toBe('0.001429');
    expect(toSigDgts(98765, 1)).toBe('100000');
    expect(toSigDgts(98765, 3)).toBe('98800');
    expect(toSigDgts(98765, 5)).toBe('98765');
    expect(toSigDgts(98765, 7)).toBe('98765.00');
});

test('truncateSigDgts', () => {
    expect(truncateSigDgts(1, 1)).toBe(1);
    expect(truncateSigDgts(1)).toBe(1);
    expect(truncateSigDgts(123.45, 8)).toBe(123.45);
    expect(truncateSigDgts(1 / 700, 4)).toBe(0.001429);
    expect(truncateSigDgts(1 / 700)).toBe(0.001429);
    expect(truncateSigDgts(123456789.111111, 12)).toBe(123456789.111);
    const err = 364.84999999999997;
    const corr = 364.85;
    expect(truncateSigDgts(err, 10)).toBe(corr);
    expect(truncateSigDgts(err, 5)).toBe(corr);
    expect(truncateSigDgts(err)).toBe(364.8);
});

test('getNaturalDgts', () => {
    expect(getNaturalDgts(1)).toBe(1);
    expect(getNaturalDgts(123)).toBe(3);
    expect(getNaturalDgts(123.45)).toBe(3);
    expect(getNaturalDgts(0.09876)).toBe(-1);
    expect(getNaturalDgts(1.234e9)).toBe(10);
});

test('roundByOrder', () => {
    expect(roundByOrder(1, 1)).toBe(0);
    expect(roundByOrder(1, 0)).toBe(1);
    expect(roundByOrder(1, -1)).toBe(1);
    expect(roundByOrder(123.45, 2)).toBe(100);
    expect(roundByOrder(128.76, 1)).toBe(130);
    expect(roundByOrder(0.1678, -1)).toBe(0.2);
    expect(roundByOrder(9.87654e12, 11)).toBe(9.9e12);
});
