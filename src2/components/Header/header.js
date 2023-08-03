import React, { Fragment, Suspense } from 'react';
import { shape, string } from 'prop-types';
import Logo from '../Logo';
import { Link, resourceUrl, Route } from 'src/drivers';
import { FormattedMessage } from 'react-intl';
import AccountTrigger from './accountTrigger';
import NavTrigger from './navTrigger';
import SearchTrigger from './searchTrigger';
import { useHeader } from 'src/peregrine/lib/talons/Header/useHeader';

import { mergeClasses } from '../../classify';
import defaultClasses from './header.css';

import SCOPE_CONFIG_DATA from '../../queries/getScopeConfigData.graphql';
import { useScopeData } from '../../peregrine/lib/talons/Home/useHome';
import { Util } from '@magento/peregrine';
import { useUserContext } from '@magento/peregrine/lib/context/user';

import { useSlider } from '../../peregrine/lib/talons/Slider/useSlider';
import GET_SLIDER_DATA from '../../queries/getSliderDetails.graphql';
import { useMobile } from '../../peregrine/lib/talons/Mobile/useMobile';

import { Heart as HeartIcon } from 'react-feather';
import Icon from '@magento/venia-ui/lib/components/Icon';

const heartIcon = <Icon src={HeartIcon} size={18} />;
const SearchBar = React.lazy(() => import('../SearchBar'));
const MegaMenu = React.lazy(() => import('../MegaMenu'));
const CompareLink = React.lazy(() => import('../Compare/compareLink'));
const VisitorId = React.lazy(() => import('../RecentProducts/visitorId.js'));
const PushNotification = React.lazy(() => import('./pushNotification.js'));
const CartTrigger = React.lazy(() => import('./cartTrigger'));
const StoreSwitcher = React.lazy(() => import('./storeSwitcher'));
const CurrencySwitcher = React.lazy(() => import('./currencySwitcher'));

