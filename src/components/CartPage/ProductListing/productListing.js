import React, { Fragment, Suspense } from 'react';
import { gql } from '@apollo/client';
import { useProductListing } from 'src/peregrine/lib/talons/CartPage/ProductListing/useProductListing';
import { mergeClasses } from '../../../classify';
import LoadingIndicator from '../../LoadingIndicator';
import defaultClasses from './productListing.css';
import Product from './product';
import { ProductListingFragment } from './productListingFragments';

/**
 * A child component of the CartPage component.
 * This component renders the product listing on the cart page.
 *
 * @param {Object} props
 * @param {Function} props.setIsCartUpdating Function for setting the updating state of the cart.
 * @param {Object} props.classes CSS className overrides.
 * See [productListing.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/ProductListing/productListing.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import ProductListing from "@magento/venia-ui/lib/components/CartPage/ProductListing";
 */
const EditModal = React.lazy(() => import('./EditModal'));

const ProductListing = props => {
    const { setIsCartUpdating } = props;
    const talonProps = useProductListing({
        queries: {
            getProductListing: GET_PRODUCT_LISTING
        }
    });
    const { activeEditItem, isLoading, items, setActiveEditItem } = talonProps;

    // console.log(items);

    const classes = mergeClasses(defaultClasses, props.classes);

    if (isLoading) {
        return <LoadingIndicator>{`Fetching Cart...`}</LoadingIndicator>;
    }

    if (items.length) {
        const productComponents = items.map(product => (
            <Product
                item={product}
                key={product.id}
                setActiveEditItem={setActiveEditItem}
                setIsCartUpdating={setIsCartUpdating}
            />
        ));

        return (
            <Fragment>
                <ul className={classes.root}>{productComponents}</ul>
                <Suspense fallback={null}>
                    <EditModal
                        item={activeEditItem}
                        setIsCartUpdating={setIsCartUpdating}
                    />
                </Suspense>
            </Fragment>
        );
    }

    return null;
};

export const GET_PRODUCT_LISTING = gql`
    query getProductListing($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...ProductListingFragment
        }
    }
    ${ProductListingFragment}
`;

export default ProductListing;
