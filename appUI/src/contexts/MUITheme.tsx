import { createTheme } from '@mui/material';

const spacing: number = 8;
export const spacingN = (n: number) => spacing * n;

const color1 = '#1690AE';
const color2 = `#${color1.slice(5)}${color1.slice(1, 5)}`;

export const MUITheme = createTheme({
    spacing,
    palette: {
        primary: {
            main: color1,
            light: '#E4F9FC',
        },
        secondary: { main: color2 },
    },
    typography: {
        fontFamily: ['Open Sans', 'sans-serif'].join(','),
    },
    components: {
        MuiAlert: {
            styleOverrides: { root: { fontWeight: 700 } },
        },
        MuiIconButton: {
            defaultProps: { color: 'primary' },
        },
        MuiDialogTitle: {
            styleOverrides: { root: { fontSize: '1.3rem' } },
        },
        MuiDialogActions: {
            styleOverrides: {
                root: {
                    padding: spacingN(2),
                    paddingTop: spacingN(1),
                    justifyContent: 'flex-start',
                    gap: spacingN(1),
                },
            },
        },
        MuiSelect: {
            variants: [{ props: { variant: 'standard' }, style: { marginLeft: spacingN(0.5) } }],
        },
        MuiTableHead: {
            styleOverrides: { root: { fontWeight: 700 } },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    padding: spacingN(1.5),
                    fontWeight: 'inherit',
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                // @ts-expect-error backdrop is a child component of Dialog, but is missing in the MUI types
                backdrop: {
                    backgroundImage: `linear-gradient(to right, ${color1}28, ${color2}28)`,
                },
            },
        },
    },
});
