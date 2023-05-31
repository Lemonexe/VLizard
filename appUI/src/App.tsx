import { useState } from 'react';
import { Box, Button } from '@mui/material';

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <Box>
                count = {count}
                <Button onClick={() => setCount((count) => count + 1)}>Add</Button>
            </Box>
        </>
    );
}

export default App;
