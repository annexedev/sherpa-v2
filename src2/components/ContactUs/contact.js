import React from 'react';
import { mergeClasses } from '../../classify';
import { useContactUs } from '../../../src/peregrine/lib/talons/Home/useHome';
import contactClasses from './contact.css';
import { Form } from 'informed';
import Button from '../Button';
import Field from '../Field';
import TextInput from '../TextInput';
import TextArea from '../TextArea';
import { FormattedMessage } from 'react-intl';
import { isRequired, validateEmail } from '../../util/formValidators';
import combine from '../../util/combineValidators';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { Link, Meta, Title } from '../../components/Head';

const Contact = props => {
    const classes = mergeClasses(contactClasses, props.classes);
    const talonProps = useContactUs();

    const meta_description = META_DESCRIPTION;
    const c_url = window.location.href;
    const siteName = window.location.hostname;
    const title = `${'Contact Us'} - ${STORE_NAME}`;
    const { formRef, handleSubmit, responseData } = talonProps;
    let errorMessage = '';
    let successMessage = '';
    if (typeof responseData != 'undefined') {
        if (!responseData.status) {
            errorMessage = responseData.message;
        }
        successMessage = responseData.message;
    }
    return (
        <div className={classes.contact_page_wrapper}>
            <Title>{title}</Title>
            <Meta name="robots" content={'INDEX,FOLLOW'} />
            <Meta name="description" content={meta_description} />
            <Link rel="canonical" href={c_url} />
            <Meta name="og:type" content={'Website'} />
            <Meta
                property="og:image"
                content="/cenia-static/icons/cenia_square_512.png"
            />
            <Meta name="og:title" content={'Contact Us'} />
            <Meta name="og:description" content={meta_description} />
            <Meta name="og:url" content={c_url} />
            <Meta name="og:site_name" content={siteName} />
            <Meta name="twitter:card" content={'summary_large_image'} />
            <Meta name="twitter:description" content={meta_description} />
            <Meta name="twitter:title" content={title} />
            <Meta
                name="twitter:image"
                content={'/cenia-static/icons/cenia_square_512.png'}
            />
            <Meta name="twitter:site" content={siteName} />
            <Meta name="twitter:url" content={c_url} />
            <div
                className={
                    'container' + ' ' + classes.contact_page_wrapper_inner
                }
            >
                <h3 className={classes.content_page_heading}>
                    <FormattedMessage
                        id={'contact.content_page_heading'}
                        defaultMessage={'Contact Us'}
                    />
                </h3>
                <div className={'row'}>
                    <div
                        className={
                            'col-lg-6' +
                            ' ' +
                            'col-md-6' +
                            ' ' +
                            'col-sm-6' +
                            ' ' +
                            'col-xs-12'
                        }
                    >
                        <Form
                            ref={formRef}
                            id="contact-form"
                            className={
                                classes.root + ' ' + classes.contact_form
                            }
                            onSubmit={handleSubmit}
                        >
                            <div className={classes.input_field}>
                                <Field label="Full Name" required={true}>
                                    <TextInput
                                        field="name"
                                        autoComplete="given-name"
                                        validate={isRequired}
                                        validateOnBlur
                                    />
                                </Field>
                            </div>
                            <div className={classes.input_field}>
                                <Field label="Email" required={true}>
                                    <TextInput
                                        field="email"
                                        autoComplete="email"
                                        validate={combine([
                                            isRequired,
                                            validateEmail
                                        ])}
                                        validateOnBlur
                                    />
                                </Field>
                            </div>
                            <div className={classes.input_field}>
                                <Field label="Phone Number">
                                    <TextInput field="telephone" />
                                </Field>
                            </div>
                            <div className={classes.input_field}>
                                <Field
                                    label="What’s on your mind?"
                                    required={true}
                                >
                                    <TextArea
                                        field="comment"
                                        validate={isRequired}
                                        validateOnBlur
                                    />
                                </Field>
                            </div>
                            <div className={classes.error}>{errorMessage}</div>
                            <div className={classes.success}>
                                {successMessage}
                            </div>
                            <div className={classes.actions}>
                                <Button type="submit" priority="high">
                                    <FormattedMessage
                                        id={'contact.submit'}
                                        defaultMessage={'Submit'}
                                    />
                                </Button>
                            </div>
                        </Form>
                    </div>
                    <div
                        className={
                            'col-lg-6' +
                            ' ' +
                            'col-md-6' +
                            ' ' +
                            'col-sm-6' +
                            ' ' +
                            'col-xs-12'
                        }
                    >
                        <div className={classes.conatct_page}>
                            <p className={classes.heading_content}>
                                Lorem ipsum dolor sit amet, consectetuer
                                adipiscing elit. Aenean commodo ligula eget
                                dolor. Aenean massa. Cum sociis natoque
                                penatibus et magnis dis parturient montes,
                                nascetur ridiculus mus. Donec quam felis,
                                ultricies nec, pellentesque eu, pretium quis,
                                sem. Nulla consequat massa quis enim.
                            </p>
                        </div>
                        <div className={classes.phone_mail_wrapp}>
                            <p className={'mb-0'}>
                                <span className={classes.icons}>
                                    <FontAwesomeIcon icon={faPhoneAlt} />
                                </span>
                                <span className={classes.phone_number}>
                                    <FormattedMessage
                                        id={'contact.phone_number'}
                                        defaultMessage={' +1(888)478-5268'}
                                    />
                                </span>
                            </p>
                            <a href="/">
                                <span className={classes.icons}>
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </span>
                                <span className={classes.email}>
                                    <FormattedMessage
                                        id={'contact.email'}
                                        defaultMessage={
                                            ' support@cedcommerce.com'
                                        }
                                    />
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
