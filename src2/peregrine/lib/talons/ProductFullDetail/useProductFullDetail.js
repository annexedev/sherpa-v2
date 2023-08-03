import { useCallback, useState, useMemo, useEffect } from 'react';
import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { appendOptionsToPayload } from '@magento/peregrine/lib/util/appendOptionsToPayload';
import { findMatchingVariant } from '@magento/peregrine/lib/util/findMatchingProductVariant';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { clearCustomerDataFromCache } from '@magento/peregrine/lib/Apollo/clearCustomerDataFromCache';

const INITIAL_OPTION_CODES = new Map();
const INITIAL_OPTION_SELECTIONS = new Map();
const INITIAL_QUANTITY = 1;

const deriveOptionCodesFromProduct = product => {
    // If this is a simple product it has no option codes.
    if (!isProductConfigurable(product)) {
        return INITIAL_OPTION_CODES;
    }

    // Initialize optionCodes based on the options of the product.
    const initialOptionCodes = new Map();
    for (const {
        attribute_id,
        attribute_code
    } of product.configurable_options) {
        initialOptionCodes.set(attribute_id, attribute_code);
    }

    return initialOptionCodes;
};

// Similar to deriving the initial codes for each option.
const deriveOptionSelectionsFromProduct = product => {
    if (!isProductConfigurable(product)) {
        return INITIAL_OPTION_SELECTIONS;
    }

    const initialOptionSelections = new Map();
    for (const { attribute_id } of product.configurable_options) {
        initialOptionSelections.set(attribute_id, undefined);
    }

    return initialOptionSelections;
};

const getIsMissingOptions = (product, optionSelections) => {
    // Non-configurable products can't be missing options.
    if (!isProductConfigurable(product)) {
        return false;
    }

    // Configurable products are missing options if we have fewer
    // option selections than the product has options.
    const { configurable_options } = product;
    const numProductOptions = configurable_options.length;
    const numProductSelections = Array.from(optionSelections.values()).filter(
        value => !!value
    ).length;

    return numProductSelections < numProductOptions;
};

const getMediaGalleryEntries = (product, optionCodes, optionSelections) => {
    let value = [];

    const { media_gallery_entries, variants } = product;
    const isConfigurable = isProductConfigurable(product);

    // Selections are initialized to "code => undefined". Once we select a value, like color, the selections change. This filters out unselected options.
    const optionsSelected =
        Array.from(optionSelections.values()).filter(value => !!value).length >
        0;

    if (!isConfigurable || !optionsSelected) {
        value = media_gallery_entries;
    } else {
        // If any of the possible variants matches the selection add that
        // variant's image to the media gallery. NOTE: This _can_, and does,
        // include variants such as size. If Magento is configured to display
        // an image for a size attribute, it will render that image.
        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });

        value = item
            ? [...item.product.media_gallery_entries, ...media_gallery_entries]
            : media_gallery_entries;
    }

    return value;
};

const getLowStockQty = (product, optionCodes, optionSelections) => {
    let value = [];

    const { only_x_left_in_stock, variants } = product;
    const isConfigurable = isProductConfigurable(product);

    // Selections are initialized to "code => undefined". Once we select a value, like color, the selections change. This filters out unselected options.
    const optionsSelected =
        Array.from(optionSelections.values()).filter(value => !!value).length >
        0;

    if (!isConfigurable || !optionsSelected) {
        value = only_x_left_in_stock;
    } else {
        // If any of the possible variants matches the selection add that
        // variant's image to the media gallery. NOTE: This _can_, and does,
        // include variants such as size. If Magento is configured to display
        // an image for a size attribute, it will render that image.
        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });

        value = item ? item.product.only_x_left_in_stock : only_x_left_in_stock;
    }

    return value;
};

