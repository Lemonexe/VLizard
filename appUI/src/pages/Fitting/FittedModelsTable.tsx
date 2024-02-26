import { FC } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useData } from '../../contexts/DataContext.tsx';
import { FittedModelRow } from './FittedModelRow.tsx';

type FittedModelsTableProps = { expandAll: boolean };

export const FittedModelsTable: FC<FittedModelsTableProps> = ({ expandAll }) => {
    const { fitData, VLEModelDefs } = useData();

    if (!fitData || !VLEModelDefs) return 'Loading...';

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
