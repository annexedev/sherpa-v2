import React, { useState } from 'react';
import { shape, string } from 'prop-types';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { useAccountMenu } from '../../peregrine/lib/talons/Header/useAccountMenu';

import CreateAccount from '../CreateAccount';
import SignIn from '../SignIn/signIn';
import AccountMenuItems from './accountMenuItems';
import ForgotPassword from '../ForgotPassword';

import SIGN_OUT_MUTATION from '../../queries/signOut.graphql';

import defaultClasses from './accountMenu.css';
import productDefaultClasses from '../ProductFullDetail/productFullDetail.css';
import { Modal } from '../Modal';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useCedContext } from 'src/peregrine/lib/context/ced';

const AccountMenu = React.forwardRef((props, ref) => {
    const [{ isSignedIn }] = useUserContext();
    const {
        accountMenuIsOpen,
        setAccountMenuIsOpen,
        handleTriggerClick
    } = props;
    const talonProps = useAccountMenu({
        mutations: { signOut: SIGN_OUT_MUTATION },
        accountMenuIsOpen,
        setAccountMenuIsOpen
    });
    const {
        view,
        username,
        handleAccountCreation,
        handleSignOut,
        handleForgotPassword,
        handleCancel,
        handleCreateAccount,
        updateUsername
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClass = accountMenuIsOpen ? classes.root_open : classes.root;

    let dropdownContents = null;
    const [overlayAdded, setOverlayAdded] = useState(false);
    const [{ overlay: backgroundOverlay }] = useCedContext();
    const [, { setOverlay }] = useCedContext();

    if (!backgroundOverlay && accountMenuIsOpen && !isSignedIn) {
        setOverlay(true);
        if (!overlayAdded) {
            setOverlayAdded(true);
        }
    }
    if (
        (backgroundOverlay &&
            !accountMenuIsOpen &&
            overlayAdded &&
            !isSignedIn) ||
        (backgroundOverlay && isSignedIn)
    ) {
        setOverlay(false);
        if (overlayAdded) {
            setOverlayAdded(false);
        }
    }

    switch (view) {
        case 'ACCOUNT': {
            dropdownContents = <AccountMenuItems onSignOut={handleSignOut} />;

            break;
        }
        case 'FORGOT_PASSWORD': {
            dropdownContents = (
                <ForgotPassword
                    handleTriggerClick={handleTriggerClick}
                    initialValues={{ email: username }}
                    onCancel={handleCancel}
                    handleTriggerClick={handleTriggerClick}
                />
            );

            break;
        }
        case 'CREATE_ACCOUNT': {
            dropdownContents = (
                <CreateAccount
                    classes={{ root: classes.createAccount }}
                    initialValues={{ email: username }}
                    isCancelButtonHidden={false}
                    onSubmit={handleAccountCreation}
                    onCancel={handleCancel}
                    handleTriggerClick={handleTriggerClick}
                />
            );

            break;
        }
        case 'SIGNIN':
        default: {
            dropdownContents = (
                <SignIn
                    classes={{
                        modal_active: classes.loading
                    }}
                    setDefaultUsername={updateUsername}
                    showCreateAccount={handleCreateAccount}
                    showForgotPassword={handleForgotPassword}
                    handleTriggerClick={handleTriggerClick}
                />
            );

            break;
        }
    }

    return (
        <>
            {(view == 'SIGNIN' ||
                view == 'FORGOT_PASSWORD' ||
                view == 'CREATE_ACCOUNT') && (
                <Modal>
                    <div className={rootClass} ref={ref}>
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={handleTriggerClick}
                            onKeyDown={handleTriggerClick}
                            className={productDefaultClasses.overlay}
                        />
                        <aside
                            className={productDefaultClasses.review_form_inner}
                        >
                            <div
                                className={
                                    productDefaultClasses.review_form_wrapper
                                }
                            >
                                {accountMenuIsOpen ? dropdownContents : null}
                            </div>
                        </aside>
                    </div>
                </Modal>
            )}
            {view == 'ACCOUNT' && (
                <div className={classes.signedin_menu} ref={ref}>
                    <div className={classes.account_modal}>
                        {accountMenuIsOpen ? dropdownContents : null}
                    </div>
                </div>
            )}
        </>
    );
});

export default AccountMenu;

AccountMenu.propTypes = {
    classes: shape({
        root: string,
        root_open: string,
        link: string
    })
};
