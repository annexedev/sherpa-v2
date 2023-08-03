import React, { Fragment, Suspense, useEffect, useRef, useState } from 'react';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import { Form } from 'informed';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Breadcrumbs from '@magento/venia-ui/lib/components/Breadcrumbs';
import Button from '@magento/venia-ui/lib/components/Button';
import Carousel from '@magento/venia-ui/lib/components/ProductImageCarousel';
import FormError from '@magento/venia-ui/lib/components/FormError';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import RichText from '@magento/venia-ui/lib/components/RichText';
import { Modal } from '../Modal';
import { useCedContext } from 'src/peregrine/lib/context/ced';

import {
    ADD_CONFIGURABLE_MUTATION,
    ADD_SIMPLE_MUTATION,
    ADD_SIMPLE_CUSTOM_MUTATION,
    ADD_BUNDLE_MUTATION
} from './productFullDetail.gql';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faStar,
    faHeart,
    faCubes,
    faBoxes
} from '@fortawesome/free-solid-svg-icons';

import {
    useAddItemToWishlist,
    useProductMoreInfo,
    isCutomOptionPresent,
    isBundleOptionPresent,
    useProductFullDetail
} from '../../peregrine/lib/talons/ProductFullDetail/useProductFullDetail';

import moreInfoProductsGraphql from '../../queries/getMoreInfoProducts.graphql';
import GET_CUSTOMER_QUERY from '../../queries/getCustomer.graphql';
import Icon from '../Icon';
import { ChevronDown as ChevronDownIcon } from 'react-feather';

const chevrondownIcon = <Icon src={ChevronDownIcon} size={18} />;
import { useUserContext } from '@magento/peregrine/lib/context/user';
const LinkedProducts = React.lazy(() => import('./linkedProducts'));
const Options = React.lazy(() => import('../ProductOptions'));
const CustomOptions = React.lazy(() => import('../ProductCustomOptions'));
const ProductReviews = React.lazy(() => import('./productReviews'));
const BundleOptions = React.lazy(() => import('../ProductBundleOptions'));
const ProductSharingIcons = React.lazy(() => import('./productSharingIcons'));
const RecentProducts = React.lazy(() =>
    import('../RecentProducts/recentProducts')
);
const CompareButton = React.lazy(() => import('../Compare/compareButton'));

import { useToasts } from '@magento/peregrine';
// Correlate a GQL error message to a field. GQL could return a longer error
// string but it may contain contextual info such as product id. We can use
// parts of the string to check for which field to apply the error.
const ERROR_MESSAGE_TO_FIELD_MAPPING = {
    'The requested qty is not available': 'quantity',
    'Product that you are trying to add is not available.': 'quantity',
    "The product that was requested doesn't exist.": 'quantity'
};

// Field level error messages for rendering.
const ERROR_FIELD_TO_MESSAGE_MAPPING = {
    quantity: 'The requested quantity is not available.'
};
import cedClasses from './productFullDetail.css';

import {
    useWishlist,
    useDeleteFromWishlist
} from '../../peregrine/lib/talons/MyAccount/useDashboard';
import ADD_TO_WISHLIST_MUTATION from '../../queries/addItemToWishlist.graphql';
import REMOVE_FROM_WISHLIST_MUTATION from '../../queries/removeFromWishlist.graphql';
import WishListQuery from '../../queries/getWishlist.graphql';

import { QuantityFields } from '../CartPage/ProductListing/quantity';
import { FormattedMessage, useIntl } from 'react-intl';
import PriceRange from '../PriceRange';
import InStockAlert from '../InStockAlert/inStockAlert';

