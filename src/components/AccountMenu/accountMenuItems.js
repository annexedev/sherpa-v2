import React from 'react';
import { func, shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Link } from 'src/drivers';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { useAccountMenuItems } from '@magento/peregrine/lib/talons/AccountMenu/useAccountMenuItems';
import { useDashboard } from '../../peregrine/lib/talons/MyAccount/useDashboard';

import defaultClasses from './accountMenuItems.css';
import { useUserContext } from '@magento/peregrine/lib/context/user';

const AccountMenuItems = props => {
    const { onSignOut } = props;
    const { email } = useDashboard();
    const talonProps = useAccountMenuItems({ onSignOut });
    const { handleSignOut, menuItems } = talonProps;
    const [{ isSignedIn: isUserSignedIn }] = useUserContext();
    const classes = mergeClasses(defaultClasses, props.classes);

    const OpenSignIn = () => {
        document.getElementById('openSignin').click();
    };

    const menu = menuItems.map(item => {
        return (
            <React.Fragment key={item.name + item.id}>
                {typeof isUserSignedIn != 'undefined' && isUserSignedIn && (
                    <Link
                        className={classes.link}
                        key={item.name}
                        to={item.url}
                    >
                        <FormattedMessage id={item.id} />
                    </Link>
                )}
                {typeof isUserSignedIn != 'undefined' && !isUserSignedIn && (
                    <button
                        className={classes.link}
                        key={item.name}
                        onClick={() => OpenSignIn()}
                    >
                        <FormattedMessage id={item.id} />
                    </button>
                )}
            </React.Fragment>
        );
    });

    return (
        <div className={classes.root}>
            {/*<span className={classes.customer_mail}>{email}</span>*/}
            {menu}
            <button
                className={classes.signOut}
                onClick={handleSignOut}
                type="button"
                key={'signout'}
            >
                <FormattedMessage id={`SIGN OUT`} />
            </button>
        </div>
    );
};

export default AccountMenuItems;

AccountMenuItems.propTypes = {
    classes: shape({
        link: string,
        signOut: string
    }),
    onSignOut: func
};
