import { gql } from '@apollo/client';

export const CategoryFragment = gql`
    fragment CategoryFragment on CategoryTree {
        id
        meta_title
        meta_keywords
        meta_description
        image
    }
`;

export const ProductsFragment = gql`
    fragment ProductsFragment on Products {
        items {
            id
            name
            special_from_date
            special_to_date
            price_range {
                minimum_price {
                    regular_price {
                        value
                        currency
                    }
                    final_price {
                        value
                        currency
                    }
                    discount {
                        amount_off
                        percent_off
                    }
                }
                maximum_price {
                    regular_price {
                        value
                        currency
                    }
                    final_price {
                        value
                        currency
                    }
                    discount {
                        amount_off
                        percent_off
                    }
                }
            }
            sku
            small_image {
                url
            }
            stock_status
            type_id
            totalavailable
            msrp_sherpa2
            msrp_sherpa
            url_key
            ... on ConfigurableProduct {
                configurable_options {
                    attribute_code
                    attribute_id
                    id
                    label
                    values {
                        default_label
                        label
                        store_label
                        use_default_value
                        value_index
                        swatch_data {
                            ... on ImageSwatchData {
                                thumbnail
                            }
                            value
                        }
                    }
                }
                variants {
                    attributes {
                        code
                        value_index
                    }
                    product {
                        id
                        media_gallery_entries {
                            id
                            disabled
                            file
                            label
                            position
                        }
                        sku
                        stock_status
                    }
                }
            }
            ... on CustomizableProductInterface {
                options {
                    title
                    required
                    sort_order
                    option_id
                    ... on CustomizableDropDownOption {
                        value {
                            option_type_id
                            sku
                            price
                            price_type
                            sort_order
                            title
                            uid
                        }
                    }

                    ... on CustomizableRadioOption {
                        value {
                            option_type_id
                            price_type
                            price
                            sku
                            sort_order
                            title
                            uid
                        }
                    }
                    ... on CustomizableCheckboxOption {
                        value {
                            option_type_id
                            price_type
                            price
                            sku
                            sort_order
                            title
                            uid
                        }
                    }
                    ... on CustomizableMultipleOption {
                        value {
                            option_type_id
                            price_type
                            price
                            sku
                            sort_order
                            title
                            uid
                        }
                    }

                    ... on CustomizableAreaOption {
                        areaValue: value {
                            max_characters
                            price_type
                            price
                            uid
                        }
                    }

                    ... on CustomizableFieldOption {
                        textValue: value {
                            max_characters
                            price_type
                            price
                            uid
                        }
                    }
                }
            }
            url_suffix
        }
        page_info {
            total_pages
        }
        total_count
    }
`;
