import { gql } from '@apollo/client';

export const ProductListFragment = gql`
    fragment ProductListFragment on Cart {
        id
        items {
            id
            product {
                id
                name
                url_key
                url_suffix
                thumbnail {
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
            ... on SimpleCartItem {
                customizable_options {
                    label
                    values {
                        label
                        value
                    }
                }
            }
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
