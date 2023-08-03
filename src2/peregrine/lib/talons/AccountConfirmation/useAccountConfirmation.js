import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';

/**
 * Returns props necessary to render a ForgotPassword form.
 * @param {function} props.onClose callback function to invoke when closing the form
 */
export const useAccountConfirmation = props => {
    const {
        accountConfirmationMutation,
        createCartMutation,
        getCartDetailsQuery,
        customerQuery
    } = props;
    const [accountConfirm, { data: accountConfirmResponse }] = useMutation(
        accountConfirmationMutation
    );

    const [inProgress, setInProgress] = useState(false);

    const [, { createCart, getCartDetails, removeCart }] = useCartContext();
    const [, { getUserDetails, setToken }] = useUserContext();
    const [fetchCartId] = useMutation(createCartMutation);
    const fetchUserDetails = useAwaitQuery(customerQuery);
    const fetchCartDetails = useAwaitQuery(getCartDetailsQuery);

    const handleAccountConfirm = useCallback(
        async ({ id, key }) => {
            setInProgress(true);
            const response = await accountConfirm({ variables: { id, key } });
            if (response && response.data.accountConfirmation.success) {
                const token =
                    response &&
                    response.data.accountConfirmation.success &&
                    response.data.accountConfirmation.token;

                await setToken(token);

                await getUserDetails({ fetchUserDetails });

                await removeCart();

                await createCart({
                    fetchCartId
                });

                await getCartDetails({
                    fetchCartId,
                    fetchCartDetails
                });
            }
            setInProgress(false);
        },
        [
            accountConfirm,
            setToken,
            getUserDetails,
            fetchUserDetails,
            removeCart,
            createCart,
            fetchCartId,
            getCartDetails,
            fetchCartDetails
        ]
    );

    return {
        inProgress,
        handleAccountConfirm,
        accountConfirmResponse
    };
};

export const useSendConfirmationLink = props => {
    const { accountConfirmationLinkMutation } = props;
    const [confirmLink, { data: confirmLinkData }] = useMutation(
        accountConfirmationLinkMutation
    );

    const [inProgress, setInProgress] = useState(false);

    const SendAccountConfirmLink = useCallback(
        async ({ email }) => {
            setInProgress(true);
            await confirmLink({ variables: { email } });
            setInProgress(false);
        },
        [confirmLink, setInProgress]
    );

    return {
        inProgress,
        SendAccountConfirmLink,
        confirmLinkData
    };
};
