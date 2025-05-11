import { FC } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Loader } from '../../components/Loader.tsx';
import { useData } from '../../contexts/DataContext.tsx';
import { GetVLESystemsResponse } from '../../adapters/api/types/VLETypes.ts';
import { EmptyData } from '../../components/dataViews/EmptyData.tsx';
import { SystemRow } from './SystemRow.tsx';

type FilterVLEDataResult = {
    finalData: GetVLESystemsResponse;
    isDsMatch?: boolean;
};

const filterVLEData = (VLEData: GetVLESystemsResponse, filter: string): FilterVLEDataResult => {
    if (filter.length === 0) return { finalData: VLEData };

    const filteredBySystemName = VLEData.filter(({ system_name }) =>
        // replace allows writing 'comp1 comp2'
        system_name.toLowerCase().includes(filter.toLowerCase().replace(/ +/g, '-')),
    );
    if (filteredBySystemName.length > 0) return { finalData: filteredBySystemName };

    const filteredByMatchingDatasets = VLEData.filter(({ datasets }) =>
        datasets.some(({ name }) => name.toLowerCase().includes(filter.toLowerCase())),
    );

    return { finalData: filteredByMatchingDatasets, isDsMatch: true };
};

type SystemsTableProps = { expandAll: boolean; filter: string };

export const SystemsTable: FC<SystemsTableProps> = ({ expandAll, filter }) => {
    const { VLEData } = useData();

    if (!VLEData) return <Loader subject="binary systems" />;
    if (VLEData.length === 0) return <EmptyData children="Click Add New to get started." />;

    const { finalData, isDsMatch } = filterVLEData(VLEData, filter);

    if (finalData.length === 0) return <EmptyData children="Clear the Filter to see your data." />;

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
                {finalData.map((system) => (
                    <SystemRow key={system.system_name} model={system} expandAll={expandAll || Boolean(isDsMatch)} />
                ))}
            </TableBody>
        </Table>
    );
};
