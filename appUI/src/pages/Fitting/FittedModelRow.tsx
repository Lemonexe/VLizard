import { FC, useEffect, useState } from 'react';
import { Collapse, IconButton, TableRow } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { CollapsibleTableCell, NoBorderCell } from '../../components/Mui/TableComponents.tsx';
import { ValidatedCompoundName } from '../../components/dataViews/ValidatedCompoundName.tsx';
import { PerformFitButton } from './buttons/PerformFitButton.tsx';
import { FitsSubTable } from './FitsSubTable.tsx';
import { useData } from '../../contexts/DataContext.tsx';
import { PersistedFitsForSystem } from '../../adapters/api/types/fitTypes.ts';

type FittedModelRowProps = { fitsForSystem: PersistedFitsForSystem; expandAll: boolean };

export const FittedModelRow: FC<FittedModelRowProps> = ({ fitsForSystem, expandAll }) => {
    const { system_name, fits } = fitsForSystem;
    const [comp1, comp2] = system_name.split('-');

    const [expandRow, setExpandRow] = useState(expandAll);
    const { compoundNames } = useData();
    const isMissingCompound = !compoundNames.includes(comp1) || !compoundNames.includes(comp2);

    useEffect(() => {
        if (fits.length === 0) setExpandRow(false);
    }, [fits.length]);

    useEffect(() => setExpandRow(expandAll), [expandAll]);

    return (
        <>
            <TableRow>
                <NoBorderCell sx={{ width: 40, px: 0 }}>
                    {fits.length > 0 && (
                        <IconButton onClick={() => setExpandRow((prevOpen) => !prevOpen)}>
                            {expandRow ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                    )}
                </NoBorderCell>
                <NoBorderCell>
                    <ValidatedCompoundName compound={comp1} />
                </NoBorderCell>
                <NoBorderCell>
                    <ValidatedCompoundName compound={comp2} />
                </NoBorderCell>
                <NoBorderCell>{fits.length}</NoBorderCell>
                <NoBorderCell>
                    <PerformFitButton compound1={comp1} compound2={comp2} disabled={isMissingCompound} />
                </NoBorderCell>
            </TableRow>

            <TableRow sx={{ '&:last-child td': { border: 0 } }}>
                <NoBorderCell style={{ padding: 0 }} />
                <CollapsibleTableCell colSpan={4}>
                    <Collapse in={expandRow && fits.length > 0} timeout="auto" unmountOnExit>
                        <FitsSubTable fitsForSystem={fitsForSystem} />
                    </Collapse>
                </CollapsibleTableCell>
            </TableRow>
        </>
    );
};
