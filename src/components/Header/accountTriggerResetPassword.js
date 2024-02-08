import React, { Fragment, Suspense } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { shape, string } from 'prop-types';
import { useAccountTrigger } from '@magento/peregrine/lib/talons/Header/useAccountTrigger';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './accountTrigger.css';
import Button from '../Button';

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
            <div className={classes.buttonContainer} >
                
                <Button
                            id="reset_password"
                            onClick={handleTriggerClick}
                            priority="high"
                        >
                            <FormattedMessage
                                id={'forgotPasswordForm.ResetPassword'}
                                defaultMessage={'Submit'}
                            />
                </Button>
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
