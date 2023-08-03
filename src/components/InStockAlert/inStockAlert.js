import React, { useEffect } from 'react';
import StockAlertMutation from './stockAlert.graphql';
import { useStockAlert } from './useStockAlert';
import { FormattedMessage } from 'react-intl';
import { useToasts } from '@magento/peregrine';

const InStockAlert = props => {
    const [, { addToast }] = useToasts();
    const { id } = props;
    const { handleAlert, inProgress, data } = useStockAlert({
        query: StockAlertMutation
    });

    useEffect(() => {
        if (data && data.stockAlert && data.stockAlert.success) {
            addToast({
                type: 'info',
                message: data.stockAlert.message,
                dismissable: true,
                timeout: 3000
            });
        }
        if (data && data.stockAlert && !data.stockAlert.success) {
            addToast({
                type: 'error',
                message: data.stockAlert.message,
                dismissable: true,
                timeout: 3000
            });
        }
    }, [addToast, data]);

    return (
        <div onClick={() => handleAlert({ product_id: id })}>
            <FormattedMessage
                id={'ProductFullDetail.notify'}
                defaultMessage={'Notify me when this product is in stock'}
            />
        </div>
    );
};

export default InStockAlert;
