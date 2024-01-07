import { FC } from 'react';
import { IconButton, styled, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from '@mui/material';
import { QueryStats, TableView } from '@mui/icons-material';
import { DatasetTable } from '../../adapters/api/types/VLE.ts';
import { DeleteDatasetButton } from './DeleteDatasetButton.tsx';

const DenseTableCell = styled(TableCell)(({ theme }) => ({
    padding: theme.spacing(0.25),
    border: 'unset',
}));

const DenseTableHeadCell = styled(TableCell)(({ theme }) => ({
    padding: theme.spacing(0.5),
    border: 'unset',
}));

type DatasetsSubTableProps = { compound1: string; compound2: string; datasets: DatasetTable[] };

export const DatasetsSubTable: FC<DatasetsSubTableProps> = ({ compound1, compound2, datasets }) => (
    <Table>
        <TableHead>
            <TableRow>
                <DenseTableHeadCell>Dataset</DenseTableHeadCell>
                <DenseTableHeadCell>Points</DenseTableHeadCell>
                <DenseTableHeadCell>Actions</DenseTableHeadCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {datasets.map((dataset) => (
                <TableRow key={dataset.name}>
                    <DenseTableCell>{dataset.name}</DenseTableCell>
                    <DenseTableCell>{dataset.x_1.length}</DenseTableCell>
                    <DenseTableCell>
                        <Tooltip title="Perform analysis">
                            <IconButton children={<QueryStats />} />
                        </Tooltip>
                        <Tooltip title="Edit dataset table">
                            <IconButton children={<TableView />} />
                        </Tooltip>
                        <DeleteDatasetButton compound1={compound1} compound2={compound2} dataset={dataset.name} />
                    </DenseTableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);
