import { FC, useEffect, useState } from 'react';
import { Collapse, IconButton, Stack, styled, TableCell, TableRow } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { spacingN } from '../../adapters/MUITheme.tsx';
import { WarningTooltip } from '../../components/TooltipIcons.tsx';
import { VLESystem } from '../../adapters/api/types/VLE.ts';
import { useData } from '../../contexts/DataContext.tsx';
import { DeleteSystemButton } from './DeleteSystemButton.tsx';
import { DatasetsSubTable } from './DatasetsSubTable.tsx';
import { AddDatasetButton } from './AddDatasetButton.tsx';

type ValidatedCompoundNameProps = { compound: string; compounds: string[] };
const ValidatedCompoundName: FC<ValidatedCompoundNameProps> = ({ compound, compounds }) => (
    <Stack direction="row" alignItems="center">
        <span>{compound}</span>
        {!compounds.includes(compound) && <WarningTooltip title="Unknown compound (no vapor pressure model)" />}
    </Stack>
);

const CollapsibleTableCell = styled(TableCell)({
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: spacingN(2),
});

const NoBorderCell = styled(TableCell)({ border: 'unset' });

type SystemRowProps = { model: VLESystem };

export const SystemRow: FC<SystemRowProps> = ({ model: { system_name, datasets } }) => {
    const [expandRow, setExpandRow] = useState(false);
    const [compound1, compound2] = system_name.split('-');
    const { compoundNames } = useData();

    useEffect(() => {
        if (datasets.length === 0) setExpandRow(false);
    }, [datasets.length]);

    return (
        <>
            <TableRow>
                <NoBorderCell sx={{ width: 40, px: 0 }}>
                    {datasets.length > 0 && (
                        <IconButton onClick={() => setExpandRow((prevOpen) => !prevOpen)}>
                            {expandRow ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                    )}
                </NoBorderCell>
                <NoBorderCell>
                    <ValidatedCompoundName compound={compound1} compounds={compoundNames} />
                </NoBorderCell>
                <NoBorderCell>
                    <ValidatedCompoundName compound={compound2} compounds={compoundNames} />
                </NoBorderCell>
                <NoBorderCell>{datasets.length}</NoBorderCell>
                <NoBorderCell>
                    <AddDatasetButton compound1={compound1} compound2={compound2} />
                    <DeleteSystemButton compound1={compound1} compound2={compound2} n_datasets={datasets.length} />
                </NoBorderCell>
            </TableRow>

            <TableRow sx={{ '&:last-child td': { border: 0 } }}>
                <CollapsibleTableCell colSpan={5}>
                    <Collapse in={expandRow} timeout="auto" unmountOnExit>
                        <DatasetsSubTable compound1={compound1} compound2={compound2} datasets={datasets} />
                    </Collapse>
                </CollapsibleTableCell>
            </TableRow>
        </>
    );
};
