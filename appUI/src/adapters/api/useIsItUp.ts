import axios from 'axios';
import { useQuery } from 'react-query';
import { useState } from 'react';
import { hostName } from './helpers/hostName.ts';

const refetchInterval = 2500;
const timeout = 1000;

// how many isItUp failures in a row are needed to evaluate as connection lost
const failureThreshold = 2;

export const useIsItUp = () => {
    const [failuresInRow, setFailuresInRow] = useState(0);
    return useQuery(
        'isItUp',
        async () => {
            try {
                await axios.get(hostName + '/is_it_up', { timeout });
                setFailuresInRow(0);
                return true;
            } catch (_e) {
                const withinTolerance = failuresInRow + 1 < failureThreshold;
                setFailuresInRow((prev) => prev + 1);
                return withinTolerance;
            }
        },
        {
            retry: Infinity,
            refetchInterval,
        },
    );
};
