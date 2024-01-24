import { CellBase, Matrix } from 'react-spreadsheet';
import { Dispatch, SetStateAction } from 'react';

// number is desired data type, but react-spreadsheet also has to represent empty cells
// unfortunately it's not consistent, so `value` can be '' | undefined
export type CellValueType = number | '' | undefined;
export type SpreadsheetCell = CellBase<CellValueType>; // { value: CellValueType }
export type SpreadsheetData = Matrix<SpreadsheetCell>; // SpreadsheetCell[][]
export type SetSpreadsheetData = Dispatch<SetStateAction<SpreadsheetData>>;

export const generateEmptyCells = (n_R: number, n_C: number): SpreadsheetData =>
    Array(n_R).fill(
        Array(n_C)
            .fill(undefined)
            .map(() => ({ value: '' })),
    );

/**
 * Transpose a matrix as array of arrays
 * @param M0 matrix to transpose
 * @returns the transposed matrix
 */
export const transposeMatrix = <T>(M0: T[][]): T[][] => {
    const n_R0 = M0.length;
    if (n_R0 === 0) throw 'Input matrix must have at least one row';
    const n_C0 = M0[0].length;
    if (!M0.every((row) => row.length === n_C0)) throw 'Matrix malformed; all rows must have same length';
    const M: T[][] = [];
    for (let i = 0; i < n_C0; i++) M.push(M0.map((row) => row[i]));
    return M;
};

export const matrixToSpreadsheetData = (M: Matrix<CellValueType>): SpreadsheetData =>
    M.map((row) => row.map((value) => ({ value })));

export const spreadsheetDataToMatrix = (data: SpreadsheetData): Matrix<CellValueType> =>
    data.map((row) => row.map((cell) => cell?.value));

export const matrixToNumerical = (M: Matrix<CellValueType>): number[][] => M.map((row) => row.map(Number));

/**
 * Check if a matrix is whole, i.e. it is non-empty and all cells have a value
 * @param data matrix of Spreadsheet Cells
 * @returns true if matrix is whole, false if it has holes
 */
export const checkIsSpreadsheetDataWhole = (data: SpreadsheetData): boolean => {
    const n_R = data.length;
    if (n_R === 0) return false; // matrix empty
    const n_C = data[0].length;
    // matrix malformed
    if (!data.every((row) => row.length === n_C)) return false;
    // matrix has empty cells
    return data.every((row) => !row.some((cell) => cell?.value === undefined || cell.value === ''));
};

/**
 * Make a matrix read-only
 */
export const makeReadOnly = (data: SpreadsheetData): SpreadsheetData =>
    data.map((row) => row.map((cell) => ({ value: cell?.value, readOnly: true })));

/**
 * Shorthand for creating a column SpreadsheetData from array of arrays (which means array of rows)
 */
export const fromRows = (rows: Matrix<CellValueType>): SpreadsheetData =>
    matrixToSpreadsheetData(transposeMatrix(rows));

/**
 * Shorthand for parsing SpreadsheetData to numerical matrix
 */
export const toNumMatrix = (data: SpreadsheetData): number[][] => matrixToNumerical(spreadsheetDataToMatrix(data));
