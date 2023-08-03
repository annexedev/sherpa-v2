import React, { useState, useEffect } from 'react';
import { shape, string } from 'prop-types';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './myAccount.css';
import accountClasses from './accountinformation.css';
import { Form } from 'informed';
import Sidebar from './sidebar.js';
import Button from '../Button';
import Select from '../Select';
import Field from '../Field';
import Checkbox from '../Checkbox';
import { FormattedMessage, useIntl } from 'react-intl';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import createAddressQuery from '../../queries/createAddress.graphql';
import getAddressData from '../../queries/getAddressData.graphql';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import {
    useCreateAddress,
    useAddressData
} from '../../peregrine/lib/talons/MyAccount/useDashboard';
import getCountriesQuery from '../../queries/getCountries.graphql';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useToasts } from '@magento/peregrine';
import { useHistory } from 'react-router-dom';
const AccountInformation = props => {
    const [billingAddressCheck, setBillingAddressCheck] = useState(false);
    const [shippingAddressCheck, setShippingAddressCheck] = useState(false);
    const history = useHistory();
    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();
    const classes = mergeClasses(defaultClasses, props.classes, accountClasses);
    const { handleSubmit, isBusy, responseData } = useCreateAddress({
        query: createAddressQuery
    });
    var errorMessage = '';
    const { countries } = useAddressData({
        query: getAddressData,
        id: '',
        addressQuery: getCountriesQuery
    });

    let selectableCountries = [];
    let selectableState = [];

    const [country, setCountry] = useState('US');

    if (countries && typeof countries != 'undefined' && countries.length) {
        {
            countries.map((value, index) => {
                selectableCountries[index] = {
                    label: value.full_name_english,
                    value: value.id
                };
                if (value.id == country) {
                    if (
                        typeof value.available_regions != 'undefined' &&
                        value.available_regions
                    ) {
                        selectableState = value.available_regions.map(
                            ({ id, name }) => ({
                                label: name,
                                value: id
                            })
                        );
                    } else {
                        selectableState = [];
                    }
                }
            });
        }
    } else {
        selectableCountries = [];
    }

    const showRegion = () => {
        if (
            document.getElementById('country_id') &&
            country != document.getElementById('country_id').value
        ) {
            var sel = document.getElementById('country_id').value;
            setCountry(sel);
        }
    };

    const handleSubmitForm = fields => {
        var regionId = document.getElementById('region_id');
        var region = document.getElementById('region');
        var regionLabel;
        var regionValue;
        if (regionId) {
            regionLabel = regionId.options[regionId.selectedIndex].text;
            regionValue = regionId.options[regionId.selectedIndex].value;
        } else {
            regionLabel = region.value;
            regionValue = 0;
        }
        delete fields['region_id'];
        delete fields['region'];
        fields['region'] = { region: regionLabel, region_id: regionValue };
        handleSubmit(fields);
    };

    useEffect(() => {
        if (
            responseData &&
            responseData.createCustomerAddress &&
            responseData.createCustomerAddress.id
        ) {
            addToast({
                type: 'info',
                message: 'New address is saved.',
                dismissable: true,
                timeout: 1000
            });
            history.push('/addresses');
        }
    }, [addToast, history, responseData]);

    return (
        <div className={defaultClasses.columns}>
            {isBusy && (
                <div className={accountClasses.indicator_loader}>
                    <LoadingIndicator />
                </div>
            )}
            <div className="container">
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
                                                id={'newAddress.page_title'}
                                                defaultMessage={
                                                    'Edit Account Information'
                                                }
                                            />
                                        </span>
                                    </h1>
                                </div>
                                <div className={accountClasses.account_form}>
                                    <Form
                                        className={
                                            classes.root +
                                            ' ' +
                                            classes.new_form_wrap +
                                            ' ' +
                                            'p-3'
                                        }
                                        onSubmit={handleSubmitForm}
                                    >
                                        <div className={classes.field_wrapper}>
                                            <Field
                                                label={formatMessage({
                                                    id: 'newAddress.firstName',
                                                    defaultMessage: 'First Name'
                                                })}
                                                required={true}
                                            >
                                                <TextInput
                                                    field="firstname"
                                                    autoComplete="given-name"
                                                    validate={isRequired}
                                                    validateOnBlur
                                                />
                                            </Field>
                                        </div>
                                        <div className={classes.field_wrapper}>
                                            <Field
                                                label={formatMessage({
                                                    id: 'newAddress.lastName',
                                                    defaultMessage: 'Last Name'
                                                })}
                                                required={true}
                                            >
                                                <TextInput
                                                    field="lastname"
                                                    autoComplete="family-name"
                                                    validate={isRequired}
                                                    validateOnBlur
                                                />
                                            </Field>
                                        </div>
                                        <div className={classes.field_wrapper}>
                                            <Field
                                                label={formatMessage({
                                                    id: 'newAddress.company',
                                                    defaultMessage: 'Company'
                                                })}
                                            >
                                                <TextInput
                                                    field="company"
                                                    autoComplete="family-name"
                                                    validateOnBlur
                                                />
                                            </Field>
                                        </div>
                                        <div className={classes.field_wrapper}>
                                            <Field
                                                label={formatMessage({
                                                    id:
                                                        'newAddress.PhoneNumber',
                                                    defaultMessage:
                                                        'Phone Number'
                                                })}
                                                required={true}
                                            >
                                                <TextInput
                                                    field="telephone"
                                                    autoComplete="family-name"
                                                    validate={isRequired}
                                                    validateOnBlur
                                                />
                                            </Field>
                                        </div>
                                        <div className={classes.street_add}>
                                            <Field
                                                label={formatMessage({
                                                    id:
                                                        'newAddress.StreetAddress',
                                                    defaultMessage:
                                                        'Street Address'
                                                })}
                                                required={true}
                                            >
                                                <TextInput
                                                    field="street[0]"
                                                    autoComplete="family-name"
                                                    validate={isRequired}
                                                    validateOnBlur
                                                />
                                                <TextInput
                                                    field="street[1]"
                                                    autoComplete="family-name"
                                                    validateOnBlur
                                                />
                                            </Field>
                                        </div>
                                        <div className={classes.field_wrapper}>
                                            <Field
                                                label={formatMessage({
                                                    id: 'newAddress.city',
                                                    defaultMessage: 'City'
                                                })}
                                                required={true}
                                            >
                                                <TextInput
                                                    field="city"
                                                    autoComplete="family-name"
                                                    validate={isRequired}
                                                    validateOnBlur
                                                />
                                            </Field>
                                        </div>
                                        <div className={classes.field_wrapper}>
                                            {selectableState.length != 0 && (
                                                <Field
                                                    label={formatMessage({
                                                        id:
                                                            'newAddress.State/Province',
                                                        defaultMessage:
                                                            'State/Province'
                                                    })}
                                                    required={true}
                                                >
                                                    <Select
                                                        id={'region_id'}
                                                        field="region_id"
                                                        items={selectableState}
                                                    />
                                                </Field>
                                            )}
                                            {!selectableState.length && (
                                                <Field
                                                    label={formatMessage({
                                                        id:
                                                            'newAddress.State/Province',
                                                        defaultMessage:
                                                            'State/Province'
                                                    })}
                                                    required={true}
                                                >
                                                    <TextInput
                                                        id={'region'}
                                                        field="region"
                                                        validate={isRequired}
                                                    />
                                                </Field>
                                            )}
                                        </div>

                                        <div className={classes.field_wrapper}>
                                            <Field
                                                label={formatMessage({
                                                    id:
                                                        'newAddress.State/Zip/PostalCode',
                                                    defaultMessage:
                                                        'Zip/Postal Code'
                                                })}
                                                required={true}
                                            >
                                                <TextInput
                                                    field="postcode"
                                                    autoComplete="family-name"
                                                    validate={isRequired}
                                                    validateOnBlur
                                                />
                                            </Field>
                                        </div>
                                        <div className={classes.field_wrapper}>
                                            <Field
                                                label={formatMessage({
                                                    id: 'newAddress.Country',
                                                    defaultMessage: 'Country'
                                                })}
                                                required={true}
                                            >
                                                <Select
                                                    id={'country_id'}
                                                    field="country_id"
                                                    initialValue="US"
                                                    items={
                                                        countries &&
                                                        selectableCountries
                                                            ? selectableCountries
                                                            : []
                                                    }
                                                    onChange={showRegion}
                                                />
                                            </Field>
                                        </div>
                                        <div className={classes.error}>
                                            {errorMessage}
                                        </div>
                                        <div
                                            className={
                                                classes.field_wrapper +
                                                ' ' +
                                                classes.checkbox_wrap
                                            }
                                        >
                                            <Field id="billing_address">
                                                <Checkbox
                                                    field="default_billing"
                                                    label={formatMessage({
                                                        id:
                                                            'newAddress.default_billing',
                                                        defaultMessage:
                                                            'Use as my default billing address'
                                                    })}
                                                    onClick={() =>
                                                        setBillingAddressCheck(
                                                            !billingAddressCheck
                                                        )
                                                    }
                                                    value={billingAddressCheck}
                                                />
                                            </Field>
                                        </div>
                                        <div
                                            className={
                                                classes.field_wrapper +
                                                ' ' +
                                                classes.checkbox_wrap
                                            }
                                        >
                                            <Field id="shipping_address">
                                                <Checkbox
                                                    field="default_shipping"
                                                    label={formatMessage({
                                                        id:
                                                            'newAddress.default_shipping',
                                                        defaultMessage:
                                                            'Use as my default shipping address'
                                                    })}
                                                    onClick={() =>
                                                        setShippingAddressCheck(
                                                            !shippingAddressCheck
                                                        )
                                                    }
                                                    value={shippingAddressCheck}
                                                />
                                            </Field>
                                        </div>
                                        <div className={'mt-3'}>
                                            <Button
                                                type="submit"
                                                priority="high"
                                            >
                                                <FormattedMessage
                                                    id={'newAddress.submit'}
                                                    defaultMessage={
                                                        'Save Address'
                                                    }
                                                />
                                            </Button>
                                        </div>
                                    </Form>
                                </div>
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
