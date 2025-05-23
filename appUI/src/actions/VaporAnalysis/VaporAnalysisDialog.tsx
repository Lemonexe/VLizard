import { DialogContent, InputAdornment, Stack, TextField, Tooltip } from '@mui/material';
import { ChangeEvent, FC, FormEvent, useState } from 'react';

import { VaporAnalysisResponse } from '../../adapters/api/types/vaporTypes.ts';
import { useVaporQuery } from '../../adapters/api/useVapor.ts';
import { display_T, display_p, input_T, input_p } from '../../adapters/logic/UoM.ts';
import { sanitizeNumStr, toSigDgts } from '../../adapters/logic/numbers.ts';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { AnalysisWarnings } from '../../components/AnalysisResults/AnalysisWarnings.tsx';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { ResponsiveDialog } from '../../components/Mui/ResponsiveDialog.tsx';
import { PlotWithDownload } from '../../components/charts/PlotWithDownload.tsx';
import { useConfig } from '../../contexts/ConfigContext.tsx';

type SubmitHandler = (e: FormEvent<HTMLFormElement>) => void;

type VaporAnalysisDialogProps = DialogProps & { data: VaporAnalysisResponse };

export const VaporAnalysisDialog: FC<VaporAnalysisDialogProps> = ({ data, open, handleClose }) => {
    const { UoM_T, UoM_p } = useConfig();

    const { mutateAsync } = useVaporQuery();
    const [query_T, setQuery_T] = useState('');
    const [query_p, setQuery_p] = useState('');

    const handleQuery_T: SubmitHandler = async (e) => {
        e.preventDefault();
        const T = input_T(parseFloat(sanitizeNumStr(query_T)), UoM_T);
        if (isNaN(T)) return;
        const { p } = await mutateAsync({ compound: data.compound, T });
        setQuery_p(toSigDgts(display_p(p, UoM_p), 4));
    };
    const handleQuery_p: SubmitHandler = async (e) => {
        e.preventDefault();
        const p = input_p(parseFloat(sanitizeNumStr(query_p)), UoM_p);
        if (isNaN(p)) return;
        const { T } = await mutateAsync({ compound: data.compound, p });
        setQuery_T(toSigDgts(display_T(T, UoM_T)));
    };

    const handleChange_T = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery_T(e.target.value);
        setQuery_p('');
    };
    const handleChange_p = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery_p(e.target.value);
        setQuery_T('');
    };

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
                                <td>{toSigDgts(display_T(data.T_min, UoM_T))} {UoM_T}</td>
                            </tr>
                        </Tooltip>
                        <Tooltip title="Temperature range covered by data">
                            <tr>
                                <td><i>T</i><sub>max</sub></td>
                                <td>{toSigDgts(display_T(data.T_max, UoM_T))} {UoM_T}</td>
                            </tr>
                        </Tooltip>
                        <Tooltip title="Calculated normal boiling point">
                            <tr>
                                <td><i>T</i><sub>boil</sub></td>
                                <td>{toSigDgts(display_T(data.T_boil, UoM_T))} {UoM_T}</td>
                            </tr>
                        </Tooltip>
                    </tbody>
                </table>

                <PlotWithDownload svgContent={data.plot} fileName={`chart ${data.compound} ${data.model_name}`} />

                <Stack direction="row" gap={1} mt={2} mb={1} alignItems="center">
                    <h4>Quick query:</h4>
                    <form onSubmit={handleQuery_T}>
                        <TextField
                            value={query_T}
                            onChange={handleChange_T}
                            size="small"
                            className="num-input"
                            slotProps={{
                                input: { endAdornment: <InputAdornment position="end">{UoM_T}</InputAdornment> },
                            }}
                        />
                    </form>
                    <form onSubmit={handleQuery_p}>
                        <TextField
                            value={query_p}
                            onChange={handleChange_p}
                            size="small"
                            className="num-input"
                            slotProps={{
                                input: { endAdornment: <InputAdornment position="end">{UoM_p}</InputAdornment> },
                            }}
                        />
                    </form>
                </Stack>
                <em style={{ color: '#555' }}>Hint: press Enter to have the other value calculated.</em>
            </DialogContent>
        </ResponsiveDialog>
    );
};
