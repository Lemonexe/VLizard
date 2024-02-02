/**
 * Download a string as a file
 * @param content raw string content
 * @param filename name of the file
 * @param type MIME type of the file
 */
export const downloadString = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
};

/**
 * Download SVG raw content as a file
 * @param svgContent raw SVG content
 * @param filename name of the file without extension
 */
export const downloadSvgString = (svgContent: string, filename: string) =>
    downloadString(svgContent, filename, 'image/svg+xml');
