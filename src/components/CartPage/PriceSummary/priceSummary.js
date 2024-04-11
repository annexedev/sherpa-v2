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
    const { isUpdating, projects, itemsWithoutProject, itemsWithProject, inputCategory } = props;
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
    /* Je suis ici en train de faire le calcul pour afficher les valeurs de chaque projet et après faire un boucle pour créer des lignes avec le nom e value de chaque projet */
    // const prixParProjet = []
    let nomProjet = '';
    let prixParProjet = '';
    const containerProjets = projects.map((item) => {
        // console.log(Object.keys(item));
        console.log(item);
        for (let chave in item) {
            // console.log('Chave:', chave);
            nomProjet = chave;
            const arrayDeObjetos = item[chave];
            prixParProjet = Number(arrayDeObjetos.reduce((total, product) => total + product.projet_qty * product.prices.price.value, 0).toFixed(2));
            return (
                < div className={[classes.lineItems, classes.containerProjects].join(' ')} >
                    {/* {Object.keys(item)} */}
                    < span className={classes.lineItemLabel} >
                        <FormattedMessage
                            id={'priceSummary.produitLabel'}
                            defaultMessage={nomProjet}
                        />
                    </span >
                    <span className={priceClass}>
                        <Price
                            value={prixParProjet}
                            currencyCode={subtotal.currency}
                        />
                    </span>
                </div >
            );

        }
    });

    // console.log(typeof prixParProjet);
    // console.log(nomProjet);

    // console.log(projects);

    // let inputCategory = 'this.props.inputCategory';
    let products = 'this.props.products';
    var priceTotal = 0;

    itemsWithProject.forEach(function (entry) {
        var entryCategory = entry.category;
        // console.log(entryCategory);
        entryCategory.forEach(function (entryCat) {
            if (entryCat.category_id == inputCategory) {
                priceTotal = parseFloat(priceTotal) + (parseInt(entryCat.qty) * parseFloat(entry.prices.price.value));
            }
        })
    })

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
                <span className={[classes.lineItemLabel, classes.bold].join(' ')}>
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
            {/* BOUCLE DANS LES ITEMS WITH PROJECTS */}
            <span className={classes.bold}>
                <FormattedMessage
                        id={'priceSummary.lineItemLabelProjects'}
                        defaultMessage={'Projects'}
                    />
            </span>
            {containerProjets}
            <div className={classes.lineItems}>
                {/* -------------------------------------- */}
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
                        bold: classes.bold,
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
            {/* <div
                className={classes.price_adjustments_container}
            >
                {priceAdjustments}
            </div> */}
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
