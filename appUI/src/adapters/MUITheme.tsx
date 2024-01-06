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
            styleOverrides: {
                root: { fontWeight: 700 },
            },
        },
        MuiIconButton: {
            defaultProps: {
                color: 'primary',
            },
        },
    },
});
