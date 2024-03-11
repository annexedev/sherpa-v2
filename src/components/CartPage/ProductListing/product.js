import React, { useMemo, Component } from 'react';
import { gql } from '@apollo/client';
import { Link, resourceUrl } from 'src/drivers';
import { useProduct } from 'src/peregrine/lib/talons/CartPage/ProductListing/useProduct';
import { Price } from '@magento/peregrine';
import CustomProductOptions from './productOptions';
import BundleProductOptions from './bundleOptions';

import { mergeClasses } from '../../../classify';
import Kebab from '../../LegacyMiniCart/kebab';
import ProductOptions from '../../LegacyMiniCart/productOptions';
import Quantity from './quantity';
import Section from '../../LegacyMiniCart/section';
import Image from '../../Image';
import defaultClasses from './product.css';
import { CartPageFragment } from '../cartPageFragments.gql';
import { AvailableShippingMethodsCartFragment } from '../PriceAdjustments/ShippingMethods/shippingMethodsFragments.gql';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useIntl } from 'react-intl';
import { useItem } from '@magento/peregrine/lib/talons/MiniCart/useItem';
import Icon from '../../Icon';
import { Trash2 as DeleteIcon } from 'react-feather';
/*import { useCategoryAddToCart  } from '../../../peregrine/lib/talons/ProductFullDetail/useProductFullDetail';
import ADD_SIMPLE_MUTATION from '../../../queries/addSimpleProductsToCart.graphql';*/



const IMAGE_SIZE = 100;

