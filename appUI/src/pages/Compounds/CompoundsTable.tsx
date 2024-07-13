import { FC, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Loader } from '../../components/Loader.tsx';
import { useData } from '../../contexts/DataContext.tsx';
import { EmptyData } from '../../components/dataViews/EmptyData.tsx';
import { CompoundRow } from './CompoundRow.tsx';

type CompoundsTableProps = { filter: string };

export const CompoundsTable: FC<CompoundsTableProps> = ({ filter }) => {
    const { vaporData, vaporDefs } = useData();

    const finalData = useMemo(
        () =>
            vaporData?.filter(
                ({ compound }) => filter.length === 0 || compound.toLowerCase().includes(filter.toLowerCase()),
            ),
        [vaporData, filter],
    );

    if (!vaporData || !finalData || !vaporDefs) return <Loader subject="compounds" />;
    if (vaporData.length === 0) return <EmptyData children="Click Add New to get started." />;
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
