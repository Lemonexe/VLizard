import { FC } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Loader } from '../../components/Loader.tsx';
import { useData } from '../../contexts/DataContext.tsx';
import { EmptyData } from '../../components/dataViews/EmptyData.tsx';
import { FittedModelRow } from './FittedModelRow.tsx';

type FittedModelsTableProps = { expandAll: boolean };

export const FittedModelsTable: FC<FittedModelsTableProps> = ({ expandAll }) => {
    const { fitData, VLEModelDefs, VLEData } = useData();

    if (!fitData || !VLEModelDefs || !VLEData) return <Loader subject="fitting data" />;
    if (fitData.length === 0)
        return <EmptyData children="Add a binary VLE system and its vapor pressure models to get started."></EmptyData>;

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell />
                    <TableCell>Compound 1</TableCell>
                    <TableCell>Compound 2</TableCell>
                    <TableCell>Fitted models</TableCell>
                    <TableCell />
                </TableRow>
            </TableHead>
            <TableBody>
                {fitData.map((fitsForSystem) => (
                    <FittedModelRow
                        key={fitsForSystem.system_name}
                        fitsForSystem={fitsForSystem}
                        expandAll={expandAll}
                    />
                ))}
            </TableBody>
        </Table>
    );
};
