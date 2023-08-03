import { useCallback, useRef, useState, useMemo } from 'react';
import { useApolloClient, useMutation } from '@apollo/client';

import { retrieveCartId } from '@magento/peregrine/lib/store/actions/cart';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import { clearCartDataFromCache } from '@magento/peregrine/lib/Apollo/clearCartDataFromCache';
import { clearCustomerDataFromCache } from '@magento/peregrine/lib/Apollo/clearCustomerDataFromCache';
import { useSaveToken } from '../PushNotification/usePushNotification';
import SAVE_TOKEN from '../../../../queries/saveToken.graphql';

import { Util } from '@magento/peregrine';
const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

export const useSignIn = props => {
    const {
        createCartMutation,
        customerQuery,
        getCartDetailsQuery,
        mergeCartsMutation,
        setDefaultUsername,
        showCreateAccount,
        showForgotPassword,
        signInMutation,
        assignMutation
    } = props;

    const apolloClient = useApolloClient();
    const [isSigningIn, setIsSigningIn] = useState(false);

    const [
        { cartId },
        { createCart, removeCart, getCartDetails }
    ] = useCartContext();

    const [
        { isGettingDetails, getDetailsError },
        { getUserDetails, setToken }
    ] = useUserContext();

    const [signIn, { error: signInError }] = useMutation(signInMutation, {
        fetchPolicy: 'no-cache'
    });
    const [assignToCustomer] = useMutation(assignMutation);

    const [fetchCartId] = useMutation(createCartMutation);
    const [mergeCarts] = useMutation(mergeCartsMutation);
    const fetchUserDetails = useAwaitQuery(customerQuery);
    const fetchCartDetails = useAwaitQuery(getCartDetailsQuery);

    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);
    const updateUid = uid => {
        storage.removeItem('compare_uid');
        storage.setItem('compare_uid', uid);
    };

    const { saveToken } = useSaveToken({
        query: SAVE_TOKEN
    });
    const NotificationToken = localStorage.getItem('notification-token');

    const handleSubmit = useCallback(
        async ({ email, password }) => {
            setIsSigningIn(true);
            try {
                // Get source cart id (guest cart id).
                const sourceCartId = cartId;
                var uid = storage.getItem('compare_uid')
                    ? storage.getItem('compare_uid')
                    : '';

                // Sign in and set the token.
                const signInResponse = await signIn({
                    variables: { email, password }
                });
                const token = signInResponse.data.generateCustomerToken.token;
                await setToken(token);

                // Clear all cart/customer data from cache and redux.
                await clearCartDataFromCache(apolloClient);
                await clearCustomerDataFromCache(apolloClient);
                await removeCart();
                if (NotificationToken) {
                    saveToken({ tokenId: NotificationToken });
                }
                // Create and get the customer's cart id.
                await createCart({
                    fetchCartId
                });
                const destinationCartId = await retrieveCartId();

                // Merge the guest cart into the customer cart.
                await mergeCarts({
                    variables: {
                        destinationCartId,
                        sourceCartId
                    }
                });
                if (uid != '') {
                    var comData = await assignToCustomer({
                        variables: {
                            uid: uid
                        },

                        skip: uid != '' ? false : true
                    });
                }
                if (
                    comData &&
                    comData.data.assignCompareListToCustomer &&
                    comData.data.assignCompareListToCustomer &&
                    comData.data.assignCompareListToCustomer.result == true
                ) {
                    updateUid(
                        comData.data.assignCompareListToCustomer.compare_list
                            .uid
                    );
                }
                // Ensure old stores are updated with any new data.
                await getUserDetails({ fetchUserDetails });
                await getCartDetails({ fetchCartId, fetchCartDetails });
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }

                setIsSigningIn(false);
            }
        },
        [
            cartId,
            signIn,
            setToken,
            apolloClient,
            removeCart,
            NotificationToken,
            createCart,
            fetchCartId,
            mergeCarts,
            assignToCustomer,
            getUserDetails,
            fetchUserDetails,
            getCartDetails,
            fetchCartDetails,
            saveToken
        ]
    );

    const handleForgotPassword = useCallback(() => {
        const { current: formApi } = formApiRef;

        if (formApi) {
            setDefaultUsername(formApi.getValue('email'));
        }

        showForgotPassword();
    }, [setDefaultUsername, showForgotPassword]);

    const handleCreateAccount = useCallback(() => {
        const { current: formApi } = formApiRef;

        if (formApi) {
            setDefaultUsername(formApi.getValue('email'));
        }

        showCreateAccount();
    }, [setDefaultUsername, showCreateAccount]);

    const errors = useMemo(
        () =>
            new Map([
                ['getUserDetailsQuery', getDetailsError],
                ['signInMutation', signInError]
            ]),
        [getDetailsError, signInError]
    );

    return {
        errors,
        handleCreateAccount,
        handleForgotPassword,
        handleSubmit,
        isBusy: isGettingDetails || isSigningIn,
        setFormApi
    };
};
