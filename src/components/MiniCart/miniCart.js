import React, { Fragment, useEffect } from 'react';
import {
    Lock as LockIcon,
    AlertCircle as AlertCircleIcon,
    X as ClearIcon
} from 'react-feather';
import { bool, shape, string } from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { useScrollLock, Price, useToasts } from '@magento/peregrine';
import { useMiniCart } from 'src/peregrine/lib/talons/MiniCart/useMiniCart';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Button from '../Button';
import Icon from '../Icon';
import StockStatusMessage from '../StockStatusMessage';
import ProductList from './ProductList';
import defaultClasses from './miniCart.css';
import MiniCartOperations from './miniCart.gql';
import { useUserContext } from '@magento/peregrine/lib/context/user';

const clearIcon = <Icon src={ClearIcon} size={24} />;
const errorIcon = <Icon src={AlertCircleIcon} size={20} />;

/**
 * The MiniCart component shows a limited view of the user's cart.
 *
 * @param {Boolean} props.isOpen - Whether or not the MiniCart should be displayed.
 * @param {Function} props.setIsOpen - Function to toggle mini cart
 */
const MiniCart = React.forwardRef((props, ref) => {
    const { isOpen, setIsOpen } = props;
    const [{ isSignedIn }] = useUserContext();
    const { formatMessage } = useIntl();

    // Prevent the page from scrolling in the background
    // when the MiniCart is open.
    useScrollLock(isOpen);

    const talonProps = useMiniCart({
        setIsOpen,
        ...MiniCartOperations
    });

    const allowGuestCheckout = 1;

    // useEffect(() => {
    //   allowGuestCheckout = storage.getItem('allowGuestCheckout');
    // }, []);

    const {
        closeMiniCart,
        errorMessage,
        handleEditCart,
        handleProceedToCheckout,
        handleRemoveItem,
        loading,
        productList,
        subTotal,
        totalQuantity
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClass = isOpen ? classes.root_open : classes.root;
    const contentsClass = isOpen ? classes.contents_open : classes.contents;
    const quantityClassName = loading
        ? classes.quantity_loading
        : classes.quantity;
    const priceClassName = loading ? classes.price_loading : classes.price;

    const isCartEmpty = !(productList && productList.length);

    const [, { addToast }] = useToasts();

    useEffect(() => {
        if (errorMessage) {
            addToast({
                type: 'error',
                icon: errorIcon,
                message: errorMessage,
                dismissable: true,
                timeout: 7000
            });
        }
    }, [addToast, errorMessage]);

    const header = subTotal ? (
        <Fragment>
            <div className={classes.stockStatusMessageContainer}>
                <StockStatusMessage cartItems={productList} />
            </div>
            <span className={quantityClassName}>
                {totalQuantity}
                {formatMessage({
                    id: 'minicart.Items',
                    defaultMessage: ' Items'
                })}
            </span>
            <span className={priceClassName}>
                <span>
                    <FormattedMessage
                        id={'miniCart.priceClassName'}
                        defaultMessage={'Subtotal: '}
                    />
                </span>
                <Price
                    currencyCode={subTotal.currency}
                    value={subTotal.value}
                />
            </span>
        </Fragment>
    ) : null;

    const handleLoginTrigger = () => {
        document.getElementById('user_account').click();
    };

    const checkoutPageTrigger = () => {
        if (isSignedIn) {
            handleProceedToCheckout();
        } else {
            {
                if (typeof allowGuestCheckout != 'undefined') {
                    allowGuestCheckout == 1
                        ? handleProceedToCheckout()
                        : handleLoginTrigger();
                } else {
                    handleProceedToCheckout();
                }
            }
        }
    };
    const contents = isCartEmpty ? (
        <div className={classes.emptyCart + ' ' + classes.body}>
            <div className={classes.header + ' ' + classes.minicarT_header}>
                <span>My cart</span>
                <button onClick={closeMiniCart}>{clearIcon}</button>
            </div>
            <div className={classes.emptyMessage}>
                <FormattedMessage
                    id={'miniCart.emptyMessage'}
                    defaultMessage={'There are no items in your cart.'}
                />
            </div>
        </div>
    ) : (
        <Fragment>
            <div className={classes.header + ' ' + classes.minicarT_header}>
                <span>
                    {' '}
                    <FormattedMessage
                        id={'minicart.myCart'}
                        defaultMessage={'My cart'}
                    />
                </span>
                <button onClick={closeMiniCart}>{clearIcon}</button>
            </div>
            <div className={classes.header}>{header}</div>
            <div className={classes.body}>
                <ProductList
                    items={productList}
                    loading={loading}
                    handleRemoveItem={handleRemoveItem}
                    closeMiniCart={closeMiniCart}
                />
            </div>
            <div className={classes.footer}>
                <Button
                    onClick={checkoutPageTrigger}
                    priority="high"
                    className={classes.checkoutButton}
                    disabled={loading || isCartEmpty}
                >
                    <Icon
                        size={16}
                        src={LockIcon}
                        classes={{ icon: classes.checkoutIcon }}
                    />
                    <FormattedMessage
                        id={'miniCart.CHECKOUT'}
                        defaultMessage={'CHECKOUT'}
                    />
                </Button>
                <Button
                    onClick={handleEditCart}
                    priority="high"
                    className={classes.editCartButton}
                    disabled={loading || isCartEmpty}
                >
                    <FormattedMessage
                        id={'miniCart.editCartButton'}
                        defaultMessage={'Edit Cart'}
                    />
                </Button>
            </div>
        </Fragment>
    );

    return (
        <aside className={rootClass}>
            <div ref={ref} className={contentsClass}>
                {contents}
            </div>
        </aside>
    );
});

export default MiniCart;

MiniCart.propTypes = {
    classes: shape({
        root: string,
        root_open: string,
        contents: string,
        contents_open: string,
        header: string,
        body: string,
        footer: string,
        checkoutButton: string,
        editCartButton: string,
        emptyCart: string,
        emptyMessage: string,
        stockStatusMessageContainer: string
    }),
    isOpen: bool
};
