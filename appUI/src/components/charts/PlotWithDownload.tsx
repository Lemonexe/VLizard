import { FC } from 'react';
import { Stack } from '@mui/material';
import { RawHtmlRenderer } from './RawHtmlRenderer.tsx';
import { DownloadChartButton, DownloadChartButtonProps } from './DownloadChartButton.tsx';

export const PlotWithDownload: FC<DownloadChartButtonProps> = ({ svgContent, fileName }) => (
    <Stack direction="row" alignItems="center">
        <RawHtmlRenderer rawHtml={svgContent} />
        <DownloadChartButton svgContent={svgContent} fileName={fileName} />
    </Stack>
);
