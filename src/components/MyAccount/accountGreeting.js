import { useAccountMenu } from '@magento/peregrine/lib/talons/Header/useAccountMenu';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDashboard } from '../../peregrine/lib/talons/MyAccount/useDashboard';
import defaultClasses from './myAccount.css';
import SIGN_OUT_MUTATION from '../../queries/signOut.graphql';

function AccountGreeting() {
    const [accountMenuIsOpen, setAccountMenuIsOpen] = useState(false);
    var shortName;
    const { handleSignOut } = useAccountMenu({
        mutations: { signOut: SIGN_OUT_MUTATION },
        accountMenuIsOpen,
        setAccountMenuIsOpen
    });
    const talonProps = useDashboard();
    const { name } = talonProps;
    if (name) {
        var nameArray = name.split(' ');
        shortName =
            nameArray[0].charAt(0).toUpperCase() +
            '' +
            (nameArray.length > 1 ? nameArray[1].charAt(0).toUpperCase() : '');
    }
    return (
        <>
            <div className={defaultClasses.customer_specified_details}>
                <div className={defaultClasses.customer_name_Fletter}>
                    {shortName}
                </div>
                <div className={defaultClasses.greetings_cust}>
                    <p className={defaultClasses.greetings_cust_text}>
                        <FormattedMessage
                            id={'account.greetings_cust_text'}
                            defaultMessage={'Hello,'}
                        />
                    </p>
                    <p className={defaultClasses.customer_name}>{name}</p>
                    <button
                        onClick={handleSignOut}
                        className={defaultClasses.signout_btn}
                    >
                        <FormattedMessage
                            id={'account.signout_btn'}
                            defaultMessage={'Sign out'}
                        />
                    </button>
                </div>
            </div>
        </>
    );
}

export default AccountGreeting;