const Product = props => {

    /*const catProps = useCategoryAddToCart({
        addSimpleProductToCartMutation: ADD_SIMPLE_MUTATION
    });
    
    const { handleAddToCart } = catProps; */

    const { item, setActiveEditItem, setIsCartUpdating, projectQty, wid, disableQuantity } = props;
    const { formatMessage } = useIntl();

    let productUrlSuffix = '';
    const [{ isSignedIn }] = useUserContext();
    const { customizable_options, bundle_options } = item;


    const talonProps = useProduct({
        item,
        wid,
        mutations: {
            removeItemMutation: REMOVE_ITEM_MUTATION,
            updateItemQuantityMutation: UPDATE_QUANTITY_MUTATION
        },
        setActiveEditItem,
        setIsCartUpdating
    });


    const {
        errorMessage,
        handleEditItem,
        handleRemoveFromCart,
        handleToggleFavorites,
        handleUpdateItemQuantity,
        isEditable,
        isFavorite,
        product
    } = talonProps;

    const {
        currency,
        image,
        name,
        options,
        quantity,
        stockStatus,
        unitPrice,
        urlKey,
        sku,
        urlSuffix
    } = product;
    if (urlSuffix && urlSuffix != 'null') {
        productUrlSuffix = urlSuffix;
    }

    const classes = mergeClasses(defaultClasses, props.classes);

    const editItemSection = isEditable ? (
        <Section
            text={formatMessage({
                id: 'product.editItem',
                defaultMessage: 'Edit item'
            })}
            onClick={handleEditItem}
            icon="Edit2"
            classes={{ text: classes.sectionText }}
        />
    ) : null;

    const itemLink = useMemo(
        () => resourceUrl(`/${urlKey}${productUrlSuffix}`),
        [urlKey, productUrlSuffix]
    );

    const stockStatusMessage =
        stockStatus === 'OUT_OF_STOCK' ? 'Out-of-stock' : '';

    /* --------  DELETE ----------- */

    const handleRemoveItem = handleRemoveFromCart;
    const itemID = item.id;
    const { isDeleting, removeItem } = useItem({
        itemID,
        handleRemoveItem
    });
    // const rootClass = isDeleting ? classes.root_disabled : classes.root;

    class SoldIn extends Component {
        constructor() {
            super();
            this.state = {
                pageData: []
            };
        }

        componentDidMount() {

            let lng = '';
            if (document.getElementById('currentLng') != null) {
                lng = document.getElementById('currentLng').innerHTML;
            }
            let activeLng = '';
            if (lng == 'Français') {
                activeLng = 2;
            } else {
                activeLng = 0;
            }

            let productId = this.props.pid;

            let dataURL =
                'https://data.sherpagroupav.com/get_soldin.php?pid=' + productId + '&sid=' + activeLng;

            fetch(dataURL)
                .then(res => res.json())
                .then(res => {
                    this.setState({
                        pageData: res
                    });
                });
        }

        render() {
            let soldin = this.state.pageData.soldin && this.state.pageData.soldin;
            if (soldin) {
                return (
                    <>{soldin}</>
                )
            } else {
                return (<></>);
            }
        }
    }

    class BrandName extends Component {
        constructor() {
            super();
            this.state = {
                pageData: []
            };
        }

        componentDidMount() {
            let productId = this.props.pid;
            let dataURL =
                'https://data.sherpagroupav.com/get_brandname.php?pid=' + productId;

            fetch(dataURL)
                .then(res => res.json())
                .then(res => {
                    this.setState({
                        pageData: res
                    });
                });
        }

        render() {
            let brandname = this.state.pageData.brandname && this.state.pageData.brandname;
            if (brandname) {
                return (
                    <>{brandname}</>
                )
            } else {
                return (<></>);
            }
        }
    }

    return (
        <li className={classes.root}>
            <span className={classes.errorText}>{errorMessage}</span>
            <div className={classes.item}>
                <Link to={itemLink} className={classes.imageContainer}>
                    <Image
                        alt={name}
                        classes={{
                            root: classes.imageRoot,
                            image: classes.image
                        }}
                        width={IMAGE_SIZE}
                        resource={image}
                    />
                </Link>
                <div className={classes.details}>
                    <Link to={itemLink} className={classes.name}>
                        {name}
                    </Link>
                    <ProductOptions
                        options={options}
                        classes={{
                            options: classes.options,
                            optionLabel: classes.optionLabel
                        }}
                    />
                    {customizable_options && (
                        <CustomProductOptions
                            options={customizable_options}
                            classes={{
                                options: classes.options
                            }}
                        />
                    )}
                    {bundle_options && (
                        <BundleProductOptions
                            options={bundle_options}
                            classes={{
                                options: classes.options
                            }}
                        />
                    )}
                    <span><strong>Part #</strong> {product.sku}</span>
                    <span><strong>Brand:</strong> <BrandName pid={item.product.id} /></span>

                    <span><strong>Sold in:</strong> <SoldIn pid={item.product.id} /></span>
                    {/* <span className={classes.price}>
                        <Price currencyCode={currency} value={unitPrice} />
                    </span> */}
                    <span className={classes.stockStatusMessage}>
                        {stockStatusMessage}
                    </span>
                    {disableQuantity == 1 ? (
                        <div className={classes.quantity}>
                            <Quantity
                                item={item}
                                itemId={item.id}
                                initialValue={quantity}
                                onChange={handleUpdateItemQuantity}
                                setActiveEditItem={setActiveEditItem}
                                setIsCartUpdating={setIsCartUpdating}
                                productId={'_' + item.product.id}
                                wid={wid}
                                projectQuantity={projectQty}
                            />
                        </div>
                    )
                        :
                        <div className={classes.quantity}>
                            <Quantity
                                item={item}
                                itemId={item.id}
                                initialValue={quantity}
                                onChange={handleUpdateItemQuantity}
                                setActiveEditItem={setActiveEditItem}
                                setIsCartUpdating={setIsCartUpdating}
                                productId={'_' + item.product.id}
                                wid=''
                                projectQuantity={projectQty}
                            />
                        </div>

                    }
                    {/* {disableQuantity != 1 && (
                        <div className={classes.quantity}>
                            <p>{quantity} in your cart</p>
                        </div>
                    )} */}
                </div>
                {/* {disableQuantity == 1 && ( */}
                <button
                    onClick={removeItem}
                    type="button"
                    className={classes.deleteButton}
                // disabled={isDeleting}
                >
                    <Icon
                        size={16}
                        src={DeleteIcon}
                        classes={{ icon: classes.editIcon }}
                    />
                </button>
                {/* )}  */}
                {/* <Kebab classes={{ root: classes.kebab }} disabled={true}  onClick={handleRemoveFromCart}> */}
                {/* {!isSignedIn && (
                        <Section
                            text={
                                isFavorite
                                    ? formatMessage({
                                          id: 'product.Removefav',
                                          defaultMessage:
                                              'Remove from favorites'
                                      })
                                    : formatMessage({
                                          id: 'product.movefav',
                                          defaultMessage: 'Move to favorites'
                                      })
                            }
                            onClick={() => {
                                document.getElementById('user_account').click();
                            }}
                            icon="Heart"
                            isFilled={isFavorite}
                            classes={{ text: classes.sectionText }}
                        />
                    )}
                    {isSignedIn && (
                        <Section
                            text={
                                isFavorite
                                    ? formatMessage({
                                          id: 'product.Removefav',
                                          defaultMessage:
                                              'Remove from favorites'
                                      })
                                    : formatMessage({
                                          id: 'product.movefav',
                                          defaultMessage: 'Move to favorites'
                                      })
                            }
                            onClick={handleToggleFavorites}
                            icon="Heart"
                            isFilled={isFavorite}
                            classes={{ text: classes.sectionText }}
                        />
                        )} */}

                {/* {editItemSection} */}
                {/* <Section
                        text={formatMessage({
                            id: 'product.removeCart',
                            defaultMessage: 'Remove from cart'
                        })}
                        onClick={handleRemoveFromCart}
                        icon="Trash"
                        classes={{ text: classes.sectionText }}
                    /> */}
                {/* </Kebab> */}
            </div>
        </li>
    );
};

export default Product;

export const REMOVE_ITEM_MUTATION = gql`
    mutation removeItem($cartId: String!, $itemId: Int! , $wid: String) {
        removeItemFromCart(input: { cart_id: $cartId, cart_item_id: $itemId , category_id: $wid , is_cart: true })
            @connection(key: "removeItemFromCart") {
            cart {
                id
                ...CartPageFragment
                ...AvailableShippingMethodsCartFragment
            }
        }
    }
    ${CartPageFragment}
    ${AvailableShippingMethodsCartFragment}
`;

export const UPDATE_QUANTITY_MUTATION = gql`
    mutation updateItemQuantity(
        $cartId: String!
        $itemId: Int!
        $quantity: Float!
        $wid: String ) {
        updateCartItems(
            input: {
                cart_id: $cartId
                cart_items: [{ cart_item_id: $itemId, quantity: $quantity , category_id: $wid }]
            }
        ) @connection(key: "updateCartItems") {
            cart {
                id
                ...CartPageFragment
                ...AvailableShippingMethodsCartFragment
            }
        }
    }
    ${CartPageFragment}
    ${AvailableShippingMethodsCartFragment}
`;
