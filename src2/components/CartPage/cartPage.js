import React from 'react';
import { useCartPage } from '../../peregrine/lib/talons/CartPage/useCartPage.js';
import { FormattedMessage } from 'react-intl';
import { mergeClasses } from '../../classify';
import { Title } from '../Head';
import LinkButton from '../LinkButton';
import { fullPageLoadingIndicator } from '../LoadingIndicator';
import StockStatusMessage from '../StockStatusMessage';
import PriceAdjustments from './PriceAdjustments';
import ProductListing from './ProductListing';
import PriceSummary from './PriceSummary';
import defaultClasses from './cartPage.css';
import { GET_CART_DETAILS } from './cartPage.gql';
import searchClasses from '../SearchPage/searchPage.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

import { useCrossSellProduct } from '../../peregrine/lib/talons/ProductFullDetail/useProductFullDetail';
import crossSellQuery from '../../queries/getCrossSellProducts.graphql';
import CrossSellProducts from './linkedProducts';

/**
 * Structural page component for the shopping cart.
 * This is the main component used in the `/cart` route in Venia.
 * It uses child components to render the different pieces of the cart page.
 *
 * @see {@link https://venia.magento.com/cart}
 *
 * @param {Object} props
 * @param {Object} props.classes CSS className overrides for the component.
 * See [cartPage.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/cartPage.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import CartPage from "@magento/venia-ui/lib/components/CartPage";
 */
const CartPage = props => {
    const talonProps = useCartPage({
        queries: {
            getCartDetails: GET_CART_DETAILS
        }
    });

    const {
        cartItems,
        hasItems,
        isSignedIn,
        isCartUpdating,
        setIsCartUpdating,
        shouldShowLoadingIndicator
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);
    const { crossSellData } = useCrossSellProduct({
        query: crossSellQuery,
        cartItems
    });
    if (shouldShowLoadingIndicator) {
        return fullPageLoadingIndicator;
    }
    const linkClick = document.getElementById('user_account');

    const signInDisplay = !isSignedIn ? (
        <LinkButton
            classes={{ root: classes.signInLink }}
            onClick={() => linkClick.click()}
        >
            <FormattedMessage
                id={'cartPage.signInLink'}
                defaultMessage={'Sign In'}
            />
        </LinkButton>
    ) : null;

    const productListing = hasItems ? (
        <ProductListing setIsCartUpdating={setIsCartUpdating} />
    ) : (
        <div className={searchClasses.noResult}>
            <span className={searchClasses.noResult_icon}>
                <FontAwesomeIcon icon={faExclamationTriangle} />
            </span>
            <span className={'ml-2' + ' ' + searchClasses.noResult_text}>
                <FormattedMessage
                    id={'cartPage.noResult_text'}
                    defaultMessage={'There are no items in your cart.'}
                />
            </span>
        </div>
    );

    const priceAdjustments = hasItems ? (
        <PriceAdjustments setIsCartUpdating={setIsCartUpdating} />
    ) : null;
    const priceSummary = hasItems ? (
        <PriceSummary isUpdating={isCartUpdating} />
    ) : null;

    return (
        <div className={'container' + ' ' + defaultClasses.cart_page_container}>
            <div className={classes.root}>
                <Title>{`Cart - ${STORE_NAME}`}</Title>
                <div className={classes.heading_container}>
                    <h1 className={classes.heading}>
                        <FormattedMessage
                            id={'cartPage.heading'}
                            defaultMessage={'Shopping cart'}
                        />
                    </h1>
                    {signInDisplay}
                    <div className={classes.stockStatusMessageContainer}>
                        <StockStatusMessage cartItems={cartItems} />
                    </div>
                </div>
                <div className={classes.cart_inner}>
                    <div className={classes.body}>
                        <div className={classes.item_container_wrap}>
                            <div className={classes.items_container}>
                                {productListing}
                            </div>
                            <div
                                className={classes.price_adjustments_container}
                            >
                                {priceAdjustments}
                            </div>
                        </div>
                        <div className={classes.summary_container}>
                            <div className={classes.summary_contents}>
                                {priceSummary}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classes.cartpage_crosssellslider}>
                    {crossSellData && (
                        <CrossSellProducts
                            title="You can also like these products"
                            linkedProducts={crossSellData}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartPage;