// We only want to display breadcrumbs for one category on a PDP even if a
// product has multiple related categories. This function filters and selects
// one category id for that purpose.
const getBreadcrumbCategoryId = categories => {
    // Exit if there are no categories for this product.
    if (!categories || !categories.length) {
        return;
    }
    const breadcrumbSet = new Set();
    categories.forEach(({ breadcrumbs }) => {
        // breadcrumbs can be `null`...
        (breadcrumbs || []).forEach(({ category_id }) =>
            breadcrumbSet.add(category_id)
        );
    });

    // Until we can get the single canonical breadcrumb path to a product we
    // will just return the first category id of the potential leaf categories.
    const leafCategory = categories.find(
        category => !breadcrumbSet.has(category.id)
    );

    // If we couldn't find a leaf category then just use the first category
    // in the list for this product.
    return leafCategory.id || categories[0].id;
};
const getConfigPrice = (product, optionCodes, optionSelections) => {
    let value;

    const { variants } = product;
    const isConfigurable = isProductConfigurable(product);

    const optionsSelected =
        Array.from(optionSelections.values()).filter(value => !!value).length >
        0;
    if (!isConfigurable || !optionsSelected) {
        value = product.price_range;
    } else {
        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });

        value = item ? item.product.price_range : product.price_range;
    }

    return value;
};

const SUPPORTED_PRODUCT_TYPES = [
    'SimpleProduct',
    'ConfigurableProduct',
    'BundleProduct'
];

/**
 * @param {GraphQLQuery} props.addConfigurableProductToCartMutation - configurable product mutation
 * @param {GraphQLQuery} props.addSimpleProductToCartMutation - configurable product mutation
 * @param {Object} props.product - the product, see RootComponents/Product
 *
 * @returns {{
 *  breadcrumbCategoryId: string|undefined,
 *  errorMessage: string|undefined,
 *  handleAddToCart: func,
 *  handleSelectionChange: func,
 *  handleSetQuantity: func,
 *  isAddToCartDisabled: boolean,
 *  mediaGalleryEntries: array,
 *  productDetails: object,
 *  quantity: number
 * }}
 */
