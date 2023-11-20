import { createTheme } from '@mui/material';

export const MUITheme = createTheme({
    typography: {
        fontFamily: ['Open Sans', 'sans-serif'].join(','),
        h1: { fontSize: '2rem', fontWeight: 700 },
        h2: { fontSize: '1.5rem', fontWeight: 700 },
        h3: { fontSize: '1.25rem', fontWeight: 700 },
    },
    components: {
        MuiAlert: {
            styleOverrides: {
                root: { fontWeight: 700 },
            },
        },
    },
});
