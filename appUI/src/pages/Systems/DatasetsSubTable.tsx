import { Table, TableBody, TableHead, TableRow } from '@mui/material';
import { FC } from 'react';

import { DatasetTable } from '../../adapters/api/types/VLETypes.ts';
import { SystemIdentifier } from '../../adapters/api/types/common.ts';
import { DenseTableCell, DenseTableHeadCell } from '../../components/Mui/TableComponents.tsx';

import { DeleteDatasetButton } from './buttons/DeleteDatasetButton.tsx';
import { EditDatasetButton } from './buttons/EditDatasetButton.tsx';
import { PerformTDTestButton } from './buttons/PerformAnalysisButton.tsx';
import { VLEAnalysisIconButton } from './buttons/TDTest/VLEAnalysisButton.tsx';

type DatasetsSubTableProps = SystemIdentifier & { datasets: DatasetTable[] };

export const DatasetsSubTable: FC<DatasetsSubTableProps> = ({ compound1, compound2, datasets }) => (
    <Table>
        <TableHead>
            <TableRow>
                <DenseTableHeadCell>Dataset</DenseTableHeadCell>
                <DenseTableHeadCell>Points</DenseTableHeadCell>
                <DenseTableHeadCell />
            </TableRow>
        </TableHead>
        <TableBody>
            {datasets.map((dataset) => (
                <TableRow key={dataset.name}>
                    <DenseTableCell>{dataset.name}</DenseTableCell>
                    <DenseTableCell>{dataset.x_1.length}</DenseTableCell>
                    <DenseTableCell>
                        <PerformTDTestButton compound1={compound1} compound2={compound2} dataset={dataset.name} />
                        <VLEAnalysisIconButton compound1={compound1} compound2={compound2} dataset={dataset.name} />
                        <EditDatasetButton compound1={compound1} compound2={compound2} dataset={dataset.name} />
                        <DeleteDatasetButton compound1={compound1} compound2={compound2} dataset={dataset.name} />
                    </DenseTableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);
