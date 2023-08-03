import React, { Fragment } from 'react';
import { shape, string } from 'prop-types';
import { mergeClasses } from '../../classify';
import ForgotPasswordForm from './ForgotPasswordForm';
import defaultClasses from './forgotPassword.css';
import { useForgotPassword } from '../../peregrine/lib/talons/ForgotPassword/useForgotPassword';
import forgotPasswordMutation from '../../queries/forgotPassword.graphql';

const ForgotPassword = props => {
    const { initialValues, onClose, onCancel, handleTriggerClick } = props;
    const talonProps = useForgotPassword({
        onClose,
        query: forgotPasswordMutation
    });

    const { handleFormSubmit, inProgress, forgotPasswordResponse } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);
    return (
        <div className={classes.root}>
            <Fragment>
                <ForgotPasswordForm
                    handleTriggerClick={handleTriggerClick}
                    initialValues={initialValues}
                    onSubmit={handleFormSubmit}
                    isResettingPassword={inProgress}
                    otpResponse={forgotPasswordResponse}
                    setShowForgot={onCancel}
                />
            </Fragment>
        </div>
    );
};

export default ForgotPassword;

ForgotPassword.propTypes = {
    classes: shape({
        instructions: string,
        root: string
    }),
    email: string,
    initialValues: shape({
        email: string
    })
};
