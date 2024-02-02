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

    let is_granted = 2;

    var pid = 'mcharbonneau@annexe-d.com';

    let grantAccess =
        'https://data.sherpagroupav.com/get_projectaccess.php?email=' + pid;
    fetch(grantAccess)
        .then(res => res.json())
        .then(res => {
            if (res['access'] == 1) {
                is_granted = 1;
                console.log('YEAH !!!');
            } else {
                is_granted = 0;
            }
        });

    console.log('IS GRANTED :::::: ' + is_granted);

    let MENU_ITEMS = [];

    if (is_granted == 1) {
        MENU_ITEMS = [
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
            {
                name: 'My Projects',
                id: 'My Projects',
                url: '/myprojects'
            },
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
    } else {
        MENU_ITEMS = [
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
            {
                name: 'My Projects',
                id: 'My Projects',
                url: '/myprojects'
            }, 
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
    }

    return {
        handleSignOut,
        menuItems: MENU_ITEMS
    };
};
