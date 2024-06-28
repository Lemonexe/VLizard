import { FC, FormEvent, useCallback, useState } from 'react';
import { DialogContent, InputAdornment, Stack, TextField, Tooltip } from '@mui/material';
import { useUoM_p, useUoM_T } from '../../adapters/logic/UoM.ts';
import { useVaporQuery } from '../../adapters/api/useVapor.ts';
import { VaporAnalysisResponse } from '../../adapters/api/types/vaporTypes.ts';
import { ResponsiveDialog } from '../../components/Mui/ResponsiveDialog.tsx';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { PlotWithDownload } from '../../components/charts/PlotWithDownload.tsx';
import { AnalysisWarnings } from '../../components/AnalysisResults/AnalysisWarnings.tsx';
import { toSigDgts } from '../../adapters/logic/numbers.ts';

type SubmitHandler = (e: FormEvent<HTMLFormElement>) => void;

type VaporAnalysisDialogProps = DialogProps & { data: VaporAnalysisResponse };

export const VaporAnalysisDialog: FC<VaporAnalysisDialogProps> = ({ data, open, handleClose }) => {
    const { convert_T, UoM_T } = useUoM_T();
    const { convert_p, UoM_p } = useUoM_p();
    const { mutateAsync } = useVaporQuery();
    const [query_T, setQuery_T] = useState('');
    const [query_p, setQuery_p] = useState('');

    const handleQuery_T = useCallback<SubmitHandler>(
        async (e) => {
            e.preventDefault();
            // TODO refactor UoMs, instead of convert_ do display_ & input_ for both way conversion!
            const T = parseFloat(query_T);
            if (isNaN(T)) return setQuery_p('');
            const { p } = await mutateAsync({ compound: data.compound, T });
            setQuery_p(toSigDgts(convert_p(p), 4));
        },
        [mutateAsync, query_T, convert_p],
    );
    const handleQuery_p = useCallback<SubmitHandler>(
        async (e) => {
            e.preventDefault();
            // TODO refactor UoMs, instead of convert_ do display_ & input_ for both way conversion!
            const p = parseFloat(query_p);
            if (isNaN(p)) return setQuery_T('');
            const { T } = await mutateAsync({ compound: data.compound, p });
            setQuery_T(toSigDgts(convert_T(T), 4));
        },
        [mutateAsync, query_p, convert_T],
    );

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

                <Stack direction="row" gap={1} mt={2} mb={1} alignItems="center">
                    <h4>Quick query TODO BROKEN:</h4>
                    <form onSubmit={handleQuery_T}>
                        <TextField
                            value={query_T}
                            onChange={(e) => setQuery_T(e.target.value)}
                            size="small"
                            className="num-input"
                            InputProps={{ endAdornment: <InputAdornment position="end">{UoM_T}</InputAdornment> }}
                        />
                    </form>
                    <form onSubmit={handleQuery_p}>
                        <TextField
                            value={query_p}
                            onChange={(e) => setQuery_p(e.target.value)}
                            size="small"
                            className="num-input"
                            InputProps={{ endAdornment: <InputAdornment position="end">{UoM_p}</InputAdornment> }}
                        />
                    </form>
                </Stack>
                <em style={{ color: '#555' }}>Hint: press Enter to have the other value calculated.</em>
            </DialogContent>
        </ResponsiveDialog>
    );
};
