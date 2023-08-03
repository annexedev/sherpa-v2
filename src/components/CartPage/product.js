import React, { useState, useEffect } from 'react';
import { Link, resourceUrl } from 'src/drivers';
import {
    useCategoryAddToCart,
    useAddItemToWishlist
} from '../../peregrine/lib/talons/ProductFullDetail/useProductFullDetail';
import ADD_SIMPLE_MUTATION from '../../queries/addSimpleProductsToCart.graphql';
import CREATE_CART_MUTATION from '../../queries/createCart.graphql';
import GET_CART_DETAILS_QUERY from '../../queries/getCartDetails.graphql';
import ADD_TO_WISHLIST_MUTATION from '../../queries/addItemToWishlist.graphql';
import REMOVE_FROM_WISHLIST_MUTATION from '../../queries/removeFromWishlist.graphql';
import WishListQuery from '../../queries/getWishlist.graphql';
import {
    useWishlist,
    useDeleteFromWishlist
} from '../../peregrine/lib/talons/MyAccount/useDashboard';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { useToasts, Price } from '@magento/peregrine';
import { gql } from '@apollo/client';
import { ProductListingFragment } from '../CartPage/ProductListing/productListingFragments';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import defaultClasses from '../CedHome/home.css';
import cedClasses from '../MyWishlist/wishlist.css';
import cartClasses from './cartPage.css';
import proClasses from '../ProductFullDetail/productFullDetail.css';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';

