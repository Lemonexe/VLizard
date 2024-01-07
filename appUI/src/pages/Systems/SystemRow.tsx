import { FC, useState } from 'react';
import { Collapse, IconButton, styled, TableCell, TableRow } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { VLESystem } from '../../adapters/api/types/VLE.ts';
import { DeleteSystemButton } from './DeleteSystemButton.tsx';
import { DatasetsSubTable } from './DatasetsSubTable.tsx';
import { spacingN } from '../../adapters/MUITheme.tsx';

const CollapsibleTableCell = styled(TableCell)({
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: spacingN(2),
});

const NoBorderCell = styled(TableCell)({ border: 'unset' });

type SystemRowProps = { model: VLESystem };

export const SystemRow: FC<SystemRowProps> = ({ model: { system_name, datasets } }) => {
    const [open, setOpen] = useState(false);
    const [compound1, compound2] = system_name.split('-');

    return (
        <>
            <TableRow>
                <NoBorderCell sx={{ width: 40, px: 0 }}>
                    <IconButton onClick={() => setOpen((prevOpen) => !prevOpen)}>
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </NoBorderCell>
                <NoBorderCell>{compound1}</NoBorderCell>
                <NoBorderCell>{compound2}</NoBorderCell>
                <NoBorderCell>{datasets.length}</NoBorderCell>
                <NoBorderCell>
                    <DeleteSystemButton compound1={compound1} compound2={compound2} n_datasets={datasets.length} />
                </NoBorderCell>
            </TableRow>

            <TableRow sx={{ '&:last-child td': { border: 0 } }}>
                <CollapsibleTableCell colSpan={5}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <DatasetsSubTable compound1={compound1} compound2={compound2} datasets={datasets} />
                    </Collapse>
                </CollapsibleTableCell>
            </TableRow>
        </>
    );
};
