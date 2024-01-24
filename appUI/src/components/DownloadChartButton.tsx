import { ElementRef, FC, RefObject, useCallback } from 'react';
import { downloadSvg } from '../adapters/io/download.ts';
import { Button } from '@mui/material';
import { Download } from '@mui/icons-material';
import { LineChart } from 'recharts';
import { useNotifications } from '../contexts/NotificationContext.tsx';

type DownloadChartButtonProps = {
    chartRef: RefObject<ElementRef<typeof LineChart>>;
    fileName: string;
};

export const DownloadChartButton: FC<DownloadChartButtonProps> = ({ chartRef, fileName }) => {
    const pushNotification = useNotifications();
    const handleDownload = useCallback(() => {
        const svg = chartRef?.current?.container?.firstChild as SVGElement | undefined;
        if (!svg) {
            pushNotification({ message: 'Error getting SVG', severity: 'error' });
            return;
        }
        downloadSvg(svg, fileName);
    }, [chartRef, fileName]);

    return (
        <Button onClick={handleDownload} variant="outlined" startIcon={<Download />}>
            Save SVG
        </Button>
    );
};
