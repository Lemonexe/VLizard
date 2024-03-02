import { FC } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Loader } from '../../components/Loader.tsx';
import { useData } from '../../contexts/DataContext.tsx';
import { EmptyData } from '../../components/dataViews/EmptyData.tsx';
import { CompoundRow } from './CompoundRow.tsx';

export const CompoundsTable: FC = () => {
    const { vaporData, vaporDefs } = useData();

    if (!vaporData || !vaporDefs) return <Loader />;
    if (vaporData.length === 0) return <EmptyData children="Click Add New to get started." />;

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
