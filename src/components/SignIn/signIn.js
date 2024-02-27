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
import { Util } from '@magento/peregrine';

function openJotForm() {
    window.open(
        'https://form.jotform.com/230886199517066',
        'blank',
        'scrollbars=yes, toolbar=no, width=700, height=500'
    );
}

const clearIcon = <Icon src={ClearIcon} size={30} />;

const { BrowserPersistence } = Util;
    const storage = new BrowserPersistence();
    let storeview = storage.getItem('store_view_code');
    if (!storeview) {
        storeview = '';
    } else {
        storeview = storeview;
    }

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

    return (
        <div>
            <FormError errors={Array.from(errors.values())} rich={true} />
            <Form
                getApi={setFormApi}
                className={classes.form}
                onSubmit={handleSubmit}
            >
                <div className={classes.root}>
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
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
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 about-us">
                            <h2 className={classes.title}>
                                {activeLng == '-fr' && (
                                    <FormattedMessage
                                        id="signIn.titleMessage"
                                        defaultMessage={`Connectez-vous à votre compte`}
                                    />
                                )}
                                {activeLng == '' && (
                                    <FormattedMessage
                                        id="signIn.titleMessage"
                                        defaultMessage={`Sign-in to Your Account`}
                                    />
                                )}
                            </h2>
                            {activeLng == '-fr' && (
                                <Field
                                    label={formatMessage({
                                        id: 'signIn.EmailAddress',
                                        defaultMessage: 'Adresse courriel'
                                    })}
                                >
                                    <TextInput
                                        autoComplete="email"
                                        field="email"
                                        validate={(value) => validateEmail(value, storeview )}
                                    />
                                </Field>
                            )}
                            {activeLng == '' && (
                                <Field
                                    label={formatMessage({
                                        id: 'signIn.EmailAddress',
                                        defaultMessage: 'Email address'
                                    })}
                                >
                                    <TextInput
                                        autoComplete="email"
                                        field="email"
                                        validate={(value) => validateEmail(value, storeview )}
                                    />
                                </Field>
                            )}
                            {activeLng == '-fr' && (
                                <Password
                                    fieldName="password"
                                    label={formatMessage({
                                        id: 'signIn.Password',
                                        defaultMessage: 'Mot de passe'
                                    })}
                                    validate={(value) => validatePassword(value, storeview )}
                                    autoComplete="current-password"
                                    isToggleButtonHidden={false}
                                />
                            )}
                            {activeLng == '' && (
                                <Password
                                    fieldName="password"
                                    label={formatMessage({
                                        id: 'signIn.Password',
                                        defaultMessage: 'Password'
                                    })}
                                    validate={(value) => validatePassword(value, storeview )}
                                    autoComplete="current-password"
                                    isToggleButtonHidden={false}
                                />
                            )}

                            <div className={'mt-3' + ' ' + classes.button_wrap}>
                                {activeLng == '-fr' ? (
                                    <Button priority="high" type="submit">
                                        <FormattedMessage
                                            id="signIn.Submit"
                                            defaultMessage={'Soumettre'}
                                        />
                                    </Button>
                                ) : (
                                    <Button priority="high" type="submit">
                                        <FormattedMessage
                                            id="signIn.Submit"
                                            defaultMessage={'Submit'}
                                        />
                                    </Button>
                                )}
                            </div>
                            <div
                                className={
                                    classes.forgotPasswordButtonContainer
                                }
                            >
                                <LinkButton
                                    classes={forgotPasswordClasses}
                                    type="button"
                                    onClick={handleForgotPassword}
                                >
                                    {activeLng == '-fr' ? (
                                        <FormattedMessage
                                            id="signIn.forgotPasswordButton"
                                            defaultMessage={
                                                'Mot de passe oublié?'
                                            }
                                        />
                                    ) : (
                                        <FormattedMessage
                                            id="signIn.forgotPasswordButton"
                                            defaultMessage={'Forgot Password?'}
                                        />
                                    )}
                                </LinkButton>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 about-us">
                            <div>
                                <h2 className={classes.title}>
                                    {activeLng == '-fr' ? (
                                        <FormattedMessage
                                            id="signIn.title"
                                            defaultMessage={`Créer votre compte`}
                                        />
                                    ) : (
                                        <FormattedMessage
                                            id="signIn.title"
                                            defaultMessage={`Sign Up`}
                                        />
                                    )}
                                </h2>
                                <p className={classes.title_subtext}>
                                    {activeLng == '-fr' ? (
                                        <FormattedMessage
                                            id="signIn.title_subtext"
                                            defaultMessage="C'est simple et rapide de créer un compte"
                                        />
                                    ) : (
                                        <FormattedMessage
                                            id="signIn.title_subtext"
                                            defaultMessage="Welcome! It's quick and easy to set up an account"
                                        />
                                    )}
                                </p>
                                <div className={classes.buttonsContainer}>
                                    {activeLng == '-fr' ? (
                                        <a
                                            className={
                                                classes.signup_button +
                                                ' ' +
                                                classes.link_button
                                            }
                                            href="/new-user-account"
                                        >
                                            Créer un compte
                                        </a>
                                    ) : (
                                        <a
                                            className={
                                                classes.signup_button +
                                                ' ' +
                                                classes.link_button
                                            }
                                            href="/new-user-account"
                                        >
                                            Create an Account
                                        </a>
                                    )}

                                    {/*<Button
                                        className={classes.signup_button}
                                        priority="normal"
                                        type="button"
                                        onClick={handleCreateAccount}
                                    >
                                        <FormattedMessage
                                            id="signIn.signup_button"
                                            defaultMessage={'Create an Account'}
                                        />
                            </Button> */}
                                </div>
                            </div>
                        </div>
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
