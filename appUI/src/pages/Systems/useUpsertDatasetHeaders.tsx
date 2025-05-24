import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { Box, IconButton, MenuItem, Select, styled } from '@mui/material';
import { FC, PropsWithChildren, ReactNode, useCallback, useMemo, useState } from 'react';

import { input_T_vec, input_p_vec, input_x_vec, p_units } from '../../adapters/logic/UoM.ts';
import { truncateSigDgts } from '../../adapters/logic/numbers.ts';
import { spacingN } from '../../contexts/MUITheme.tsx';

// Display UoM label for dimensionless quantities x,y
const get_xy_label = (label: string, UoM: string) => label + (UoM === '1' ? '' : `/${UoM}`);

const MAX_SIG_DGTS = 10; // enough for any practical purpose, enough to mitigate unsightly floating point errors
// Truncate all numbers to a maximal number of sig digits
const truncate = (vec: number[]) => vec.map((x) => truncateSigDgts(x, MAX_SIG_DGTS));

// Throw if some values are negative
const validatePositive = (label: string, vec: number[]) => {
    if (vec.some((x) => x <= 0)) throw new Error(`All ${label} values must > 0`);
};

// Throw if some values aren't within [0,1]
const validate_xy = (label: string, vec: number[]) => {
    if (vec.some((x) => x <= 0 || x >= 1)) throw new Error(`All ${label} values must be between 0 and 1, exclusive!`);
};

// Move an array element left or right in the group
const move = (arr: number[], i: number, dir: 1 | -1) => {
    arr = [...arr];
    [arr[i + dir], arr[i]] = [arr[i], arr[i + dir]];
    return arr;
};

const HeaderBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.dark,
    borderRadius: spacingN(2),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
}));

export const useUpsertDatasetHeaders = () => {
    // apparent indices chosen by the user for the original columns p, T, x1, y1
    const [columnsOrder, setColumnsOrder] = useState([0, 1, 2, 3]);
    const [UoM_T, setUoM_T] = useState('K');
    const [UoM_p, setUoM_p] = useState('kPa');
    const [UoM_x1, setUoM_x1] = useState('1');
    const [UoM_y1, setUoM_y1] = useState('1');

    const renderDeps = [columnsOrder, UoM_T, UoM_p, UoM_x1, UoM_y1];

    const convertTableUoMs = useCallback((data: number[][]): number[][] => {
        const dataNew = Array(4).fill(null);
        for (let i = 0; i < columnsOrder.length; i++) dataNew[columnsOrder[i]] = [...data[i]];
        dataNew[0] = truncate(input_p_vec(dataNew[0], UoM_p));
        validatePositive('p', dataNew[0]);
        dataNew[1] = truncate(input_T_vec(dataNew[1], UoM_T));
        validatePositive('T', dataNew[1]);
        dataNew[2] = truncate(input_x_vec(dataNew[2], UoM_x1));
        validate_xy('x1', dataNew[2]);
        dataNew[3] = truncate(input_x_vec(dataNew[3], UoM_y1));
        validate_xy('y1', dataNew[3]);
        return dataNew;
    }, renderDeps);

    const headerComponents = useMemo<ReactNode[]>(() => {
        const MovableBox: FC<PropsWithChildren<{ which: number }>> = ({ children, which }) => {
            const i = columnsOrder.indexOf(which); // apparent index as per columnsOrder – the user's choice
            const moveLeft = () => setColumnsOrder(move(columnsOrder, i, -1));
            const moveRight = () => setColumnsOrder(move(columnsOrder, i, 1));
            return (
                <HeaderBox>
                    <IconButton size="small" disabled={i === 0} onClick={moveLeft} children={<KeyboardArrowLeft />} />
                    <Box children={children} />
                    <IconButton size="small" disabled={i === 3} onClick={moveRight} children={<KeyboardArrowRight />} />
                </HeaderBox>
            );
        };

        // render four components in the original order: p, T, x1, y1
        const origComponents: ReactNode[] = [
            <MovableBox key="p" which={0}>
                <i>p</i> /
                <Select variant="standard" value={UoM_p} onChange={(e) => setUoM_p(e.target.value)}>
                    {Object.keys(p_units).map((unit) => (
                        <MenuItem key={unit} value={unit} children={unit} />
                    ))}
                </Select>
            </MovableBox>,
            <MovableBox key="T" which={1}>
                <i>T</i> /
                <Select variant="standard" value={UoM_T} onChange={(e) => setUoM_T(e.target.value)}>
                    <MenuItem value="K" children="K" />
                    <MenuItem value="°C" children="°C" />
                </Select>
            </MovableBox>,
            <MovableBox key="x1" which={2}>
                <i>
                    x<sub>1</sub>
                </i>{' '}
                /
                <Select variant="standard" value={UoM_x1} onChange={(e) => setUoM_x1(e.target.value)}>
                    <MenuItem value="1" children="1" />
                    <MenuItem value="%" children="%" />
                </Select>
            </MovableBox>,
            <MovableBox key="y1" which={3}>
                <i>
                    y<sub>1</sub>
                </i>{' '}
                /
                <Select variant="standard" value={UoM_y1} onChange={(e) => setUoM_y1(e.target.value)}>
                    <MenuItem value="1" children="1" />
                    <MenuItem value="%" children="%" />
                </Select>
            </MovableBox>,
        ];

        // sort the components as per columnsOrder – the user's choice
        return columnsOrder.map((i) => origComponents[i]);
    }, renderDeps);

    const columnLabels: string[] = useMemo(() => {
        const originalSpreadsheetHeaders = [
            `p/${UoM_p}`,
            `T/${UoM_T}`,
            get_xy_label('x1', UoM_x1),
            get_xy_label('y1', UoM_y1),
        ];
        return columnsOrder.map((i) => originalSpreadsheetHeaders[i]);
    }, renderDeps);

    return useMemo(
        () => ({ convertTableUoMs, headerComponents, columnLabels }),
        [convertTableUoMs, headerComponents, columnLabels],
    );
};
