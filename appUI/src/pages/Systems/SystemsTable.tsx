import { FC } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useData } from '../../contexts/DataContext.tsx';
import { SystemRow } from './SystemRow.tsx';

export const SystemsTable: FC = () => {
    const { VLEData } = useData();

    if (!VLEData) return 'Loading...';

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell />
                    <TableCell>Compound 1</TableCell>
                    <TableCell>Compound 2</TableCell>
                    <TableCell>Datasets</TableCell>
                    <TableCell>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {VLEData.map((system) => (
                    <SystemRow key={system.system_name} model={system} />
                ))}
            </TableBody>
        </Table>
    );
};
