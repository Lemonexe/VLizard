import { FC } from 'react';
import { Table, TableBody, TableRow } from '@mui/material';
import { DenseTableCell } from '../../components/Mui/TableComponents.tsx';
import { PlotFittedModelButton } from './buttons/PlotFittedModelButton.tsx';
import { AlterFittedModelButton } from './buttons/AlterFittedModelButton.tsx';
import { DeleteFittedModelButton } from './buttons/DeleteFittedModelButton.tsx';
import { PersistedFitsForSystem } from '../../adapters/api/types/fitTypes.ts';

type FitsSubTableProps = { fitsForSystem: PersistedFitsForSystem };

export const FitsSubTable: FC<FitsSubTableProps> = ({ fitsForSystem: { system_name, fits } }) => {
    const [comp1, comp2] = system_name.split('-');
    return (
        <Table>
            <TableBody>
                {fits.map((fit) => (
                    <TableRow key={fit.model_name}>
                        <DenseTableCell>{fit.model_name}</DenseTableCell>
                        <DenseTableCell>
                            <PlotFittedModelButton compound1={comp1} compound2={comp2} fit={fit} />
                            <AlterFittedModelButton compound1={comp1} compound2={comp2} fit={fit} />
                            <DeleteFittedModelButton compound1={comp1} compound2={comp2} model_name={fit.model_name} />
                        </DenseTableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
