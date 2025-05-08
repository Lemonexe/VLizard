import { expect, test } from 'vitest';
import {
    filterEmptyRows,
    generateEmptyCells,
    isSpreadsheetDataWhole,
    matrixToNumerical,
    matrixToSpreadsheetData,
    spreadsheetDataToMatrix,
    spreadsheetToSigDgts,
    transposeMatrix,
} from './spreadsheet.ts';
import { toSigDgts } from './numbers.ts';

test(generateEmptyCells.name, () => {
    expect(generateEmptyCells(0, 0)).toEqual([]);
    expect(generateEmptyCells(1, 0)).toEqual([[]]);
    expect(generateEmptyCells(0, 1)).toEqual([]);
    expect(generateEmptyCells(1, 1)).toEqual([[{ value: '' }]]);
    expect(generateEmptyCells(2, 3)).toEqual([
        [{ value: '' }, { value: '' }, { value: '' }],
        [{ value: '' }, { value: '' }, { value: '' }],
    ]);
});

test(transposeMatrix.name, () => {
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

test(matrixToSpreadsheetData.name, () => {
    expect(matrixToSpreadsheetData([[1e-7]])).toEqual([[{ value: 1e-7 }]]);
    expect(matrixToSpreadsheetData([[1, '', 3]])).toEqual([[{ value: 1 }, { value: '' }, { value: 3 }]]);
    expect(matrixToSpreadsheetData([[undefined, undefined]])).toEqual([[{}, {}]]);
});

test(spreadsheetDataToMatrix.name, () => {
    expect(spreadsheetDataToMatrix([[{ value: 1 / 7 }], [{ value: '' }]])).toEqual([[1 / 7], ['']]);
});

test(matrixToNumerical.name, () => {
    expect(matrixToNumerical([[1]])).toEqual([[1]]);
    expect(matrixToNumerical([[1, '', 3.753]])).toEqual([[1, 0, 3.753]]);
    expect(matrixToNumerical([[undefined, undefined]])).toEqual([[NaN, NaN]]);
});

test(isSpreadsheetDataWhole.name, () => {
    expect(isSpreadsheetDataWhole([[{ value: 1 }]])).toBe(true);
    expect(isSpreadsheetDataWhole([[{ value: '' }]])).toBe(false);
    expect(isSpreadsheetDataWhole([[{ value: undefined }]])).toBe(false);
    expect(isSpreadsheetDataWhole([[{ value: 1 }, { value: '' }]])).toBe(false);
    expect(isSpreadsheetDataWhole([[{ value: 1 }, { value: undefined }]])).toBe(false);
    expect(
        isSpreadsheetDataWhole([
            [{ value: 1 }, { value: 2 }],
            [{ value: 3 }, { value: 4 }],
        ]),
    ).toBe(true);
});

test(filterEmptyRows.name, () => {
    expect(filterEmptyRows([])).toEqual([]);
    expect(filterEmptyRows([[{ value: 3 }, { value: 4 }]])).toEqual([[{ value: 3 }, { value: 4 }]]);
    expect(filterEmptyRows([[{ value: '' }, { value: undefined }]])).toEqual([]);
    expect(filterEmptyRows([[{ value: 1 }, { value: undefined }]])).toEqual([[{ value: 1 }, { value: undefined }]]);
    expect(
        filterEmptyRows([
            [{ value: 1 }, { value: '' }],
            [{ value: '' }, { value: '' }],
            [{ value: 3 }, { value: 4 }],
        ]),
    ).toEqual([
        [{ value: 1 }, { value: '' }],
        [{ value: 3 }, { value: 4 }],
    ]);
});

test(spreadsheetToSigDgts.name, () => {
    expect(spreadsheetToSigDgts([[{ value: 1 / 3 }]])).toEqual([[{ value: toSigDgts(1 / 3) }]]);
    expect(spreadsheetToSigDgts([[{ value: 1 / 3 }]], 2)).toEqual([[{ value: toSigDgts(1 / 3, 2) }]]);
    expect(spreadsheetToSigDgts([[{ value: '' }, { value: undefined }, { value: 'asdf' }]], 2)).toEqual([
        Array(3).fill({ value: toSigDgts(0, 2) }),
    ]);
    expect(spreadsheetToSigDgts([[]], 2)).toEqual([[]]);
});
