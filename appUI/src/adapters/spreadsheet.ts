import { CellBase, Matrix } from 'react-spreadsheet';
import { Dispatch, SetStateAction } from 'react';

export type SpreadsheetData = Matrix<CellBase<number | ''>>;
export type SetSpreadsheetData = Dispatch<SetStateAction<SpreadsheetData>>;

export const generateEmptyCells = (n_R: number, n_C: number): SpreadsheetData =>
    Array(n_R).fill(
        Array(n_C)
            .fill(undefined)
            .map(() => ({ value: '' })),
    );

export const transposeMatrix = <T>(M0: T[][]): T[][] => {
    const n_R0 = M0.length;
    if (n_R0 === 0) throw 'Input matrix must have at least one row';
    const n_C0 = M0[0].length;
    if (!M0.every((row) => row.length === n_C0)) throw 'Matrix malformed; all rows must have same length';
    const M: T[][] = [];
    for (let i = 0; i < n_C0; i++) M.push(M0.map((row) => row[i]));
    return M;
};
