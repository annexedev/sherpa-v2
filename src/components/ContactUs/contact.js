import React, { useEffect, useState, Suspense, Component } from 'react';
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
import JotformEmbed from 'react-jotform-embed';
const Banner = React.lazy(() => import('/src/components/CedHome/banner'));
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
    let contactid = 'contactus_newsite' + activeLng;
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
                        id={'contact.content_page_heading_contact'}
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
                        {activeLng == '-fr' ? (
                            <JotformEmbed src="https://form.jotform.com/232284757056260" />
                        ) : (
                            <JotformEmbed src="https://form.jotform.com/232284967022256" />
                        )}
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
                                <Suspense fallback={''}>
                                    <Banner
                                        identifier={contactid}
                                        showBanner={true}
                                    />
                                </Suspense>
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
                                        defaultMessage={
                                            ' T: 1-866-767-6584 / F: 514-366-4265'
                                        }
                                    />
                                </span>
                            </p>
                            <a href="mailto:info@sherpagroupav.com">
                                <span className={classes.icons}>
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </span>
                                <span className={classes.email}>
                                    <FormattedMessage
                                        id={'contact.email'}
                                        defaultMessage={
                                            'info@sherpagroupav.com'
                                        }
                                    />
                                </span>
                            </a>
                        </div>
                    </div>
                    {activeLng == '-fr' ? (
                        <>
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
                                <h3 className={classes.content_page_heading}>
                                    <br />
                                    <br />
                                    <FormattedMessage
                                        id={'contact.content_page_heading'}
                                        defaultMessage={'BUREAU RÉGIONAL QC'}
                                    />
                                </h3>
                                <p className={classes.heading_content}>
                                    80 Avenue Lindsay,
                                    <br />
                                    Dorval, QC H9P 2T8
                                    <br />
                                    T: 514-366-9822 / 1-866-767-6584
                                    <br />
                                    F: 514-366-4265
                                </p>
                                <p className={classes.heading_content}>
                                    De 8 h à 16 h 30 du lundi au vendredi.
                                </p>
                                <iframe
                                    width="100%"
                                    height="450"
                                    src="https://www.openstreetmap.org/export/embed.html?bbox=-74.18106079101564%2C45.25072145953108%2C-73.26919555664064%2C45.659167483312785&amp;layer=mapnik&amp;marker=45.4553258%2C-73.7250693"
                                />
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
                                <h3 className={classes.content_page_heading}>
                                    <br />
                                    <br />
                                    <FormattedMessage
                                        id={'contact.content_page_heading'}
                                        defaultMessage={'BUREAU RÉGIONAL ON'}
                                    />
                                </h3>
                                <p className={classes.heading_content}>
                                    335 Admiral Blvd, #13
                                    <br />
                                    Mississauga, ON L5T 2N2
                                    <br />
                                    T: 905-565-9028 / 1-866-767-6584
                                    <br />
                                    F: 866-670-5052
                                </p>
                                <p className={classes.heading_content}>
                                    De 8 h à 16 h 30 du lundi au vendredi.
                                </p>
                                <iframe
                                    width="100%"
                                    height="450"
                                    src="https://www.openstreetmap.org/export/embed.html?bbox=-80.60531616210938%2C43.22819449883485%2C-78.78158569335938%2C44.07081379264681&amp;layer=mapnik&amp;marker=43.650981839898684%2C-79.69413757324219"
                                />
                            </div>
                        </>
                    ) : (
                        <>
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
                                <h3 className={classes.content_page_heading}>
                                    <br />
                                    <br />
                                    <FormattedMessage
                                        id={'contact.content_page_heading'}
                                        defaultMessage={'Montreal Head Office'}
                                    />
                                </h3>
                                <p className={classes.heading_content}>
                                    80 Avenue Lindsay,
                                    <br />
                                    Dorval, QC H9P 2T8
                                    <br />
                                    T: 514-366-9822 / 1-866-767-6584
                                    <br />
                                    F: 514-366-4265
                                </p>
                                <p className={classes.heading_content}>
                                    8:00am - 4:30pm M-F
                                </p>
                                <iframe
                                    width="100%"
                                    height="450"
                                    src="https://www.openstreetmap.org/export/embed.html?bbox=-74.18106079101564%2C45.25072145953108%2C-73.26919555664064%2C45.659167483312785&amp;layer=mapnik&amp;marker=45.4553258%2C-73.7250693"
                                />
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
                                <h3 className={classes.content_page_heading}>
                                    <br />
                                    <br />
                                    <FormattedMessage
                                        id={'contact.content_page_heading'}
                                        defaultMessage={'Mississauga Office'}
                                    />
                                </h3>
                                <p className={classes.heading_content}>
                                    335 Admiral Blvd, #13
                                    <br />
                                    Mississauga, ON L5T 2N2
                                    <br />
                                    T: 905-565-9028 / 1-866-767-6584
                                    <br />
                                    F: 866-670-5052
                                </p>
                                <p className={classes.heading_content}>
                                    8:00am - 4:30pm M-F
                                </p>
                                <iframe
                                    width="100%"
                                    height="450"
                                    src="https://www.openstreetmap.org/export/embed.html?bbox=-80.60531616210938%2C43.22819449883485%2C-78.78158569335938%2C44.07081379264681&amp;layer=mapnik&amp;marker=43.650981839898684%2C-79.69413757324219"
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Contact;
