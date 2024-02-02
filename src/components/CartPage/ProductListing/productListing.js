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
    const { setIsCartUpdating, projectIds, products, cart } = props;
    const talonProps = useProductListing({
        queries: {
            getProductListing: GET_PRODUCT_LISTING
        }
    });
    const { activeEditItem, isLoading, items, setActiveEditItem } = talonProps;

    // console.log('**PROJECT', cart);
    console.log('***PRODUCT', products);

    // const arrayProduct = Object.keys(product).map((key) => {
    //     return { [key]: product[key] }
    //  });

    //  console.log(arrayProduct);

    /* TESTE  */

    // Array para armazenar os projetos filtrados

    // let productsFiltre = [];
    // let productsParProjet = [];

    // // Filtrar os projetos com base na quantidade desejada
    // products.map(item => {

    //     item.category.map(projet => {
    //         let _item = { ...item.product, projet_qty: projet.qty, productID: projet.product_id, projetID: projet.category_id };
    //         productsFiltre.push(_item)
    //         // productsFiltre.map(item => item.filter())
    //     })

    // });

    // console.log('FIN', productsFiltre);

    // // Agrupando os itens por ID do projeto
    // const itensAgrupadosPorProjeto = productsFiltre.reduce((agrupado, produit) => {
    //     // Verifica se já existe uma chave com o ID do projeto
    //     if (!agrupado[produit.projetID]) {
    //         // Se não existe, cria uma nova chave com o ID do projeto e inicia com um array vazio
    //         agrupado[produit.projetID] = [];
    //     }
    //     // Adiciona o item ao array correspondente ao ID do projeto
    //     agrupado[produit.projetID].push(produit);
    //     return agrupado;
    // }, {});

    // console.log(itensAgrupadosPorProjeto);


    // productsFiltre.map(item => {
    //     console.log(item);
    // })


    const classes = mergeClasses(defaultClasses, props.classes);

    if (isLoading) {
        return <LoadingIndicator>{`Fetching Cart...`}</LoadingIndicator>;
    }

    if (items.length) {
        let productComponents = [];
        console.log('projectIds ' + projectIds);
        if (cart) {
            productComponents = products.map(product => (
                <>
                    <Product
                        item={product}
                        key={product.id + 1}
                        setActiveEditItem={setActiveEditItem}
                        setIsCartUpdating={setIsCartUpdating}
                    />
                </>

            ));

        } else {
            productComponents = items.map(product => (

                <>
                    <Product
                        item={product}
                        key={product.id + 1}
                        setActiveEditItem={setActiveEditItem}
                        setIsCartUpdating={setIsCartUpdating}
                    />
                </>

            ));
        }
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
