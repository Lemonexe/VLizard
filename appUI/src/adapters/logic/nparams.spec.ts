import { expect, test } from 'vitest';
import { fromNamedParams, toNamedParams } from './nparams.ts';

test('toNamedParams', () => {
    expect(toNamedParams(['a', 'b'], [1, 2])).toEqual({ a: 1, b: 2 });
});
test('fromNamedParams', () => {
    expect(fromNamedParams({ a: 1, b: 2 })).toEqual([
        ['a', 'b'],
        [1, 2],
    ]);
    expect(fromNamedParams({})).toEqual([[], []]);
    expect(fromNamedParams()).toEqual([[], []]);
});
