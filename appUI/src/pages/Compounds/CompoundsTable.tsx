import { FC } from 'react';
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from '@mui/material';
import { Edit, QueryStats } from '@mui/icons-material';
import { useData } from '../../contexts/DataContext.tsx';
import { VaporModel } from '../../adapters/api/types/vapor.ts';
import { DeleteCompoundButton } from './DeleteCompoundButton.tsx';

type CompoundRowProps = { model: VaporModel };

const CompoundRow: FC<CompoundRowProps> = ({ model: { compound, model_name } }) => (
    <TableRow sx={{ '&:last-child td': { border: 0 } }}>
        <TableCell>{compound}</TableCell>
        <TableCell>
            {model_name}
            <Tooltip title="Change or edit vapor pressure model">
                <IconButton children={<Edit />} />
            </Tooltip>
        </TableCell>
        <TableCell>
            <Tooltip title="Perform analysis">
                <IconButton children={<QueryStats />} />
            </Tooltip>
            <DeleteCompoundButton compound={compound} model_name={model_name} />
        </TableCell>
    </TableRow>
);

export const CompoundsTable: FC = () => {
    const { vaporData } = useData();

    if (!vaporData) return 'Loading...';

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell style={{ width: 150 }}>Model</TableCell>
                    <TableCell style={{ width: 150 }}>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {vaporData.map((model) => (
                    <CompoundRow key={model.compound} model={model} />
                ))}
            </TableBody>
        </Table>
    );
};
