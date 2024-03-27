import React, { useState } from 'react';
import { func } from 'prop-types';
import { Form } from 'informed';
import { FormattedMessage, useIntl } from 'react-intl';
import signClasses from '../../SignIn/signIn.css';
import Button from '../../Button';
import Field from '../../Field';
import TextInput from '../../TextInput';
import { Util } from '@magento/peregrine';


import {
    validateEmail,
    isRequired,
    validatePassword,
    validateConfirmPassword
} from '../../../util/formValidators';

import { mergeClasses } from '../../../classify';
import defaultClasses from './forgotPasswordForm.css';
import { useResetPassword } from '../../../peregrine/lib/talons/ForgotPassword/useForgotPassword';
import resetPasswordMutation from '../../../queries/resetPassword.graphql';

const ForgotPasswordForm = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const { BrowserPersistence } = Util;
    const storage = new BrowserPersistence();
    let storeview = storage.getItem('store_view_code');
    if (!storeview) {
        storeview = '';
    } else {
        storeview = storeview;
    }

    const {
        email,
        isResettingPassword,
        onSubmit,
        otpResponse,
        setShowForgot,
        handleTriggerClick,
        displayBtnBack
    } = props;
    const [emailData, setEmailData] = useState('');

    function openLoginBox() {
            setTimeout(function() {
                document.getElementById('closePopupLink').click();
            }, 500);
    
            setTimeout(function() {
                document.getElementById('user_account').click();
            }, 500);
        
    }

    function returnToLogin() {
      
        setTimeout(function() {
            document.getElementById('returnToLogin').click();
        }, 500);

        setTimeout(function() {
            document.getElementById('user_account').click();
        }, 500);
    }

    const {
        submitResetForm,
        resetPasswordResponse,
        inProgress
    } = useResetPassword({
        query: resetPasswordMutation
    });

    
    const handleSubmitEmail = v => {
        setEmailData(v['email']);
        onSubmit(v);
    };
    const handleReset = v => {
        v['email'] = emailData;
        submitResetForm(v);
    };

    let lng = '';
    if (document.getElementById('currentLng') != null) {
        lng = document.getElementById('currentLng').innerHTML;
    }
    let activeLng = '';
    if (lng == 'Français') {
        activeLng = '-fr';
    } else {
        activeLng = '';
    }

    if (
        resetPasswordResponse &&
        resetPasswordResponse.resetForgotPassword &&
        resetPasswordResponse.resetForgotPassword.success
    ) {
        return (
            <div className={defaultClasses.instructionsContainer}>
                <div className={defaultClasses.check}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M22.8075 6.3975L20.5575 4.18875C20.2764 3.9088 19.8958 3.75163 19.4991 3.75163C19.1023 3.75163 18.7218 3.9088 18.4406 4.18875L9.75002 12.75L9.73971 12.7397L6.30471 9.43312C6.02288 9.15421 5.64208 8.99822 5.24558 8.99928C4.84907 9.00033 4.46911 9.15834 4.18877 9.43875L1.93877 11.6887C1.65796 11.97 1.50024 12.3512 1.50024 12.7486C1.50024 13.146 1.65796 13.5272 1.93877 13.8084L8.65314 20.5584C8.79244 20.6978 8.95781 20.8083 9.13982 20.8837C9.32183 20.9591 9.51691 20.9979 9.71392 20.9979C9.91094 20.9979 10.106 20.9591 10.288 20.8837C10.47 20.8083 10.6354 20.6978 10.7747 20.5584L22.8122 8.52281C22.9518 8.38314 23.0624 8.21729 23.1378 8.03476C23.2131 7.85224 23.2516 7.65664 23.2512 7.45918C23.2508 7.26172 23.2114 7.06629 23.1352 6.8841C23.0591 6.70191 22.9477 6.53655 22.8075 6.3975ZM9.71439 19.5L3.00002 12.75L5.25002 10.5L5.26033 10.5103L8.69533 13.8169C8.97622 14.0951 9.35559 14.2512 9.75096 14.2512C10.1463 14.2512 10.5257 14.0951 10.8066 13.8169L19.5056 5.25L21.75 7.4625L9.71439 19.5Z" fill="#8DC74C"/>
                    </svg>
                </div>
               
                <FormattedMessage
                            id={'forgotPasswordForm.instructions'}
                            defaultMessage={'Réinitialisation du mot de passe'}
                />
                <button
                    className={defaultClasses.instructions}
                    onClick={openLoginBox}
                >
                    <FormattedMessage
                        id={'forgotPasswordForm.instructions_notify'}
                        defaultMessage={
                            'Password Changed successfully. Please click here to login'
                        }
                    />
                </button>
                <a href="#" id="closePopupLink"></a>
            </div>
        );
    } else if (
        otpResponse &&
        otpResponse.forgotPassword &&
        otpResponse.forgotPassword.success
    ) {
        return (
            <Form className={classes.root} onSubmit={handleReset}>
                <div className={'text-right'}>
                    <span
                        role="button"
                        onClick={handleTriggerClick}
                        onKeyDown={handleTriggerClick}
                        tabIndex={0}
                        className={signClasses.close}
                    >
                        <img
                            src="/cenia-static/images/cross.png"
                            alt="icon"
                            width="30"
                        />
                    </span>
                </div>
                <h2 className={defaultClasses.title}>
                    {activeLng == '-fr' ? (
                        <FormattedMessage
                            id={'forgotPasswordForm.titleSuccess'}
                            defaultMessage={'Réinitialisation du mot de passe'}
                        />
                    ) : (
                        <FormattedMessage
                            id={'forgotPasswordForm.titleSuccess'}
                            defaultMessage={'Password Reset'}
                        />
                    )}
                </h2>
                <div className={classes.title_message}>
                    <FormattedMessage
                        id={'forgotPasswordForm.title_message_Success_notice'}
                        defaultMessage={
                            'A one-time password reset code (OTP) has been sent to your email address.'
                        }
                    />
                </div>
                <div className={classes.title_message}>
                    <FormattedMessage
                        id={'forgotPasswordForm.title_message_Success_more'}
                        defaultMessage={
                            'Enter this OTP into the field below, then choose your password, and click submit.Thank you, we look forward to working with you!'
                        }
                    />
                </div>
                <div className={classes.form_field}>
                    <Field label="OTP" required={true}>
                        <TextInput
                            field="otp"
                            validate={(value) => isRequired(value, storeview )}
                            validateOnBlur
                        />
                    </Field>
                </div>
                {/* <div className={classes.title_message}>
                    <FormattedMessage
                        id={'forgotPasswordForm.title_message_Success'}
                        defaultMessage={
                            'Enter your otp received on your email id.'
                        }
                    />
                </div> */}
                <div className={classes.form_field}>
                    <Field  label={formatMessage({
                              id: 'forgotPassword.password',
                                defaultMessage: 'Password'
                            })}  required={true}>
                        <TextInput
                            field="password"
                            type="password"
                            autoComplete="new-password"
                            validate={(value) => validatePassword(value, storeview )}
                            validateOnBlur
                        />
                    </Field>
                </div>
                <div className={classes.form_field}>
                    <Field label={formatMessage({
                                id: 'forgotPassword.confirmPassword',
                                defaultMessage: 'Confirm password'
                            })} required={true}>
                        <TextInput
                            field="confirm"
                            type="password"
                            validate={(value , values ) => validateConfirmPassword(value, values, 'password' , storeview)}
                            validateOnBlur
                        />
                    </Field>
                </div>
                <div className={classes.signInError}>
                    {resetPasswordResponse &&
                        resetPasswordResponse.resetPassword &&
                        resetPasswordResponse.resetPassword.message}
                </div>

                <div className={classes.buttonContainer}>
                    <Button disabled={inProgress} type="submit" priority="high">
                        <FormattedMessage
                            id={'forgotPasswordForm.submit'}
                            defaultMessage={'Submit'}
                        />
                    </Button>
                </div>
                <div className={'text-center'}>
                    <span
                        role="button"
                        className={defaultClasses.instructions}
                        onClick={returnToLogin}
                        onKeyDown={() => setShowForgot(false)}
                        tabIndex={0}
                    >
                        <span>
                            <img
                                src="/cenia-static/images/icon_arrow_left.png"
                                alt="icon_arrow_left"
                                width="25"
                            />
                        </span>
                        <FormattedMessage
                            id={'forgotPasswordForm.BackToLoginSuccess'}
                            defaultMessage={'Back to Login'}
                        />
                    </span>
                    <a href="#" id="returnToLogin"></a>
                </div>
            </Form>
        );
    } else {
        return (
            <div>
                <div className={'text-right'}>
                    <span
                        role="button"
                        tabIndex={0}
                        onClick={handleTriggerClick}
                        onKeyDown={handleTriggerClick}
                        className={signClasses.close}
                    >
                        <img
                            src="/cenia-static/images/cross.png"
                            alt="icon"
                            width="30"
                        />
                    </span>
                </div>
                <h2 className={defaultClasses.title}>
                    {activeLng == '-fr' ? (
                        <FormattedMessage
                            id={'forgotPasswordForm.titleSuccess'}
                            defaultMessage={'Réinitialisation du mot de passe'}
                        />
                    ) : (
                        <FormattedMessage
                            id={'forgotPasswordForm.titleSuccess'}
                            defaultMessage={'Password Reset'}
                        />
                    )}
                </h2>
                <p className={defaultClasses.title_message}>
                    {activeLng == '-fr' ? (
                        <FormattedMessage
                            id={'forgotPasswordForm.title_message_notice'}
                            defaultMessage={
                                'Thank you for registering for an account on SherpaGroupAV.com'
                            }
                        />
                    ) : (
                        <FormattedMessage
                            id={'forgotPasswordForm.title_message_notice'}
                            defaultMessage={
                                'Thank you for registering for an account on SherpaGroupAV.com'
                            }
                        />
                    )}
                </p>
                <p className={defaultClasses.title_message}>
                    {activeLng == '-fr' ? (
                        <FormattedMessage
                            id={'forgotPasswordForm.title_message_more'}
                            defaultMessage={
                                'Please enter the email address you registered with below, and click submit:'
                            }
                        />
                    ) : (
                        <FormattedMessage
                            id={'forgotPasswordForm.title_message_more'}
                            defaultMessage={
                                'Please enter the email address you registered with below, and click submit:'
                            }
                        />
                    )}
                </p>
                <Form className={classes.root} onSubmit={handleSubmitEmail}>
                    <div className={defaultClasses.form_field}>
                        <Field
                            className={'mb-0'}
                            label={formatMessage({
                                id: 'forgotPassword.email',
                                defaultMessage: 'Email Address'
                            })}
                            required={true}
                        >
                            <TextInput
                                autoComplete="email"
                                field="email"
                                validate={(value) => validateEmail(value, storeview )}
                                validateOnBlur
                                initialValue={email}
                            />
                        </Field>
                    </div>

                    <div className={defaultClasses.signInError}>
                        {otpResponse &&
                            otpResponse.forgotPassword &&
                            otpResponse.forgotPassword.message}
                    </div>
                    <div className={classes.buttonContainer}>
                        <Button
                            disabled={isResettingPassword}
                            type="submit"
                            priority="high"
                        >
                            <FormattedMessage
                                id={'forgotPasswordForm.isResettingPassword'}
                                defaultMessage={'Submit'}
                            />
                        </Button>
                    </div>
                    {displayBtnBack ? (
                        <div className={'text-center'}>
                            <span
                                role="button"
                                className={defaultClasses.instructions}
                                onClick={() => setShowForgot(false)}
                                onKeyDown={() => setShowForgot(false)}
                                tabIndex={0}
                            >
                                <span>
                                    <img
                                        src="/cenia-static/images/icon_arrow_left.png"
                                        alt="icon_arrow_left"
                                        width="25"
                                    />
                                </span>
                                <FormattedMessage
                                    id={'forgotPasswordForm.BackToLogin'}
                                    defaultMessage={'Back to Login'}
                                />
                            </span>
                        </div>
                    ) : (
                        <></>
                    )}
                </Form>
            </div>
        );
    }
};

ForgotPasswordForm.propTypes = {
    onSubmit: func.isRequired
};

export default ForgotPasswordForm;
