import { ChangeEvent, FC, FormEvent, useState } from 'react';
import { Button, TextField } from '@mui/material';
import { Add } from '@mui/icons-material';
import { generateEmptyCells, SetSpreadsheetData } from '../../adapters/logic/spreadsheet.ts';

type AddRowsButtonProps = { setData: SetSpreadsheetData };

export const AddRowsButton: FC<AddRowsButtonProps> = ({ setData }) => {
    const [showAddRows, setShowAddRows] = useState(false);
    const [rowsToAdd, setRowsToAdd] = useState(1);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.currentTarget.value);
        setRowsToAdd(isNaN(value) || value < 0 ? 0 : value);
    };

    const addRows = (n_R: number) => {
        setData((prev) => {
            const n_C = prev[0]?.length ?? 4;
            const newRows = generateEmptyCells(n_R, n_C);
            return [...prev, ...newRows];
        });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setShowAddRows(false);
        addRows(rowsToAdd);
    };

    return showAddRows ? (
        <form onSubmit={handleSubmit}>
            <TextField
                type="number"
                value={rowsToAdd}
                onChange={handleChange}
                autoFocus
                size="small"
                style={{ maxWidth: 60, padding: 0 }}
                slotProps={{ htmlInput: { style: { padding: 6.75 }, min: 0 } }}
            />
            <Button type="submit" variant="text" style={{ paddingLeft: 0, paddingRight: 0 }}>
                Add
            </Button>
        </form>
    ) : (
        <Button onClick={() => setShowAddRows(true)} variant="outlined" startIcon={<Add />}>
            Add rows
        </Button>
    );
};
