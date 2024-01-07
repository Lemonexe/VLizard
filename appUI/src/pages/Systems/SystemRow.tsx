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

type SystemRowProps = { model: VLESystem };

export const SystemRow: FC<SystemRowProps> = ({ model: { system_name, datasets } }) => {
    const [open, setOpen] = useState(false);
    const [compound1, compound2] = system_name.split('-');

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell sx={{ width: 40, px: 0 }}>
                    <IconButton onClick={() => setOpen((prevOpen) => !prevOpen)}>
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell>{compound1}</TableCell>
                <TableCell>{compound2}</TableCell>
                <TableCell>{datasets.length}</TableCell>
                <TableCell>
                    <DeleteSystemButton compound1={compound1} compound2={compound2} n_datasets={datasets.length} />
                </TableCell>
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
