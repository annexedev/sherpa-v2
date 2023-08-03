import React, { useState } from 'react';
import { Form } from 'informed';
import { func, shape, string, bool } from 'prop-types';
import { Redirect } from 'src/drivers';
import { FormattedMessage, useIntl } from 'react-intl';
import { useCreateAccount } from '../../peregrine/lib/talons/CreateAccount/useCreateAccount';
import signClasses from '../SignIn/signIn.css';
import { mergeClasses } from '../../classify';
import CREATE_ACCOUNT_MUTATION from '../../queries/createAccount.graphql';
import CREATE_CART_MUTATION from '../../queries/createCart.graphql';
import GET_CART_DETAILS_QUERY from '../../queries/getCartDetails.graphql';
import GET_CUSTOMER_QUERY from '../../queries/getCustomer.graphql';
import SIGN_IN_MUTATION from '../../queries/signIn.graphql';
import { mergeCartsMutation } from '../../queries/mergeCarts.gql';
import combine from '../../util/combineValidators';
import {
    hasLengthAtLeast,
    isRequired,
    validatePassword
} from '../../util/formValidators';
import Button from '../Button';
import Checkbox from '../Checkbox';
import Field from '../Field';
import TextInput from '../TextInput';
import defaultClasses from './createAccount.css';
import FormError from '../FormError';
import Password from '../Password';
import AssignToCustomerMutation from '../../queries/assignCompareListToCustomer.graphql';
import Icon from '../Icon';
import { X as ClearIcon } from 'react-feather';

const clearIcon = <Icon src={ClearIcon} size={30} />;

