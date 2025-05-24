import { Stack } from '@mui/material';
import { FC } from 'react';

import { DownloadChartButton, DownloadChartButtonProps } from './DownloadChartButton.tsx';
import { RawHtmlRenderer } from './RawHtmlRenderer.tsx';

export const PlotWithDownload: FC<DownloadChartButtonProps> = ({ svgContent, fileName }) => (
    <Stack direction="row" alignItems="center">
        <RawHtmlRenderer rawHtml={svgContent} />
        <DownloadChartButton svgContent={svgContent} fileName={fileName} />
    </Stack>
);
