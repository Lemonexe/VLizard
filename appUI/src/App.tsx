import { useState } from 'react';
import { Box, Button, ThemeProvider } from '@mui/material';

// empty MUI theme object
const theme = {};

function App() {
    const [count, setCount] = useState(0);

    return (
        <ThemeProvider theme={theme}>
            <Box>
                <Button variant="contained" color="primary" onClick={() => setCount((prev) => prev + 1)}>
                    Click me
                </Button>
                <Box sx={{ m: 1 }}>{count}</Box>
            </Box>
        </ThemeProvider>
    );
}

export default App;
