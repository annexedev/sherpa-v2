import React, { Suspense, useState, useCallback } from 'react';
import { Link, resourceUrl } from 'src/drivers';
import { useCategoryAddToCart } from '../../peregrine/lib/talons/ProductFullDetail/useProductFullDetail';
import { ADD_SIMPLE_MUTATION } from '../../components/ProductFullDetail/productFullDetail.gql';
import CREATE_CART_MUTATION from '../../queries/createCart.graphql';
import GET_CART_DETAILS_QUERY from '../../queries/getCartDetails.graphql';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useToasts } from '@magento/peregrine';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import defaultClasses from './home.css';
import { mergeClasses } from '../../classify';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import { FormattedMessage, useIntl } from 'react-intl';
import PriceRange from '../PriceRange';
import proClasses from '../ProductFullDetail/productFullDetail.css';

const Wishlist = React.lazy(() => import('../MyWishlist/wishlist'));
import CompareButton from '../Compare/compareButton';

const Product = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { value, config, index } = props;
    const [showAlertMsg, setShowAlertMsg] = useState(false);
    const [loaderName, setLoaderName] = useState('');

    const [, { addToast }] = useToasts();
    let productUrlSuffix = '';
    var image = resourceUrl(value['image'], {
        type: 'image-product',
        quality: '85',
        width: 300
    });

    const catProps = useCategoryAddToCart({
        addSimpleProductToCartMutation: ADD_SIMPLE_MUTATION,
        createCartMutation: CREATE_CART_MUTATION,
        getCartDetailsQuery: GET_CART_DETAILS_QUERY,
        setShowAlertMsg
    });

    const { handleAddToCart, isAddingItem, success, errorMessage } = catProps;
    const { formatMessage } = useIntl();

    const responseToast = useCallback(() => {
        if (success && showAlertMsg && !isAddingItem) {
            addToast({
                type: 'info',
                message:
                    value.name +
                    formatMessage({
                        id: 'cart.message',
                        defaultMessage: ' added to the cart.'
                    }),
                dismissable: true,
                timeout: 2000
            });
            setShowAlertMsg(false);
        }
        if (errorMessage && showAlertMsg && !isAddingItem) {
            addToast({
                type: 'error',
                message: errorMessage ? errorMessage : 'error',
                dismissable: true,
                timeout: 2000
            });
            setShowAlertMsg(false);
        }
    }, [
        success,
        showAlertMsg,
        isAddingItem,
        errorMessage,
        addToast,
        value.name,
        formatMessage
    ]);

    if (showAlertMsg) {
        responseToast();
    }
    if (config.product_url_suffix && config.product_url_suffix != 'null') {
        productUrlSuffix = config.product_url_suffix;
    }
    return (
        <div key={index} className="item">
            <div className={defaultClasses.products_grid_item}>
                <div className={defaultClasses.noo_product_item}>
                    <div className={defaultClasses.noo_product_inner}>
                        <div className={defaultClasses.noo_product_image}>
                            <Link
                                to={resourceUrl(
                                    value['urlkey'] + productUrlSuffix
                                )}
                            >
                                <img
                                    src={image}
                                    alt={value.name}
                                    title={value.name}
                                    className="product_image"
                                    height="300"
                                    width="300"
                                />
                            </Link>

                            {/* wishlist section */}
                            <Suspense fallback={''}>
                                <Wishlist value={value} />
                            </Suspense>
                        </div>
                        <div className={defaultClasses.noo_details_wrapper}>
                            <h3 className={defaultClasses.product_name}>
                                <Link
                                    to={resourceUrl(
                                        value['urlkey'] + productUrlSuffix
                                    )}
                                >
                                    {value.name}
                                </Link>
                            </h3>
                            {/* <p className={defaultClasses.vendor_price_wrap}>
                <span className={defaultClasses.price}>{value.price}</span>
              </p> */}
                            <div className={defaultClasses.vendor_price_wrap}>
                                <div className={defaultClasses.price}>
                                    <PriceRange
                                        price={value.price_range}
                                        optionFlag={false}
                                        product={value}
                                        type={value.type}
                                    />
                                </div>
                            </div>
                            {false && (
                                <div
                                    className={defaultClasses.colors_stars_wrap}
                                >
                                    <div className={defaultClasses.colors_wrap}>
                                        <span
                                            className={
                                                defaultClasses.colors_inner
                                            }
                                        />
                                        <span
                                            className={
                                                defaultClasses.colors_inner
                                            }
                                        />
                                        <span
                                            className={
                                                defaultClasses.colors_inner
                                            }
                                        />
                                        <span
                                            className={
                                                defaultClasses.colors_inner
                                            }
                                        />
                                        <span
                                            className={
                                                defaultClasses.extra_colors
                                            }
                                        >
                                            +4
                                        </span>
                                    </div>
                                    <div className={defaultClasses.stars_wap}>
                                        <span className={classes.not_reviewed}>
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
                                </div>
                            )}
                            <div className={defaultClasses.add_to_cart_Wrap}>
                                {value.type == 'simple' && (
                                    <button
                                        aria-label="Addtocart"
                                        className={classes.add_to_cart_btn}
                                        onClick={() => {
                                            handleAddToCart(value);
                                            setShowAlertMsg(true);
                                            setLoaderName(value.name);
                                        }}
                                    >
                                        <FormattedMessage
                                            id={'home.add_to_cart_btn'}
                                            defaultMessage={'Add to cart'}
                                        />
                                    </button>
                                )}
                                {value.type != 'simple' && (
                                    <Link
                                        to={resourceUrl(
                                            value['urlkey'] + productUrlSuffix
                                        )}
                                        className={classes.add_to_cart_btn}
                                    >
                                        <FormattedMessage
                                            id={'home.add_to_cart_btn'}
                                            defaultMessage={'Add to cart'}
                                        />
                                    </Link>
                                )}

                                <CompareButton id={value.id} />
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
                                            <div
                                                className={
                                                    proClasses.ball_pulse
                                                }
                                            >
                                                <div />
                                                <div />
                                                <div />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product;
