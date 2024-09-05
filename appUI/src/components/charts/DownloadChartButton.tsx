import { FC } from 'react';
import { downloadSvgString } from '../../adapters/io/download.ts';
import { Button } from '@mui/material';
import { Download } from '@mui/icons-material';

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
