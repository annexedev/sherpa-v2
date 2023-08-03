import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { func } from 'prop-types';
import TextArea from '../../TextArea';
import { mergeClasses } from '../../../classify';
import { Accordion, Section } from '../../Accordion';
import CouponCode from '../../CartPage/PriceAdjustments/CouponCode';
import defaultClasses from './priceAdjustments.css';

/**
 * PriceAdjustments component for the Checkout page.

 * @param {Function} props.setPageIsUpdating callback that sets checkout page updating state
 */
const PriceAdjustments = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const [textValue, setTextValue] = useState(' ');

    const { setPageIsUpdating } = props;
    const { formatMessage } = useIntl();

    return (
        <div className={classes.root}>
            <Accordion canOpenMultiple={true}>
                <Section
                    id={'coupon_code'}
                    title={formatMessage({
                        id: 'checkoutPage.couponCode',
                        defaultMessage: 'Enter Coupon Code'
                    })}
                >
                    <CouponCode setIsCartUpdating={setPageIsUpdating} />
                </Section>
                {/* <GiftCardSection setIsCartUpdating={setPageIsUpdating} />
        <Section
          id={'gift_options'}
          title={formatMessage({
            id: 'checkoutPage.giftOptions',
            defaultMessage: 'See Gift Options'
          })}
        >
          <GiftOptions />
        </Section> */}
                <Section
                    id={'cardMessage'}
                    title={formatMessage({
                        id: 'checkoutPage.cardMessage',
                        defaultMessage: 'Enter Comment for your order'
                    })}
                >
                    <TextArea
                        id="cardMessage"
                        field="cardMessage"
                        placeholder={formatMessage({
                            id: 'giftOption.placeholder',
                            defaultMessage: 'Enter your message here'
                        })}
                        initialValue=""
                        onChange={e => {
                            setTextValue(e.target.value);
                        }}
                        onBlur={() => {
                            localStorage.setItem('cardMessage', textValue);
                        }}
                    />
                </Section>
            </Accordion>
        </div>
    );
};

export default PriceAdjustments;

PriceAdjustments.propTypes = {
    setPageIsUpdating: func
};
