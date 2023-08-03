import React, { useState, useEffect } from 'react';
import { shape, string } from 'prop-types';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './myAccount.css';
import accountClasses from './accountinformation.css';
import { Form } from 'informed';
import Sidebar from './sidebar.js';
import { FormattedMessage, useIntl } from 'react-intl';
import Button from '@magento/venia-ui/lib/components/Button';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import CustomerQuery from '../../queries/getCustomer.graphql';
import updateCustomerQuery from '../../queries/updateCustomer.graphql';
import changeCustomerPasswordQuery from '../../queries/changePassword.graphql';
import {
    validateEmail,
    isRequired,
    validatePassword,
    validateNewConfirmPassword,
    hasLengthAtLeast
} from '../../util/formValidators';
import {
    useCustomer,
    useUpdateCustomer
} from '../../peregrine/lib/talons/MyAccount/useDashboard';
import { Redirect } from 'src/drivers';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useToasts } from '@magento/peregrine';
import { Title } from '@magento/venia-ui/lib/components/Head';

const AccountInformation = props => {
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();

    const [errorShow, setErrorShow] = useState(false);
    const [showMsg, setShowMsg] = useState(false);
    const passwordChange =
        props.location && props.location.state && props.location.state.password
            ? props.location.state.password
            : false;
    const classes = mergeClasses(defaultClasses, props.classes, accountClasses);
    const customerInfo = useCustomer({
        query: CustomerQuery
    });
    const { errors, handleSubmit, isBusy, responseData } = useUpdateCustomer({
        query: updateCustomerQuery,
        changeCustomerPasswordQuery
    });
    const { data, isSignedIn } = customerInfo;

    useEffect(() => {
        if (
            responseData &&
            responseData.customer &&
            responseData.customer.firstname &&
            showMsg
        ) {
            addToast({
                type: 'info',
                message: 'You saved the account information.',
                dismissable: true,
                timeout: 10000
            });
            setShowMsg(false);
        }
        if (errors.length > 0 && errorShow) {
            errors.forEach(element => {
                addToast({
                    type: 'error',
                    message: element.message,
                    dismissable: true,
                    timeout: 10000
                });
            });
            setErrorShow(false);
        }
    }, [
        addToast,
        errors,
        errorShow,
        setErrorShow,
        responseData,
        showMsg,
        setShowMsg
    ]);

    var errorMessage = '';
    const [changeEmail, setChangeEmail] = useState(false);
    const [changePassword, setChangePassword] = useState(passwordChange);

    const handleSubmitForm = v => {
        handleSubmit(v);
        setErrorShow(true);
        setShowMsg(true);
    };
    if (!isSignedIn) {
        return <Redirect to="/" />;
    }
    return (
        <div className={defaultClasses.columns}>
            {isBusy && (
                <div className={accountClasses.indicator_loader}>
                    <LoadingIndicator />
                </div>
            )}
            <div className="container">
                <Title>{`My Account Information - ${STORE_NAME}`}</Title>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div
                            className={
                                defaultClasses.column +
                                ' ' +
                                defaultClasses.main
                            }
                        >
                            <div className={defaultClasses.account_sideBar}>
                                <Sidebar history={props.history} />
                            </div>
                            <div className={defaultClasses.account_contentBar}>
                                <div
                                    className={
                                        defaultClasses.page_title_wrapper
                                    }
                                >
                                    <h1 className={defaultClasses.page_title}>
                                        <span className={defaultClasses.base}>
                                            <FormattedMessage
                                                id={
                                                    'accountInformation.page_title'
                                                }
                                                defaultMessage={
                                                    'Edit Account Information'
                                                }
                                            />
                                        </span>
                                    </h1>
                                </div>
                                {data && (
                                    <div
                                        className={
                                            classes.new_form_wrap +
                                            ' ' +
                                            accountClasses.account_form
                                        }
                                    >
                                        <Form
                                            onSubmit={v => handleSubmitForm(v)}
                                            className={
                                                accountClasses.account_form_inner
                                            }
                                        >
                                            <div
                                                className={
                                                    accountClasses.field_inner_wrap
                                                }
                                            >
                                                <Field
                                                    label={formatMessage({
                                                        id:
                                                            'accountInformation.FirstName',
                                                        defaultMessage:
                                                            'First Name'
                                                    })}
                                                    required={true}
                                                >
                                                    <TextInput
                                                        field="firstname"
                                                        autoComplete="given-name"
                                                        validate={isRequired}
                                                        validateOnBlur
                                                        initialValue={
                                                            data.firstname
                                                        }
                                                    />
                                                </Field>
                                            </div>
                                            <div
                                                className={
                                                    accountClasses.field_inner_wrap
                                                }
                                            >
                                                <Field
                                                    label={formatMessage({
                                                        id:
                                                            'accountInformation.LastName',
                                                        defaultMessage:
                                                            'Last Name'
                                                    })}
                                                    required={true}
                                                >
                                                    <TextInput
                                                        field="lastname"
                                                        autoComplete="family-name"
                                                        validate={isRequired}
                                                        validateOnBlur
                                                        initialValue={
                                                            data.lastname
                                                        }
                                                    />
                                                </Field>
                                            </div>
                                            <div
                                                className={
                                                    accountClasses.field_inner_wrap
                                                }
                                            >
                                                {changeEmail && (
                                                    <Field
                                                        label={formatMessage({
                                                            id:
                                                                'accountInformation.Email',
                                                            defaultMessage:
                                                                'Email'
                                                        })}
                                                        required={true}
                                                    >
                                                        <TextInput
                                                            field="email"
                                                            autoComplete="email"
                                                            validate={combine([
                                                                isRequired,
                                                                validateEmail
                                                            ])}
                                                            validateOnBlur
                                                            initialValue={
                                                                data.email
                                                            }
                                                        />
                                                    </Field>
                                                )}
                                            </div>
                                            <div
                                                className={
                                                    accountClasses.field_inner_wrap
                                                }
                                            >
                                                {(changeEmail ||
                                                    changePassword) && (
                                                    <Field
                                                        label={formatMessage({
                                                            id:
                                                                'accountInformation.CurrentPassword',
                                                            defaultMessage:
                                                                'Current Password'
                                                        })}
                                                        required={true}
                                                    >
                                                        <TextInput
                                                            field="password"
                                                            type="password"
                                                            validate={combine([
                                                                isRequired,
                                                                [
                                                                    hasLengthAtLeast,
                                                                    8
                                                                ],
                                                                validatePassword
                                                            ])}
                                                            validateOnBlur
                                                        />
                                                    </Field>
                                                )}
                                            </div>
                                            <div
                                                className={
                                                    accountClasses.field_inner_wrap
                                                }
                                            >
                                                {changePassword && (
                                                    <Field
                                                        label={formatMessage({
                                                            id:
                                                                'accountInformation.NewPassword',
                                                            defaultMessage:
                                                                'New Password'
                                                        })}
                                                        required={true}
                                                    >
                                                        <TextInput
                                                            field="new_password"
                                                            type="password"
                                                            validate={combine([
                                                                isRequired,
                                                                [
                                                                    hasLengthAtLeast,
                                                                    8
                                                                ],
                                                                validatePassword
                                                            ])}
                                                            validateOnBlur
                                                        />
                                                    </Field>
                                                )}
                                            </div>
                                            <div
                                                className={
                                                    accountClasses.field_inner_wrap
                                                }
                                            >
                                                {changePassword && (
                                                    <Field
                                                        label={formatMessage({
                                                            id:
                                                                'accountInformation.ConfirmNewPassword',
                                                            defaultMessage:
                                                                'Confirm New Password'
                                                        })}
                                                        required={true}
                                                    >
                                                        <TextInput
                                                            field="confirm"
                                                            type="password"
                                                            validate={combine([
                                                                isRequired,
                                                                validateNewConfirmPassword
                                                            ])}
                                                            validateOnBlur
                                                        />
                                                    </Field>
                                                )}
                                            </div>
                                            <div className={classes.checkbox}>
                                                <Checkbox
                                                    field="change_email"
                                                    label={formatMessage({
                                                        id:
                                                            'accountInformation.ChangeEmail',
                                                        defaultMessage:
                                                            'Change Email'
                                                    })}
                                                    onChange={() =>
                                                        setChangeEmail(
                                                            !changeEmail
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className={classes.checkbox}>
                                                <Checkbox
                                                    initialValue={
                                                        changePassword
                                                    }
                                                    field="change_password"
                                                    label={formatMessage({
                                                        id:
                                                            'accountInformation.ChangePassword',
                                                        defaultMessage:
                                                            'Change Password'
                                                    })}
                                                    onChange={() =>
                                                        setChangePassword(
                                                            !changePassword
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className={classes.error}>
                                                {errorMessage}
                                            </div>
                                            <div
                                                className={classes.edit_acc_btn}
                                            >
                                                <Button
                                                    type="submit"
                                                    priority="high"
                                                >
                                                    <FormattedMessage
                                                        id={
                                                            'accountInformation.edit_acc_btn'
                                                        }
                                                        defaultMessage={
                                                            'Submit'
                                                        }
                                                    />
                                                </Button>
                                            </div>
                                        </Form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountInformation;

AccountInformation.propTypes = {
    classes: shape({
        actions: string,
        root: string,
        subtitle: string,
        title: string,
        user: string
    })
};
