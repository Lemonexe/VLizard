import { FC } from 'react';
import { Button } from '@mui/material';
import { ContentCut } from '@mui/icons-material';
import { generateEmptyCells, SetSpreadsheetData } from '../../adapters/logic/spreadsheet.ts';

type TrimButtonProps = { setData: SetSpreadsheetData };

export const TrimButton: FC<TrimButtonProps> = ({ setData }) => {
    const trimRows = () => {
        setData((prev) => {
            const n_C = prev[0]?.length ?? 4;
            const filtered = prev.filter((row) => row.some((cell) => cell?.value));
            return filtered.length > 0 ? filtered : generateEmptyCells(1, n_C);
        });
    };
    return (
        <Button onClick={trimRows} variant="outlined" startIcon={<ContentCut />}>
            Trim empty
        </Button>
    );
};
