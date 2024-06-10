import { FC } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Loader } from '../../components/Loader.tsx';
import { useData } from '../../contexts/DataContext.tsx';
import { EmptyData } from '../../components/dataViews/EmptyData.tsx';
import { SystemRow } from './SystemRow.tsx';

type SystemsTableProps = { expandAll: boolean };

export const SystemsTable: FC<SystemsTableProps> = ({ expandAll }) => {
    const { VLEData } = useData();

    if (!VLEData) return <Loader subject="binary systems" />;
    if (VLEData.length === 0) return <EmptyData children="Click Add New to get started." />;

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell />
                    <TableCell>Compound 1</TableCell>
                    <TableCell>Compound 2</TableCell>
                    <TableCell>Datasets</TableCell>
                    <TableCell />
                </TableRow>
            </TableHead>
            <TableBody>
                {VLEData.map((system) => (
                    <SystemRow key={system.system_name} model={system} expandAll={expandAll} />
                ))}
            </TableBody>
        </Table>
    );
};
