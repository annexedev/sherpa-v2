import { useCallback } from 'react';

/**
 * @param {Object}      props
 * @param {Function}    props.onSignOut - A function to call when sign out occurs.
 *
 * @returns {Object}    result
 * @returns {Function}  result.handleSignOut - The function to handle sign out actions.
 */
export const useAccountMenuItems = props => {
    const { onSignOut } = props;

    const handleSignOut = useCallback(() => {
        onSignOut();
    }, [onSignOut]);

    const MENU_ITEMS = [
        {
            name: 'My Account',
            id: 'My Account',
            url: '/account'
        },
        {
            name: 'My Orders',
            id: 'My Orders',
            url: '/orders'
        },
        /*{
            name: 'My Projects',
            id: 'My Projects',
            url: '/wishlist'
        }, */
        {
            name: 'Address Book',
            id: 'Address Book',
            url: '/addresses'
        },
        {
            name: 'Account Information',
            id: 'Account Information',
            url: '/profile'
        }
    ];

    return {
        handleSignOut,
        menuItems: MENU_ITEMS
    };
};
