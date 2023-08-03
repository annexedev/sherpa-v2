import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useToasts } from '@magento/peregrine';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import React, { useEffect, useState } from 'react';
import {
    useDeleteFromWishlist,
    useWishlist
} from '../../peregrine/lib/talons/MyAccount/useDashboard';
import { useAddItemToWishlist } from '../../peregrine/lib/talons/ProductFullDetail/useProductFullDetail';
import ADD_TO_WISHLIST_MUTATION from '../../queries/addItemToWishlist.graphql';
import REMOVE_FROM_WISHLIST_MUTATION from '../../queries/removeFromWishlist.graphql';
import GET_CUSTOMER_QUERY from '../../queries/getCustomer.graphql';
import WishListQuery from '../../queries/getWishlist.graphql';
import cedClasses from './wishlist.css';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';

export default function Wishlist(props) {
    const { value } = props;
    const classes = mergeClasses(cedClasses, props.classes);

    const [{ isSignedIn }] = useUserContext();
    const [, { addToast }] = useToasts();
    const [removeWishlistMsg, setRemoveWishlistMsg] = useState(false);
    const [addedWishlistMsg, setAddedWishlistMsg] = useState(false);
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
        customerQuery: GET_CUSTOMER_QUERY,
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
        query: REMOVE_FROM_WISHLIST_MUTATION,
        customerQuery: GET_CUSTOMER_QUERY
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
                timeout: 10000
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
                    timeout: 10000
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
    return (
        <>
            {isSignedIn && (
                <div className={classes.wishlist_carousel_Wrap}>
                    <section
                        className={
                            addedToWishlist || removeWishlistMsg
                                ? classes.wishlist_addition +
                                  ' ' +
                                  classes.wishlist_added
                                : classes.wishlist_addition
                        }
                    >
                        {addingToWishlist && (
                            <div className={classes.loader_Wrap}>
                                {fullPageLoadingIndicator}
                            </div>
                        )}
                        {!addedToWishlist || removeWishlistMsg ? (
                            <span
                                role="button"
                                className={classes.wishlist_icon_wrap}
                                onClick={() => addtowishlist(value.id)}
                                onKeyDown={() => addtowishlist(value.id)}
                                tabIndex={0}
                            >
                                <FontAwesomeIcon
                                    fill={addedToWishlist ? 'red' : ''}
                                    icon={faHeart}
                                />
                            </span>
                        ) : (
                            <span
                                role="button"
                                className={classes.wishlist_icon_wrap}
                                onClick={() => removeFromWishlist(value.id)}
                                onKeyDown={() => removeFromWishlist(value.id)}
                                tabIndex={0}
                            >
                                <FontAwesomeIcon
                                    fill={addedToWishlist ? 'red' : ''}
                                    icon={faHeart}
                                />
                            </span>
                        )}
                    </section>
                </div>
            )}
        </>
    );
}
