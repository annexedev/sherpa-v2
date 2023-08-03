import React, { useState, useEffect } from 'react';
import ACC_CONFIRMATION_MUTATION from './accountConfirmationLink.graphql';
import { useSendConfirmationLink } from '../../peregrine/lib/talons/AccountConfirmation/useAccountConfirmation';
import { useLocation } from 'react-router-dom';
import { useToasts } from '@magento/peregrine';
import defaultClasses from './accountConfirmation.css';
import Button from '../Button';

const SendConfirmationLink = () => {
    const location = useLocation();
    const { search } = location;
    const [, { addToast }] = useToasts();
    const searchData = new URLSearchParams(search);
    const [email, setEmail] = useState(searchData.get('email'));
    const [msgFlag, setMsgFlag] = useState(false);
    const {
        inProgress,
        SendAccountConfirmLink,
        confirmLinkData
    } = useSendConfirmationLink({
        accountConfirmationLinkMutation: ACC_CONFIRMATION_MUTATION
    });

    useEffect(() => {
        if (
            confirmLinkData &&
            confirmLinkData.accountConfirmationLink &&
            msgFlag
        ) {
            if (confirmLinkData.accountConfirmationLink.success) {
                addToast({
                    type: 'info',
                    message: confirmLinkData.accountConfirmationLink.message,
                    dismissable: true,
                    timeout: 1000
                });
            }
            if (confirmLinkData.accountConfirmationLink.success == false) {
                addToast({
                    type: 'error',
                    message: confirmLinkData.accountConfirmationLink.message,
                    dismissable: true,
                    timeout: 1000
                });
            }
            setMsgFlag(false);
        }
    }, [addToast, confirmLinkData, setMsgFlag, msgFlag]);

    return (
        <div className={defaultClasses.confirmation_page + ' ' + 'container'}>
            <div className={defaultClasses.page_title_wrapper}>
                <img
                    className={defaultClasses.confirm_img}
                    src="/cenia-static/images/sand-timer.png"
                    alt="timer"
                    width="60"
                    height="60"
                />
                <h1 className={defaultClasses.page_title}>
                    Send confirmation link{' '}
                </h1>
            </div>
            <form
                className={
                    defaultClasses.form +
                    ' ' +
                    defaultClasses.send +
                    ' ' +
                    defaultClasses.confirmation
                }
            >
                <fieldset className={defaultClasses.fieldset}>
                    <p className={defaultClasses.note}>
                        Please enter your email below and we will send you the
                        confirmation link.
                    </p>
                    <div
                        className={
                            defaultClasses.field +
                            ' ' +
                            defaultClasses.email +
                            ' ' +
                            'required'
                        }
                    >
                        <div className={defaultClasses.control}>
                            <input
                                type="email"
                                name="email"
                                id="email_address"
                                className={defaultClasses.input_text}
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                </fieldset>
                <div className={defaultClasses.actions_toolbar}>
                    <div className={defaultClasses.primary}>
                        <Button
                            priority="high"
                            onClick={() => {
                                setMsgFlag(true);
                                SendAccountConfirmLink({ email });
                            }}
                        >
                            {inProgress
                                ? 'Sending...'
                                : 'Send confirmation link'}
                        </Button>
                    </div>
                    <div className={defaultClasses.secondary}>
                        <span>Back to Home</span>
                    </div>
                </div>
            </form>
        </div>
    );
};
export default SendConfirmationLink;
