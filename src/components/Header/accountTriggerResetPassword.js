import React, { Fragment, Suspense } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { shape, string } from 'prop-types';
import { useAccountTrigger } from '@magento/peregrine/lib/talons/Header/useAccountTrigger';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import AccountChip from '../AccountChip';
import defaultClasses from './accountTrigger.css';

const AccountMenu = React.lazy(() => import('../AccountMenu'));
/**
 * The AccountTrigger component is the call to action in the site header
 * that toggles the AccountMenu dropdown.
 *
 * @param {Object} props
 * @param {Object} props.classes - CSS classes to override element styles.
 */
const AccountTriggerResetPassword = props => {
    const talonProps = useAccountTrigger();
    const {
        accountMenuIsOpen,
        accountMenuRef,
        accountMenuTriggerRef,
        setAccountMenuIsOpen,
        handleTriggerClick
    } = talonProps;


    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClassName = accountMenuIsOpen ? classes.root_open : classes.root;
    const { formatMessage } = useIntl();
    if (accountMenuIsOpen) {
        document
            .getElementsByTagName('html')[0]
            .setAttribute('data-scroll-lock', 'true');
    } else {
        document
            .getElementsByTagName('html')[0]
            .setAttribute('data-scroll-lock', 'false');
    }
    

    return (
        <Fragment>
            <div className={rootClassName} ref={accountMenuTriggerRef}>
                <button
                    id="reset_password"
                    aria-label={formatMessage({
                        id: 'accountTrigger.ariaLabel',
                        defaultMessage: 'Toggle My Account Menu'
                    })}
                    className={classes.trigger}
                    onClick={handleTriggerClick}
                >
                      <FormattedMessage
                                    id={'forgotPasswordForm.title'}
                                    defaultMessage={'Reset password existing count'}
                                />
                </button>
            </div>
            <Suspense fallback={null}>
                <AccountMenu
                    ref={accountMenuRef}
                    accountMenuIsOpen={accountMenuIsOpen}
                    setAccountMenuIsOpen={setAccountMenuIsOpen}
                    handleTriggerClick={handleTriggerClick}
                    customeRoute={'FORGOT_PASSWORD'}
                    displayBtnBack={false}
                />
            </Suspense>
        </Fragment>
    );
};

export default AccountTriggerResetPassword;

AccountTriggerResetPassword.propTypes = {
    classes: shape({
        root: string,
        root_open: string,
        trigger: string
    })
};
