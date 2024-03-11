import React from 'react';
import { FormattedMessage } from 'react-intl';
import PriceSummary from '../../CartPage/PriceSummary';
import { mergeClasses } from '../../../classify';

import defaultClasses from './orderSummary.css';

const OrderSummary = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    console.log(props);
    return (
        <div className={classes.root}>
            <h1 className={classes.title}>
                <FormattedMessage
                    id={'checkoutPage.orderSummary'}
                    defaultMessage={'Order Summary'}
                />
            </h1>
            {/* <PriceSummary isUpdating={props.isUpdating} projects={props.projects} itemsWithoutProject={props.itemsWithoutProject} itemsWithProject={props.itemsWithProject} /> */}
        </div>
    );
};

export default OrderSummary;
