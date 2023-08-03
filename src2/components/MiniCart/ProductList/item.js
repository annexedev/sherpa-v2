import React, { useMemo } from 'react';
import { string, number, shape, func, arrayOf } from 'prop-types';
import { Trash2 as DeleteIcon } from 'react-feather';

import { Price } from '@magento/peregrine';
import { Link, resourceUrl } from 'src/drivers';
import { useItem } from '@magento/peregrine/lib/talons/MiniCart/useItem';
import CustomProductOptions from '../../CartPage/ProductListing/productOptions';
import BundleProductOptions from '../../CartPage/ProductListing/bundleOptions';

import ProductOptions from '../../LegacyMiniCart/productOptions';
import Image from '../../Image';
import Icon from '../../Icon';
import { mergeClasses } from '../../../classify';

import defaultClasses from './item.css';
import { useIntl } from 'react-intl';

const Item = props => {
    const {
        classes: propClasses,
        product,
        id,
        quantity,
        configurable_options,
        handleRemoveItem,
        prices,
        closeMiniCart,
        customizable_options,
        bundle_options
    } = props;
    const classes = mergeClasses(defaultClasses, propClasses);
    const { formatMessage } = useIntl();

    let productUrlSuffix = '';
    if (product.url_suffix && product.url_suffix != 'null') {
        productUrlSuffix = product.url_suffix;
    }
    const itemLink = useMemo(
        () => resourceUrl(`/${product.url_key}${productUrlSuffix}`),
        [product.url_key, productUrlSuffix]
    );
    const stockStatusText =
        product.stock_status === 'OUT_OF_STOCK' ? 'Out-of-stock' : '';

    const { isDeleting, removeItem } = useItem({
        id,
        handleRemoveItem
    });

    const rootClass = isDeleting ? classes.root_disabled : classes.root;

    return (
        <div className={rootClass}>
            <Link
                className={classes.thumbnailContainer}
                to={itemLink}
                onClick={closeMiniCart}
            >
                <Image
                    alt={product.name}
                    classes={{ root: classes.thumbnail }}
                    width={100}
                    resource={product.thumbnail.url}
                />
            </Link>
            <Link
                className={classes.name}
                to={itemLink}
                onClick={closeMiniCart}
            >
                {product.name}
            </Link>
            <ProductOptions
                options={configurable_options}
                classes={{
                    options: classes.options
                }}
            />
            {customizable_options && (
                <CustomProductOptions
                    options={customizable_options}
                    classes={{
                        options: classes.options
                    }}
                />
            )}
            {bundle_options && (
                <BundleProductOptions
                    options={bundle_options}
                    classes={{
                        options: classes.options
                    }}
                />
            )}

            <span className={classes.quantity}>
                {formatMessage({
                    id: 'item.qty',
                    defaultMessage: 'QTY'
                })}
                : {quantity}
            </span>
            <span className={classes.price}>
                <Price
                    currencyCode={prices.price.currency}
                    value={prices.price.value}
                />
            </span>
            <span className={classes.stockStatus}>{stockStatusText}</span>
            <button
                onClick={removeItem}
                type="button"
                className={classes.deleteButton}
                disabled={isDeleting}
            >
                <Icon
                    size={16}
                    src={DeleteIcon}
                    classes={{ icon: classes.editIcon }}
                />
            </button>
        </div>
    );
};

export default Item;

Item.propTypes = {
    classes: shape({
        root: string,
        thumbnail: string,
        name: string,
        options: string,
        quantity: string,
        price: string,
        editButton: string,
        editIcon: string
    }),
    product: shape({
        name: string,
        thumbnail: shape({
            url: string
        })
    }),
    id: string,
    quantity: number,
    configurable_options: arrayOf(
        shape({
            id: number,
            option_label: string,
            value_id: number,
            value_label: string
        })
    ),
    handleRemoveItem: func,
    prices: shape({
        price: shape({
            value: number,
            currency: string
        })
    })
};
