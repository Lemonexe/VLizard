import { Table, TableBody, TableRow } from '@mui/material';
import { FC, useMemo } from 'react';

import { PersistedFitsForSystem } from '../../adapters/api/types/fitTypes.ts';
import { DenseTableCell } from '../../components/Mui/TableComponents.tsx';
import { useData } from '../../contexts/DataContext.tsx';

import { AlterFittedModelButton } from './buttons/AlterFittedModelButton.tsx';
import { DeleteFittedModelButton } from './buttons/DeleteFittedModelButton.tsx';
import { PlotFittedModelButton } from './buttons/PlotFittedModelButton.tsx';
import { TabulateModelButton } from './buttons/TabulateModelButton.tsx';

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
                            <TabulateModelButton compound1={comp1} compound2={comp2} fit={fit} />
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
