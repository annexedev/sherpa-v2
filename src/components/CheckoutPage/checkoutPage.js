import React, { Fragment, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { AlertCircle as AlertCircleIcon } from 'react-feather';
import { Link, useHistory } from 'react-router-dom';
import { useWindowSize, useToasts, Util } from '@magento/peregrine';
import { mergeClasses } from '../../classify';
import Button from '../Button';
import { Title } from '../Head';
import Icon from '../Icon';
import LinkButton from '../LinkButton';
import { fullPageLoadingIndicator } from '../LoadingIndicator';
import StockStatusMessage from '../StockStatusMessage';
import AddressBook from './AddressBook';
import OrderSummary from './OrderSummary';
import PaymentInformation from './PaymentInformation';
import PriceAdjustments from './PriceAdjustments';
import ShippingMethod from './ShippingMethod';
import ShippingInformation from './ShippingInformation';
import OrderConfirmationPage from './OrderConfirmationPage';
import ItemsReview from './ItemsReview';
import defaultClasses from './checkoutPage.css';
import CheckoutPageOperations from './checkoutPage.gql.js';
import searchClasses from '../SearchPage/searchPage.css';
import summaryOperations, {
    CUSTOM_TYPES
} from './PaymentInformation/summary.gql';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useAccountTrigger } from '@magento/peregrine/lib/talons/Header/useAccountTrigger';
import AccountMenu from '../AccountMenu';
import { useSummary } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useSummary';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { usePaypal } from '../../peregrine/lib/talons/CheckoutPage/usePaypalPayment';
import {
    CHECKOUT_STEP,
    useCheckoutPage
} from 'src/peregrine/lib/talons/CheckoutPage/useCheckoutPage';
import { useUserContext } from '@magento/peregrine/lib/context/user';

const errorIcon = <Icon src={AlertCircleIcon} size={20} />;

