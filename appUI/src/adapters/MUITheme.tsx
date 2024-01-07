import { createTheme } from '@mui/material';

export const MUITheme = createTheme({
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
        MuiDialogActions: {
            styleOverrides: { root: { padding: 24, paddingTop: 0, paddingBottom: 16 } },
        },
        MuiTableHead: {
            styleOverrides: { root: { fontWeight: 700 } },
        },
        MuiTableCell: {
            styleOverrides: { root: { fontWeight: 'inherit' } },
        },
    },
});