export const useProductFullDetail = props => {
    const {
        addConfigurableProductToCartMutation,
        addSimpleProductToCartMutation,
        addBundleProductToCartMutation,
        product,
        addSimpleCustomMutation
    } = props;

    const productType = product.__typename;

    const isSupportedProductType = SUPPORTED_PRODUCT_TYPES.includes(
        productType
    );

    const [{ cartId }] = useCartContext();

    const [
        addConfigurableProductToCart,
        {
            error: errorAddingConfigurableProduct,
            loading: isAddConfigurableLoading,
            data: addConfigurableProductsToCartData
        }
    ] = useMutation(addConfigurableProductToCartMutation);

    const [
        addSimpleProductToCart,
        {
            error: errorAddingSimpleProduct,
            loading: isAddSimpleLoading,
            data: addSimpleProductsToCartData
        }
    ] = useMutation(addSimpleProductToCartMutation);

    const [
        addSimpleCustomProductToCart,
        {
            error: errorAddingSimpleCustomProduct,
            loading: isAddSimpleCustomLoading,
            data: addSimpleCustomProductsToCartData
        }
    ] = useMutation(addSimpleCustomMutation);

    const [
        addBundleProductToCart,
        {
            error: errorAddingBundleProduct,
            loading: isAddBundleLoading,
            data: addBundleProductsToCartData
        }
    ] = useMutation(addBundleProductToCartMutation);

    const [quantity, setQuantity] = useState(INITIAL_QUANTITY);

    const breadcrumbCategoryId = useMemo(
        () => getBreadcrumbCategoryId(product.categories),
        [product.categories]
    );

    const derivedOptionSelections = useMemo(
        () => deriveOptionSelectionsFromProduct(product),
        [product]
    );

    const [optionSelections, setOptionSelections] = useState(
        derivedOptionSelections
    );

    const derivedOptionCodes = useMemo(
        () => deriveOptionCodesFromProduct(product),
        [product]
    );
    const [optionCodes] = useState(derivedOptionCodes);

    const isMissingOptions = useMemo(
        () => getIsMissingOptions(product, optionSelections),
        [product, optionSelections]
    );
    const mediaGalleryEntries = useMemo(
        () => getMediaGalleryEntries(product, optionCodes, optionSelections),
        [product, optionCodes, optionSelections]
    );
    const only_x_left_in_stock = useMemo(
        () => getLowStockQty(product, optionCodes, optionSelections),
        [product, optionCodes, optionSelections]
    );

    const handleAddToCart = useCallback(
        async formValues => {
            const {
                quantity,
                customOptionId,
                customOptionString,
                customArrayVar,
                bundleOptionsVar
            } = formValues;
            const payload = {
                item: product,
                productType,
                quantity: quantity ? quantity : 1
            };

            if (isProductConfigurable(product)) {
                appendOptionsToPayload(payload, optionSelections, optionCodes);
            }

            if (isSupportedProductType) {
                const variables = {
                    cartId,
                    parentSku: payload.parentSku,
                    product: payload.item,
                    quantity: payload.quantity,
                    sku: payload.item.sku,
                    customOptionId,
                    customOptionString,
                    customArrayVar,
                    bundleOptionsVar
                };

                // Use the proper mutation for the type.
                if (
                    productType === 'SimpleProduct' &&
                    customOptionId &&
                    customOptionString
                ) {
                    try {
                        await addSimpleCustomProductToCart({
                            variables
                        });
                    } catch {
                        return;
                    }
                } else if (productType === 'SimpleProduct') {
                    try {
                        await addSimpleProductToCart({
                            variables
                        });
                    } catch {
                        return;
                    }
                } else if (productType === 'ConfigurableProduct') {
                    try {
                        await addConfigurableProductToCart({
                            variables
                        });
                    } catch {
                        return;
                    }
                } else if (productType === 'BundleProduct') {
                    try {
                        await addBundleProductToCart({
                            variables
                        });
                    } catch {
                        return;
                    }
                }
            } else {
                console.error('Unsupported product type. Cannot add to cart.');
            }
        },
        [
            product,
            productType,
            isSupportedProductType,
            optionSelections,
            optionCodes,
            cartId,
            addSimpleCustomProductToCart,
            addSimpleProductToCart,
            addConfigurableProductToCart,
            addBundleProductToCart
        ]
    );

    const handleSelectionChange = useCallback(
        (optionId, selection) => {
            // We must create a new Map here so that React knows that the value
            // of optionSelections has changed.
            const nextOptionSelections = new Map([...optionSelections]);
            nextOptionSelections.set(optionId, selection);
            setOptionSelections(nextOptionSelections);
        },
        [optionSelections]
    );

    const handleSetQuantity = useCallback(
        value => {
            setQuantity(value);
        },
        [setQuantity]
    );
    const productPrice = useMemo(
        () => getConfigPrice(product, optionCodes, optionSelections),
        [product, optionCodes, optionSelections]
    );

    // Normalization object for product details we need for rendering.
    const productDetails = {
        description: product.description,
        name: product.name,
        price: productPrice,
        sku: product.sku
    };

    const derivedErrorMessage = useMemo(
        () =>
            deriveErrorMessage([
                errorAddingSimpleProduct,
                errorAddingSimpleCustomProduct,
                errorAddingConfigurableProduct,
                errorAddingBundleProduct
            ]),
        [
            errorAddingConfigurableProduct,
            errorAddingSimpleCustomProduct,
            errorAddingSimpleProduct,
            errorAddingBundleProduct
        ]
    );

    return {
        breadcrumbCategoryId,
        errorMessage: derivedErrorMessage,
        handleAddToCart,
        handleSelectionChange,
        handleSetQuantity,
        isAddToCartDisabled:
            !isSupportedProductType ||
            isMissingOptions ||
            isAddSimpleCustomLoading ||
            isAddConfigurableLoading ||
            isAddSimpleLoading ||
            isAddBundleLoading,
        mediaGalleryEntries,
        productDetails,
        quantity,
        isAddingItem:
            isAddConfigurableLoading ||
            isAddSimpleLoading ||
            isAddBundleLoading ||
            isAddSimpleCustomLoading,
        only_x_left_in_stock,
        success:
            (addConfigurableProductsToCartData &&
                addConfigurableProductsToCartData.addConfigurableProductsToCart) ||
            (addSimpleProductsToCartData &&
                addSimpleProductsToCartData.addSimpleProductsToCart) ||
            (addSimpleCustomProductsToCartData &&
                addSimpleCustomProductsToCartData.addSimpleProductsToCart) ||
            (addBundleProductsToCartData &&
                addBundleProductsToCartData.addBundleProductsToCart)
    };
};

