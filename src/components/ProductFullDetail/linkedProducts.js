import React, { Suspense, useState, useEffect } from 'react';
import linkedProductsGraphql from '../../queries/linkedProducts.graphql';
import { Link, resourceUrl } from 'src/drivers';
import {
    useCategoryAddToCart,
    useLinkedProduct
} from '../../peregrine/lib/talons/ProductFullDetail/useProductFullDetail';
import OwlCarousel from 'react-owl-carousel';
import { FormattedMessage, useIntl } from 'react-intl';
import 'owl.carousel/dist/assets/owl.carousel.css';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import cedClasses from './productFullDetail.css';
import { ADD_SIMPLE_MUTATION } from './productFullDetail.gql';
import CREATE_CART_MUTATION from '../../queries/createCart.graphql';
import GET_CART_DETAILS_QUERY from '../../queries/getCartDetails.graphql';
import { useToasts } from '@magento/peregrine';
import CompareButton from '../Compare/compareButton';
const Wishlist = React.lazy(() => import('../MyWishlist/wishlist'));

const LinkedProducts = props => {
    const { sku, title, type, suffix } = props;
    const [productName, setProductName] = useState('');

    let product_url_suffix = '';
    if (suffix && suffix != 'null') {
        product_url_suffix = suffix;
    }
    const [showAlertMsg, setShowAlertMsg] = useState(false);
    const [, { addToast }] = useToasts();

    const catProps = useCategoryAddToCart({
        addSimpleProductToCartMutation: ADD_SIMPLE_MUTATION,
        createCartMutation: CREATE_CART_MUTATION,
        getCartDetailsQuery: GET_CART_DETAILS_QUERY,
        setShowAlertMsg
    });

    const { handleAddToCart, isAddingItem, success, errorMessage } = catProps;
    const { formatMessage } = useIntl();

    useEffect(() => {
        if (success && showAlertMsg && !isAddingItem) {
            addToast({
                type: 'info',
                message:
                    productName +
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
        addToast,
        setShowAlertMsg,
        productName,
        showAlertMsg,
        success,
        setProductName,
        errorMessage,
        isAddingItem,
        formatMessage
    ]);
    const responsive1 = {
        0: {
            items: 2
        },
        450: {
            items: 2
        },
        600: {
            items: 4
        },
        1000: {
            items: 5
        }
    };

    const defaultClasses = mergeClasses(cedClasses, props.classes);
    const { relatedProducts, upsell_products } = useLinkedProduct({
        query: linkedProductsGraphql,
        sku: sku
    });

    let linkedProducts;
    if (type == 'related') {
        linkedProducts = relatedProducts;
    } else if (type == 'upsell') {
        linkedProducts = upsell_products;
    }

    if (typeof linkedProducts != 'undefined' && linkedProducts.length > 0) {
        return (
            <section className={cedClasses.h_products + ' ' + 'mb-3'}>
                <div className={'container'}>
                    <div className="row">
                        <div
                            className={
                                defaultClasses.slider_container +
                                ' ' +
                                'col-xs-12 col-lg-12 col-sm-12 col-md-12'
                            }
                        >
                            <div className={defaultClasses.section_heading}>
                                <p className={defaultClasses.section_title}>
                                    {title}
                                </p>
                            </div>
                            <React.Fragment>
                                {/* {productComponents} */}
                                {linkedProducts &&
                                    typeof linkedProducts != 'undefined' && (
                                        <OwlCarousel
                                            className={
                                                'owl-theme' +
                                                ' ' +
                                                defaultClasses.owl_thme_design
                                            }
                                            loop={false}
                                            rewind={true}
                                            margin={10}
                                            nav={true}
                                            dots={true}
                                            autoplay={true}
                                            autoplayTimeout={2000}
                                            items={5}
                                            responsive={responsive1}
                                        >
                                            {linkedProducts.map(
                                                (value, index) => {
                                                    var image = resourceUrl(
                                                        value['image'],
                                                        {
                                                            type:
                                                                'image-product',
                                                            quality: '85',
                                                            width: 300
                                                        }
                                                    );
                                                    // let description = value.description;
                                                    //  description = description.replace(/<[^>]+>/g, '');
                                                    return (
                                                        <div
                                                            key={index}
                                                            className="item"
                                                        >
                                                            <div
                                                                className={
                                                                    defaultClasses.products_grid_item
                                                                }
                                                            >
                                                                <div
                                                                    className={
                                                                        defaultClasses.noo_product_item
                                                                    }
                                                                >
                                                                    <div
                                                                        className={
                                                                            defaultClasses.noo_product_inner
                                                                        }
                                                                    >
                                                                        <div
                                                                            className={
                                                                                defaultClasses.noo_product_image
                                                                            }
                                                                        >
                                                                            <Link
                                                                                to={resourceUrl(
                                                                                    value[
                                                                                        'urlkey'
                                                                                    ] +
                                                                                        product_url_suffix
                                                                                )}
                                                                                aria-label="linked products"
                                                                            >
                                                                                <img
                                                                                    src={
                                                                                        image
                                                                                    }
                                                                                    title={
                                                                                        value.name
                                                                                    }
                                                                                    alt="linked products"
                                                                                    className="product_image"
                                                                                />
                                                                            </Link>

                                                                            {/* wishlist section */}
                                                                            <Suspense
                                                                                fallback={
                                                                                    ''
                                                                                }
                                                                            >
                                                                                <Wishlist
                                                                                    value={
                                                                                        value
                                                                                    }
                                                                                />
                                                                            </Suspense>
                                                                        </div>
                                                                        <div
                                                                            className={
                                                                                defaultClasses.noo_details_wrapper
                                                                            }
                                                                        >
                                                                            <p
                                                                                className={
                                                                                    defaultClasses.product_name
                                                                                }
                                                                            >
                                                                                <Link
                                                                                    to={resourceUrl(
                                                                                        value[
                                                                                            'urlkey'
                                                                                        ] +
                                                                                            product_url_suffix
                                                                                    )}
                                                                                    aria-label="linked products"
                                                                                >
                                                                                    {
                                                                                        value.name
                                                                                    }
                                                                                </Link>
                                                                            </p>
                                                                            <p
                                                                                className={
                                                                                    defaultClasses.vendor_price_wrap
                                                                                }
                                                                            >
                                                                                <span
                                                                                    className={
                                                                                        defaultClasses.price
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        value.final_price
                                                                                    }
                                                                                </span>
                                                                            </p>
                                                                            <div
                                                                                className={
                                                                                    defaultClasses.colors_stars_wrap
                                                                                }
                                                                            >
                                                                                {/* <div className={defaultClasses.colors_wrap}>
                                                                                    <span className={defaultClasses.colors_inner}></span>
                                                                                    <span className={defaultClasses.colors_inner}></span>
                                                                                    <span className={defaultClasses.colors_inner}></span>
                                                                                    <span className={defaultClasses.colors_inner}></span>
                                                                                    <span className={defaultClasses.extra_colors}>+4</span>
                                                                                </div> */}
                                                                                {/* <div className={defaultClasses.stars_wap}>
                                                                                    <span className={defaultClasses.not_reviewed}>
                                                                                        <FontAwesomeIcon icon={faStar} />
                                                                                        <FontAwesomeIcon icon={faStar} />
                                                                                        <FontAwesomeIcon icon={faStar} />
                                                                                        <FontAwesomeIcon icon={faStar} />
                                                                                        <FontAwesomeIcon icon={faStar} />
                                                                                    </span>
                                                                                    <span className={defaultClasses.reviewed}>
                                                                                        <FontAwesomeIcon icon={faStar} />
                                                                                        <FontAwesomeIcon icon={faStar} />
                                                                                        <FontAwesomeIcon icon={faStar} />
                                                                                        <FontAwesomeIcon icon={faStar} />
                                                                                        <FontAwesomeIcon icon={faStar} />
                                                                                    </span>
                                                                                </div> */}
                                                                            </div>
                                                                            <div
                                                                                className={
                                                                                    defaultClasses.add_to_cart_Wrap
                                                                                }
                                                                            >
                                                                                {value.type ==
                                                                                    'simple' && (
                                                                                    <button
                                                                                        aria-label="Addtocart"
                                                                                        className={
                                                                                            defaultClasses.add_to_cart_btn
                                                                                        }
                                                                                        onClick={() => {
                                                                                            setProductName(
                                                                                                value.name
                                                                                            );
                                                                                            handleAddToCart(
                                                                                                value
                                                                                            );
                                                                                        }}
                                                                                    >
                                                                                        <FormattedMessage
                                                                                            id={
                                                                                                'linkedProduct.add_to_cart_btn'
                                                                                            }
                                                                                            defaultMessage={
                                                                                                'ADD TO CART'
                                                                                            }
                                                                                        />
                                                                                    </button>
                                                                                )}
                                                                                {value.type !=
                                                                                    'simple' && (
                                                                                    <Link
                                                                                        to={resourceUrl(
                                                                                            value[
                                                                                                'urlkey'
                                                                                            ] +
                                                                                                product_url_suffix
                                                                                        )}
                                                                                        className={
                                                                                            defaultClasses.add_to_cart_btn
                                                                                        }
                                                                                    >
                                                                                        <FormattedMessage
                                                                                            id="linkedProduct.add_to_cart_btn"
                                                                                            defaultMessage="ADD TO CART"
                                                                                        />
                                                                                    </Link>
                                                                                )}
                                                                                <CompareButton
                                                                                    id={
                                                                                        value.id
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        {/* original */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </OwlCarousel>
                                    )}
                            </React.Fragment>
                            {/* end
                             */}
                        </div>
                    </div>
                </div>
            </section>
        );
    } else {
        return <div />;
    }
};

LinkedProducts.propTypes = {};

export default LinkedProducts;
