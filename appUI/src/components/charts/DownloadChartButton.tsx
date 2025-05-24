import { Download } from '@mui/icons-material';
import { Button } from '@mui/material';
import { FC } from 'react';

import { downloadSvgString } from '../../adapters/io/download.ts';

export type DownloadChartButtonProps = {
    svgContent: string;
    fileName: string;
};

export const DownloadChartButton: FC<DownloadChartButtonProps> = ({ svgContent, fileName }) => {
    const handleDownload = () => downloadSvgString(svgContent, fileName);

    return (
        <Button onClick={handleDownload} variant="outlined" startIcon={<Download />}>
            Save SVG
        </Button>
    );
};
