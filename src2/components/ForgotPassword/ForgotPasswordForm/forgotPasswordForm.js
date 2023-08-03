import React, { useState } from 'react';
import { func } from 'prop-types';
import { Form } from 'informed';
import { FormattedMessage, useIntl } from 'react-intl';
import signClasses from '../../SignIn/signIn.css';
import Button from '../../Button';
import Field from '../../Field';
import TextInput from '../../TextInput';

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

    const {
        email,
        isResettingPassword,
        onSubmit,
        otpResponse,
        setShowForgot,
        handleTriggerClick
    } = props;
    const [emailData, setEmailData] = useState('');

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
    if (
        resetPasswordResponse &&
        resetPasswordResponse.resetForgotPassword &&
        resetPasswordResponse.resetForgotPassword.success
    ) {
        return (
            <div>
                <button
                    className={defaultClasses.instructions}
                    onClick={() => setShowForgot(false)}
                >
                    <FormattedMessage
                        id={'forgotPasswordForm.instructions'}
                        defaultMessage={
                            'Password Changed successfully. Please click here to login'
                        }
                    />
                </button>
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
                    <FormattedMessage
                        id={'forgotPasswordForm.titleSuccess'}
                        defaultMessage={'Password Reset'}
                    />
                </h2>
                <div className={classes.form_field}>
                    <Field label="OTP" required={true}>
                        <TextInput
                            field="otp"
                            validate={isRequired}
                            validateOnBlur
                        />
                    </Field>
                </div>
                <div className={classes.title_message}>
                    <FormattedMessage
                        id={'forgotPasswordForm.title_message_Success'}
                        defaultMessage={
                            'Enter your otp received on your email id.'
                        }
                    />
                </div>
                <div className={classes.form_field}>
                    <Field label="Password" required={true}>
                        <TextInput
                            field="password"
                            type="password"
                            autoComplete="new-password"
                            validate={validatePassword}
                            validateOnBlur
                        />
                    </Field>
                </div>
                <div className={classes.form_field}>
                    <Field label="Confirm Password" required={true}>
                        <TextInput
                            field="confirm"
                            type="password"
                            validate={validateConfirmPassword}
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
                            id={'forgotPasswordForm.BackToLoginSuccess'}
                            defaultMessage={'Back to Login'}
                        />
                    </span>
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
                    <FormattedMessage
                        id={'forgotPasswordForm.title'}
                        defaultMessage={'Password Reset'}
                    />
                </h2>
                <p className={defaultClasses.title_message}>
                    <FormattedMessage
                        id={'forgotPasswordForm.title_message'}
                        defaultMessage={
                            'Enter your email below to receive OTP.'
                        }
                    />
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
                                validate={validateEmail}
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
                </Form>
            </div>
        );
    }
};

ForgotPasswordForm.propTypes = {
    onSubmit: func.isRequired
};

export default ForgotPasswordForm;
