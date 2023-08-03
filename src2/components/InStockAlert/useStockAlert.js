import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/client';

export const useStockAlert = props => {
    const { query } = props;
    const [subscribeAlert, { data }] = useMutation(query);

    const [inProgress, setInProgress] = useState(false);
    const handleAlert = useCallback(
        async ({ product_id }) => {
            setInProgress(true);
            await subscribeAlert({ variables: { product_id } });
            setInProgress(false);
        },
        [subscribeAlert]
    );
    console.log(data, 'ffff');
    return {
        handleAlert,
        inProgress,
        data
    };
};
