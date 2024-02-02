import { FC, useEffect, useState } from 'react';
import { Collapse, IconButton, Stack, styled, TableCell, TableRow } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { spacingN } from '../../contexts/MUITheme.tsx';
import { WarningTooltip } from '../../components/TooltipIcons.tsx';
import { CompoundIdentifier } from '../../adapters/api/types/common.ts';
import { VLESystem } from '../../adapters/api/types/VLETypes.ts';
import { useData } from '../../contexts/DataContext.tsx';
import { DeleteSystemButton } from './buttons/DeleteSystemButton.tsx';
import { DatasetsSubTable } from './DatasetsSubTable.tsx';
import { AddDatasetButton } from './buttons/AddDatasetButton.tsx';

const ValidatedCompoundName: FC<CompoundIdentifier> = ({ compound }) => {
    const { compoundNames } = useData();
    return (
        <Stack direction="row" alignItems="center">
            <span>{compound}</span>
            {!compoundNames.includes(compound) && <WarningTooltip title="Unknown compound (no vapor pressure model)" />}
        </Stack>
    );
};

const CollapsibleTableCell = styled(TableCell)({
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: spacingN(2),
});

const NoBorderCell = styled(TableCell)({ border: 'unset' });

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
                <NoBorderCell />
                <CollapsibleTableCell colSpan={4}>
                    <Collapse in={expandRow || expandAll} timeout="auto" unmountOnExit>
                        <DatasetsSubTable compound1={compound1} compound2={compound2} datasets={datasets} />
                    </Collapse>
                </CollapsibleTableCell>
            </TableRow>
        </>
    );
};
