import { FC, useMemo } from 'react';
import { DialogContent } from '@mui/material';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { ResponsiveDialog } from '../../components/Mui/ResponsiveDialog.tsx';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { useConfig } from '../../contexts/ConfigContext.tsx';
import { VanNessTestRequest, VanNessTestResponse } from '../../adapters/api/types/TDTestTypes.ts';
import { ConsistencyResult } from '../../components/AnalysisResults/ConsistencyResult.tsx';
import { PlotWithDownload } from '../../components/charts/PlotWithDownload.tsx';
import { ResultsDisplayTable } from '../../components/Spreadsheet/ResultsDisplayTable.tsx';
import { toPercent } from '../../adapters/logic/numbers.ts';
import { useData } from '../../contexts/DataContext.tsx';

const columnLabels = ['x1', 'residual'];

type VanNessTestDialogProps = DialogProps & { req: VanNessTestRequest; data: VanNessTestResponse };

export const VanNessTestDialog: FC<VanNessTestDialogProps> = ({ open, handleClose, req, data }) => {
    const { findVLEModelByName } = useData();
    // findVLEModel is guaranteed; the procedure has just been successfully invoked
    const modelDisplayName = useMemo(() => findVLEModelByName(req.model_name)!.display_name, [req.model_name]);
    const label = `${req.compound1}-${req.compound2} ${req.dataset} & ${modelDisplayName}`;

    const { van_Ness_marking_interval, van_Ness_max_mark } = useConfig();

    const max_RMS = (van_Ness_max_mark - 1) * van_Ness_marking_interval;
    const reasons = [
        `Consistency index ${data.is_consistent ? 'is' : 'must be'} < ${van_Ness_max_mark}, meaning RMS < ${toPercent(max_RMS, 1)}`,
    ];
    const currentMarkLowerBound = van_Ness_marking_interval * (data.consistency_index - 1);
    const currentMarkUpperBound = van_Ness_marking_interval * data.consistency_index;

    const dataColumns = useMemo(() => [data.x_1, data.residuals], [data]);

    return (
        <ResponsiveDialog maxWidth="lg" fullWidth open={open} onClose={handleClose}>
            <DialogTitleWithX handleClose={handleClose}>van Ness test for {label}</DialogTitleWithX>
            <DialogContent>
                <ConsistencyResult warnings={data.warnings} is_consistent={data.is_consistent} reasons={reasons} />
                <p>Consistency index = {data.consistency_index} </p>
                <p>Root mean square = {toPercent(data.RMS, 2)}</p>
                <p>
                    <em>
                        Consistency index is ranked from 1 (perfect) to {van_Ness_max_mark} (unacceptable).
                        <br />
                        The interval for {data.consistency_index} is {toPercent(currentMarkLowerBound, 1)} &lt; RMS &le;{' '}
                        {toPercent(currentMarkUpperBound, 1)}
                    </em>
                </p>
                <ResultsDisplayTable rawDataColumns={dataColumns} columnLabels={columnLabels} />
                <h4 className="h-margin">Residuals plot</h4>
                <PlotWithDownload svgContent={data.plot} fileName={`van Ness test chart ${label}`} />
            </DialogContent>
        </ResponsiveDialog>
    );
};