const CheckoutPage = props => {
    const history = useHistory();
    const propsData = history.location.state;
    const [{ isSignedIn }] = useUserContext();

    const { classes: propClasses } = props;
    const { formatMessage } = useIntl();
    const talonProps = useCheckoutPage({
        ...CheckoutPageOperations
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { BrowserPersistence } = Util;
    const storage = new BrowserPersistence();
    const allowGuestCheckout = storage.getItem('allowGuestCheckout');

    const [{ cart_id }] = useCartContext();

    const { selectedPaymentMethod } = useSummary({
        ...summaryOperations,
        typePolicies: CUSTOM_TYPES
    });
    const modalClass = isSubmitting
        ? defaultClasses.modal + ' ' + defaultClasses.modal_active
        : defaultClasses.modal;

    const {
        accountMenuIsOpen,
        accountMenuRef,
        setAccountMenuIsOpen,
        handleTriggerClick
    } = useAccountTrigger();
    const {
        /**
         * Enum, one of:
         * SHIPPING_ADDRESS, SHIPPING_METHOD, PAYMENT, REVIEW
         */
        activeContent,
        cartItems,
        checkoutStep,
        customer,
        error,
        handlePlaceOrder,
        hasError,
        isCartEmpty,
        isGuestCheckout,
        isLoading,
        isUpdating,
        orderDetailsData,
        orderDetailsLoading,
        orderNumber,
        placeOrderLoading,
        setCheckoutStep,
        setIsUpdating,
        setShippingInformationDone,
        setShippingMethodDone,
        setPaymentInformationDone,
        resetReviewOrderButtonClicked,
        handleReviewOrder,
        reviewOrderButtonClicked,
        toggleActiveContent
    } = talonProps;
    const { handleCreateToken, tokenResponse } = usePaypal();
    const [, { addToast }] = useToasts();

    useEffect(() => {
        if (hasError) {
            const message =
                error && error.message
                    ? error.message
                    : formatMessage({
                          id: 'checkoutPage.errorSubmit',
                          defaultMessage:
                              'Oops! An error occurred while submitting. Please try again.'
                      });
            addToast({
                type: 'error',
                icon: errorIcon,
                message,
                dismissable: true,
                timeout: 7000
            });

            if (process.env.NODE_ENV !== 'production') {
                console.error(error);
            }
        }
    }, [addToast, error, formatMessage, hasError]);

    const classes = mergeClasses(defaultClasses, propClasses);

    const windowSize = useWindowSize();
    const isMobile = windowSize.innerWidth <= 960;

    let checkoutContent;

    const heading = isGuestCheckout
        ? formatMessage({
              id: 'checkoutPage.guestCheckout',
              defaultMessage: 'Guest Checkout'
          })
        : formatMessage({
              id: 'checkoutPage.checkout',
              defaultMessage: 'Checkout'
          });

    if (propsData && propsData.orderNumber) {
        return (
            <OrderConfirmationPage
                data={propsData.orderDetailsData}
                orderNumber={propsData.orderNumber}
            />
        );
    }

    if (orderNumber) {
        return (
            <OrderConfirmationPage
                data={orderDetailsData}
                orderNumber={orderNumber}
            />
        );
    } else if (isLoading) {
        return fullPageLoadingIndicator;
    } else if (isCartEmpty) {
        checkoutContent = (
            <div className={classes.empty_cart_container}>
                <div className={classes.heading_container}>
                    <h1 className={classes.heading}>{heading}</h1>
                </div>
                <div className={classes.noResult_wrap}>
                    <div className={searchClasses.noResult}>
                        <span className={searchClasses.noResult_icon}>
                            <FontAwesomeIcon icon={faExclamationTriangle} />
                        </span>
                        <p className={classes.heading_container + ' ' + 'px-3'}>
                            <FormattedMessage
                                id={'checkoutPage.emptyMessage'}
                                defaultMessage={
                                    'There are no items in your cart.'
                                }
                            />
                        </p>
                    </div>
                </div>
            </div>
        );
    } else {
        if (
            isSignedIn ||
            (!isSignedIn &&
                typeof allowGuestCheckout != 'undefined' &&
                allowGuestCheckout == 1) ||
            (!isSignedIn && typeof allowGuestCheckout == 'undefined')
        ) {
            const loginButton = isGuestCheckout ? (
                <div className={classes.signin_container}>
                    <LinkButton
                        className={classes.sign_in}
                        onClick={handleTriggerClick}
                    >
                        <FormattedMessage
                            id={'checkoutPage.loginAndCheckoutFaster'}
                            defaultMessage={'Login and Checkout Faster'}
                        />
                    </LinkButton>
                    <AccountMenu
                        ref={accountMenuRef}
                        accountMenuIsOpen={accountMenuIsOpen}
                        setAccountMenuIsOpen={setAccountMenuIsOpen}
                        handleTriggerClick={handleTriggerClick}
                    />
                </div>
            ) : null;

            const shippingMethodSection =
                checkoutStep >= CHECKOUT_STEP.SHIPPING_METHOD ? (
                    <ShippingMethod
                        pageIsUpdating={isUpdating}
                        onSave={setShippingMethodDone}
                        setPageIsUpdating={setIsUpdating}
                    />
                ) : (
                    <h3 className={classes.shipping_method_heading}>
                        <FormattedMessage
                            id={'checkoutPage.shippingMethodStep'}
                            defaultMessage={'2. Shipping Method'}
                        />
                    </h3>
                );

            const paymentInformationSection =
                checkoutStep >= CHECKOUT_STEP.PAYMENT ? (
                    <>
                        <PaymentInformation
                            onSave={setPaymentInformationDone}
                            checkoutError={error}
                            resetShouldSubmit={resetReviewOrderButtonClicked}
                            setCheckoutStep={setCheckoutStep}
                            shouldSubmit={reviewOrderButtonClicked}
                        />
                    </>
                ) : (
                    <h3 className={classes.payment_information_heading}>
                        <FormattedMessage
                            id={'checkoutPage.paymentInformationStep'}
                            defaultMessage={'3. Payment Information'}
                        />
                    </h3>
                );

            const priceAdjustmentsSection =
                checkoutStep === CHECKOUT_STEP.PAYMENT ? (
                    <div className={classes.price_adjustments_container}>
                        <PriceAdjustments setPageIsUpdating={setIsUpdating} />
                    </div>
                ) : null;
            const stepOneClass =
                checkoutStep == 1
                    ? classes.shipping_information_container +
                      ' ' +
                      classes.base_wrap +
                      ' ' +
                      classes.active_step
                    : classes.shipping_information_container +
                      ' ' +
                      classes.base_wrap;
            const stepTwoClass =
                checkoutStep == 2
                    ? classes.shipping_method_container +
                      ' ' +
                      classes.base_wrap +
                      ' ' +
                      classes.active_step
                    : classes.shipping_method_container +
                      ' ' +
                      classes.base_wrap;
            const stepThreeClass =
                checkoutStep == 3
                    ? classes.payment_information_container +
                      ' ' +
                      classes.base_wrap +
                      ' ' +
                      classes.active_step
                    : classes.payment_information_container +
                      ' ' +
                      classes.base_wrap;

            const reviewOrderButton =
                checkoutStep === CHECKOUT_STEP.PAYMENT ? (
                    <Button
                        onClick={handleReviewOrder}
                        priority="high"
                        className={classes.review_order_button}
                        disabled={reviewOrderButtonClicked || isUpdating}
                    >
                        <FormattedMessage
                            id={'checkoutPage.reviewOrder'}
                            defaultMessage={'Review Order'}
                        />
                    </Button>
                ) : null;

            const itemsReview =
                checkoutStep === CHECKOUT_STEP.REVIEW ? (
                    <div className={classes.items_review_container}>
                        <ItemsReview />
                    </div>
                ) : null;
            const OrderPlace = async () => {
                setIsSubmitting(true);
                handleCreateToken({ cart_id });
                setIsSubmitting(false);
                // await props.placeOrder();
            };
            const placeOrderButton =
                checkoutStep === CHECKOUT_STEP.REVIEW ? (
                    <>
                        {selectedPaymentMethod.code == 'paypal_express' &&
                            paymentInformationSection && (
                                <Button
                                    onClick={OrderPlace}
                                    priority="high"
                                    className={classes.place_order_button}
                                    disabled={
                                        isUpdating ||
                                        placeOrderLoading ||
                                        orderDetailsLoading
                                    }
                                >
                                    <FormattedMessage
                                        id={'checkoutPage.placeOrder'}
                                        defaultMessage={'Place Order'}
                                    />
                                </Button>
                            )}

                        {selectedPaymentMethod.code != 'paypal_express' && (
                            <Button
                                onClick={handlePlaceOrder}
                                priority="high"
                                className={classes.place_order_button}
                                disabled={
                                    isUpdating ||
                                    placeOrderLoading ||
                                    orderDetailsLoading
                                }
                            >
                                <FormattedMessage
                                    id={'checkoutPage.placeOrder'}
                                    defaultMessage={'Place Order'}
                                />
                            </Button>
                        )}
                    </>
                ) : null;

            var starturl =
                tokenResponse &&
                tokenResponse.paypal_urls &&
                tokenResponse.paypal_urls.start;
            if (starturl) {
                //     localStorage.setItem('sturl', JSON.stringify(tokenResponse));
                //     localStorage.setItem('sturl', JSON.stringify(tokenResponse.paypal_urls.start));
                window.location.href = tokenResponse.paypal_urls.start;
            }
            // If we're on mobile we should only render price summary in/after review.
            const shouldRenderPriceSummary = !(
                isMobile && checkoutStep < CHECKOUT_STEP.REVIEW
            );

            const orderSummary = shouldRenderPriceSummary ? (
                <div className={classes.summaryContainer}>
                    <strong className={classes.summaryContainer_heading}>
                        {formatMessage({
                            id: 'checkoutPage.orderSummary',
                            defaultMessage: ' Order summary'
                        })}
                    </strong>
                    <OrderSummary isUpdating={isUpdating} />
                </div>
            ) : null;

            let headerText;

            if (isGuestCheckout) {
                headerText = formatMessage({
                    id: 'checkoutPage.guestCheckout',
                    defaultMessage: 'Guest Checkout'
                });
            } else if (customer.default_shipping) {
                headerText = formatMessage({
                    id: 'checkoutPage.reviewAndPlaceOrder',
                    defaultMessage: 'Checkout'
                });
            } else {
                headerText = formatMessage(
                    { id: 'checkoutPage.greeting', defaultMessage: 'Welcome' },
                    { firstname: customer.firstname }
                );
            }

            const checkoutContentClass =
                activeContent === 'checkout'
                    ? classes.checkoutContent
                    : classes.checkoutContent_hidden;

            const stockStatusMessageElement = (
                <Fragment>
                    <FormattedMessage
                        id={'checkoutPage.stockStatusMessage'}
                        defaultMessage={
                            'An item in your cart is currently out-of-stock and must be removed in order to Checkout. Please return to your cart to remove the item.'
                        }
                    />
                    <Link className={classes.cartLink} to={'/cart'}>
                        <FormattedMessage
                            id={'checkoutPage.returnToCart'}
                            defaultMessage={'Return to Cart'}
                        />
                    </Link>
                </Fragment>
            );
            checkoutContent = (
                <div className={classes.checkoutContent_wrap}>
                    {loginButton}
                    <div className={checkoutContentClass}>
                        <div className={classes.checkoutContent_left_section}>
                            <div className={classes.heading_container}>
                                <StockStatusMessage
                                    cartItems={cartItems}
                                    message={stockStatusMessageElement}
                                />
                                <h1 className={classes.heading}>
                                    {headerText}
                                </h1>
                            </div>
                            <div className={stepOneClass}>
                                <ShippingInformation
                                    onSave={setShippingInformationDone}
                                    toggleActiveContent={toggleActiveContent}
                                />
                            </div>
                            
                            <div className={stepTwoClass}>
                                {shippingMethodSection}
                            </div>
                            <div className={stepThreeClass}>
                                {paymentInformationSection}
                            </div>

                            {priceAdjustmentsSection}
                            {reviewOrderButton}
                            {itemsReview}
                            {placeOrderButton}
                        </div>

                        <div className={classes.order_summary_wrap}>
                            {orderSummary}
                        </div>
                    </div>
                </div>
            );
        } else if (
            !isSignedIn &&
            typeof allowGuestCheckout != 'undefined' &&
            allowGuestCheckout == 0
        ) {
            checkoutContent = (
                <div className={classes.empty_cart_container}>
                    <div className={classes.heading_container}>
                        <h1 className={classes.heading}>{heading}</h1>
                    </div>
                    <div className={classes.noResult_wrap}>
                        <div className={searchClasses.noResult}>
                            <span className={searchClasses.noResult_icon}>
                                <FontAwesomeIcon icon={faExclamationTriangle} />
                            </span>
                            <p
                                className={
                                    classes.heading_container + ' ' + 'px-3'
                                }
                            >
                                <FormattedMessage
                                    id={'checkoutPage.guestCheckoutProhibited'}
                                    defaultMessage={
                                        'Please SignIn to continue to your checkout page'
                                    }
                                />
                            </p>
                        </div>
                    </div>
                </div>
            );
        }
    }

    const addressBookElement = !isGuestCheckout ? (
        <AddressBook
            activeContent={activeContent}
            toggleActiveContent={toggleActiveContent}
        />
    ) : null;

    return (
        <div className={'container' + ' ' + classes.checkout_page_container}>
            <div className={classes.root}>
                <Title>
                    {formatMessage(
                        {
                            id: 'checkoutPage.titleCheckout',
                            defaultMessage: 'Checkout'
                        },
                        { name: STORE_NAME }
                    )}
                </Title>
                {checkoutContent}
                {addressBookElement}
                <React.Fragment>
                    {isSubmitting && (
                        <div className={modalClass}>
                            <div className={defaultClasses.loader_div}>
                                <div className={defaultClasses.ball_pulse}>
                                    <div />
                                    <div />
                                    <div />
                                </div>
                            </div>
                        </div>
                    )}
                </React.Fragment>
            </div>
        </div>
    );
};

export default CheckoutPage;
