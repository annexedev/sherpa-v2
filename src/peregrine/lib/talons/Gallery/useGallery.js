import { useQuery } from '@apollo/client';

import { useCustomerWishlistSkus } from '../../hooks/useCustomerWishlistSkus/useCustomerWishlistSkus';

import mergeOperations from '../../util/shallowMerge';
import defaultOperations from './gallery.gql';

export const useGallery = (props = {}) => {
    const operations = mergeOperations(defaultOperations, props.operations);

    useCustomerWishlistSkus();

    const { data: storeConfigData } = useQuery(operations.getStoreConfigQuery, {
        fetchPolicy: 'network-only'
    });

    const storeConfig = storeConfigData ? storeConfigData.storeConfig : null;

    return {
        storeConfig
    };
};
