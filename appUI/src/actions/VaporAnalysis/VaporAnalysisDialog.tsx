import { FC } from 'react';
import { DialogContent, Tooltip } from '@mui/material';
import { useUoM_T } from '../../adapters/logic/UoM.ts';
import { VaporAnalysisResponse } from '../../adapters/api/types/vaporTypes.ts';
import { ResponsiveDialog } from '../../components/Mui/ResponsiveDialog.tsx';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { PlotWithDownload } from '../../components/charts/PlotWithDownload.tsx';
import { AnalysisWarnings } from '../../components/AnalysisResults/AnalysisWarnings.tsx';

type VaporAnalysisDialogProps = DialogProps & { data: VaporAnalysisResponse };

export const VaporAnalysisDialog: FC<VaporAnalysisDialogProps> = ({ data, open, handleClose }) => {
    const { convert_T, UoM_T } = useUoM_T();
    return (
        <ResponsiveDialog maxWidth="md" open={open} onClose={handleClose}>
            <DialogTitleWithX handleClose={handleClose}>Vapor pressure analysis for {data.compound}</DialogTitleWithX>
            <DialogContent>
                <AnalysisWarnings warnings={data.warnings} />

                <p>Model: {data.model_name}</p>

                {/* prettier-ignore */}
                <table>
                    <tbody>
                        <Tooltip title="Temperature range covered by data">
                            <tr>
                                <td width="70"><i>T</i><sub>min</sub></td>
                                <td>{convert_T(data.T_min).toFixed(1)} {UoM_T}</td>
                            </tr>
                        </Tooltip>
                        <Tooltip title="Temperature range covered by data">
                            <tr>
                                <td><i>T</i><sub>max</sub></td>
                                <td>{convert_T(data.T_max).toFixed(1)} {UoM_T}</td>
                            </tr>
                        </Tooltip>
                        <Tooltip title="Calculated normal boiling point">
                            <tr>
                                <td><i>T</i><sub>boil</sub></td>
                                <td>{convert_T(data.T_boil).toFixed(1)} {UoM_T}</td>
                            </tr>
                        </Tooltip>
                    </tbody>
                </table>

                <PlotWithDownload svgContent={data.plot} fileName={`chart ${data.compound} ${data.model_name}`} />
            </DialogContent>
        </ResponsiveDialog>
    );
};
