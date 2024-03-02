import { createTheme } from '@mui/material';

const spacing: number = 8;
export const spacingN = (n: number) => spacing * n;

export const MUITheme = createTheme({
    spacing,
    palette: {
        primary: {
            main: '#1690AE',
        },
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
    },
});
