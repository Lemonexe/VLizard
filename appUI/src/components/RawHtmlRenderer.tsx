import { FC } from 'react';

type RawHtmlRendererProps = { rawHtml: string };

/**
 * Component that just dangerously renders raw HTML in a div.
 */
export const RawHtmlRenderer: FC<RawHtmlRendererProps> = ({ rawHtml }) => (
    <div dangerouslySetInnerHTML={{ __html: rawHtml }} />
);
