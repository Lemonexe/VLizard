import { FC, FormEvent, useMemo, useState } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select, Stack, Tooltip } from '@mui/material';
import { DatasetIdentifier } from '../../../../adapters/api/types/common.ts';
import { useData } from '../../../../contexts/DataContext.tsx';
import { useVanNessTestDialog } from '../../../../actions/VanNess/useVanNessTestDialog.tsx';

export const VanNessTestButton: FC<DatasetIdentifier> = (props) => {
    const { listFitsForSystem, findVLEModelByName } = useData();
    const fitDataForSystem = useMemo(() => listFitsForSystem(props.compound1, props.compound2), [props]);

    const [model_name, setModel_name] = useState<string>(fitDataForSystem[0]?.model_name ?? '');
    const { perform, result } = useVanNessTestDialog({ ...props, model_name });
    const [nextStep, setNextStep] = useState(false);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setNextStep(false);
        perform();
    };

    const menuItems = useMemo(
        () =>
            fitDataForSystem.map(({ model_name: name }) => {
                const displayName = findVLEModelByName(name)?.display_name ?? name;
                return <MenuItem key={name} value={name} children={displayName} />;
            }),
        [fitDataForSystem],
    );

    if (fitDataForSystem.length === 0) {
        return (
            <Tooltip title="Requires a model Fitting" placement="right">
                <div>
                    <Button fullWidth variant="contained" disabled>
                        Van Ness test
                    </Button>
                </div>
            </Tooltip>
        );
    }

    const inputLabelId = `models-${props.compound1}-${props.compound2}`;

    const form = !nextStep ? (
        <Button variant="contained" onClick={() => setNextStep(true)}>
            Van Ness test
        </Button>
    ) : (
        <form onSubmit={handleSubmit}>
            <Stack direction="row" gap={1}>
                <FormControl fullWidth className="medium-input">
                    <InputLabel id={inputLabelId}>Model</InputLabel>
                    <Select
                        size="small"
                        labelId={inputLabelId}
                        label="Datasets"
                        value={model_name}
                        onChange={(e) => setModel_name(e.target.value)}
                        children={menuItems}
                    />
                </FormControl>
                <Button type="submit" variant="contained">
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
