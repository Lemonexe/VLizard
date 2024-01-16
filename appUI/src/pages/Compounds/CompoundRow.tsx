import { FC } from 'react';
import { IconButton, TableCell, TableRow, Tooltip } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { VaporModel } from '../../adapters/api/types/vapor.ts';
import { DeleteCompoundButton } from './DeleteCompoundButton.tsx';
import { PerformAnalysisButton } from './PerformAnalysisButton.tsx';

type CompoundRowProps = { model: VaporModel };
export const CompoundRow: FC<CompoundRowProps> = ({ model: { compound, model_name } }) => (
    <TableRow sx={{ '&:last-child td': { border: 0 } }}>
        <TableCell>{compound}</TableCell>
        <TableCell>{model_name}</TableCell>
        <TableCell>
            <PerformAnalysisButton compound={compound} />
            <Tooltip title="Change or edit vapor pressure model">
                <IconButton children={<Edit />} />
            </Tooltip>
            <DeleteCompoundButton compound={compound} model_name={model_name} />
        </TableCell>
    </TableRow>
);
