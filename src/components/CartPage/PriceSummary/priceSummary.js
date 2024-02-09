import React from 'react';
import { gql } from '@apollo/client';
import { Price } from '@magento/peregrine';
import { usePriceSummary } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/usePriceSummary';
import Button from '../../Button';
import { mergeClasses } from '../../../classify';
import defaultClasses from './priceSummary.css';
import DiscountSummary from './discountSummary';
import GiftCardSummary from './giftCardSummary';
import ShippingSummary from './shippingSummary';
import PriceAdjustments from '../PriceAdjustments';
import TaxSummary from './taxSummary';
import { PriceSummaryFragment } from './priceSummaryFragments';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

const GET_PRICE_SUMMARY = gql`
    query getPriceSummary($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...PriceSummaryFragment
        }
    }
    ${PriceSummaryFragment}
`;

/**
 * A child component of the CartPage component.
 * This component fetches and renders cart data, such as subtotal, discounts applied,
 * gift cards applied, tax, shipping, and cart total.
 *
 * @param {Object} props
 * @param {Object} props.classes CSS className overrides.
 * See [priceSummary.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceSummary/priceSummary.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import PriceSummary from "@magento/venia-ui/lib/components/CartPage/PriceSummary";
 */
const PriceSummary = props => {
    const { isUpdating, arrayItensParProjets, itemsWithoutProject, itemsWithProject } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const talonProps = usePriceSummary({
        queries: {
            getPriceSummary: GET_PRICE_SUMMARY
        }
    });
    const { formatMessage } = useIntl();

    const {
        handleProceedToCheckout,
        hasError,
        hasItems,
        isCheckout,
        isLoading,
        flatData
    } = talonProps;

    if (hasError) {
        return (
            <div className={classes.root}>
                <span className={classes.errorText}>
                    <FormattedMessage
                        id={'priceSummary.errorText'}
                        defaultMessage={
                            'Something went wrong. Please refresh and try again.'
                        }
                    />
                </span>
            </div>
        );
    } else if (!hasItems) {
        return null;
    }

    const priceAdjustments = hasItems ? (
        <PriceAdjustments setIsCartUpdating={isUpdating} />
    ) : null;


    const { subtotal, total, discounts, giftCards, taxes, shipping } = flatData;

    const isPriceUpdating = isUpdating || isLoading;
    const priceClass = isPriceUpdating ? classes.priceUpdating : classes.price;
    const totalPriceClass = isPriceUpdating
        ? classes.priceUpdating
        : classes.totalPrice;

    const proceedToCheckoutButton = !isCheckout ? (
        <>
            <div className={classes.checkoutButton_container}>
                <Button
                    disabled={isPriceUpdating}
                    priority={'high'}
                    onClick={handleProceedToCheckout}
                >
                    <FormattedMessage
                        id={'priceSummary.checkoutButton_container'}
                        defaultMessage={'This is correct'}
                    />
                </Button>
            </div>
            <br />
            <div className={classes.checkoutButton_containerlink}>
                <Link to="/brands-sherpa" className={classes.review_order_button_link}>
                    <span>
                        <FormattedMessage
                            id={'checkoutPage.cs'}
                            defaultMessage={'Continue Shopping'}
                        />
                    </span>
                </Link>
            </div>
        </>
    ) : null;

    const totalPriceProductsWithoutProject = itemsWithoutProject.reduce((total, product) => total + product.quantity * product.prices.price.value, 0).toFixed(2);

    console.log(itemsWithoutProject);

    return (
        <div className={classes.root}>
                <h3 className={classes.headingSubtotal}>
                    <FormattedMessage
                        id={'priceSummary.heading'}
                        defaultMessage={'Subtotal'}
                    />
                </h3>
            <div className={classes.lineItems}>

                {/* ITEMS SANS PROJECT */}
                <span className={classes.lineItemLabel}>
                    <FormattedMessage
                        id={'priceSummary.lineItemLabel'}
                        defaultMessage={'Products'}
                    />
                </span>
                <span className={priceClass}>
                    <Price
                        value={totalPriceProductsWithoutProject}
                        currencyCode={subtotal.currency}
                    />
                </span>
            </div>           
            <div className={classes.lineItems}>
                {/* BOUCLE DANS LES ITEMS WITH PROJECTS */}
                <span className={classes.lineItemLabel}>
                    <FormattedMessage
                        id={'priceSummary.produitLabel'}
                        defaultMessage={'Nom produit'}
                    />
                </span>
                <span className={priceClass}>
                    <Price
                        value={subtotal.value}
                        currencyCode={subtotal.currency}
                    />
                </span>
                <DiscountSummary
                    classes={{
                        lineItemLabel: classes.lineItemLabel,
                        price: priceClass
                    }}
                    data={discounts}
                />
                <GiftCardSummary
                    classes={{
                        lineItemLabel: classes.lineItemLabel,
                        price: priceClass
                    }}
                    data={giftCards}
                />
                <TaxSummary
                    classes={{
                        lineItemLabel: classes.lineItemLabel,
                        price: priceClass
                    }}
                    data={taxes}
                    isCheckout={isCheckout}
                />
                <ShippingSummary
                    classes={{
                        lineItemLabel: classes.lineItemLabel,
                        price: priceClass,
                    }}
                    data={shipping}
                    isCheckout={isCheckout}
                />
            </div>
            <div
                className={classes.price_adjustments_container}
            >
                {priceAdjustments}
            </div>
            <div className={classes.flexBetween}>
                <span className={classes.totalLabel}>
                    {isCheckout
                        ? formatMessage({
                            id: 'priceSummary.Total',
                            defaultMessage: 'Total'
                        })
                        : formatMessage({
                            id: 'priceSummary.estimatedTotal',
                            defaultMessage: 'Estimated Total'
                        })}
                </span>
                <span className={totalPriceClass}>
                    <Price value={total.value} currencyCode={total.currency} />
                </span>
            </div>

            {proceedToCheckoutButton}
            {/* <p className={classes.checkoutNotice}>Make sure the quantity of your products is right before checkout.</p> */}
        </div>
    );
};

export default PriceSummary;
