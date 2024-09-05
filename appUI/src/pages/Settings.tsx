import { ChangeEvent, FC, FormEvent, useState } from 'react';
import {
    Button,
    Checkbox,
    CheckboxProps,
    FormControlLabel,
    MenuItem,
    Select,
    SelectProps,
    Stack,
    Tab,
    Tabs,
    TextField,
    TextFieldProps,
} from '@mui/material';
import { useNotifications } from '../contexts/NotificationContext.tsx';
import { useConfig } from '../contexts/ConfigContext.tsx';
import { useUpdateConfig } from '../adapters/api/useConfigApi.ts';
import { Config } from '../adapters/api/types/configTypes.tsx';
import { DefaultLayout } from '../components/DefaultLayout.tsx';
import { HeaderStack } from '../components/Mui/HeaderStack.tsx';
import { spacingN } from '../contexts/MUITheme.tsx';
import { p_units } from '../adapters/logic/UoM.ts';
import { sanitizeNumStr } from '../adapters/logic/numbers.ts';

type PatchConfigFn = (key: keyof Config, value: string | number | boolean) => void;
type ChE = ChangeEvent<HTMLInputElement>;
/**
 * HOF that returns a function that creates props for a numerical TextField for a given config key.
 * Cray innit?
 */
type GeneratorFn<T> = (formConfig: Config, patchConfig: PatchConfigFn, handleBlur?: () => void) => T;

type CreateTFPropsFn = (key: keyof Config, isPercent?: boolean) => Partial<TextFieldProps>;
const getCreateTFProps: GeneratorFn<CreateTFPropsFn> = (formConfig, patchConfig, send) => {
    return (key, isPercent) => ({
        style: { marginTop: spacingN(0.5) },
        className: 'num-input',
        size: 'small',
        value: formConfig[key],
        onChange: (e: ChE) => patchConfig(key, e.target.value),
        onBlur: send,
        InputProps: isPercent ? { endAdornment: <span>%</span> } : undefined,
    });
};

// same for Checkbox
type CreateCBPropsFn = (key: keyof Config) => Partial<CheckboxProps>;
const getCreateCBProps: GeneratorFn<CreateCBPropsFn> = (formConfig, patchConfig, send) => {
    return (key) => ({
        checked: Boolean(formConfig[key]),
        onChange: (e: ChE) => patchConfig(key, e.target.checked),
        onBlur: send,
    });
};

// same for Select
type CreateSelectPropsFn = (key: keyof Config) => Partial<SelectProps>;
const getCreateSelectProps: GeneratorFn<CreateSelectPropsFn> = (formConfig, patchConfig, send) => {
    return (key) => ({
        size: 'small',
        sx: { ml: 2, mb: 1 },
        className: 'num-input',
        value: formConfig[key],
        onChange: (e) => patchConfig(key, e.target.value as string),
        onBlur: send,
    });
};

type TabProps = {
    formConfig: Config;
    patchConfig: PatchConfigFn;
    send: () => void;
};

const CalcSettings: FC<TabProps> = ({ formConfig, patchConfig, send }) => {
    const createTFProps = getCreateTFProps(formConfig, patchConfig, send);
    return (
        <Stack direction="column" gap={2.5} pt={3}>
            <div>
                Tolerance for exceeding model temperature bounds, otherwise warning <em>(% of temp interval)</em>
                <br />
                <TextField {...createTFProps('T_bounds_rel_tol', true)} />
            </div>
            <div>
                <strong>Fredenslund</strong>: default Legendre polynomial order <em>(permissible 3, 4 or 5)</em>
                <br />
                <TextField {...createTFProps('default_legendre_order')} />
            </div>
            <div>
                <strong>Fredenslund</strong>: % threshold for average residuals{' '}
                <em>(data declared inconsistent when greater)</em>
                <br />
                <TextField {...createTFProps('fredenslund_criterion', true)} />
            </div>
            <div>
                <strong>Redlich-Kister</strong>: % threshold for |D| <em>(data declared inconsistent when greater)</em>
                <br />
                <TextField {...createTFProps('rk_D_criterion', true)} />
            </div>
            <div>
                <strong>Herington</strong>: % threshold for |D-J| <em>(data declared inconsistent when greater)</em>
                <br />
                <TextField {...createTFProps('herington_DJ_criterion', true)} />
            </div>
            <div>
                <strong>Gamma test</strong>: Absolute tolerance of activity coefficient deviation from 1
                <br />
                <TextField {...createTFProps('gamma_abs_tol', true)} />
            </div>
            <div>
                <strong>Area tests</strong> (RK, Herington): relative tolerance for curve integration error
                <br />
                <TextField {...createTFProps('rk_quad_rel_tol')} />
            </div>
        </Stack>
    );
};