const ProductFullDetail = props => {
    const [scrollFlag, setScrollFlag] = useState(false);
    const handleClick = () => {
        if (!scrollFlag) setScrollFlag(true);
    };
    useEffect(() => {
        document.addEventListener('scroll', handleClick);
        return () => {
            document.removeEventListener('scroll', handleClick);
        };
    });
    let targetRef = useRef(' ');
    const { product } = props;

    const [, { addToast }] = useToasts();
    const [{ isSignedIn }] = useUserContext();
    const talonProps = useProductFullDetail({
        addConfigurableProductToCartMutation: ADD_CONFIGURABLE_MUTATION,
        addSimpleProductToCartMutation: ADD_SIMPLE_MUTATION,
        addSimpleCustomMutation: ADD_SIMPLE_CUSTOM_MUTATION,
        addBundleProductToCartMutation: ADD_BUNDLE_MUTATION,
        product
    });
    const { formatMessage } = useIntl();

    const { productMoreInfo } = useProductMoreInfo({
        query: moreInfoProductsGraphql,
        sku: product.sku
    });

    const wishlistProps = useWishlist({
        query: WishListQuery
    });

    const { data, refetch } = wishlistProps;
    let addedToWishlist = false;
    if (typeof data != 'undefined') {
        data.forEach(function(value) {
            if (value.product.id == product.id) {
                addedToWishlist = true;
            }
        });
    }

    const addItemToWishlistTalonProps = useAddItemToWishlist({
        customerQuery: GET_CUSTOMER_QUERY,
        query: ADD_TO_WISHLIST_MUTATION
    });
    const { addItemToWishlist, wishlistResponse } = addItemToWishlistTalonProps;

    const [removeWishlistMsg, setRemoveWishlistMsg] = useState(false);
    const [addedWishlistMsg, setAddedWishlistMsg] = useState(false);
    const [customOptionId, setCustomOptionId] = useState(' ');
    const [customOptionString, setCustomOptionString] = useState(' ');
    const [customPrice, setCustomPriceCheckbox] = useState(0);
    const [customPriceRadio, setCustomPriceRadio] = useState(0);
    const [customPriceMultiple, setCustomPriceMultiple] = useState(0);
    const [customPriceDropdown, setCustomPriceDropdown] = useState(0);
    const [customPricePercentRadio, setCustomPricePercentRadio] = useState(0);
    const [customPercDropDown, setCustomPercDropDown] = useState(0);
    const [customPercCheckbox, setCustomPercCheckbox] = useState(0);
    const [customField, setCustomField] = useState(0);
    const [customOptionArray, setCustomOptionArray] = useState([]);
    const [customArea, setCustomArea] = useState(0);
    const [showBundleOptions, setShowBundleOptions] = useState(false);
    const customArrayVar = [];
    customOptionArray &&
        customOptionArray.map(ele => {
            customArrayVar.push(Object.values(ele)[0]);
        });

    const {
        breadcrumbCategoryId,
        errorMessage,
        handleAddToCart,
        handleSelectionChange,
        isAddToCartDisabled,
        mediaGalleryEntries,
        productDetails,
        isAddingItem,
        only_x_left_in_stock,
        success
    } = talonProps;

    const classes = mergeClasses(cedClasses, props.classes);

    const [, { setOverlay }] = useCedContext();

    const options = isProductConfigurable(product) ? (
        <Suspense fallback={fullPageLoadingIndicator}>
            <Options
                onSelectionChange={handleSelectionChange}
                options={product.configurable_options}
            />
        </Suspense>
    ) : null;

    const bundleOptions = isBundleOptionPresent(product) ? (
        <Suspense fallback={fullPageLoadingIndicator}>
            <BundleOptions
                options={product.bundleItems}
                product={product}
                handleAddToCart={handleAddToCart}
                isAddingItem={isAddingItem}
                isAddToCartDisabled={isAddToCartDisabled}
                showBundleOptions={showBundleOptions}
                setShowBundleOptions={setShowBundleOptions}
                handleSetOverlay={setOverlay}
            />
        </Suspense>
    ) : null;

    const customOptions = isCutomOptionPresent(product) ? (
        <Suspense>
            <CustomOptions
                setCustomOptionArray={setCustomOptionArray}
                customOptionArray={customOptionArray}
                classes={classes}
                customPrice={customPrice}
                customOptionId={customOptionId}
                customOptionString={customOptionString}
                options={product.options}
                setCustomOptionId={setCustomOptionId}
                setCustomOptionString={setCustomOptionString}
                setCustomPriceCheckbox={setCustomPriceCheckbox}
                setCustomPriceRadio={setCustomPriceRadio}
                setCustomPriceMultiple={setCustomPriceMultiple}
                setCustomPriceDropdown={setCustomPriceDropdown}
                setCustomPricePercentRadio={setCustomPricePercentRadio}
                setCustomPercDropDown={setCustomPercDropDown}
                setCustomPercCheckbox={setCustomPercCheckbox}
                customPercCheckbox={customPercCheckbox}
                setCustomField={setCustomField}
                setCustomArea={setCustomArea}
            />
        </Suspense>
    ) : null;
    const breadcrumbs = breadcrumbCategoryId ? (
        <Breadcrumbs
            categoryId={breadcrumbCategoryId}
            currentProduct={productDetails.name}
        />
    ) : null;

    // Fill a map with field/section -> error.
    const errors = new Map();
    if (errorMessage) {
        Object.keys(ERROR_MESSAGE_TO_FIELD_MAPPING).forEach(key => {
            if (errorMessage.includes(key)) {
                const target = ERROR_MESSAGE_TO_FIELD_MAPPING[key];
                const message = ERROR_FIELD_TO_MESSAGE_MAPPING[target];
                errors.set(target, message);
            }
        });

        // Handle cases where a user token is invalid or expired. Preferably
        // this would be handled elsewhere with an error code and not a string.
        if (errorMessage.includes('The current user cannot')) {
            errors.set('form', [
                new Error(
                    'There was a problem with your cart. Please sign in again and try adding the item once more.'
                )
            ]);
        }

        // Handle cases where a cart wasn't created properly.
        if (
            errorMessage.includes('Variable "$cartId" got invalid value null')
        ) {
            errors.set('form', [
                new Error(
                    'There was a problem with your cart. Please refresh the page and try adding the item once more.'
                )
            ]);
        }

        // An unknown error should still present a readable message.
        if (!errors.size) {
            errors.set('form', [
                new Error(
                    'Could not add item to cart. Please check required options and try again.'
                )
            ]);
        }
    }

    const addtowishlist = async product => {
        await addItemToWishlist({
            product_id: product.id
        });
        setAddedWishlistMsg(true);
    };
    const deleteData = useDeleteFromWishlist({
        query: REMOVE_FROM_WISHLIST_MUTATION,
        customerQuery: GET_CUSTOMER_QUERY
    });
    const { handleRemoveItem, removeResponse } = deleteData;
    const removeFromWishlist = async product => {
        await handleRemoveItem({
            product_id: product.id
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
                timeout: 2000
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
                    timeout: 2000
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

    useEffect(() => {
        if (success && !isAddingItem) {
            addToast({
                type: 'info',
                message:
                    productDetails.name +
                    formatMessage({
                        id: 'cart.message',
                        defaultMessage: 'added to the cart.'
                    }),
                dismissable: true,
                timeout: 2000
            });
        }
        if (errorMessage && !isAddingItem) {
            addToast({
                type: 'error',
                message: errorMessage ? errorMessage : 'error',
                dismissable: true,
                timeout: 2000
            });
        }
    }, [
        addToast,
        success,
        errorMessage,
        isAddingItem,
        productDetails.name,
        formatMessage
    ]);

    var stockClass = '';
    var stockStatus = '';

    if (product && product.stock_status) {
        if (product.stock_status == 'IN_STOCK') {
            stockClass =
                classes.stock_info + ' ' + 'pl-3 ml-3' + ' ' + classes.in_stock;
            stockStatus = 'In Stock';
        } else if (product.stock_status == 'OUT_STOCK') {
            stockStatus = 'Out Of  Stock';
            stockClass =
                classes.stock_info +
                ' ' +
                'pl-3 ml-3' +
                ' ' +
                classes.out_of_stock;
        }
    }

    const ratingSummary = product && product.rating_summary;
    const reviewCount = product && product.review_count;
    let reviewMessage = '';
    if (parseInt(reviewCount) < 1) {
        reviewMessage = formatMessage({
            id: 'productFullDetail.noReview',
            defaultMessage: 'No Reviews '
        });
    } else if (parseInt(reviewCount) == 1) {
        reviewMessage = '1 Reviews ';
    } else {
        reviewMessage = reviewCount + ' ' + 'Review';
    }
    // var customOption;
    // if (product && product.options && product.options.length > 0) {
    //   var optionData = product.options;
    //   customOption = optionData[0];
    // }
    let image = '';
    if (
        mediaGalleryEntries &&
        mediaGalleryEntries[0] &&
        mediaGalleryEntries[0]['file']
    ) {
        image = mediaGalleryEntries[0]['file'];
    }
    return (
        <Fragment>
            <div className={'container' + ' ' + classes.product_page_container}>
                {breadcrumbs}
                <Form className={classes.root}>
                    {/* product image carousel section */}
                    <section
                        className={
                            classes.imageCarousel + ' ' + classes.shadow_section
                        }
                    >
                        <div className={classes.imageCarousel_inner}>
                            <Carousel images={mediaGalleryEntries} />
                            {/* wishlist section */}
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
                                        {!addedToWishlist ||
                                        removeWishlistMsg ? (
                                            <button
                                                className={
                                                    classes.wishlist_icon_wrap
                                                }
                                                onClick={() =>
                                                    addtowishlist(product)
                                                }
                                            >
                                                <FontAwesomeIcon
                                                    fill={
                                                        addedToWishlist
                                                            ? 'red'
                                                            : ''
                                                    }
                                                    icon={faHeart}
                                                />
                                            </button>
                                        ) : (
                                            <button
                                                className={
                                                    classes.wishlist_icon_wrap
                                                }
                                                onClick={() =>
                                                    removeFromWishlist(product)
                                                }
                                            >
                                                <FontAwesomeIcon
                                                    fill={
                                                        addedToWishlist
                                                            ? 'red'
                                                            : ''
                                                    }
                                                    icon={faHeart}
                                                />
                                            </button>
                                        )}
                                    </section>
                                </div>
                            )}
                        </div>
                    </section>
                    {/* product right section */}
                    <section className={classes.product_details_right}>
                        <div className={classes.produtc_right_section}>
                            <section
                                className={
                                    classes.title + ' ' + classes.shadow_section
                                }
                            >
                                <h1 className={classes.productName}>
                                    {productDetails.name}
                                </h1>
                                {/* <p className={classes.productPrice}>
                  <Price currencyCode={productDetails.price.currency} value={productDetails.price.value} />
                </p> */}

                                <PriceRange
                                    price={productDetails.price}
                                    optionFlag={productDetails.optionFlag}
                                    product={product}
                                    customPrice={
                                        customPrice +
                                        customPriceRadio +
                                        customPriceMultiple +
                                        customPriceDropdown +
                                        customField +
                                        customArea
                                    }
                                    customPricePercent={
                                        customPricePercentRadio +
                                        customPercDropDown +
                                        customPercCheckbox
                                    }
                                />

                                {product && product.short_description && (
                                    <div>
                                        <RichText
                                            content={
                                                product.short_description.html
                                            }
                                        />
                                    </div>
                                )}

                                <div
                                    className={
                                        classes.review_section +
                                        ' ' +
                                        'd-flex' +
                                        ' ' +
                                        'flex-wrap'
                                    }
                                >
                                    <div
                                        className={
                                            classes.review_stars_wrapper +
                                            ' ' +
                                            'position-relative'
                                        }
                                    >
                                        <span
                                            className={classes.not_reviewed}
                                            style={{
                                                width: ratingSummary + '%'
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStar} />
                                        </span>
                                        <span className={classes.reviewed}>
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStar} />
                                        </span>
                                    </div>
                                    <span
                                        className={
                                            classes.total_reviews +
                                            ' ' +
                                            'pl-3 ml-3'
                                        }
                                    >
                                        <button
                                            onClick={() => {
                                                setTimeout(() => {
                                                    targetRef.scrollIntoView({
                                                        behavior: 'smooth'
                                                    });
                                                }, 300);
                                            }}
                                        >
                                            {/* <a
                        href="#customer-reviews"
                        data-toggle="collapse"
                        data-target="#collapseThree"
                        aria-expanded="false"
                        aria-controls="collapseThree"
                      >
                        {reviewMessage}
                      </a> */}
                                            <button
                                                type="button"
                                                data-toggle="collapse"
                                                data-target="#collapseThree"
                                                aria-expanded="false"
                                                aria-controls="collapseThree"
                                            >
                                                <span>{reviewMessage}</span>
                                            </button>
                                        </button>
                                    </span>
                                    <div className={stockClass}>
                                        <span>{stockStatus}</span>
                                    </div>
                                </div>
                                <div
                                    className={
                                        classes.sku_details + ' ' + 'mb-4'
                                    }
                                >
                                    <span className={classes.sku_details_label}>
                                        SKU:
                                    </span>
                                    <span>{product && product.sku}</span>
                                </div>
                            </section>
                            <div
                                className={
                                    classes.form_wrror +
                                    ' ' +
                                    classes.shadow_section
                                }
                            >
                                <FormError
                                    classes={{
                                        root: classes.formErrors
                                    }}
                                    errors={errors.get('form') || []}
                                />
                            </div>
                            {only_x_left_in_stock && (
                                <div
                                    className={
                                        classes.quantity_wrap +
                                        ' ' +
                                        classes.shadow_section
                                    }
                                >
                                    <span className={classes.qty_icon}>
                                        <FontAwesomeIcon icon={faCubes} />
                                    </span>
                                    <span className={classes.qty_number}>
                                        {only_x_left_in_stock +
                                            ' ' +
                                            'quantity left only.'}
                                    </span>
                                </div>
                            )}

                            <div className={classes.options_wrap}>
                                {bundleOptions && showBundleOptions && (
                                    <section
                                        className={
                                            classes.options +
                                            ' ' +
                                            classes.shadow_section
                                        }
                                    >
                                        <Modal>
                                            <div
                                                id="bundle-option-overlay"
                                                className={
                                                    classes.bundle_form_popup
                                                }
                                            >
                                                <div
                                                    className={classes.overlay}
                                                />
                                                {bundleOptions}
                                            </div>
                                        </Modal>
                                    </section>
                                )}
                                {customOptions && (
                                    <section
                                        className={
                                            classes.options +
                                            ' ' +
                                            classes.shadow_section
                                        }
                                    >
                                        {customOptions}
                                    </section>
                                )}
                                {options && (
                                    <section
                                        className={
                                            classes.options +
                                            ' ' +
                                            classes.shadow_section
                                        }
                                    >
                                        {options}
                                    </section>
                                )}
                            </div>
                            {product.__typename != 'BundleProduct' && (
                                <div
                                    className={
                                        classes.qty_cart_wrap +
                                        ' ' +
                                        classes.shadow_section
                                    }
                                >
                                    <Suspense fallback={''}>
                                        <InStockAlert id={product.id} />
                                    </Suspense>
                                    <section className={classes.quantity}>
                                        <QuantityFields
                                            itemId={'qty'}
                                            classes={{
                                                root: classes.quantityRoot
                                            }}
                                            min={1}
                                            message={errors.get('quantity')}
                                        />
                                    </section>

                                    <section
                                        className={
                                            classes.cartActions +
                                            ' ' +
                                            classes.loader_case_wrapp
                                        }
                                    >
                                        {product &&
                                            product.stock_status ==
                                                'IN_STOCK' && (
                                                <Button
                                                    priority="high"
                                                    type="submit"
                                                    onClick={() => {
                                                        handleAddToCart({
                                                            quantity: document.getElementById(
                                                                'qty'
                                                            ).value,
                                                            customOptionId,
                                                            customOptionString,
                                                            customArrayVar
                                                        });
                                                    }}
                                                    disabled={
                                                        isAddToCartDisabled
                                                    }
                                                >
                                                    <FormattedMessage
                                                        id={
                                                            'ProductFullDetail.addToCart'
                                                        }
                                                        defaultMessage={
                                                            'Add to Cart'
                                                        }
                                                    />
                                                </Button>
                                            )}

                                        {product &&
                                            product.stock_status !=
                                                'IN_STOCK' && (
                                                <div
                                                    className={
                                                        classes.out_of_stock
                                                    }
                                                >
                                                    <span className={'mr-2'}>
                                                        <FontAwesomeIcon
                                                            icon={faBoxes}
                                                        />
                                                    </span>
                                                    <span>
                                                        <FormattedMessage
                                                            id={
                                                                'ProductFullDetail.OutOfStock'
                                                            }
                                                            defaultMessage={
                                                                'This item is out of stock'
                                                            }
                                                        />
                                                    </span>
                                                </div>
                                            )}
                                        {isAddingItem && (
                                            <div
                                                className={
                                                    classes.modal +
                                                    ' ' +
                                                    classes.modal_active +
                                                    ' ' +
                                                    classes.galler_modal_active
                                                }
                                            >
                                                <div
                                                    className={
                                                        classes.loader_div
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            classes.ball_pulse
                                                        }
                                                    >
                                                        <div />
                                                        <div />
                                                        <div />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </section>

                                    <Suspense fallback={''}>
                                        <CompareButton id={product.id} />
                                        <ProductSharingIcons
                                            classes={classes}
                                            productDetails={productDetails}
                                            image={image}
                                        />
                                    </Suspense>
                                </div>
                            )}
                            {product.__typename == 'BundleProduct' && (
                                <section
                                    className={
                                        classes.loader_case_wrapp +
                                        ' ' +
                                        classes.bundle_rpoduct_wrap
                                    }
                                >
                                    {product &&
                                        product.stock_status == 'IN_STOCK' && (
                                            <Button
                                                priority="high"
                                                onClick={() => {
                                                    if (!showBundleOptions) {
                                                        setShowBundleOptions(
                                                            true
                                                        );
                                                    }
                                                    setOverlay(true);
                                                    document
                                                        .getElementsByTagName(
                                                            'html'
                                                        )[0]
                                                        .setAttribute(
                                                            'data-scroll-lock',
                                                            'true'
                                                        );
                                                }}
                                                disabled={showBundleOptions}
                                            >
                                                <FormattedMessage
                                                    id={
                                                        'ProductFullDetail.customizeAddToCart'
                                                    }
                                                    defaultMessage={
                                                        'Customize and Add to Cart'
                                                    }
                                                />
                                            </Button>
                                        )}
                                </section>
                            )}

                            {/* tabs structure */}
                            <div
                                className={
                                    classes.tabs_wrap +
                                    ' ' +
                                    classes.shadow_section
                                }
                                id="tabs_wrap"
                            >
                                <div
                                    className="accordion"
                                    id="accordionExample"
                                >
                                    {/* description tab */}
                                    <div
                                        className={
                                            classes.details_tab +
                                            ' ' +
                                            classes.tab_list +
                                            ' ' +
                                            'card'
                                        }
                                    >
                                        <div
                                            className={
                                                'card-header' +
                                                ' ' +
                                                classes.card_header
                                            }
                                            id="headingOne"
                                        >
                                            <div
                                                className={
                                                    'btn btn-link collapsed' +
                                                    ' ' +
                                                    classes.product_tabs_list
                                                }
                                                type="button"
                                                data-toggle="collapse"
                                                data-target="#collapseOne"
                                                aria-expanded="true"
                                                aria-controls="collapseOne"
                                            >
                                                <span>
                                                    <FormattedMessage
                                                        id={
                                                            'ProductFullDetail.ProductDescription'
                                                        }
                                                        defaultMessage={
                                                            'Product Description'
                                                        }
                                                    />
                                                </span>
                                                <span
                                                    className={
                                                        classes.tabs_arrow
                                                    }
                                                >
                                                    {chevrondownIcon}
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            id="collapseOne"
                                            className="collapse"
                                            aria-labelledby="headingOne"
                                            data-parent="#accordionExample"
                                        >
                                            <div
                                                className={
                                                    classes.tabs_content_custom +
                                                    ' ' +
                                                    'card-body'
                                                }
                                            >
                                                <RichText
                                                    content={
                                                        productDetails.description
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* details tab */}
                                    <div
                                        className={
                                            classes.moreinfo_tab +
                                            ' ' +
                                            classes.tab_list +
                                            ' ' +
                                            'card'
                                        }
                                    >
                                        <div
                                            className={
                                                'card-header' +
                                                ' ' +
                                                classes.card_header
                                            }
                                            id="headingTwo"
                                        >
                                            <div
                                                className={
                                                    'btn btn-link collapsed' +
                                                    ' ' +
                                                    classes.product_tabs_list
                                                }
                                                type="button"
                                                data-toggle="collapse"
                                                data-target="#collapseTwo"
                                                aria-expanded="false"
                                                aria-controls="collapseTwo"
                                            >
                                                <span>
                                                    <FormattedMessage
                                                        id={
                                                            'ProductFullDetail.ProductDetails'
                                                        }
                                                        defaultMessage={
                                                            'Product Details'
                                                        }
                                                    />
                                                </span>
                                                <span
                                                    className={
                                                        classes.tabs_arrow
                                                    }
                                                >
                                                    {chevrondownIcon}
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            id="collapseTwo"
                                            className="collapse"
                                            aria-labelledby="headingTwo"
                                            data-parent="#accordionExample"
                                        >
                                            <div
                                                className={
                                                    classes.tabs_content_custom +
                                                    ' ' +
                                                    'card-body'
                                                }
                                            >
                                                <strong>
                                                    <FormattedMessage
                                                        id={
                                                            'ProductFullDetail.sku'
                                                        }
                                                        defaultMessage={
                                                            'SKU : '
                                                        }
                                                    />
                                                </strong>
                                                {productDetails.sku}
                                            </div>
                                            {productMoreInfo.length > 0 &&
                                                productMoreInfo.map((v, i) => {
                                                    return (
                                                        <div
                                                            key={
                                                                i + 'more_info'
                                                            }
                                                            className={
                                                                classes.tabs_content_custom +
                                                                ' ' +
                                                                'card-body'
                                                            }
                                                        >
                                                            <strong>
                                                                {v.label +
                                                                    ' : '}
                                                            </strong>
                                                            {v.value}
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                    {/* reviews tab */}
                                    <div
                                        id="target-section"
                                        ref={ref => {
                                            targetRef = ref;
                                        }}
                                    >
                                        {scrollFlag && (
                                            <Suspense fallback={''}>
                                                <ProductReviews
                                                    product={product}
                                                />
                                            </Suspense>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </Form>
            </div>
            {scrollFlag && (
                <>
                    <div className={classes.h_products_wrap}>
                        <Suspense fallback={''}>
                            <LinkedProducts
                                suffix={product.url_suffix}
                                sku={product.sku}
                                title={formatMessage({
                                    id: 'home.relatedProductTitle',
                                    defaultMessage: 'Related Products'
                                })}
                                type={'related'}
                            />
                        </Suspense>
                    </div>
                    <div className={classes.h_products_wrap}>
                        <Suspense fallback={''}>
                            <LinkedProducts
                                suffix={product.url_suffix}
                                sku={product.sku}
                                title={formatMessage({
                                    id: 'home.linkedProductTitle',
                                    defaultMessage:
                                        'You may also be interested in the following products'
                                })}
                                description={'description'}
                                type={'upsell'}
                            />
                        </Suspense>
                    </div>
                    <div className={classes.h_products_wrap}>
                        <Suspense fallback={''}>
                            <RecentProducts
                                product={product}
                                sku={product.sku}
                                title={'Recently Viewed'}
                                description={'description'}
                                type={'Recent'}
                            />
                        </Suspense>
                    </div>
                </>
            )}
        </Fragment>
    );
};

ProductFullDetail.propTypes = {
    classes: shape({
        cartActions: string,
        description: string,
        descriptionTitle: string,
        details: string,
        detailsTitle: string,
        imageCarousel: string,
        options: string,
        productName: string,
        productPrice: string,
        quantity: string,
        quantityTitle: string,
        root: string,
        title: string
    }),
    product: shape({
        __typename: string,
        id: number,
        sku: string.isRequired,
        media_gallery_entries: arrayOf(
            shape({
                label: string,
                position: number,
                disabled: bool,
                file: string.isRequired
            })
        ),
        description: string
    }).isRequired
};

export default ProductFullDetail;
