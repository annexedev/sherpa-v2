import React from 'react';
import CookieConsent from 'react-cookie-consent';
import { Link } from 'react-router-dom';
import defaultClasses from './footer.css';

const Cookie = props => {
    const { lifeTime } = props;

    return (
        <CookieConsent
            buttonText="Allow Cookies"
            cookieName="user_allowed_save_cookie"
            expires={parseInt(lifeTime)}
            style={{ background: '#000000' }}
            buttonStyle={{ color: '#ffffff', fontSize: '13px' }}
        >
            <div className={defaultClasses.cookie_msg_tetxt}>
                <strong>We use cookies</strong>
                <p className={'mb-0'}>
                    {' '}
                    <span>
                        To comply with the new e-Privacy directive, we need to
                        ask for your consent to set the cookies.
                    </span>
                    <Link to="/privacy-policy-cookie-restriction-mode">
                        {' '}
                        Learn more
                    </Link>
                    .
                </p>
            </div>
        </CookieConsent>
    );
};

export default Cookie;