const Product = props => {
    const { value } = props;
    const [, { addToast }] = useToasts();
    const [{ isSignedIn }] = useUserContext();
    const [removeWishlistMsg, setRemoveWishlistMsg] = useState(false);
    const [addedWishlistMsg, setAddedWishlistMsg] = useState(false);
    const [showAlertMsg, setShowAlertMsg] = useState(false);
    const [loaderName, setLoaderName] = useState('');
    var image = resourceUrl(value.small_image.url, {
        type: 'image-product'
    });

    const catProps = useCategoryAddToCart({
        addSimpleProductToCartMutation: ADD_SIMPLE_MUTATION,
        createCartMutation: CREATE_CART_MUTATION,
        getCartDetailsQuery: GET_CART_DETAILS_QUERY,
        setShowAlertMsg
    });

    const { handleAddToCart, success, isAddingItem } = catProps;

    const wishlistProps = useWishlist({
        query: WishListQuery
    });

    const { data, refetch } = wishlistProps;
    let addedToWishlist = false;
    if (typeof data != 'undefined') {
        data.forEach(function(elem) {
            if (elem.product.id == value.id) {
                addedToWishlist = true;
            }
        });
    }

    const addItemToWishlistTalonProps = useAddItemToWishlist({
        query: ADD_TO_WISHLIST_MUTATION
    });
    const {
        addItemToWishlist,
        wishlistResponse,
        addingToWishlist
    } = addItemToWishlistTalonProps;

    const addtowishlist = async product_id => {
        await addItemToWishlist({
            product_id: product_id
        });
        setAddedWishlistMsg(true);
    };

    const deleteData = useDeleteFromWishlist({
        query: REMOVE_FROM_WISHLIST_MUTATION
    });
    const { handleRemoveItem, removeResponse } = deleteData;
    const removeFromWishlist = async product_id => {
        await handleRemoveItem({
            product_id: product_id
        });
        setRemoveWishlistMsg(true);
    };

    useEffect(() => {
        if (
            removeResponse &&
            removeResponse.removeFromWishlist &&
            removeResponse.removeFromWishlist.success &&
            removeWishlistMsg
        ) {
            addToast({
                type: 'info',
                message: removeResponse.removeFromWishlist.message,
                dismissable: true,
                timeout: 4000
            });
            refetch();
            setRemoveWishlistMsg(false);
        } else {
            if (
                wishlistResponse &&
                wishlistResponse.addItemToWishlist &&
                wishlistResponse.addItemToWishlist.success &&
                addedWishlistMsg
            ) {
                addToast({
                    type: 'info',
                    message: wishlistResponse.addItemToWishlist.message,
                    dismissable: true,
                    timeout: 4000
                });
                refetch();
                setAddedWishlistMsg(false);
            }
        }
    }, [
        addToast,
        setAddedWishlistMsg,
        wishlistResponse,
        refetch,
        setRemoveWishlistMsg,
        removeResponse,
        addedWishlistMsg,
        removeWishlistMsg
    ]);

    if (success && showAlertMsg) {
        addToast({
            type: 'info',
            message: name + ' added to the cart.',
            dismissable: true,
            timeout: 4000
        });
        setShowAlertMsg(false);
    }

    const addTocartHtml = () => {
        return (
            <div className={defaultClasses.add_to_cart_Wrap}>
                {value.__typename == 'SimpleProduct' && (
                    <button
                        className={
                            defaultClasses.add_to_cart_btn +
                            ' ' +
                            cartClasses.add_to_cart_btn
                        }
                        onClick={() => {
                            handleAddToCart(value);
                            setLoaderName(value.name);
                        }}
                    >
                        ADD TO CART
                    </button>
                )}
                {value.__typename != 'SimpleProduct' && (
                    <Link
                        to={resourceUrl(value['url_key'])}
                        className={
                            defaultClasses.add_to_cart_btn +
                            ' ' +
                            cartClasses.add_to_cart_btn
                        }
                    >
                        ADD TO CART
                    </Link>
                )}
                {isAddingItem && value.name == loaderName && (
                    <div
                        className={
                            proClasses.modal +
                            ' ' +
                            proClasses.modal_active +
                            ' ' +
                            defaultClasses.modal_active +
                            ' ' +
                            proClasses.galler_modal_active
                        }
                    >
                        <div className={proClasses.loader_div}>
                            <div className={proClasses.ball_pulse}>
                                <div />
                                <div />
                                <div />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={defaultClasses.products_grid_item}>
            <div className={defaultClasses.noo_product_item}>
                <div className={defaultClasses.noo_product_inner}>
                    <div className={defaultClasses.noo_product_image}>
                        <Link to={resourceUrl(value['url_key'])}>
                            <img
                                src={image}
                                alt="product_name"
                                className="product_image"
                                height="300"
                                width="300"
                            />
                        </Link>
                        {/* wishlist */}
                        {false && isSignedIn && (
                            <div className={cedClasses.wishlist_carousel_Wrap}>
                                <section
                                    className={
                                        addedToWishlist || removeWishlistMsg
                                            ? cedClasses.wishlist_addition +
                                              ' ' +
                                              cedClasses.wishlist_added
                                            : cedClasses.wishlist_addition
                                    }
                                >
                                    {addingToWishlist && (
                                        <div className={cedClasses.loader_Wrap}>
                                            {fullPageLoadingIndicator}
                                        </div>
                                    )}
                                    {!addedToWishlist || removeWishlistMsg ? (
                                        <span
                                            role="button"
                                            className={
                                                cedClasses.wishlist_icon_wrap
                                            }
                                            onKeyDown={() =>
                                                addtowishlist(value.id)
                                            }
                                            tabIndex={0}
                                            onClick={() =>
                                                addtowishlist(value.id)
                                            }
                                        >
                                            <FontAwesomeIcon
                                                fill={
                                                    addedToWishlist ? 'red' : ''
                                                }
                                                icon={faHeart}
                                            />
                                        </span>
                                    ) : (
                                        <span
                                            role="button"
                                            className={
                                                cedClasses.wishlist_icon_wrap
                                            }
                                            onClick={() =>
                                                removeFromWishlist(value.id)
                                            }
                                            onKeyDown={() =>
                                                removeFromWishlist(value.id)
                                            }
                                            tabIndex={0}
                                        >
                                            <FontAwesomeIcon
                                                fill={
                                                    addedToWishlist ? 'red' : ''
                                                }
                                                icon={faHeart}
                                            />
                                        </span>
                                    )}
                                </section>
                            </div>
                        )}

                        <div className={defaultClasses.noo_details_wrapper}>
                            <h3 className={defaultClasses.product_name}>
                                <Link to={resourceUrl(value['url_key'])}>
                                    {value.name}
                                </Link>
                            </h3>
                            <div className={defaultClasses.vendor_price_wrap}>
                                <Price
                                    value={
                                        value.price.regularPrice.amount.value
                                    }
                                    currencyCode={
                                        value.price.regularPrice.amount.currency
                                    }
                                />
                            </div>
                            {addTocartHtml()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
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

export default Product;
