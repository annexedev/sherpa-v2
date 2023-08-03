import React, { useCallback, useMemo } from 'react';
import { func, number, shape, string } from 'prop-types';
import { Price } from '@magento/peregrine';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { Link, resourceUrl } from 'src/drivers';
import Image from '@magento/venia-ui/lib/components/Image';
import defaultClasses from './suggestedProduct.css';

const IMAGE_WIDTH = 60;

const SuggestedProduct = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const {
        url_key,
        small_image,
        name,
        onNavigate,
        price,
        url_suffix,
        handleSearchTriggerClick
    } = props;
    let productUrlSuffix = '';
    if (url_suffix && url_suffix != 'null') {
        productUrlSuffix = url_suffix;
    }
    const handleClick = useCallback(() => {
        if (typeof onNavigate === 'function') {
            onNavigate();
        }
    }, [onNavigate]);

    const uri = useMemo(() => resourceUrl(`/${url_key}${productUrlSuffix}`), [
        url_key,
        productUrlSuffix
    ]);

    return (
        <Link
            className={classes.root}
            to={uri}
            onClick={v => {
                handleClick(v);
                handleSearchTriggerClick(v);
            }}
        >
            <Image
                alt={name}
                classes={{ image: classes.thumbnail, root: classes.image }}
                resource={small_image}
                width={IMAGE_WIDTH}
            />
            <div className={classes.product_details_Wrap}>
                <span className={classes.name}>{name}</span>
                <span className={classes.price}>
                    <Price
                        currencyCode={price.regularPrice.amount.currency}
                        value={price.regularPrice.amount.value}
                    />
                </span>
            </div>
        </Link>
    );
};

SuggestedProduct.propTypes = {
    url_key: string.isRequired,
    small_image: string.isRequired,
    name: string.isRequired,
    onNavigate: func,
    price: shape({
        regularPrice: shape({
            amount: shape({
                currency: string,
                value: number
            })
        })
    }).isRequired,
    classes: shape({
        root: string,
        image: string,
        name: string,
        price: string,
        thumbnail: string
    })
};

export default SuggestedProduct;