export const isCutomOptionPresent = product =>
    product && product.options && product.options.length > 0;

export const isBundleOptionPresent = product =>
    product && product.bundleItems && product.bundleItems.length > 0;

export const useProductReviews = props => {
    const { query } = props;
    const { error, data, fetchMore } = useQuery(query, {
        variables: {
            product_id: props.product_id,
            current_page: props.current_page,
            limit: props.limit
        },
        fetchPolicy: 'network-only',
        skip: !props.product_id
    });
    useEffect(() => {
        if (error) {
            console.log(error);
        }
    }, [error]);

    const loadMoreReviews = async params => {
        fetchMore({
            variables: {
                product_id: params.product_id,
                current_page: params.current_page,
                limit: params.limit
            },
            updateQuery: (pv, { fetchMoreResult }) => {
                if (!fetchMoreResult) {
                    return pv;
                }
                return {
                    productReviews: {
                        __typename: 'ProductReviews',
                        data: [
                            ...pv.productReviews.data,
                            ...fetchMoreResult.productReviews.data
                        ],
                        avgRating: fetchMoreResult.productReviews.avgRating,
                        totalRating: fetchMoreResult.productReviews.totalRating,
                        totalStarts: fetchMoreResult.productReviews.totalStarts,
                        current_page: params.current_page,
                        limit: params.limit
                    }
                };
            }
        });
    };

    if (typeof data != 'undefined') {
        return { productReviews: data.productReviews, loadMoreReviews };
    } else {
        return { productReviews: '', loadMoreReviews };
    }
};

export const useProductRatings = props => {
    const { query } = props;
    const { error, data } = useQuery(query);
    useEffect(() => {
        if (error) {
            console.log(error);
        }
    }, [error]);

    if (typeof data != 'undefined') {
        return { productRatings: data.getProductRatings };
    } else {
        return { productRatings: '' };
    }
};

export const useSubmitProductReview = props => {
    const { query } = props;
    const [reviewResponseData, setReviewResponseData] = useState({});
    const [showReviewLoader, setShowReviewLoader] = useState(false);
    const [submit] = useMutation(query);
    const submitReview = async details => {
        setShowReviewLoader(true);
        const response = await submit({
            variables: details
        });
        setReviewResponseData(response.data.submitProductReview);
        setShowReviewLoader(false);
    };
    return {
        submitReview,
        reviewResponseData,
        showReviewLoader
    };
};

export const useAddItemToWishlist = props => {
    const { query, customerQuery } = props;
    const apolloClient = useApolloClient();

    const [addItem, { data: wishlistResponse }] = useMutation(query);
    const [adding, setAdding] = useState(false);
    const [, { getUserDetails }] = useUserContext();
    const fetchUserDetails = useAwaitQuery(customerQuery);
    const addItemToWishlist = useCallback(
        async ({ product_id }) => {
            try {
                setAdding(true);
                await addItem({ variables: { product_id } });
                setAdding(false);
                await clearCustomerDataFromCache(apolloClient);
                getUserDetails({ fetchUserDetails });
            } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                    console.error(error);
                    setAdding(false);
                }
            }
        },
        [addItem, apolloClient, fetchUserDetails, getUserDetails]
    );
    return {
        addItemToWishlist,
        wishlistResponse,
        addingToWishlist: adding
    };
};

