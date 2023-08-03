import React, { Suspense } from 'react';
import { Route } from 'src/drivers';
import { shape, string } from 'prop-types';
import { useFooter } from '../../peregrine/lib/talons/Footer/useFooter';
import { mergeClasses } from '../../classify';
import defaultClasses from './footer.css';
import { DEFAULT_LINKS } from './sampleData';
import GET_STORE_CONFIG_DATA from '../../queries/getStoreConfigData.graphql';
import NewsLetter from '../NewsLetter';

import {
    useFooterData,
    useHome
} from '../../peregrine/lib/talons/Home/useHome';
import RichContent from '../../components/RichContent';
import GET_CMSBLOCK_QUERY from '../../queries/getCmsBlocks.graphql';
import GET_HOMEPAGECONFIG_DATA from '../../queries/getHomeConfig.graphql';

const Cookie = React.lazy(() => import('./cookie'));
import { useLocation } from 'react-router-dom';

const Footer = props => {
    const { pathname } = useLocation();
    const classes = mergeClasses(defaultClasses, props.classes);
    const talonProps = useFooter({
        query: GET_STORE_CONFIG_DATA
    });

    const { copyrightText, cookieRestriction, cookieLifetime } = talonProps;
    const homepageData = useHome({
        query: GET_HOMEPAGECONFIG_DATA
    });

    const { HomeConfigData } = homepageData;
    let footerIdentifier = 'ced-pwa-footer-x';
    if (typeof HomeConfigData != 'undefined') {
        for (var i = 0; i < HomeConfigData.length; i++) {
            if (HomeConfigData[i]['name'] == 'ced_pwa_footer')
                footerIdentifier = HomeConfigData[i]['value'];
        }
    }

    const footerDatas = useFooterData({
        footerQuery: GET_CMSBLOCK_QUERY,
        footerIdentifiers: footerIdentifier
    });
    const { footerData } = footerDatas;

    const cookie =
        cookieRestriction == 1 ? (
            <Suspense fallback={''}>
                <Route>
                    <Cookie lifeTime={cookieLifetime} />
                </Route>
            </Suspense>
        ) : null;

    if (pathname.includes('printorder')) {
        return (
            <footer className={classes.root}>
                <div className={classes.bottom_footer}>
                    <div className={'container'}>
                        <div className={'row'}>
                            <div className={'col-12'}>
                                <p className={classes.copyright}>
                                Copyright © {new Date().getFullYear()} SherpaGroup. All rights reserved.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }


    return (
        <footer className={classes.root}>
            <NewsLetter />
            <RichContent html={footerData} />
            <div className={classes.bottom_footer}>
                <div className={'container'}>
                    <div className={'row'}>
                        <div className={'col-12'}>
                            <p className={classes.copyright}>Copyright © {new Date().getFullYear()} SherpaGroup. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </div>
            {cookie}
            <script src="//code.tidio.co/lkmxnhgge8hf2csbej2fog3du6bcwvdq.js"></script>
        </footer>
    );
};

export default Footer;

Footer.defaultProps = {
    links: DEFAULT_LINKS
};

Footer.propTypes = {
    classes: shape({
        root: string
    })
};
