import { ChangeEvent, FC, FormEvent, useCallback, useState } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import { TextFieldProps } from '@mui/material/TextField/TextField';
import { useNotifications } from '../contexts/NotificationContext.tsx';
import { useConfig } from '../contexts/ConfigContext.tsx';
import { useUpdateConfig } from '../adapters/api/useConfigApi.ts';
import { Config } from '../adapters/api/types/configTypes.tsx';
import { DefaultLayout } from '../components/DefaultLayout.tsx';
import { HeaderStack } from '../components/Mui/HeaderStack.tsx';
import { spacingN } from '../contexts/MUITheme.tsx';

export const Settings: FC = () => {
    const currentConfig = useConfig();
    const { mutate } = useUpdateConfig();
    const pushNotification = useNotifications();

    // TS is not accurate for cfg, numbers will be turned to strings by MUI
    const [cfg, setCfg] = useState({ ...currentConfig });

    const handleSubmit = useCallback(
        (e: FormEvent<HTMLFormElement>) => {
            const newCfg = { ...cfg };
            Object.entries(newCfg).forEach(([key, value]) => {
                if (isNaN(Number(value))) {
                    e.preventDefault();
                    pushNotification({ message: `All values must be number, got ${value}`, severity: 'error' });
                }
                newCfg[key as keyof Config] = Number(value);
                mutate(newCfg);
            });
        },
        [cfg],
    );

    const createProps = (key: keyof Config, isPercent?: boolean): Partial<TextFieldProps> => ({
        style: { width: 150, marginTop: spacingN(0.5) },
        size: 'small',
        value: cfg[key],
        onChange: (e: ChangeEvent<HTMLInputElement>) => setCfg((prev) => ({ ...prev, [key]: e.target.value })),
        InputProps: isPercent ? { endAdornment: <span>%</span> } : undefined,
    });

    return (
        <DefaultLayout>
            <HeaderStack>
                <h2>Settings</h2>
            </HeaderStack>
            <form onSubmit={handleSubmit}>
                <Stack direction="column" gap={2.5}>
                    <div>
                        Tolerance for exceeding model temperature bounds, otherwise warning{' '}
                        <em>(% of temp interval)</em>
                        <br />
                        <TextField {...createProps('T_bounds_rel_tol', true)} />
                    </div>
                    <div>
                        <strong>Fredenslund</strong>: default Legendre polynomial order <em>(permissible 3, 4 or 5)</em>
                        <br />
                        <TextField {...createProps('default_legendre_order')} />
                    </div>
                    <div>
                        <strong>Fredenslund</strong>: % threshold for average residuals{' '}
                        <em>(data declared inconsistent when greater)</em>
                        <br />
                        <TextField {...createProps('fredenslund_criterion', true)} />
                    </div>
                    <div>
                        <strong>Redlich-Kister</strong>: % threshold for |D|{' '}
                        <em>(data declared inconsistent when greater)</em>
                        <br />
                        <TextField {...createProps('rk_D_criterion', true)} />
                    </div>
                    <div>
                        <strong>Herington</strong>: % threshold for |D-J|{' '}
                        <em>(data declared inconsistent when greater)</em>
                        <br />
                        <TextField {...createProps('herington_DJ_criterion', true)} />
                    </div>
                    <div>
                        <strong>Gamma test</strong>: Absolute tolerance of activity coefficient deviation from 1
                        <br />
                        <TextField {...createProps('gamma_abs_tol')} />
                    </div>
                    <div>
                        <strong>Area tests</strong> (RK, Herington): relative tolerance for curve integration error
                        <br />
                        <TextField {...createProps('rk_quad_rel_tol')} />
                    </div>
                    <Button type="submit" variant="contained" style={{ width: 'fit-content' }}>
                        Save settings
                    </Button>
                </Stack>
            </form>
        </DefaultLayout>
    );
};