export const useLinkedProduct = props => {
    const { query, sku } = props;
    const { error, data } = useQuery(query, {
        variables: {
            sku
        },
        fetchPolicy: 'network-only'
    });
    useEffect(() => {
        if (error) {
            console.log(error);
        }
    }, [error]);

    return {
        relatedProducts:
            data && data.linkedProducts && data.linkedProducts.related_product,
        upsell_products:
            data && data.linkedProducts && data.linkedProducts.upsell_products
    };
};

export const useProductMoreInfo = props => {
    const { query, sku } = props;
    const { error, data } = useQuery(query, {
        variables: {
            sku
        },
        fetchPolicy: 'network-only'
    });
    useEffect(() => {
        if (error) {
            console.log(error);
        }
    }, [error]);

    if (typeof data != 'undefined') {
        return {
            productMoreInfo: data.moreInfoProducts && data.moreInfoProducts.data
        };
    } else {
        return { productMoreInfo: '' };
    }
};

export const useCategoryAddToCart = props => {
    const {
        addSimpleProductToCartMutation,
        createCartMutation,
        getCartDetailsQuery,
        setShowAlertMsg
    } = props;

    const [{ isAddingItem }, { addItemToCart }] = useCartContext();

    const [
        addSimpleProductToCart,
        { error: errorAddingSimpleProduct, data: addSimpleProductsToCartData }
    ] = useMutation(addSimpleProductToCartMutation);

    const [fetchCartId] = useMutation(createCartMutation);

    const fetchCartDetails = useAwaitQuery(getCartDetailsQuery);

    const [quantity] = useState(INITIAL_QUANTITY);

    const handleAddToCart = useCallback(
        async product => {
            const productType = product.__typename;
            const payload = {
                item: product,
                productType,
                quantity
            };

            let addItemMutation;
            // Use the proper mutation for the type.
            if (
                productType === 'SimpleProduct' ||
                productType === 'VirtualProduct'
            ) {
                addItemMutation = addSimpleProductToCart;
            } else if (product.type === 'simple') {
                addItemMutation = addSimpleProductToCart;
            }

            await addItemToCart({
                ...payload,
                addItemMutation,
                fetchCartDetails,
                fetchCartId
            });
            setShowAlertMsg(true);

            // toggleDrawer("cart");
        },
        [
            addItemToCart,
            addSimpleProductToCart,
            fetchCartDetails,
            fetchCartId,
            quantity,
            setShowAlertMsg
        ]
    );
    const SuccessMessage =
        addSimpleProductsToCartData &&
        addSimpleProductsToCartData.addSimpleProductsToCart;
    const derivedErrorMessage = useMemo(() => {
        return deriveErrorMessage([errorAddingSimpleProduct]) || '';
    }, [errorAddingSimpleProduct]);
    return {
        handleAddToCart,
        isAddingItem,
        errorMessage: derivedErrorMessage,
        success: SuccessMessage
    };
};
export const useCrossSellProduct = props => {
    const { query, cartItems } = props;
    const skus = [];
    if (cartItems) {
        cartItems.forEach(function(value) {
            skus.push(value.product.sku);
        });
    }
    const { error, data } = useQuery(query, {
        variables: {
            skus,
            pageSize: 10
        },
        fetchPolicy: 'network-only',
        skip: skus.length ? false : true
    });
    useEffect(() => {
        if (error) {
            console.log(error);
        }
    }, [error]);
    console.log(data);
    return {
        crossSellData: data && data.products && data.products.items
    };
};
