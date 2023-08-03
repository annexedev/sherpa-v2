import React, { useEffect, useState } from 'react';
import { useScrollLock, useToasts } from '@magento/peregrine';
import { FormattedMessage } from 'react-intl';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './main.css';
import headerClasses from '../Header/header.css';
import { useNavigationTrigger } from '@magento/peregrine/lib/talons/Header/useNavigationTrigger';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useHistory } from 'react-router-dom';
import {
    Home as HomeIcon,
    MapPin as MapPinIcon,
    User as UserIcon,
    Heart as HeartIcon
} from 'react-feather';
import Icon from '@magento/venia-ui/lib/components/Icon';

const homeIcon = <Icon src={HomeIcon} size={18} />;
const userIcon = <Icon src={UserIcon} size={18} />;
const heartIcon = <Icon src={HeartIcon} size={18} />;
const mappinIcon = <Icon src={MapPinIcon} size={18} />;

const MobileLinks = props => {
    const [activeClass, setActiveClass] = useState('home');
    const [{ currentUser, isSignedIn }] = useUserContext();
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
    const { isMasked } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const [wishlistRender, setWishlistRender] = useState(false);
    const [, { addToast }] = useToasts();
    useEffect(() => {
        if (wishlistRender && !isSignedIn) {
            addToast({
                type: 'info',
                message: 'Please Register or Signin to create your wishlist.',
                dismissable: true,
                timeout: 4000
            });
        }
        setWishlistRender(false);
    }, [addToast, isSignedIn, wishlistRender]);

    const history = useHistory();
    const { handleOpenNavigation } = useNavigationTrigger();

    const wishlistCount =
        currentUser.wishlist && currentUser.wishlist.items_count
            ? currentUser.wishlist.items_count
            : 0;
    useScrollLock(isMasked);

    const handleProfile = () => {
        if (isSignedIn) {
            history.push('/account');
            setActiveClass('profile');
        } else {
            handleOpenNavigation();
        }
    };
    const handleWishlist = () => {
        if (isSignedIn) {
            history.push('/wishlist'), setActiveClass('wishlist');
        } else {
            handleOpenNavigation();
        }
    };
    const handleHome = () => {
        history.push('/');
    };
    return (
        <div className={defaultClasses.bottom_toolbar}>
            <div className={defaultClasses.bottom_tool_inner}>
                <button
                    onClick={() => {
                        handleHome(), setActiveClass('home');
                    }}
                    className={
                        defaultClasses.toolbar_items +
                        ' ' +
                        (activeClass == 'home' ? defaultClasses.active : '')
                    }
                >
                    <span
                        className={
                            defaultClasses.language_switch_image +
                            ' ' +
                            classes.header_Actions_image
                        }
                        title="Home"
                    >
                        {homeIcon}
                    </span>
                    <p className={defaultClasses.images_label}>
                        <FormattedMessage
                            id={'main.Home'}
                            defaultMessage={'Home'}
                        />
                    </p>
                </button>
                <button
                    onClick={handleOpenNavigation}
                    className={defaultClasses.toolbar_items}
                >
                    <span
                        className={
                            defaultClasses.language_switch_image +
                            ' ' +
                            classes.header_Actions_image
                        }
                        title="Country switcher"
                    >
                        {mappinIcon}
                    </span>
                    <p className={defaultClasses.images_label}>
                        <FormattedMessage
                            id={'main.Country'}
                            defaultMessage={'Country'}
                        />
                    </p>
                </button>
                <button
                    onClick={() => {
                        setWishlistRender(true);

                        handleWishlist();
                    }}
                    className={
                        defaultClasses.toolbar_items +
                        ' ' +
                        (activeClass == 'wishlist' ? defaultClasses.active : '')
                    }
                >
                    <span
                        className={
                            defaultClasses.wishlist_image +
                            ' ' +
                            classes.header_Actions_image
                        }
                        title="Wishlist"
                    >
                        {heartIcon}
                        <span className={headerClasses.wishlist_counter}>
                            {wishlistCount}
                        </span>
                    </span>
                    <p className={defaultClasses.images_label}>
                        <FormattedMessage
                            id={'main.Wishlist'}
                            defaultMessage={'Wishlist'}
                        />
                    </p>
                </button>
                <button
                    onClick={() => {
                        handleProfile();
                    }}
                    className={
                        defaultClasses.toolbar_items +
                        ' ' +
                        (activeClass == 'profile' ? defaultClasses.active : '')
                    }
                >
                    <span
                        className={
                            defaultClasses.user_icon_image +
                            ' ' +
                            classes.header_Actions_image
                        }
                        title="User"
                    >
                        {/* <AccountTrigger /> */}
                        {userIcon}
                    </span>
                    <p className={defaultClasses.images_label}>
                        <FormattedMessage
                            id={'main.Profile'}
                            defaultMessage={'Profile'}
                        />
                    </p>
                </button>
            </div>
        </div>
    );
};

export default MobileLinks;
