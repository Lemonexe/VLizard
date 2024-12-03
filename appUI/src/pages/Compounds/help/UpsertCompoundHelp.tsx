import { FC } from 'react';
import { PS_MODELS_URL } from '../../../adapters/io/URL.ts';

export const UpsertCompoundHelp: FC = () => (
    <ul>
        <li>
            Either fill in known values from an external source.
            <ul>
                <li>
                    Make sure to check its formula and <a href={PS_MODELS_URL}>recalculate accordingly</a>.
                </li>
            </ul>
        </li>
        <li>
            Or perform fitting using measured data.
            <ul>
                <li>If needed, modify the initial estimates below.</li>
            </ul>
        </li>
        <li>Either way, don&apos;t forget to SAVE afterwards.</li>
    </ul>
);
