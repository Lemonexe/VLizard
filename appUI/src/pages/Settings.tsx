import { ChangeEvent, Dispatch, FC, FormEvent, SetStateAction, useCallback, useState } from 'react';
import { Button, Checkbox, FormControlLabel, Stack, Tab, Tabs, TextField } from '@mui/material';
import { TextFieldProps } from '@mui/material/TextField/TextField';
import { useNotifications } from '../contexts/NotificationContext.tsx';
import { useConfig } from '../contexts/ConfigContext.tsx';
import { useUpdateConfig } from '../adapters/api/useConfigApi.ts';
import { Config } from '../adapters/api/types/configTypes.tsx';
import { DefaultLayout } from '../components/DefaultLayout.tsx';
import { HeaderStack } from '../components/Mui/HeaderStack.tsx';
import { spacingN } from '../contexts/MUITheme.tsx';

type CreatePropsFn = (key: keyof Config, isPercent?: boolean) => Partial<TextFieldProps>;

/**
 * HOF that returns a function that creates props for a numerical TextField for a given config key. IKR?
 */
function getCreateTextProps(formConfig: Config, setFormConfig: Dispatch<SetStateAction<Config>>): CreatePropsFn {
    return (key, isPercent) => ({
        style: { marginTop: spacingN(0.5) },
        className: 'num-input',
        size: 'small',
        value: formConfig[key],
        onChange: (e: ChangeEvent<HTMLInputElement>) => setFormConfig((prev) => ({ ...prev, [key]: e.target.value })),
        InputProps: isPercent ? { endAdornment: <span>%</span> } : undefined,
    });
}

type TabProps = {
    formConfig: Config;
    setFormConfig: Dispatch<SetStateAction<Config>>;
};

const CalculationSettings: FC<TabProps> = ({ formConfig, setFormConfig }) => {
    const createTextProps = getCreateTextProps(formConfig, setFormConfig);
    return (
        <Stack direction="column" gap={2.5} pt={3}>
            <div>
                Tolerance for exceeding model temperature bounds, otherwise warning <em>(% of temp interval)</em>
                <br />
                <TextField {...createTextProps('T_bounds_rel_tol', true)} />
            </div>
            <div>
                <strong>Fredenslund</strong>: default Legendre polynomial order <em>(permissible 3, 4 or 5)</em>
                <br />
                <TextField {...createTextProps('default_legendre_order')} />
            </div>
            <div>
                <strong>Fredenslund</strong>: % threshold for average residuals{' '}
                <em>(data declared inconsistent when greater)</em>
                <br />
                <TextField {...createTextProps('fredenslund_criterion', true)} />
            </div>
            <div>
                <strong>Redlich-Kister</strong>: % threshold for |D| <em>(data declared inconsistent when greater)</em>
                <br />
                <TextField {...createTextProps('rk_D_criterion', true)} />
            </div>
            <div>
                <strong>Herington</strong>: % threshold for |D-J| <em>(data declared inconsistent when greater)</em>
                <br />
                <TextField {...createTextProps('herington_DJ_criterion', true)} />
            </div>
            <div>
                <strong>Gamma test</strong>: Absolute tolerance of activity coefficient deviation from 1
                <br />
                <TextField {...createTextProps('gamma_abs_tol')} />
            </div>
            <div>
                <strong>Area tests</strong> (RK, Herington): relative tolerance for curve integration error
                <br />
                <TextField {...createTextProps('rk_quad_rel_tol')} />
            </div>
        </Stack>
    );
};

const UISettings: FC<TabProps> = ({ formConfig, setFormConfig }) => {
    const createTextProps = getCreateTextProps(formConfig, setFormConfig);
    // create props for a checkbox
    const createCBProps = (key: keyof Config) => ({
        checked: Boolean(formConfig[key]),
        onChange: (e: ChangeEvent<HTMLInputElement>) => setFormConfig((prev) => ({ ...prev, [key]: e.target.checked })),
    });
    return (
        <Stack direction="column" gap={2.5} pt={3}>
            <FormControlLabel
                control={<Checkbox {...createCBProps('UI_expandAll')} />}
                label="Always expand all data subtables"
            />
            <FormControlLabel control={<Checkbox {...createCBProps('chart_title')} />} label="Show chart title" />
            <FormControlLabel control={<Checkbox {...createCBProps('chart_legend')} />} label="Show chart legend" />

            <div>
                Aspect ratio for all charts <em>(set 1.0 for square)</em>
                <br />
                <TextField {...createTextProps('chart_aspect_ratio', false)} />
            </div>
        </Stack>
    );
};

export const Settings: FC = () => {
    const initConfig = useConfig();
    const { mutate } = useUpdateConfig();
    const pushNotification = useNotifications();
    const [tab, setTab] = useState(0);

    // TS is not accurate for formConfig, numbers will be turned to strings by MUI
    const [formConfig, setFormConfig] = useState<Config>({ ...initConfig });

    const handleSubmit = useCallback(
        (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const patchConfig: Record<string, number | boolean> = {};
            for (const key of Object.keys(formConfig)) {
                const initVal = initConfig[key as keyof Config];
                const currVal = formConfig[key as keyof Config];
                // if initVal was a number, a number is expected, so try to cast
                const castVal = typeof initVal === 'number' ? Number(currVal) : currVal;
                if (isNaN(Number(castVal))) {
                    pushNotification({ message: `${key} must be number, got ${currVal}`, severity: 'error' });
                    return;
                }
                // push if changed
                if (castVal !== initVal) patchConfig[key] = castVal;
            }
            mutate(patchConfig);
        },
        [formConfig, mutate],
    );

    return (
        <DefaultLayout>
            <HeaderStack>
                <h2>Settings</h2>
            </HeaderStack>
            <Tabs value={tab} onChange={(_e, newValue) => setTab(newValue)}>
                <Tab label="Calculations" />
                <Tab label="UI & Charts" />
            </Tabs>
            <form onSubmit={handleSubmit}>
                {tab === 0 && <CalculationSettings formConfig={formConfig} setFormConfig={setFormConfig} />}
                {tab === 1 && <UISettings formConfig={formConfig} setFormConfig={setFormConfig} />}
                <Button type="submit" variant="contained" style={{ width: 'fit-content' }} sx={{ mt: 4 }}>
                    Save settings
                </Button>
            </form>
        </DefaultLayout>
    );
};
