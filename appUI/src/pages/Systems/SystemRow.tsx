import { FC, useEffect, useState } from 'react';
import { Collapse, IconButton, TableRow } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { CollapsibleTableCell, NoBorderCell } from '../../components/Mui/TableComponents.tsx';
import { ValidatedCompoundName } from '../../components/dataViews/ValidatedCompoundName.tsx';
import { VLESystem } from '../../adapters/api/types/VLETypes.ts';
import { DeleteSystemButton } from './buttons/DeleteSystemButton.tsx';
import { DatasetsSubTable } from './DatasetsSubTable.tsx';
import { AddDatasetButton } from './buttons/AddDatasetButton.tsx';

type SystemRowProps = { model: VLESystem; expandAll: boolean };

export const SystemRow: FC<SystemRowProps> = ({ model: { system_name, datasets }, expandAll }) => {
    const [expandRow, setExpandRow] = useState(false);
    const [compound1, compound2] = system_name.split('-');

    useEffect(() => {
        if (datasets.length === 0) setExpandRow(false);
    }, [datasets.length]);

    return (
        <>
            <TableRow>
                <NoBorderCell sx={{ width: 40, px: 0 }}>
                    {!expandAll && datasets.length > 0 && (
                        <IconButton onClick={() => setExpandRow((prevOpen) => !prevOpen)}>
                            {expandRow ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                    )}
                </NoBorderCell>
                <NoBorderCell>
                    <ValidatedCompoundName compound={compound1} />
                </NoBorderCell>
                <NoBorderCell>
                    <ValidatedCompoundName compound={compound2} />
                </NoBorderCell>
                <NoBorderCell>{datasets.length}</NoBorderCell>
                <NoBorderCell>
                    <AddDatasetButton compound1={compound1} compound2={compound2} />
                    <DeleteSystemButton compound1={compound1} compound2={compound2} n_datasets={datasets.length} />
                </NoBorderCell>
            </TableRow>

            <TableRow sx={{ '&:last-child td': { border: 0 } }}>
                <NoBorderCell style={{ padding: 0 }} />
                <CollapsibleTableCell colSpan={4}>
                    <Collapse in={expandRow || expandAll} timeout="auto" unmountOnExit>
                        <DatasetsSubTable compound1={compound1} compound2={compound2} datasets={datasets} />
                    </Collapse>
                </CollapsibleTableCell>
            </TableRow>
        </>
    );
};
