import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { FC } from 'react';

import { Loader } from '../../components/Loader.tsx';
import { EmptyData } from '../../components/dataViews/EmptyData.tsx';
import { useData } from '../../contexts/DataContext.tsx';

import { CompoundRow } from './CompoundRow.tsx';

type CompoundsTableProps = { filter: string };

export const CompoundsTable: FC<CompoundsTableProps> = ({ filter }) => {
    const { vaporData, vaporDefs } = useData();

    if (!vaporData || !vaporDefs) return <Loader subject="compounds" />;
    if (vaporData.length === 0) return <EmptyData children="Click Add New to get started." />;

    const finalData = vaporData.filter(
        ({ compound }) => filter.length === 0 || compound.toLowerCase().includes(filter.toLowerCase()),
    );

    if (finalData.length === 0) return <EmptyData children="Clear the Filter to see your data." />;

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
                {finalData.map((model) => (
                    <CompoundRow key={model.compound} model={model} />
                ))}
            </TableBody>
        </Table>
    );
};
