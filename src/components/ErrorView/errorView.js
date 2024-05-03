import React from 'react';
import defaultClasses from './error.css';
import PropTypes, { shape, string } from 'prop-types';
import { Title } from '../Head';
import { Link } from 'src/drivers';
import { FormattedMessage } from 'react-intl';
const ErrorView = () => {

    /* Handle 404 errors */

    const currentUrl = window.location.href;
    let newurl = '';
    let newurlAruba = '';

    if (window.location.href.indexOf("/brands/") != -1) {
        newurl = currentUrl.replace('/brands','');
        window.location.href = newurl;
    }

    if (window.location.href.indexOf("/brands-sherpa/brands-sherpa") != -1) {
        newurlAruba = currentUrl.replace('/brands-sherpa','');
        window.location.assign(newurlAruba);
        console.log(newurlAruba);
    }

    /*if (window.location.href.indexOf("/aruba-instant-on") != -1) {
        newurlAruba = currentUrl.replace('/hewlett-packard-enterprise','');
        window.location.href = newurlAruba;
    }*/

    return (
        <div className={defaultClasses.page_not_find}>
            <Title>{'404 not found'}</Title>
            <div className={'container' + ' ' + defaultClasses.container}>
                <div className={'row'}>
                    {/* <div className={'col-12 col-lg-3 col-md-6 col-sm-6'}>
                        <div className={defaultClasses.not_found_left}>
                            <img
                                src="/SherpaTech-Horz-644x_web-ed6.png"
                                className={'img-fluid'}
                                alt="noProductsFound"
                            />
                        </div>
                    </div> */}

                    <div className={'col-12 col-lg-12 col-md-6 col-sm-6'}>
                        <div className={defaultClasses.not_found_text}>
                            <div className={defaultClasses.not_found_left}>
                                {/*<p><img
                                    src="/SherpaTech-Horz-644x_web-ed6.png"
                                    alt="noProductsFound"
                                /></p> */}
                                <p>
                                    <img src="https://data.sherpagroupav.com/pub/media/pwa-theme/404-ScottRun-1loop.gif" />
                                </p>
                                <h3>
                                    <FormattedMessage
                                        id={'404.title'}
                                        defaultMessage={
                                            "Well, that doesn't look right, does it?"
                                        }
                                    />
                                </h3>
                                <Link to="/">
                                    <FormattedMessage
                                        id={'404.link'}
                                        defaultMessage={'Back to HomePage'}
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

ErrorView.propTypes = {
    children: PropTypes.node.isRequired,
    classes: shape({
        root: string
    })
};

export default ErrorView;
