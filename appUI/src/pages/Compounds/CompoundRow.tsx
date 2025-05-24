import { TableCell, TableRow } from '@mui/material';
import { FC } from 'react';

import { VaporModel } from '../../adapters/api/types/vaporTypes.ts';

import { DeleteCompoundButton } from './buttons/DeleteCompoundButton.tsx';
import { EditCompoundButton } from './buttons/EditCompoundButton.tsx';
import { PerformAnalysisButton } from './buttons/PerformAnalysisButton.tsx';

type CompoundRowProps = { model: VaporModel };
export const CompoundRow: FC<CompoundRowProps> = ({ model: { compound, model_name } }) => (
    <TableRow sx={{ '&:last-child td': { border: 0 } }}>
        <TableCell>{compound}</TableCell>
        <TableCell>{model_name}</TableCell>
        <TableCell>
            <PerformAnalysisButton compound={compound} />
            <EditCompoundButton compound={compound} />
            <DeleteCompoundButton compound={compound} model_name={model_name} />
        </TableCell>
    </TableRow>
);
