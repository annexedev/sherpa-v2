import { gql } from '@apollo/client';

export const ProductListingFragment = gql`
    fragment ProductListingFragment on Cart {
        id
        items {
            id
            ... on SimpleCartItem {
                customizable_options {
                    label
                    values {
                        label
                        value
                    }
                }
            }
            product {
                id
                name
                sku
                url_key
                url_suffix
                thumbnail {
                    url
                }
                small_image {
                    url
                }
                stock_status
            }
            prices {
                price {
                    currency
                    value
                }
            }
            quantity
            ... on ConfigurableCartItem {
                configurable_options {
                    id
                    option_label
                    value_id
                    value_label
                }
            }
            ... on BundleCartItem {
                bundle_options {
                    uid
                    label
                    type
                    values {
                        id
                        label
                        price
                        quantity
                    }
                }
            }
        }
    }
`;
