import React, { useState } from 'react';
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
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faCircle, faCircleChevronUp, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

import {
    useWishlist,
    useDeleteFromWishlist
} from '../../peregrine/lib/talons/MyAccount/useDashboard';
import WishListQuery from '../../queries/getWishlist.graphql';


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



    /* list produits dans le projet */

    const wishlistProps = useWishlist({
        query: WishListQuery
    });

    const {
        handleSetQuantity,
        quantity,
        data,
        loading,
        refetch
    } = wishlistProps;


    const [productsWithoutProject, setProductsWithoutProject] = useState(false);
    const [productsWithProject, setProductsWithProject] = useState(false);


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


    // const productListing =
    //     hasItems ? (
    //         <ProductListing setIsCartUpdating={setIsCartUpdating} />
    //     ) : (
    //         <div className={classes.noResult}>
    //             {/* <span className={searchClasses.noResult_icon}>
    //             <FontAwesomeIcon icon={faExclamationTriangle} />
    //             </span> */}
    //             <span className={'ml-2' + ' ' + classes.noResult_text}>
    //                 <FormattedMessage
    //                     id={'cartPage.noResult_text'}
    //                     defaultMessage={'No products without project in your cart.'}
    //                 />
    //             </span>
    //         </div>
    //     )


    // const priceAdjustments = hasItems ? (
    //     <PriceAdjustments setIsCartUpdating={setIsCartUpdating} />
    // ) : null;

    const priceSummary = hasItems ? (
        <PriceSummary isUpdating={isCartUpdating} />
    ) : null;

    const url = window.location.href;

    // const myprojects = url.includes("?id");


    const cartItemsJSON = cartItems.map(item => {
        return {
            ...item,
            category: item.category ? JSON.parse(item.category) : null
        };
    });

    // console.log('ITEMS JSON', cartItemsJSON);

    const itemsWithoutProject = cartItemsJSON.filter(item => item.category === null);
    const itemsWithProject = cartItemsJSON.filter(item => item.category !== null);
    let listOfProjects = [];

    const projectsDansPanier = itemsWithProject.map(project => project.category.map(item => listOfProjects.push(item)));

    // console.log('LIST OF PROJECTS',listOfProjects);

    console.log('ITEMS WITH PROJECT', itemsWithProject);
    // console.log('ITEMS WITHOUT PROJECT', itemsWithoutProject);

    const myprojects = itemsWithProject.length >= 1 ? true : false; /* il faut verifier si il y a des projets */

    const qntyProjects = itemsWithProject.map(project => (project.category.length))

    const totalPriceProductsWithoutProject = itemsWithoutProject.reduce((total, product) => total + product.quantity * product.prices.price.value, 0).toFixed(2);


    // console.log(totalPriceProductsWithoutProject);

    let productsFiltre = [];
    let productsParProjet = [];

    // Filtrar os projetos com base na quantidade desejada
    itemsWithProject.map(item => {

        item.category.map(projet => {
            // console.log(projet);
            let _item = { ...item.product, projet_qty: projet.qty, productID: projet.product_id, projetID: projet.category_id, projetNom: projet.category_name, prices: item.prices };
            productsFiltre.push(_item)
        })

    });

    // console.log('FIN', productsFiltre);

    // Agrupando os itens por ID do projeto
    const itensParProjets = productsFiltre.reduce((groupe, produit) => {
        // Verifica se já existe uma chave com o ID do projeto
        if (!groupe[produit.projetNom]) {
            // Se não existe, cria uma nova chave com o ID do projeto e inicia com um array vazio
            groupe[produit.projetNom] = [];
        }
        // console.log(groupe);
        // Adiciona o item ao array correspondente ao ID do projeto
        groupe[produit.projetNom].push(produit);
        return groupe;
    }, {});

    // console.log(itensParProjets);

    // productsParProjet.push(itensAgrupadosPorProjeto);
    const arrayItensParProjets = Object.keys(itensParProjets).map((key) => {
        return { [key]: itensParProjets[key] }
     });

    console.log(arrayItensParProjets);

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
                            <div className={classes.productsWithoutProject}>
                                {/* products individuelle */}
                                <div className={classes.wrapperProducts}>
                                    <h1 className={classes.headingProducts}>
                                        <FormattedMessage
                                            id={'cartPage.headingProducts'}
                                            defaultMessage={'Products'}
                                        />
                                    </h1>
                                    <div className={classes.wrapperValeurProduits}>
                                        <span>{itemsWithoutProject.length} products</span>
                                        <span className={classes.circleIcon}><FontAwesomeIcon icon={faCircle} /></span>
                                        <span>$ {totalPriceProductsWithoutProject}</span>
                                        <span onClick={() => { setProductsWithoutProject(!productsWithoutProject) }}>{productsWithoutProject ? <FontAwesomeIcon icon={faChevronUp} style={{ color: "#8DC74C", marginLeft: "10px", }} /> : <FontAwesomeIcon icon={faChevronDown} style={{ color: "#8DC74C", marginLeft: "10px", }} />}</span>
                                    </div>
                                </div>
                                {productsWithoutProject &&
                                    <div className={classes.items_container}>
                                        {itemsWithoutProject ?
                                            <ProductListing setIsCartUpdating={setIsCartUpdating} products={itemsWithoutProject} cart={true} />
                                            :
                                            <div className={classes.noResult}>
                                                {/* <span className={searchClasses.noResult_icon}>
                                                <FontAwesomeIcon icon={faExclamationTriangle} />
                                                </span> */}
                                                <span className={'ml-2' + ' ' + classes.noResult_text}>
                                                    <FormattedMessage
                                                        id={'cartPage.noResult_text'}
                                                        defaultMessage={'No products without project in your cart.'}
                                                    />
                                                </span>
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                            {/* <div
                                className={classes.price_adjustments_container}
                            >
                                {priceAdjustments}
                            </div> */}
                            <div className={classes.productsWithProject}>
                                {myprojects &&
                                    <div className={classes.wrapperProductsFromProjects}>
                                        <h1 className={classes.headingProducts}>
                                            <FormattedMessage
                                                id={'cartPage.headingProducts'}
                                                defaultMessage={'Products from projects'}
                                            />
                                        </h1>
                                        <div className={classes.wrapperValeurProduits}>
                                            <span>{projectsDansPanier[0].length} projects</span>
                                            <span className={classes.circleIcon}><FontAwesomeIcon icon={faCircle} /></span>
                                            <span>Valeur</span>
                                        </div>
                                    </div>
                                }
                                {myprojects && itemsWithProject.length >= 1 && (

                                    <>
                                        {arrayItensParProjets.map(item => (
                                           
                                                <div className={classes.items_container_projet}>
                                                    <div className={classes.wrapperProductsWithProject}>
                                                        <h1 className={classes.headingProductsWithProject}>
                                                            <FormattedMessage
                                                                id={'cartPage.headingProducts'}
                                                                defaultMessage={Object.keys(item)[0]}
                                                            />
                                                        </h1>
                                                        <div className={classes.wrapperValeurProduits}>
                                                            <span>{item.qty} products</span>
                                                            <span className={classes.circleIcon}><FontAwesomeIcon icon={faCircle} /></span>
                                                            <span>Valeur</span>
                                                            <span onClick={() => { setProductsWithProject(!productsWithProject) }}>{productsWithProject ? <FontAwesomeIcon icon={faChevronUp} style={{ color: "#8DC74C", marginLeft: "10px", }} /> : <FontAwesomeIcon icon={faChevronDown} style={{ color: "#8DC74C", marginLeft: "10px", }} />}</span>
                                                        </div>
                                                    </div>

                                                    {/* il faut verifier si le category est !null si true vient le produit ici*/}
                                                    {productsWithProject && itemsWithProject ?
                                                        <ProductListing setIsCartUpdating={setIsCartUpdating} products={itemsWithProject} cart={true} />
                                                        :
                                                        <div>
                                                        </div>
                                                    }
                                                </div>
                                        ))}
                                    </>
                                )
                                }
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
