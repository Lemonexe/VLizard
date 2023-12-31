import { createTheme } from '@mui/material';

export const MUITheme = createTheme({
    typography: {
        fontFamily: ['Open Sans', 'sans-serif'].join(','),
    },
    components: {
        MuiAlert: {
            styleOverrides: {
                root: { fontWeight: 700 },
            },
        },
    },
});
