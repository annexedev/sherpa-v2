import React, { useState, Component } from 'react';
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
import { Price } from '@magento/peregrine';
import defaultClasses from './cartPage.css';
import { GET_CART_DETAILS } from './cartPage.gql';
import searchClasses from '../SearchPage/searchPage.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faCircle, faCircleChevronUp, faChevronUp, faChevronDown, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';

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


    const [productsWithoutProject, setProductsWithoutProject] = useState(true);
    // const [productsWithProject, setProductsWithProject] = useState(false);
    const [openProjects, setOpenProjects] = useState({});



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


    const url = window.location.href;

    // const myprojects = url.includes("?id");


    // console.log(cartItems);

    const cartItemsJSON = cartItems.map(item => {

        /*const obj = JSON.parse(item.category);

        var x = 0;

        if(obj) {

            obj.forEach(function (arrayItem) {
                x = x + parseInt(arrayItem.qty);
            });
            
            if(x < item.quantity) {
                console.log('SURVIVANT');
            }
        }*/

        const itemCategory = item.category === '' || item.category === null ? false : true

        return {
            ...item,
            category: itemCategory ? JSON.parse(item.category) : null
        };
    });

    function checkProjectQuantity(arrayCategory, itemQuantity) {

        const obj = arrayCategory;

        var x = 0;

        if (obj) {

            obj.forEach(function (arrayItem) {
                x = x + parseInt(arrayItem.qty);
            });

            if (x < itemQuantity) {
                return true;
            } else {
                return false;
            }
        }
    }

    function getProjectProductQuantity(arrayCategory) {

        const obj = arrayCategory;

        var x = 0;

        if (obj) {

            obj.forEach(function (arrayItem) {
                x = x + parseInt(arrayItem.qty);
            });

            return x;
        }
    }

    //const itemsWithBoth 

    // console.log('ITEMS JSON', cartItemsJSON);

    // const itemsWithoutProject = cartItemsJSON.filter(item => item.category === null || item.category.lengt === 0 || item.category === '');

    const itemsWithoutProject = cartItemsJSON.filter(item => item.category === null || checkProjectQuantity(item.category, item.quantity));
    // console.log('itemsWithoutProject*****' , itemsWithoutProject);


    // const itemsWithoutProject = cartItemsJSON.filter(item => item.category === null || item.category !== null);

    const itemsWithProject = cartItemsJSON.filter(item => item.category !== null);
    let listOfProjects = [];
    // console.log('itemsWithProject*****' , itemsWithProject);


    const projectsDansPanier = itemsWithProject.map(project => project.category.map(item => listOfProjects.push(item)));

    // console.log('LIST OF PROJECTS',listOfProjects);
    // console.log('ITEMS WITH PROJECT', itemsWithProject);
    // console.log('ITEMS WITHOUT PROJECT', itemsWithoutProject);

    const myprojects = itemsWithProject.length >= 1 ? true : false; /* il faut verifier si il y a des projets */

    // const qntyProjects = itemsWithProject.map(project => (project.category.length))

    const totalPriceProductsWithoutProject = Number(itemsWithoutProject.reduce((total, product) => total + product.quantity * product.prices.price.value, 0).toFixed(2));

    // console.log(typeof totalPriceProductsWithoutProject);
    let productsFiltre = [];
    let productsParProjet = [];

    // Filtre basée dans la quantité 
    itemsWithProject.map(item => {

        item.category.map(projet => {
            let _item = { ...item.product, projet_qty: projet.qty, productID: projet.product_id, projetID: projet.category_id, projetNom: projet.category_name, prices: item.prices };
            productsFiltre.push(_item)
        })
    });

    // Groupe les itens par nom de projet
    const itensParProjets = productsFiltre.reduce((groupe, produit) => {
        // Verifie si il y a un key avec l'id du projet
        if (!groupe[produit.projetNom]) {
            groupe[produit.projetNom] = [];
        }
        groupe[produit.projetNom].push(produit);
        return groupe;
    }, {});

    const arrayItensParProjets = Object.keys(itensParProjets).map((key) => {
        return { [key]: itensParProjets[key] }
    });




    // Groupe les itens par nom de projet
    const itensParProjetsID = productsFiltre.reduce((groupe, produit) => {
        // Verifie si il y a un key avec l'id du projet
        if (!groupe[produit.projetID]) {
            groupe[produit.projetID] = [];
        }
        groupe[produit.projetID].push(produit);
        return groupe;
    }, {});

    const arrayItensParProjetsID = Object.keys(itensParProjetsID).map((key) => {
        return { [key]: itensParProjetsID[key] }
    });


    const unique = [...new Set(productsFiltre.map(item => item.projetID))];




    const priceSummary = hasItems ? (
        <PriceSummary isUpdating={isCartUpdating} isPageCheckout={true} projects={arrayItensParProjets} itemsWithoutProject={itemsWithoutProject} itemsWithProject={itemsWithProject} inputCategory={unique} />
    ) : null;



    const toggleProjectVisibility = (projectId, e) => {
        setOpenProjects(prevState => ({
            ...prevState,
            [projectId]: !prevState[projectId]
        }));
    };


    class CountProjectItem extends Component {

        render() {
            let inputCategory = this.props.inputCategory;
            let products = this.props.products;
            var qtyTotal = 0;
            products.forEach(function (entry) {
                var entryCategory = entry.category;

                entryCategory.forEach(function (entryCat) {

                    if (entryCat.category_id == inputCategory) {

                        //qtyTotal = qtyTotal + parseInt(entryCat.qty);

                        qtyTotal = qtyTotal + 1;

                    }

                })

            })

            if (qtyTotal == 1) {
                return qtyTotal + ' product';
            } else {
                return qtyTotal + ' products';
            }

            //return inputCategory.length;


        }
    }

    class CountProjectValue extends Component {

        render() {

            let inputCategory = this.props.inputCategory;
            let products = this.props.products;
            var priceTotal = 0;

            products.forEach(function (entry) {
                var entryCategory = entry.category;

                entryCategory.forEach(function (entryCat) {

                    if (entryCat.category_id == inputCategory) {

                        priceTotal = parseFloat(priceTotal) + (parseInt(entryCat.qty) * parseFloat(entry.prices.price.value));

                    }

                })

            })

            return (
                <Price
                    value={priceTotal}
                    currencyCode={'CAD'}
                />
            )
        }
    }

    class ProjectName extends Component {
        constructor() {
            super();
            this.state = {
                pageData: []
            };
        }

        componentDidMount() {
            let cid = this.props.cid;
            let dataURL =
                'https://data.sherpagroupav.com/get_projectname.php?cid=' + cid;
            fetch(dataURL)
                .then(res => res.json())
                .then(res => {
                    this.setState({
                        pageData: res
                    });
                });
        }

        render() {
            let projectname = this.state.pageData.pname && this.state.pageData.pname;
            if (this.state.pageData.pname && this.state.pageData.pname) {
                return (
                    <>{`${projectname}`} </>
                );
            } else {
                return (<></>);
            }
        }
    }

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
                                            id={'cartPage.headingWithoutProjects'}
                                            defaultMessage={'Products in your cart'}
                                        />
                                    </h1>
                                    <div className={classes.wrapperValeurProduits}>
                                        <span>{itemsWithoutProject.length}
                                        </span>
                                        {itemsWithoutProject.length === 1 ?
                                            <FormattedMessage
                                                id={'cartPage.product'}
                                                defaultMessage={'product'}
                                            />
                                            :
                                            <FormattedMessage
                                                id={'cartPage.products'}
                                                defaultMessage={'products'}
                                            />
                                        }
                                        <span className={classes.circleIcon}><FontAwesomeIcon icon={faCircle} /></span>
                                        <span><Price value={totalPriceProductsWithoutProject} currencyCode={'CAD'} /></span>
                                        <span className={classes.chevronDown} onClick={() => { setProductsWithoutProject(!productsWithoutProject) }}>{productsWithoutProject ? <FontAwesomeIcon icon={faChevronUp} style={{ color: "#8DC74C", marginLeft: "10px", }} /> : <FontAwesomeIcon icon={faChevronDown} style={{ color: "#8DC74C", marginLeft: "10px", }} />}
                                            {!productsWithoutProject &&
                                                <span className={classes.tooltiptext}>
                                                    <FormattedMessage
                                                        id={'cartPage.tooltipChevronDownProject'}
                                                        defaultMessage={'Click to expand'}
                                                    />
                                                </span>
                                            }
                                        </span>
                                    </div>
                                </div>
                                {productsWithoutProject &&
                                    <div className={classes.items_container}>
                                        {itemsWithoutProject.length >= 1 ?
                                            <ProductListing setIsCartUpdating={setIsCartUpdating} products={itemsWithoutProject} cart={true} isProject={0} />
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
                                                id={'cartPage.headingWithProjects'}
                                                defaultMessage={'Products from projects'}
                                            />
                                        </h1>
                                        {/*<div className={classes.wrapperValeurProduits}>
                                            <span>{projectsDansPanier[0].length} projects</span>
                                            <span className={classes.circleIcon}><FontAwesomeIcon icon={faCircle} /></span>
                                            <span>Valeur2</span>
                                        </div> */}
                                    </div>
                                }
                                {myprojects && itemsWithProject.length >= 1 && (

                                    <>

                                        {/* {unique.map(itemProjet => ( */}
                                        {Object.entries(arrayItensParProjetsID).map(([projectId, products]) => (

                                            <>

                                                {/* {arrayItensParProjets.map((item, index) => ( */}

                                                <div className={classes.items_container_projet} key={'item' + projectId}>
                                                    <div className={classes.wrapperProductsWithProject}>
                                                        <a href={'/myprojects?id=' + Object.keys(products)[0]} className={classes.headingProductsWithProject}>
                                                            <ProjectName cid={Object.keys(products)[0]} />
                                                            <span className={classes.tooltiptext}>
                                                                <FormattedMessage
                                                                    id={'cartPage.tooltipHeadingProject'}
                                                                    defaultMessage={'Click for project details'}
                                                                />
                                                            </span>
                                                        </a>
                                                        {/* {openProjects[projectId] &&  <div className={classes.ctaUpdate}><a href={"/myprojects?id=" + Object.keys(products)[0]}>Update your project items / quantity <FontAwesomeIcon icon={faLongArrowAltRight} style={{ color: "#8DC74C", marginLeft: "10px", }} /></a></div>} */}
                                                        <div className={classes.wrapperValeurProduits}>
                                                            <span><CountProjectItem products={itemsWithProject} inputCategory={Object.keys(products)[0]} /></span>
                                                            <span className={classes.circleIcon}><FontAwesomeIcon icon={faCircle} /></span>
                                                            <span><CountProjectValue products={itemsWithProject} inputCategory={Object.keys(products)[0]} /></span>
                                                            <span className={classes.chevronDown} onClick={() => { toggleProjectVisibility(projectId);  }}>{openProjects[projectId] ? <FontAwesomeIcon id={projectId} icon={faChevronUp} style={{ color: "#8DC74C", marginLeft: "10px", }} /> : <FontAwesomeIcon id={projectId} icon={faChevronDown} style={{ color: "#8DC74C", marginLeft: "10px", }} />}
                                                                {!openProjects[projectId] &&
                                                                    <span className={classes.tooltiptext}>
                                                                        <FormattedMessage
                                                                            id={'cartPage.tooltipChevronDownProject'}
                                                                            defaultMessage={'Click to expand'}
                                                                        />
                                                                    </span>
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {/* {openProjects[projectId] &&  <div className={classes.ctaUpdate}><a href={"/myprojects?id=" + Object.keys(products)[0]}>Update your project items / quantity <FontAwesomeIcon icon={faLongArrowAltRight} style={{ color: "#8DC74C", marginLeft: "10px", }} /></a></div>} */}

                                                    {/* ))} */}
                                                    {/* il faut verifier si le category est !null si true vient le produit ici*/}
                                                    {itemsWithProject && openProjects[projectId] ?

                                                        <ProductListing setIsCartUpdating={setIsCartUpdating} products={itemsWithProject} cart={true} inputCategory={Object.keys(products)[0]} isProject={1} />
                                                        :
                                                        <div>
                                                        </div>
                                                    }
                                                </div>

                                            </>

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
