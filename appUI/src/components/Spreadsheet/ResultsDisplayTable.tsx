import { FC, useMemo, useState } from 'react';
import Spreadsheet from 'react-spreadsheet';
import { Box, Button, Collapse } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { CellValueType, fromRows, makeReadOnly, spreadsheetToSigDgts } from '../../adapters/logic/spreadsheet.ts';

export type ResultsDisplayTableProps = {
    rawDataColumns: CellValueType[][];
    columnLabels?: string[];
    rowLabels?: string[];
    sigDgts?: number;
};

/**
 * Helper component to display a collapsible readonly transposed table, usually handy for calculation results.
 */
export const ResultsDisplayTable: FC<ResultsDisplayTableProps> = ({
    rawDataColumns,
    columnLabels,
    rowLabels,
    sigDgts,
}) => {
    const [visible, setVisible] = useState(false);
    const handleToggle = () => setVisible((prevOpen) => !prevOpen);

    const spreadsheetData = useMemo(
        () => makeReadOnly(spreadsheetToSigDgts(fromRows(rawDataColumns), sigDgts)),
        [rawDataColumns],
    );

    return (
        <Box>
            <Button
                onClick={handleToggle}
                variant="outlined"
                startIcon={visible ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                style={{ minWidth: 160 }}
            >
                {visible ? 'Hide' : 'Show'} table
            </Button>

            <Collapse in={visible} timeout="auto">
                <Spreadsheet data={spreadsheetData} columnLabels={columnLabels} rowLabels={rowLabels} />
            </Collapse>
        </Box>
    );
};
