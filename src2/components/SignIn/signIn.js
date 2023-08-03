import React from 'react';
import { func, shape, string } from 'prop-types';
import { Form } from 'informed';
import { useSignIn } from '../../peregrine/lib/talons/SignIn/useSignIn';
import { FormattedMessage, useIntl } from 'react-intl';
import { mergeClasses } from '../../classify';
import CREATE_CART_MUTATION from '../../queries/createCart.graphql';
import GET_CUSTOMER_QUERY from '../../queries/getCustomer.graphql';
import SIGN_IN_MUTATION from '../../queries/signIn.graphql';
import { mergeCartsMutation } from '../../queries/mergeCarts.gql';
import { validateEmail, validatePassword } from '../../util/formValidators';
import Button from '../Button';
import Field from '../Field';
import LoadingIndicator from '../LoadingIndicator';
import TextInput from '../TextInput';
import defaultClasses from './signIn.css';
import { GET_CART_DETAILS_QUERY } from './signIn.gql';
import LinkButton from '../LinkButton';
import Password from '../Password';
import FormError from '../FormError/formError';
import AssignToCustomerMutation from '../../queries/assignCompareListToCustomer.graphql';
import Icon from '../Icon';
import { X as ClearIcon } from 'react-feather';

const clearIcon = <Icon src={ClearIcon} size={30} />;

const SignIn = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const {
        setDefaultUsername,
        showCreateAccount,
        showForgotPassword,
        handleTriggerClick
    } = props;
    const { formatMessage } = useIntl();

    const talonProps = useSignIn({
        createCartMutation: CREATE_CART_MUTATION,
        customerQuery: GET_CUSTOMER_QUERY,
        getCartDetailsQuery: GET_CART_DETAILS_QUERY,
        signInMutation: SIGN_IN_MUTATION,
        assignMutation: AssignToCustomerMutation,
        mergeCartsMutation,
        setDefaultUsername,
        showCreateAccount,
        showForgotPassword
    });

    const {
        errors,
        handleCreateAccount,
        handleForgotPassword,
        handleSubmit,
        isBusy,
        setFormApi
    } = talonProps;

    if (isBusy) {
        return (
            <div className={classes.modal_active}>
                <LoadingIndicator>{'Signing In'}</LoadingIndicator>
            </div>
        );
    }

    const forgotPasswordClasses = {
        root: classes.forgotPasswordButton
    };

    return (
        <div className={classes.root}>
            <div className={'text-right'}>
                <span
                    role="button"
                    onClick={handleTriggerClick}
                    onKeyDown={handleTriggerClick}
                    tabIndex={0}
                    className={classes.close}
                >
                    {clearIcon}
                </span>
            </div>
            <h2 className={classes.title}>
                <FormattedMessage
                    id="signIn.titleMessage"
                    defaultMessage={`Sign-in to Your Account`}
                />
            </h2>
            <FormError errors={Array.from(errors.values())} rich={true} />
            <Form
                getApi={setFormApi}
                className={classes.form}
                onSubmit={handleSubmit}
            >
                <Field
                    label={formatMessage({
                        id: 'signIn.EmailAddress',
                        defaultMessage: 'Email address'
                    })}
                >
                    <TextInput
                        autoComplete="email"
                        field="email"
                        validate={validateEmail}
                    />
                </Field>
                <Password
                    fieldName="password"
                    label={formatMessage({
                        id: 'signIn.Password',
                        defaultMessage: 'Password'
                    })}
                    validate={validatePassword}
                    autoComplete="current-password"
                    isToggleButtonHidden={false}
                />
                <div className={'mt-3' + ' ' + classes.button_wrap}>
                    <Button priority="high" type="submit">
                        <FormattedMessage
                            id="signIn.Submit"
                            defaultMessage={'Submit'}
                        />
                    </Button>
                </div>
                <div className={classes.forgotPasswordButtonContainer}>
                    <LinkButton
                        classes={forgotPasswordClasses}
                        type="button"
                        onClick={handleForgotPassword}
                    >
                        <FormattedMessage
                            id="signIn.forgotPasswordButton"
                            defaultMessage={'Forgot Password?'}
                        />
                    </LinkButton>
                </div>
                <div className={classes.create_account_div}>
                    <h2 className={classes.title}>
                        <FormattedMessage
                            id="signIn.title"
                            defaultMessage={`Sign Up`}
                        />
                    </h2>
                    <p className={classes.title_subtext}>
                        <FormattedMessage
                            id="signIn.title_subtext"
                            defaultMessage="Welcome! It's quick and easy to set up an account"
                        />
                    </p>
                    <div className={classes.buttonsContainer}>
                        <Button
                            className={classes.signup_button}
                            priority="normal"
                            type="button"
                            onClick={handleCreateAccount}
                        >
                            <FormattedMessage
                                id="signIn.signup_button"
                                defaultMessage={'Create an Account'}
                            />
                        </Button>
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default SignIn;

SignIn.propTypes = {
    classes: shape({
        buttonsContainer: string,
        form: string,
        forgotPasswordButton: string,
        forgotPasswordButtonContainer: string,
        root: string,
        title: string
    }),
    setDefaultUsername: func,
    showCreateAccount: func,
    showForgotPassword: func
};

SignIn.defaultProps = {
    setDefaultUsername: () => {},
    showCreateAccount: () => {},
    showForgotPassword: () => {}
};
