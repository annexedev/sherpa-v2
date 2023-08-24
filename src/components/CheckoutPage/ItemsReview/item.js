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
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      
        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
      });
      
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
                />{quantity}
            </span>
            {product.price_range.minimum_price.final_price.value && product.sku && product.sku != 'undefined' && (
                <span>
                    <FormattedMessage
                        id={'checkoutPage.partNumber'}
                        defaultMessage={'Part # :'}
                    />
                    &nbsp;{product.sku}<br></br>
                    <FormattedMessage
                        id={'checkoutPage.partNumber'}
                        defaultMessage={'Price :'}
                    />&nbsp;{formatter.format(product.price_range.minimum_price.final_price.value)}
                
                </span>
            )}
            
            
        </div>
    );
};

export default Item;
