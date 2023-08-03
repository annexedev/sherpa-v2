import React, { useEffect, useState } from 'react';
import { bool, shape, string } from 'prop-types';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Header from '../Header';
import defaultClasses from './main.css';

const MobileLinks = React.lazy(() => import('./mobileLinks'));
const Footer = React.lazy(() => import('../Footer'));
const PushNotification = React.lazy(() => import('./pushNotification'));

const Main = props => {
    const [scrollFlag, setScrollFlag] = useState(false);

    const handleClick = () => {
        if (!scrollFlag) setScrollFlag(true);
    };

    useEffect(() => {
        document.addEventListener('scroll', handleClick);
        return () => {
            document.removeEventListener('scroll', handleClick);
        };
    });
    const { children, isMasked, mobileView } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClass = isMasked ? classes.root_masked : classes.root;
    const pageClass = isMasked ? classes.page_masked : classes.page;
    const token = localStorage.getItem('notification-token');
    return (
        <main className={rootClass}>
            <Header />
            <div className={pageClass}>
                {children}
                {/* bottom_toolbar */}
                {mobileView && (
                    <React.Suspense fallback={null}>
                        <MobileLinks />
                    </React.Suspense>
                )}
            </div>
            {scrollFlag && (
                <React.Suspense fallback={null}>
                    <Footer />
                </React.Suspense>
            )}
            {!token && scrollFlag && (
                <React.Suspense fallback={null}>
                    <PushNotification />
                </React.Suspense>
            )}
        </main>
    );
};

export default Main;

Main.propTypes = {
    classes: shape({
        page: string,
        page_masked: string,
        root: string,
        root_masked: string
    }),
    isMasked: bool
};
