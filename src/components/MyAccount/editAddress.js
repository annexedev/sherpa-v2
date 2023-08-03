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
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { FormattedMessage } from 'react-intl';
import updateAddressQuery from '../../queries/updateAddress.graphql';
import getAddressData from '../../queries/getAddressData.graphql';
import getCountriesQuery from '../../queries/getCountries.graphql';
import AddressSkeleton from './editAddressSkeleton.js';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import {
    useUpdateAddress,
    useAddressData
} from '../../peregrine/lib/talons/MyAccount/useDashboard';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useToasts } from '@magento/peregrine';
import { useHistory, useParams } from 'react-router-dom';

const AccountInformation = props => {
    const history = useHistory();
    const { who } = useParams();
    const [, { addToast }] = useToasts();
    const classes = mergeClasses(defaultClasses, props.classes, accountClasses);
    const { handleSubmit, isBusy, responseData } = useUpdateAddress({
        query: updateAddressQuery
    });
    const addressId = who;
    const { address, countries } = useAddressData({
        query: getAddressData,
        id: addressId,
        addressQuery: getCountriesQuery
    });
    var errorMessage = '';

    const [country, setCountry] = useState('US');
    const [initialcountry, setInitialcountry] = useState(false);

    if (address && country != address.country_id && !initialcountry) {
        setCountry(address.country_id);
        setInitialcountry(true);
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
        handleSubmit(addressId, fields);
    };

    let selectableCountries = [];
    let selectableState = [];

    if (
        countries &&
        typeof countries != 'undefined' &&
        countries.length &&
        address
    ) {
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

    useEffect(() => {
        if (
            responseData &&
            responseData.updateCustomerAddress &&
            responseData.updateCustomerAddress.id
        ) {
            addToast({
                type: 'info',
                message: 'You saved the address.',
                dismissable: true,
                timeout: 1000
            });
            history.push('/addresses');
        }
    }, [addToast, history, responseData]);

    if (addressId && address) {
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
                                    <Sidebar
                                        history={props.history}
                                        activePath={'/addresses'}
                                    />
                                </div>
                                <div
                                    className={
                                        defaultClasses.account_contentBar
                                    }
                                >
                                    <div
                                        className={
                                            defaultClasses.page_title_wrapper
                                        }
                                    >
                                        <h1
                                            className={
                                                defaultClasses.page_title
                                            }
                                        >
                                            <span
                                                className={defaultClasses.base}
                                            >
                                                <FormattedMessage
                                                    id={'editAddress.title'}
                                                    defaultMessage={
                                                        'Edit Account Information'
                                                    }
                                                />
                                            </span>
                                        </h1>
                                    </div>
                                    <div
                                        className={
                                            classes.new_form_wrap +
                                            ' ' +
                                            accountClasses.account_form
                                        }
                                    >
                                        <Form
                                            className={
                                                accountClasses.account_form_inner
                                            }
                                            onSubmit={handleSubmitForm}
                                        >
                                            <Field
                                                label="First Name"
                                                required={true}
                                            >
                                                <TextInput
                                                    field="firstname"
                                                    autoComplete="given-name"
                                                    validate={isRequired}
                                                    validateOnBlur
                                                    initialValue={
                                                        address.firstname
                                                    }
                                                />
                                            </Field>
                                            <Field
                                                label="Last Name"
                                                required={true}
                                            >
                                                <TextInput
                                                    field="lastname"
                                                    autoComplete="family-name"
                                                    validate={isRequired}
                                                    validateOnBlur
                                                    initialValue={
                                                        address.lastname
                                                    }
                                                />
                                            </Field>
                                            <Field label="Company">
                                                <TextInput
                                                    field="company"
                                                    autoComplete="family-name"
                                                    validateOnBlur
                                                    initialValue={
                                                        address.company
                                                    }
                                                />
                                            </Field>
                                            <Field
                                                label="Phone Number"
                                                required={true}
                                            >
                                                <TextInput
                                                    field="telephone"
                                                    autoComplete="family-name"
                                                    validate={isRequired}
                                                    validateOnBlur
                                                    initialValue={
                                                        address.telephone
                                                    }
                                                />
                                            </Field>
                                            <Field
                                                label="Street Address"
                                                required={true}
                                            >
                                                <TextInput
                                                    field="street[0]"
                                                    autoComplete="family-name"
                                                    validate={isRequired}
                                                    validateOnBlur
                                                    initialValue={
                                                        address.street
                                                    }
                                                />
                                                <TextInput
                                                    field="street[1]"
                                                    autoComplete="family-name"
                                                    validateOnBlur
                                                />
                                                <TextInput
                                                    field="street[2]"
                                                    autoComplete="family-name"
                                                    validateOnBlur
                                                />
                                            </Field>
                                            <Field label="City" required={true}>
                                                <TextInput
                                                    field="city"
                                                    autoComplete="family-name"
                                                    validate={isRequired}
                                                    validateOnBlur
                                                    initialValue={address.city}
                                                />
                                            </Field>
                                            {selectableState.length != 0 && (
                                                <Field
                                                    label="State/Province"
                                                    required={true}
                                                >
                                                    <Select
                                                        id={'region_id'}
                                                        field="region_id"
                                                        initialValue={
                                                            address.region_id
                                                        }
                                                        items={selectableState}
                                                    />
                                                </Field>
                                            )}
                                            {!selectableState.length && (
                                                <Field
                                                    label="State/Province"
                                                    required={true}
                                                >
                                                    <TextInput
                                                        id={'region'}
                                                        field="region"
                                                        initialValue={
                                                            address.region
                                                        }
                                                    />
                                                </Field>
                                            )}
                                            <Field
                                                label="Zip/Postal Code"
                                                required={true}
                                            >
                                                <TextInput
                                                    field="postcode"
                                                    autoComplete="family-name"
                                                    validate={isRequired}
                                                    validateOnBlur
                                                    initialValue={
                                                        address.postcode
                                                    }
                                                />
                                            </Field>
                                            <Field
                                                label="Country"
                                                required={true}
                                            >
                                                {countries && (
                                                    <Select
                                                        id={'country_id'}
                                                        field="country_id"
                                                        initialValue={country}
                                                        items={
                                                            selectableCountries
                                                        }
                                                        onChange={showRegion}
                                                    />
                                                )}
                                            </Field>
                                            <div className={classes.error}>
                                                {errorMessage}
                                            </div>
                                            <div className={'mt-3'}>
                                                <Button
                                                    type="submit"
                                                    priority="high"
                                                >
                                                    <FormattedMessage
                                                        id={
                                                            'editAddress.submitButton'
                                                        }
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
    } else {
        return (
            <div>
                <AddressSkeleton />
            </div>
        );
    }
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
