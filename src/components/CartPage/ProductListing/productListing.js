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
    const { setIsCartUpdating, projectIds, products, cart, inputCategory, isProject } = props;
    const talonProps = useProductListing({
        queries: {
            getProductListing: GET_PRODUCT_LISTING
        }
    });
    const { activeEditItem, isLoading, items, setActiveEditItem } = talonProps;

    // console.log('**PROJECT', cart);
    // console.log('***PRODUCT', products);
    // console.log('ITEMS****', items);

    /* Transforme le objet en array pour faire le mapping */
    // const productsArray = Object.values(products).flat()

    // console.log(productsArray);


    const classes = mergeClasses(defaultClasses, props.classes);

    if (isLoading) {
        return <LoadingIndicator>{`Fetching Cart...`}</LoadingIndicator>;
    }

    if (items.length) {
        let productComponents = [];
        console.log(products);

        /*products.forEach(function(entry,index) {
            var entryCategory = entry.category;

            entryCategory.forEach(function(entryCat) { 
                console.log('Prise 1 '+entryCat.category_id+' '+inputCategory);

                if(entryCat.category_id == inputCategory) {
                   console.log('FOUND !');
                } 

            })

        });*/

        if (isProject == 1) {

            if (cart) {

                products.forEach(function (entry) {

                    var entryCategory = entry.category;

                    entryCategory.forEach(function (entryCat) {

                        if (entryCat.category_id == inputCategory) {
                            //entry.quantity = entryCat.qty;
                            entry.quantity = entryCat.qty;
                            console.log('PROJET ' + entryCat.category_id + ' qty ' + entryCat.qty)

                            productComponents.push(
                                <>
                                    <Product
                                        item={entry}
                                        key={entry.id + 1}
                                        setActiveEditItem={setActiveEditItem}
                                        setIsCartUpdating={setIsCartUpdating}
                                        projectQty={entryCat.qtyCategory}
                                        wid={entryCat.category_id}
                                        disableQuantity={1}
                                    />
                                </>
                            );
                        }
                    })

                });

            }
        }
        else {
            if (cart && isProject == 0) {

                products.forEach(function (entry) {
                    var entryCategory = entry.category;
                    // console.log(entry);
                    let qtyProduitsSansProject = '';
                    let categoryLenght = entry.category === null ? 0 : entry.category.length; 
                    // console.log(categoryLenght);
                    if (categoryLenght >= 1) {
                        entryCategory.forEach(function (entryCat) {
                            qtyProduitsSansProject = entry.quantity - entryCat.qty;
                            // console.log(qtyProduitsSansProject, '*****************');
                            // productComponents = products.map(product => (
                            productComponents.push(
                                <>
                                    <Product
                                        item={entry}
                                        key={entry.id}
                                        setActiveEditItem={setActiveEditItem}
                                        setIsCartUpdating={setIsCartUpdating}
                                        projectQty={qtyProduitsSansProject}
                                        wid={entryCat.category_id}
                                        disableQuantity={0}
                                    />
                                </>
                            )

                            // ));
                        });
                    } else if(categoryLenght == 0) {
                        let qtyProduitsSansProject = entry.quantity;
                        console.log(qtyProduitsSansProject, '*****************');
                        // productComponents = products.map(product => (
                        productComponents.push(
                            <>
                                <Product
                                    item={entry}
                                    key={entry.id}
                                    setActiveEditItem={setActiveEditItem}
                                    setIsCartUpdating={setIsCartUpdating}
                                    projectQty={qtyProduitsSansProject}
                                    wid={''}
                                    disableQuantity={0}
                                />
                            </>
                        )
                    } else{
                        <></>
                    }
                });

            }

        }
        // if (cart) { 1 }
        // else {
        //     productComponents = items.map(product => (

        //         <>
        //             <Product
        //                 item={product}
        //                 key={product.id + 1}
        //                 setActiveEditItem={setActiveEditItem}
        //                 setIsCartUpdating={setIsCartUpdating}
        //             />
        //         </>

        //     ));
        // }
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
