import React from 'react';
import { FormattedMessage } from 'react-intl';

import ProductOptions from '../../LegacyMiniCart/productOptions';
import CustomProductOptions from '../../CartPage/ProductListing/productOptions';
import BundleProductOptions from '../../CartPage/ProductListing/bundleOptions';

import Image from '../../Image';
import { mergeClasses } from '../../../classify';

import defaultClasses from './item.css';

const Item = props => {
    const {
        classes: propClasses,
        product,
        quantity,
        configurable_options,
        isHidden,
        customizable_options,
        bundle_options
    } = props;
    const classes = mergeClasses(defaultClasses, propClasses);
    const className = isHidden ? classes.root_hidden : classes.root;

    return (
        <div className={className}>
            <Image
                alt={product.name}
                classes={{ root: classes.thumbnail }}
                width={100}
                resource={product.thumbnail.url}
            />
            <span className={classes.name}>{product.name}</span>
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
            <ProductOptions
                options={configurable_options}
                classes={{
                    options: classes.options
                }}
            />
            <span className={classes.quantity}>
                <FormattedMessage
                    id={'checkoutPage.quantity'}
                    defaultMessage={'Qty :'}
                    values={{ quantity }}
                />
            </span>
        </div>
    );
};

export default Item;