const UISettings: FC<TabProps> = ({ formConfig, patchConfig, send }) => {
    const createTFProps = getCreateTFProps(formConfig, patchConfig, send);
    const createCBProps = getCreateCBProps(formConfig, patchConfig, send);
    const createSlProps = getCreateSelectProps(formConfig, patchConfig, send);
    return (
        <Stack direction="column" gap={2.5} pt={3}>
            <div>
                <FormControlLabel
                    control={<Checkbox {...createCBProps('UI_expandAll')} />}
                    label="Always expand all data subtables"
                />
                <br />
                <FormControlLabel control={<Checkbox {...createCBProps('chart_title')} />} label="Show chart title" />
                <br />
                <FormControlLabel control={<Checkbox {...createCBProps('chart_legend')} />} label="Show chart legend" />
                <br />
                <FormControlLabel control={<Checkbox {...createCBProps('chart_grid')} />} label="Show chart grids" />
            </div>

            <div>
                Pressure units
                <Select {...createSlProps('UoM_p')}>
                    {Object.keys(p_units).map((unit) => (
                        <MenuItem key={unit} value={unit} children={unit} />
                    ))}
                </Select>
                <br />
                Temperature units
                <Select {...createSlProps('UoM_T')}>
                    <MenuItem value="K" children="K" />
                    <MenuItem value="°C" children="°C" />
                </Select>
            </div>

            <div>
                Aspect ratio for all charts <em>(set 1.0 for square)</em>
                <br />
                <TextField {...createTFProps('chart_aspect_ratio', false)} />
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
    const patchConfig: PatchConfigFn = (key, value) => setFormConfig((prev) => ({ ...prev, [key]: value }));

    const send = () => {
        const patch: Record<string, number | string | boolean> = {};
        let isEmpty = true;
        for (const k of Object.keys(formConfig)) {
            const key = k as keyof Config;
            const initVal = initConfig[key];
            const currVal = formConfig[key];
            const wasItNumber = typeof initVal === 'number'; // if initVal was a number, a number is expected, so try to cast
            const castVal = wasItNumber && typeof currVal === 'string' ? Number(sanitizeNumStr(currVal)) : currVal;
            if (wasItNumber && isNaN(Number(castVal))) {
                patchConfig(key, initVal);
                const message = `Ignored ${key} – must be number, got ${currVal}`;
                pushNotification({ message, severity: 'warning' });
                continue;
            }
            // push if changed
            if (castVal === initVal) continue;
            patch[key] = castVal;
            isEmpty = false;
        }

        if (isEmpty) return;
        mutate(patch);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        send();
    };

    return (
        <DefaultLayout>
            <HeaderStack>
                <h2>Settings</h2>
            </HeaderStack>
            <Tabs value={tab} onChange={(_e, newValue) => setTab(newValue)}>
                <Tab label="UI & Charts" />
                <Tab label="Calculations" />
            </Tabs>
            <form onSubmit={handleSubmit}>
                {tab === 0 && <UISettings formConfig={formConfig} patchConfig={patchConfig} send={send} />}
                {tab === 1 && <CalcSettings formConfig={formConfig} patchConfig={patchConfig} send={send} />}
                <Button type="submit" variant="contained" style={{ width: 'fit-content' }} sx={{ mt: 6 }}>
                    Save settings
                </Button>
            </form>
        </DefaultLayout>
    );
};
