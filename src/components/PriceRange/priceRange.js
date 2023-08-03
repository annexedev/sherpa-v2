import React from 'react';
import { Price } from '@magento/peregrine';
import classes from '../ProductFullDetail/productFullDetail.css';
import priceClasses from './priceRange.css';
import { FormattedMessage } from 'react-intl';

const PriceRange = props => {

    var today = new Date();

    const {
        price,
        optionFlag,
        product,
        customPrice = 0,
        customPricePercent = 0,
        type = null
    } = props;

    const final_minimum_price =
        price.minimum_price.final_price.value +
        customPrice +
        customPricePercent * price.minimum_price.final_price.value;

    const final_regular_price =
        price.minimum_price.regular_price.value +
        customPrice +
        customPricePercent * price.minimum_price.regular_price.value;

    const final_maximum_price =
        price.maximum_price.final_price.value +
        customPrice +
        customPricePercent * price.maximum_price.final_price.value;

    const final_regular_price_max =
        price.maximum_price.regular_price.value +
        customPrice +
        customPricePercent * price.maximum_price.regular_price.value;

    let specialDate = new Date(product.special_to_date)

    if (
        (price && product.__typename == 'SimpleProduct') ||
        ((type != null && type == 'simple') || type == 'simple_custom')
    ) {
        return (
            <>
                <section className={classes.price_details_wrap}>
                    
                    <p className={classes.productPrice}>
                        PART # <span>{product && product.sku}</span></p><br/>
                        <p className={classes.productPrice}>
                        BRAND : <span>{product && product.productbrand}</span></p><br/>    
                    

                    {/* today.toISOString().split('T')[0] < specialDate.toISOString().split('T')[0] && */}
                    {final_minimum_price == final_regular_price &&  (
                        <>
                            <p className={classes.productPrice}>YOUR COST&nbsp;&nbsp;&nbsp;
                                <Price
                                    currencyCode={
                                        price.minimum_price.final_price.currency
                                    }
                                    value={final_minimum_price}
                                />
                            </p>
                        </>
                    )}
                    {final_minimum_price != final_regular_price &&  (
                        <>
                            <p className={classes.productPrice + ' ' + priceClasses.greenprice }>YOUR COST&nbsp;&nbsp;&nbsp;
                                <Price
                                    currencyCode={
                                        price.minimum_price.final_price.currency
                                    }
                                    value={final_minimum_price}
                                />
                            </p>
                            <p
                                className={
                                    classes.productPrice +
                                    ' ' +
                                    priceClasses.regularprice + ' ' + priceClasses.discountedprice
                                }
                            >
                                <Price
                                    currencyCode={
                                        price.minimum_price.regular_price.currency
                                    }
                                    value={final_regular_price}
                                />
                            </p>
                        </>
                    )}
                            
                </section>
            </>
        );
    } else if (
        (price && product.__typename == 'ConfigurableProduct') ||
        (type != null && type == 'configurable')
    ) {
        return (
            <>
                {optionFlag == false && 'As low as'}
                <p className={classes.productPrice}>
                    <Price
                        currencyCode={price.minimum_price.final_price.currency}
                        value={final_minimum_price}
                    />
                </p>
            </>
        );
    } else if (
        (price && product.__typename == 'BundleProduct') ||
        (type != null && type == 'bundle')
    ) {
        return (
            <>
                <section className={classes.price_details_wrap}>
                    <span>
                        <FormattedMessage
                            id={'priceRange.from'}
                            defaultMessage={'From'}
                        />
                    </span>
                    <p className={classes.productPrice}>
                        <Price
                            currencyCode={
                                price.minimum_price.final_price.currency
                            }
                            value={final_minimum_price}
                        />
                    </p>
                    {final_minimum_price != final_regular_price && (
                        <p
                            className={
                                classes.productPrice +
                                ' ' +
                                priceClasses.regularprice
                            }
                        >
                            <Price
                                currencyCode={
                                    price.minimum_price.regular_price.currency
                                }
                                value={final_regular_price}
                            />
                        </p>
                    )}
                </section>
                <section className={classes.price_details_wrap}>
                    <span>
                        <FormattedMessage
                            id={'priceRange.to'}
                            defaultMessage={'To'}
                        />
                    </span>
                    <p className={classes.productPrice}>
                        <Price
                            currencyCode={
                                price.maximum_price.final_price.currency
                            }
                            value={final_maximum_price}
                        />
                    </p>
                    {final_maximum_price != final_regular_price_max && (
                        <p
                            className={
                                classes.productPrice +
                                ' ' +
                                priceClasses.regularprice
                            }
                        >
                            <Price
                                currencyCode={
                                    price.maximum_price.regular_price.currency
                                }
                                value={final_regular_price_max}
                            />
                        </p>
                    )}
                </section>
            </>
        );
    } else return <div />;
};

export default PriceRange;
