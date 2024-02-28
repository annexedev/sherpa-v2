import React from 'react';
import { Form } from 'informed';
import { func, number, string } from 'prop-types';
import { Minus as MinusIcon, Plus as PlusIcon } from 'react-feather';
import { useQuantity } from '@magento/peregrine/lib/talons/CartPage/ProductListing/useQuantity';
import { useProduct } from 'src/peregrine/lib/talons/CartPage/ProductListing/useProduct';
import { Price } from '@magento/peregrine';
import { gql } from '@apollo/client';

import { CartPageFragment } from '../cartPageFragments.gql';
import { AvailableShippingMethodsCartFragment } from '../PriceAdjustments/ShippingMethods/shippingMethodsFragments.gql';



import { mergeClasses } from '../../../classify';
import Icon from '../../Icon';
import TextInput from '../../TextInput';
import defaultClasses from './quantity.css';

export const QuantityFields = props => {
    const { initialValue, itemId, label, min, onChange, item, isChildren, productId, wid, ignore } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const iconClasses = { root: classes.icon };

    const talonProps = useQuantity({
        initialValue,
        min,
        onChange,
        isChildren,
        productId,
        wid
    });

    //console.log('PROD ID : '+productId+' '+wid);

    
    const price = item ? item.prices.price.value : 0;
    const currency = item ? item.prices.price.currency : 'CAD';

    const url = window.location.href;
    const cart = url.includes("cart");

    /* Si il y a rabais ( manque prendre les données pour avoir les rabais du produit ) */
    const ProduitDiscount = true;

    const {
        isDecrementDisabled,
        isIncrementDisabled,
        handleBlur,
        handleDecrement,
        handleIncrement,
        maskInput
    } = talonProps;

    return (
        <div className={cart ? [classes.root, classes.rootCart].join(' ') : classes.root }>
            {/* <label className={classes.label} htmlFor={itemId}>
                {label}
            </label> */}
            <div>
                <div className={classes.qty_inner_wrap + ' ' + classes.wrap}>
                    {/* { ignore == 1 ?
                        <button
                            aria-label={'Decrease Quantity'}
                            className={classes.button_decrement+' decrement'}
                            disabled={isDecrementDisabled}
                            onClick={handleDecrement}
                            type="button"
                            id={'minus_undefined'}
                            data-wid={wid}
                            data-pid={productId}
                            data-pidselect={'m'+productId}
                        >
                        
                            <Icon classes={iconClasses} src={MinusIcon} size={22} />
                        </button>
                        : */}
                        <button
                            aria-label={'Decrease Quantity'}
                            className={classes.button_decrement+' decrement'}
                            // disabled={isDecrementDisabled}
                            onClick={handleDecrement}
                            type="button"
                            // id={'minus_'+productId}
                            // data-wid={wid}

                        >
                            <Icon classes={iconClasses} src={MinusIcon} size={22} />
                        </button>
                    {/* } */}
                   
                    <div className={classes.qty_field_wrap}>
                        <TextInput
                            aria-label="Item Quantity"
                            classes={{ input: classes.input }}
                            field="quantity"
                            id={itemId}
                            inputMode="numeric"
                            mask={maskInput}
                            min={min}
                            onBlur={handleBlur}
                            pattern="[0-9]*"
                        
                        />
                    </div>
                    {/* { ignore == 1 ?
                        <button
                            aria-label={'Increase Quantity'}
                            className={classes.button_increment+' increment'}
                            disabled={isIncrementDisabled}
                            onClick={handleIncrement}
                            type="button"
                            id={'plus_undefined'}
                            data-wid={wid}
                            data-pid={productId}
                            data-pidselect={'p'+productId}
                        >
                            <Icon classes={iconClasses} src={PlusIcon} size={20} />
                        </button>
                        : */}
                        <button
                            aria-label={'Increase Quantity'}
                            className={classes.button_increment+' increment'}
                            // disabled={isIncrementDisabled}
                            onClick={handleIncrement}
                            type="button"
                            // id={'plus_'+productId}
                            // data-wid={wid}
                        >
                            <Icon classes={iconClasses} src={PlusIcon} size={20} />
                        </button>
                    {/* } */}
                    
                </div>
                {cart &&
                    <div className={classes.wrapperPrice}>
                        <p>YOUR COST </p>
                        <p className={classes.priceWithDiscount}>${price}</p>
                        {ProduitDiscount && <p className={classes.initialPrice}>$30.00</p>}
                    </div>
                }
            </div>
            {cart &&

                <div className={classes.price}>
                    <span>
                        <Price currencyCode={currency} value={price * props.initialValue} />
                    </span>
                </div>
            }
        </div>
    );


};



const Quantity = props => {
    return (
        <Form
            initialValues={{
                quantity: props.initialValue
            }}
        >
            <QuantityFields {...props} />
        </Form>
    );
};

Quantity.propTypes = {
    initialValue: number,
    itemId: string,
    label: string,
    min: number,
    onChange: func,
    productId: number,
    ignore: number,
    wid: number
};

Quantity.defaultProps = {
    label: 'Quantity',
    min: 0,
    initialValue: 1,
    onChange: () => { }
};

QuantityFields.defaultProps = {
    min: 0,
    initialValue: 1,
    onChange: () => { }
};

export default Quantity;

// export const REMOVE_ITEM_MUTATION = gql`
//     mutation removeItem($cartId: String!, $itemId: Int!) {
//         removeItemFromCart(input: { cart_id: $cartId, cart_item_id: $itemId })
//             @connection(key: "removeItemFromCart") {
//             cart {
//                 id
//                 ...CartPageFragment
//                 ...AvailableShippingMethodsCartFragment
//             }
//         }
//     }
//     ${CartPageFragment}
//     ${AvailableShippingMethodsCartFragment}
// `;

// export const UPDATE_QUANTITY_MUTATION = gql`
//     mutation updateItemQuantity(
//         $cartId: String!
//         $itemId: Int!
//         $quantity: Float!
//     ) {
//         updateCartItems(
//             input: {
//                 cart_id: $cartId
//                 cart_items: [{ cart_item_id: $itemId, quantity: $quantity }]
//             }
//         ) @connection(key: "updateCartItems") {
//             cart {
//                 id
//                 ...CartPageFragment
//                 ...AvailableShippingMethodsCartFragment
//             }
//         }
//     }
//     ${CartPageFragment}
//     ${AvailableShippingMethodsCartFragment}
// `;

