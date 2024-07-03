import { FC, useMemo } from 'react';
import { Table, TableBody, TableRow } from '@mui/material';
import { DenseTableCell } from '../../components/Mui/TableComponents.tsx';
import { PlotFittedModelButton } from './buttons/PlotFittedModelButton.tsx';
import { AlterFittedModelButton } from './buttons/AlterFittedModelButton.tsx';
import { DeleteFittedModelButton } from './buttons/DeleteFittedModelButton.tsx';
import { PersistedFitsForSystem } from '../../adapters/api/types/fitTypes.ts';
import { useData } from '../../contexts/DataContext.tsx';

type FitsSubTableProps = { fitsForSystem: PersistedFitsForSystem };

export const FitsSubTable: FC<FitsSubTableProps> = ({ fitsForSystem: { system_name, fits } }) => {
    const { findVLEModelByName } = useData();
    const [comp1, comp2] = system_name.split('-');

    const rows = useMemo(
        () =>
            fits.map((fit) => {
                const modelDisplayName = findVLEModelByName(fit.model_name)?.display_name ?? fit.model_name;
                return (
                    <TableRow key={fit.model_name}>
                        <DenseTableCell>{modelDisplayName} model</DenseTableCell>
                        <DenseTableCell>
                            <PlotFittedModelButton compound1={comp1} compound2={comp2} fit={fit} />
                            <AlterFittedModelButton compound1={comp1} compound2={comp2} fit={fit} />
                            <DeleteFittedModelButton compound1={comp1} compound2={comp2} model_name={fit.model_name} />
                        </DenseTableCell>
                    </TableRow>
                );
            }),
        [fits, comp1, comp2],
    );

    return (
        <Table>
            <TableBody>{rows}</TableBody>
        </Table>
    );
};