const CreateAccount = props => {

    const { handleTriggerClick, onCancel } = props;
    const [isChecked, setIsChecked] = useState(false);
    const { formatMessage } = useIntl();

    const talonProps = useCreateAccount({
        queries: {
            customerQuery: GET_CUSTOMER_QUERY,
            getCartDetailsQuery: GET_CART_DETAILS_QUERY
        },
        mutations: {
            createAccountMutation: CREATE_ACCOUNT_MUTATION,
            createCartMutation: CREATE_CART_MUTATION,
            signInMutation: SIGN_IN_MUTATION,
            mergeCartsMutation,
            assignMutation: AssignToCustomerMutation
        },
        initialValues: props.initialValues,
        onSubmit: props.onSubmit,
        onCancel: props.onCancel
    });

    const {
        errors,
        handleSubmit,
        isDisabled,
        isSignedIn,
        initialValues,
        confirmation_required
    } = talonProps;

    if (isSignedIn) {
        return <Redirect to="/" />;
    }

    const classes = mergeClasses(defaultClasses, props.classes);
    const submitButton = (
        <Button
            className={classes.submitButton}
            disabled={isDisabled}
            type="submit"
            priority="high"
        >
            <FormattedMessage
                id={'createAccount.submitButton'}
                defaultMessage={'Submit'}
            />
        </Button>
    );

    var source = document.getElementById("formJot");
    document.getElementById("newJot").appendChild(source);

    

    

    return (
        <div className={signClasses.root}>
             <div className='row'>
                <div className='col-lg-6 col-md-6 col-sm-6 col-xs-12 about-us'>
                    <h2 className={signClasses.title}>
                        <FormattedMessage
                            id={'createAccount.title'}
                            defaultMessage={`Create New Customer Account`}
                        />
                    </h2>
                </div>
                <div className='col-lg-6 col-md-6 col-sm-6 col-xs-12 about-us'>
                    <div className={'text-right'}>
                        <span
                            role="button"
                            onClick={handleTriggerClick}
                            onKeyDown={handleTriggerClick}
                            tabIndex={0}
                            className={signClasses.close}
                        >
                            {clearIcon}
                        </span>
                    </div>
                </div>
             </div>
            <div className='row'>
            <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 about-us'>
            
                <div id='newJot'></div>

            </div>
            </div>
            <div className='row'>
            <div className='col-lg-6 col-md-6 col-sm-6 col-xs-12 about-us'>
              
               
                   
                 {/* <Form
                    className={classes.root}
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                >
                    {confirmation_required && (
                        <div className={defaultClasses.success_msg}>
                            Please check your email and confirm your account.
                        </div>
                    )}
                    <FormError errors={Array.from(errors.values())} />
                    <Field
                        label={formatMessage({
                            id: 'createAccount.firstName',
                            defaultMessage: 'First Name'
                        })}
                    >
                        <TextInput
                            field="customer.firstname"
                            autoComplete="given-name"
                            validate={isRequired}
                            validateOnBlur
                        />
                    </Field>
                    <Field
                        label={formatMessage({
                            id: 'createAccount.lastName',
                            defaultMessage: 'Last Name'
                        })}
                    >
                        <TextInput
                            field="customer.lastname"
                            autoComplete="family-name"
                            validate={isRequired}
                            validateOnBlur
                        />
                    </Field>
                    <Field
                        label={formatMessage({
                            id: 'createAccount.lastName',
                            defaultMessage: 'Phone Number'
                        })}
                    >
                        <TextInput
                            field="customer.lastname"
                            autoComplete="family-name"
                            validate={isRequired}
                            validateOnBlur
                        />
                    </Field>
                    <Field
                        label={formatMessage({
                            id: 'createAccount.email',
                            defaultMessage: 'Email'
                        })}
                    >
                        <TextInput
                            field="customer.email"
                            autoComplete="email"
                            validate={isRequired}
                            validateOnBlur
                        />
                    </Field>
                    <Password
                        autoComplete="new-password"
                        fieldName="password"
                        isToggleButtonHidden={false}
                        label={formatMessage({
                            id: 'createAccount.password',
                            defaultMessage: 'Password'
                        })}
                        validate={combine([
                            isRequired,
                            [hasLengthAtLeast, 8],
                            validatePassword
                        ])}
                        validateOnBlur
                    />
                     <div className={classes.subscribe}>
                        <Checkbox
                            field="subscribe"
                            label={formatMessage({
                                id: 'createAccount.newsletter',
                                defaultMessage: 'Subscribe to news and updates'
                            })}
                        />
                        </div> 
                    <div className={classes.subscribe} validate={isRequired}>
                        <Checkbox
                            id="assistance_allowed"
                            onClick={() => {
                                setIsChecked(!isChecked);
                            }}
                            field="assistance_allowed"
                            label={formatMessage({
                                id: 'createAccount.assistance',
                                defaultMessage: 'Allow remote shopping assistance'
                            })}
                        />
                    </div>
                    
                </Form> */}
                
            </div>
            <div className='col-lg-6 col-md-6 col-sm-6 col-xs-12 about-us'>
                
                {/*<Form
                    className={classes.root}
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                >
                    {confirmation_required && (
                        <div className={defaultClasses.success_msg}>
                            Please check your email and confirm your account.
                        </div>
                    )}
                    <FormError errors={Array.from(errors.values())} />
                    <Field
                        label={formatMessage({
                            id: 'createAccount.firstName',
                            defaultMessage: 'Company'
                        })}
                    >
                        <TextInput
                            field="customer.firstname"
                            autoComplete="given-name"
                            validate={isRequired}
                            validateOnBlur
                        />
                    </Field>
                    <Field
                        label={formatMessage({
                            id: 'createAccount.lastName',
                            defaultMessage: 'Street Address'
                        })}
                    >
                        <TextInput
                            field="customer.lastname"
                            autoComplete="family-name"
                            validate={isRequired}
                            validateOnBlur
                        />
                    </Field>
                    <Field
                        label={formatMessage({
                            id: 'createAccount.lastName',
                            defaultMessage: 'City'
                        })}
                    >
                        <TextInput
                            field="customer.lastname"
                            autoComplete="family-name"
                            validate={isRequired}
                            validateOnBlur
                        />
                    </Field>
                    <Field
                        label={formatMessage({
                            id: 'createAccount.email',
                            defaultMessage: 'State/Province'
                        })}
                    >
                        <TextInput
                            field="customer.email"
                            autoComplete="email"
                            validate={isRequired}
                            validateOnBlur
                        />
                    </Field>
                    <Field
                        label={formatMessage({
                            id: 'createAccount.email',
                            defaultMessage: 'Zip/Postal Code'
                        })}
                    >
                        <TextInput
                            field="customer.email"
                            autoComplete="email"
                            validate={isRequired}
                            validateOnBlur
                        />
                    </Field>
                    <div className={classes.subscribe}>
                        <Checkbox
                            field="subscribe"
                            label={formatMessage({
                                id: 'createAccount.newsletter',
                                defaultMessage: 'Subscribe to news and updates'
                            })}
                        />
                        </div> 
                    <div className={classes.subscribe} validate={isRequired}>
                        <Checkbox
                            id="assistance_allowed"
                            onClick={() => {
                                setIsChecked(!isChecked);
                            }}
                            field="assistance_allowed"
                            label={formatMessage({
                                id: 'createAccount.assistance',
                                defaultMessage: 'Allow remote shopping assistance'
                            })}
                        />
                    </div>
                    <div className={classes.actions}>{submitButton}</div>
                </Form> */}
                
                
            </div>
            </div>
            <div className='row'>
                <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12 about-us'>
                    <div className={signClasses.create_account_div}>
                        <h2 className={signClasses.title}>
                            <FormattedMessage
                                id={'createAccount.checkSignIn'}
                                defaultMessage={`Already a Member?`}
                            />
                        </h2>
                        <div className={signClasses.buttonsContainer + ' ' + 'mt-3'}>
                            <Button
                                className={signClasses.signup_button}
                                priority="normal"
                                type="button"
                                onClick={onCancel}
                            >
                                <FormattedMessage
                                    id={'createAccount.signup_button'}
                                    defaultMessage={'Sign In'}
                                />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

CreateAccount.propTypes = {
    classes: shape({
        actions: string,
        lead: string,
        root: string,
        subscribe: string
    }),
    initialValues: shape({
        email: string,
        firstName: string,
        lastName: string
    }),
    isCancelButtonHidden: bool,
    onSubmit: func.isRequired,
    onCancel: func
};

CreateAccount.defaultProps = {
    onCancel: () => {},
    isCancelButtonHidden: true
};

export default CreateAccount;
