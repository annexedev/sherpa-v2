import React from 'react';
import { shape, string, bool, func } from 'prop-types';
import { RadioGroup } from 'informed';

import { usePaymentMethods } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/usePaymentMethods';

import { mergeClasses } from '../../../classify';
import Radio from '../../RadioGroup/radio';
import CreditCard from './creditCard';
import OfflinePayment from './offlinePayment';
import paymentMethodOperations from './paymentMethods.gql';
import defaultClasses from './paymentMethods.css';
import OnlinePayment from './onlinePayment';
import { useIntl } from 'react-intl';

const PAYMENT_METHOD_COMPONENTS_BY_CODE = {
    braintree: CreditCard,
    checkmo: OfflinePayment,
    cashondelivery: OfflinePayment,
    paypal_express: OnlinePayment
    // etc
};

const PaymentMethods = props => {
    const {
        classes: propClasses,
        onPaymentError,
        onPaymentSuccess,
        resetShouldSubmit,
        shouldSubmit
    } = props;

    const classes = mergeClasses(defaultClasses, propClasses);
    const { formatMessage } = useIntl();
    const talonProps = usePaymentMethods({
        ...paymentMethodOperations
    });

    const {
        availablePaymentMethods,
        currentSelectedPaymentMethod,
        initialSelectedMethod,
        isLoading
    } = talonProps;

    if (isLoading) {
        return null;
    }

    const radios = availablePaymentMethods.map(({ code, title }) => {
        // If we don't have an implementation for a method type, ignore it.
        if (!Object.keys(PAYMENT_METHOD_COMPONENTS_BY_CODE).includes(code)) {
            return;
        }
        const isSelected = currentSelectedPaymentMethod === code;
        const PaymentMethodComponent = PAYMENT_METHOD_COMPONENTS_BY_CODE[code];
        const renderedComponent = isSelected ? (
            <PaymentMethodComponent
                onPaymentSuccess={onPaymentSuccess}
                onPaymentError={onPaymentError}
                resetShouldSubmit={resetShouldSubmit}
                shouldSubmit={shouldSubmit}
                paymentCode={code}
            />
        ) : null;

        return (
            <div key={code} className={classes.payment_method}>
                <Radio
                    label={title}
                    value={code}
                    classes={{
                        label: classes.radio_label
                    }}
                    checked={isSelected}
                />
                {renderedComponent}
            </div>
        );
    });

    const noPaymentMethodMessage = !radios.length ? (
        <div className={classes.payment_errors}>
            <span>
                {formatMessage({
                    id: 'checkoutPage.paymentLoadingError',
                    defaultMessage: 'There are no available payment methods.'
                })}
            </span>
            <span>
                {formatMessage({
                    id: 'checkoutPage.refreshOrTryAgainLater',
                    defaultMessage: 'Please refresh or try again later.'
                })}
            </span>
        </div>
    ) : null;

    return (
        <div className={classes.root}>
            <RadioGroup
                field="selectedPaymentMethod"
                initialValue={initialSelectedMethod}
            >
                {radios}
            </RadioGroup>
            {noPaymentMethodMessage}
        </div>
    );
};

export default PaymentMethods;

PaymentMethods.propTypes = {
    classes: shape({
        root: string,
        payment_method: string,
        radio_label: string
    }),
    onPaymentSuccess: func,
    onPaymentError: func,
    resetShouldSubmit: func,
    selectedPaymentMethod: string,
    shouldSubmit: bool
};
