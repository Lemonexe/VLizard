import axios from 'axios';
import { useQuery } from 'react-query';

export const useIsItUp = () =>
    useQuery(
        'isItUp',
        async () => {
            try {
                await axios.get('http://localhost:4663/is_it_up', {
                    timeout: 500,
                });
                return true;
            } catch (_e) {
                return false;
            }
        },
        {
            retry: Infinity,
            refetchInterval: 5000,
        },
    );
