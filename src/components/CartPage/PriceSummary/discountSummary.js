import React, { Fragment } from 'react';
import { gql } from '@apollo/client';
import { Price } from '@magento/peregrine';
import { FormattedMessage } from 'react-intl';

import { mergeClasses } from '../../../classify';

const DEFAULT_AMOUNT = {
    currency: 'USD',
    value: 0
};

/**
 * Reduces discounts array into a single amount.
 *
 * @param {Array} discounts
 */
const getDiscount = (discounts = []) => {
    // discounts from data can be null
    if (!discounts || !discounts.length) {
        return DEFAULT_AMOUNT;
    } else {
        return {
            label: discounts[0].label,
            currency: discounts[0].amount.currency,
            value: discounts.reduce(
                (acc, discount) => acc + discount.amount.value,
                0
            )
        };
    }
};

/**
 * A component that renders the discount summary line item.
 *
 * @param {Object} props.classes
 * @param {Object} props.data fragment response data
 */
const DiscountSummary = props => {
    const classes = mergeClasses({}, props.classes);
    const discount = getDiscount(props.data);
    //let discountLabel = props.data[0].label;
    //console.log(props.data);
    return discount.value ? (
        <Fragment>
            <span className={classes.lineItemLabel}>
                {/*<FormattedMessage
                    id={'discountSummary.lineItemLabel'}
                    defaultMessage={'Discounts applied'}
                /> */}
                {discount.label}
            </span>
            <span className={classes.price}>
                <FormattedMessage
                    id={'discountSummary.price'}
                    defaultMessage={'-'}
                />

                <Price
                    value={discount.value}
                    currencyCode={discount.currency}
                />
            </span>
        </Fragment>
    ) : null;
};

export const DiscountSummaryFragment = gql`
    fragment DiscountSummaryFragment on CartPrices {
        discounts {
            amount {
                currency
                value
            }
            label
        }
    }
`;

export default DiscountSummary;
