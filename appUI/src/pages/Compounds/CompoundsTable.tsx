import { FC } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useData } from '../../contexts/DataContext.tsx';
import { CompoundRow } from './CompoundRow.tsx';

export const CompoundsTable: FC = () => {
    const { vaporData } = useData();

    if (!vaporData) return 'Loading...';

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell style={{ width: 150 }}>Model</TableCell>
                    <TableCell style={{ width: 150 }} />
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
