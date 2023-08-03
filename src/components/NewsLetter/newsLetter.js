import React, { useState, useEffect } from 'react';
import { shape, string } from 'prop-types';
import { Form } from 'informed';
import Button from '../Button';
import Field from '../Field';
import TextInput from '../TextInput';
import { FormattedMessage, useIntl } from 'react-intl';
import { validateEmail } from '../../util/formValidators';
import { mergeClasses } from '../../classify';
import defaultClasses from '../Footer/footer.css';
import { useNewsLetter } from '../../peregrine/lib/talons/NewsLetter/useNewsLetter';
import NEWSLETTER_MUTATION from '../../queries/subscribeNewsLetter.graphql';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useToasts } from '@magento/peregrine';

const NewsLetter = props => {
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();

    const [successMsg, setSuccessMsg] = useState(true);
    const [errorMsg, setErrorMsg] = useState(true);
    const classes = mergeClasses(defaultClasses, props.classes);
    const talonProps = useNewsLetter({
        query: NEWSLETTER_MUTATION
    });

    const { handleSubmit, responseData } = talonProps;

    const submitForm = async v => {
        await handleSubmit(v);
        setSuccessMsg(true);
        setErrorMsg(true);
    };

    useEffect(() => {
        if (responseData && responseData.success == 'true' && successMsg) {
            addToast({
                type: 'info',
                message: responseData.message,
                dismissable: true,
                timeout: 10000
            });
            setSuccessMsg(false);
        }

        if (responseData && responseData.success == 'false' && errorMsg) {
            addToast({
                type: 'info',
                message: responseData.message,
                dismissable: true,
                timeout: 10000
            });
            setErrorMsg(false);
        }
    }, [
        addToast,
        responseData,
        setErrorMsg,
        errorMsg,
        successMsg,
        setSuccessMsg
    ]);

    return (
        <div className={classes.newsletter_Wrap}>
            <div className={'container'}>
                <div className={'row'}>
                    <div className={'col-lg-6 col-md-6 col-12'}>
                        <div className={classes.newsletter_content}>
                            <p className={classes.newsletter_content_head}>
                                <img className={classes.newsletter_img} src="https://sherpagroupav.com/media/wysiwyg/Guide_to_the_Exceptional-w-logo-wht.png"/><br/>
                                <FormattedMessage
                                    id="newsLetter.newsletter_content_head"
                                    defaultMessage=" "
                                />
                                {/*<br />
                                <FormattedMessage
                                    id="newsLetter.newsletter_content_head2"
                                    defaultMessage="15% off on your first order."
                                /> */}
                            </p>
                            {/*<p className={classes.newsletter_content_text}>
                                <FormattedMessage
                                    id="newsLetter.newsletter_content_text"
                                    defaultMessage="Lorem Ipsum is simply dummy text of the printing."
                                />
                            </p>*/}
                        </div>
                    </div>
                    <div className={'col-lg-6 col-md-6 col-12'}>
                        <div className={classes.newsletter_form}>
                            <Form onSubmit={submitForm}>
                                <div className={classes.newsletter_Wrap_inner}>
                                    <p className={classes.newsletter_content_head}>
                                        <a className={classes.newsletter_social} href="https://www.linkedin.com/company/sherpatechgroup/" target="_blank" rel="noopener">
                                            <img src="https://sherpagroupav.com/media/wysiwyg/LinkedIn_Icon-50px.png" />
                                        </a>
                                        <a className={classes.newsletter_social} href="https://www.facebook.com/SherpaTechGroup" target="_blank" rel="noopener">
                                            <img src="https://sherpagroupav.com/media/wysiwyg/Facebook_icon-50px.png" />
                                        </a>
                                        <a className={classes.newsletter_social} href="https://www.instagram.com/sherpatechgroup/" target="_blank" rel="noopener">
                                            <img src="https://sherpagroupav.com/media/wysiwyg/instagram-logo_50px.png" />
                                        </a>
                                        <br/>
                                        <FormattedMessage
                                            id="newsLetter.newsletter_content_head"
                                            defaultMessage="Stay Connected"
                                        />
                                       
                                    </p>
                                    
                                    {/*}
                                    <div className={classes.newsletter_input}>
                                        <Field
                                            label="Email"
                                            id={'newsletter-email'}
                                        >
                                            <TextInput
                                                id={'newsletter-email'}
                                                autoComplete="email"
                                                field="email_id"
                                                validate={validateEmail}
                                                placeholder={formatMessage({
                                                    id:
                                                        'newsletter.placeholder',
                                                    defaultMessage:
                                                        'Enter your email'
                                                })}
                                            />
                                        </Field>
                                    </div>
                                    <div className={classes.newsletter_btn}>
                                        <Button
                                            className={
                                                classes.newsletter_btn_inner
                                            }
                                            type="submit"
                                            aria-label="Submit"
                                        >
                                            <span
                                                className="newsletter action"
                                                aria-hidden="true"
                                            >
                                                <FormattedMessage
                                                    id="newsLetter.submit"
                                                    defaultMessage="Submit"
                                                />
                                            </span>
                                            <FontAwesomeIcon
                                                icon={faArrowRight}
                                            />
                                        </Button>
                                    </div> */}
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

NewsLetter.propTypes = {
    classes: shape({
        copyright: string,
        root: string,
        tile: string,
        tileBody: string,
        tileTitle: string,
        signInButton: string
    })
};

export default NewsLetter;
