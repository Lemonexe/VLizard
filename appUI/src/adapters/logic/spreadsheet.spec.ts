import { expect, test } from 'vitest';
import {
    checkIsSpreadsheetDataWhole,
    generateEmptyCells,
    matrixToNumerical,
    matrixToSpreadsheetData,
    spreadsheetDataToMatrix,
    transposeMatrix,
} from './spreadsheet.ts';

test('generateEmptyCells', () => {
    expect(generateEmptyCells(0, 0)).toEqual([]);
    expect(generateEmptyCells(1, 0)).toEqual([[]]);
    expect(generateEmptyCells(0, 1)).toEqual([]);
    expect(generateEmptyCells(1, 1)).toEqual([[{ value: '' }]]);
    expect(generateEmptyCells(2, 3)).toEqual([
        [{ value: '' }, { value: '' }, { value: '' }],
        [{ value: '' }, { value: '' }, { value: '' }],
    ]);
});

test('transposeMatrix', () => {
    expect(transposeMatrix([[1]])).toEqual([[1]]);
    expect(transposeMatrix([[1, 2, 3]])).toEqual([[1], [2], [3]]);
    expect(transposeMatrix([[1], [2], [3]])).toEqual([[1, 2, 3]]);
    expect(
        transposeMatrix([
            [1, 2, 3],
            [4, 5, 6.333],
        ]),
    ).toEqual([
        [1, 4],
        [2, 5],
        [3, 6.333],
    ]);
});

test('matrixToSpreadsheetData', () => {
    expect(matrixToSpreadsheetData([[1e-7]])).toEqual([[{ value: 1e-7 }]]);
    expect(matrixToSpreadsheetData([[1, '', 3]])).toEqual([[{ value: 1 }, { value: '' }, { value: 3 }]]);
    expect(matrixToSpreadsheetData([[undefined, undefined]])).toEqual([[{}, {}]]);
});

test('spreadsheetDataToMatrix', () => {
    expect(spreadsheetDataToMatrix([[{ value: 1 / 7 }], [{ value: '' }]])).toEqual([[1 / 7], ['']]);
});

test('matrixToNumerical', () => {
    expect(matrixToNumerical([[1]])).toEqual([[1]]);
    expect(matrixToNumerical([[1, '', 3.753]])).toEqual([[1, 0, 3.753]]);
    expect(matrixToNumerical([[undefined, undefined]])).toEqual([[NaN, NaN]]);
});

test('checkIsSpreadsheetDataWhole', () => {
    expect(checkIsSpreadsheetDataWhole([[{ value: 1 }]])).toBe(true);
    expect(checkIsSpreadsheetDataWhole([[{ value: '' }]])).toBe(false);
    expect(checkIsSpreadsheetDataWhole([[{ value: undefined }]])).toBe(false);
    expect(checkIsSpreadsheetDataWhole([[{ value: 1 }, { value: '' }]])).toBe(false);
    expect(checkIsSpreadsheetDataWhole([[{ value: 1 }, { value: undefined }]])).toBe(false);
    expect(
        checkIsSpreadsheetDataWhole([
            [{ value: 1 }, { value: 2 }],
            [{ value: 3 }, { value: 4 }],
        ]),
    ).toBe(true);
});
