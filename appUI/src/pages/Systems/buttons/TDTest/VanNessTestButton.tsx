import { FC, useState } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select, Stack, Tooltip } from '@mui/material';
import { DatasetIdentifier } from '../../../../adapters/api/types/common.ts';
import { useData } from '../../../../contexts/DataContext.tsx';
import { useVanNessTestDialog } from '../../../../actions/VanNess/useVanNessTestDialog.tsx';

export const VanNessTestButton: FC<DatasetIdentifier> = (props) => {
    const { fitData } = useData();
    const systemName = `${props.compound1}-${props.compound2}`;
    const fitDataForSystem = fitData?.find((fit) => fit.system_name === systemName)?.fits ?? [];

    const [model_name, setModel_name] = useState<string>(fitDataForSystem[0]?.model_name ?? '');
    const { perform, result } = useVanNessTestDialog({ ...props, model_name });
    const [nextStep, setNextStep] = useState(false);
    const sendAndReset = () => {
        setNextStep(false);
        perform();
    };

    if (fitDataForSystem.length === 0)
        return (
            <Tooltip title="Requires a model Fitting">
                <div>
                    <Button fullWidth variant="contained" disabled>
                        Van Ness test
                    </Button>
                </div>
            </Tooltip>
        );

    const inputLabelId = `models-${systemName}`;

    const form = !nextStep ? (
        <Button variant="contained" onClick={() => setNextStep(true)}>
            Van Ness test
        </Button>
    ) : (
        <form onSubmit={sendAndReset}>
            <Stack direction="row" gap={1}>
                <FormControl fullWidth className="medium-input">
                    <InputLabel id={inputLabelId}>Model</InputLabel>
                    <Select
                        size="small"
                        labelId={inputLabelId}
                        label="Datasets"
                        value={model_name}
                        onChange={(e) => setModel_name(e.target.value)}
                    >
                        {fitDataForSystem.map((model) => (
                            <MenuItem
                                key={model.model_name}
                                value={model.model_name}
                                children={model.model_display_name}
                            />
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" onClick={sendAndReset}>
                    Run
                </Button>
            </Stack>
        </form>
    );

    return (
        <>
            {form}
            {result}
        </>
    );
};