const Header = props => {
    const [{ currentUser, isSignedIn }] = useUserContext();

    const wishlistCount =
        currentUser.wishlist && currentUser.wishlist.items_count
            ? currentUser.wishlist.items_count
            : 0;
    const scopeConfigData = useScopeData({
        query: SCOPE_CONFIG_DATA
    });

    const sliderData = useSlider({
        query: GET_SLIDER_DATA
    });

    const { mobileView } = useMobile();
    const { scopeData } = scopeConfigData;
    const { BrowserPersistence } = Util;
    const storage = new BrowserPersistence();

    if (scopeData && scopeData.rtl == '1') {
        document.body.classList.add('rtl_view');
    }

    storage.setItem('slider_data', sliderData);

    if (!storage.getItem('scope_data') && scopeData) {
        storage.setItem('scope_data', scopeData);
    }
    const { handleSearchTriggerClick, searchOpen } = useHeader();

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClass = searchOpen ? classes.open : classes.closed;
    const searchBarFallback = (
        <div className={classes.searchFallback}>
            <div className={classes.input}>
                <div className={classes.loader} />
            </div>
        </div>
    );
    const searchBar = searchOpen ? (
        <Suspense fallback={searchBarFallback}>
            <Route>
                <SearchBar
                    isOpen={searchOpen}
                    handleSearchTriggerClick={handleSearchTriggerClick}
                />
            </Route>
        </Suspense>
    ) : null;

    const handleWishlistTrigger = () => {
        document.getElementById('user_account').click();
    };

    return (
        <Fragment>
            <header className={rootClass}>
                <div className={classes.top_header_wrap}>
                    <div className={'container'}>
                        <div className={classes.switcher_offer_Wrap}>
                            <div className={classes.switchers_wrap}>
                                {!mobileView && (
                                    <Suspense fallback={null}>
                                        <StoreSwitcher />
                                        <CurrencySwitcher />
                                    </Suspense>
                                )}

                                <Suspense fallback={null}>
                                    <PushNotification />
                                    <VisitorId />
                                </Suspense>
                            </div>
                            <p className={classes.offer_message_text}>
                                <FormattedMessage
                                    id={'header.offer_message_text'}
                                    defaultMessage={
                                        ' Limited time only: up to 50% off must-have styles. Shop Women | Shop Men | Shop Aerie'
                                    }
                                />
                            </p>
                        </div>
                    </div>
                </div>
                <div className={classes.middle_header + ' ' + 'container'}>
                    <div className={'row'}>
                        <div
                            className={
                                'col-lg-4 col-md-4 col-sm-3 col-5' +
                                ' ' +
                                classes.logo_wrap
                            }
                        >
                            {mobileView && (
                                <div className={classes.primaryActions}>
                                    <NavTrigger />
                                </div>
                            )}

                            <Link
                                className={classes.logo_wrap}
                                to={resourceUrl('/')}
                            >
                                <span aria-hidden="true">
                                    <FormattedMessage
                                        id={'header.logo'}
                                        defaultMessage={' logo'}
                                    />
                                </span>
                                <Logo classes={{ logo: classes.logo }} />
                            </Link>
                        </div>

                        <div className={'col-lg-8 col-md-8 col-sm-9 col-7'}>
                            <div className={classes.secondaryActions}>
                                <Suspense fallback={null}>
                                    <CompareLink
                                        currentUser={currentUser}
                                        isSignedIn={isSignedIn}
                                    />
                                </Suspense>
                                <span
                                    className={
                                        classes.language_switch_image +
                                        ' ' +
                                        classes.header_Actions_image
                                    }
                                    title="Country switcher"
                                >
                                    <img
                                        src="/cenia-static/images/home.png"
                                        alt="location"
                                        title="location"
                                        width="20"
                                        height="20"
                                    />
                                </span>
                                <span
                                    className={
                                        classes.search_image +
                                        ' ' +
                                        classes.header_Actions_image
                                    }
                                    title="Search"
                                >
                                    <SearchTrigger
                                        active={searchOpen}
                                        onClick={handleSearchTriggerClick}
                                    />
                                </span>
                                <span
                                    className={
                                        classes.user_icon_image +
                                        ' ' +
                                        classes.header_Actions_image
                                    }
                                    title="User"
                                >
                                    <AccountTrigger />
                                </span>
                                {/* <span className={classes.marketplace + " " + classes.header_Actions_image} title="Marketplace">
                  <img src="/cenia-static/images/market (1).png" alt="marketplace" title="marketplace" width="20" height="20" />
                </span> */}
                                {!isSignedIn && (
                                    <button
                                        onClick={handleWishlistTrigger}
                                        className={
                                            classes.wishlist_image +
                                            ' ' +
                                            classes.header_Actions_image
                                        }
                                        title="Wishlist"
                                    >
                                        {heartIcon}
                                        {wishlistCount > 0 && (
                                            <span
                                                className={
                                                    classes.wishlist_counter
                                                }
                                            >
                                                {wishlistCount}
                                            </span>
                                        )}
                                    </button>
                                )}
                                {isSignedIn && (
                                    <Link
                                        className={
                                            classes.wishlist_image +
                                            ' ' +
                                            classes.header_Actions_image
                                        }
                                        to="/wishlist"
                                    >
                                        <span aria-hidden="true">
                                            <FormattedMessage
                                                id={'header.Wishlist'}
                                                defaultMessage={'Wishlist'}
                                            />
                                        </span>
                                        <span
                                            title="Wishlist"
                                            className={
                                                classes.header_icons_span
                                            }
                                        >
                                            {heartIcon}
                                            {wishlistCount > 0 && (
                                                <span
                                                    className={
                                                        classes.wishlist_counter
                                                    }
                                                >
                                                    {wishlistCount}
                                                </span>
                                            )}
                                        </span>
                                    </Link>
                                )}
                                <span
                                    className={
                                        classes.cart_image +
                                        ' ' +
                                        classes.header_Actions_image
                                    }
                                    title="Cart"
                                >
                                    <Suspense fallback={null}>
                                        <CartTrigger />
                                    </Suspense>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* {pageLoadingIndicator}
          <OnlineIndicator hasBeenOffline={hasBeenOffline} isOnline={isOnline} /> */}
                </div>
                {searchBar}
                {!mobileView && (
                    <Suspense fallback={null}>
                        <MegaMenu />
                    </Suspense>
                )}
            </header>
        </Fragment>
    );
};

Header.propTypes = {
    classes: shape({
        closed: string,
        logo: string,
        open: string,
        primaryActions: string,
        secondaryActions: string,
        toolbar: string
    })
};

export default Header;
