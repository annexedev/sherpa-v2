import React from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import defaultClasses from './myAccount.css';
import { Link } from 'src/drivers';
import AccountGreeting from './accountGreeting';

const Sidebar = props => {
    const { onClose } = props;
    let path = '';
    if (typeof props.activePath != 'undefined') {
        path = props.activePath;
    } else if (typeof props.history != 'undefined') {
        path = props.history.location.pathname;
    }

    return (
        <div className={defaultClasses.sideBar_wrapper}>
            <AccountGreeting />
            <ul className={defaultClasses.list}>
                <li
                    className={
                        path == '/account'
                            ? defaultClasses.item + ' ' + defaultClasses.active
                            : defaultClasses.item
                    }
                >
                    {' '}
                    <span className={defaultClasses.dashboard_links_images}>
                        <img
                            src="/cenia-static/images/account.png"
                            alt="account"
                            width="20"
                            height="20"
                        />
                    </span>
                    <Link to="/account" onClick={onClose}>
                        <FormattedMessage
                            id={'sidebar.MyAccount'}
                            defaultMessage={'My Account'}
                        />
                    </Link>
                </li>
                <li
                    className={
                        path == '/orders'
                            ? defaultClasses.item + ' ' + defaultClasses.active
                            : defaultClasses.item
                    }
                >
                    <span className={defaultClasses.dashboard_links_images}>
                        <img
                            src="/cenia-static/images/sent.png"
                            width="20"
                            height="20"
                            alt="sent"
                        />
                    </span>
                    <Link to="/orders" onClick={onClose}>
                        <FormattedMessage
                            id={'sidebar.MyOrders'}
                            defaultMessage={'My Orders'}
                        />
                    </Link>
                </li>
                <li
                    className={
                        path == '/wishlist'
                            ? defaultClasses.item + ' ' + defaultClasses.active
                            : defaultClasses.item
                    }
                >
                    {' '}
                    <span className={defaultClasses.dashboard_links_images}>
                        <img
                            src="/cenia-static/images/wishlist-1.png"
                            alt="wishlist"
                            width="20"
                            height="20"
                        />
                    </span>
                    <Link to="/wishlist" onClick={onClose}>
                        <FormattedMessage
                            id={'sidebar.MyWishlist'}
                            defaultMessage={'My Orders'}
                        />
                    </Link>
                </li>
                <li
                    className={
                        path == '/addresses'
                            ? defaultClasses.item + ' ' + defaultClasses.active
                            : defaultClasses.item
                    }
                >
                    {' '}
                    <span className={defaultClasses.dashboard_links_images}>
                        <img
                            src="/cenia-static/images/home.png"
                            width="20"
                            height="20"
                            alt="home"
                        />
                    </span>
                    <Link to="/addresses" onClick={onClose}>
                        <FormattedMessage
                            id={'sidebar.AddressBook'}
                            defaultMessage={'Address Book'}
                        />
                    </Link>
                </li>
                <li
                    className={
                        path == '/accountinformation'
                            ? defaultClasses.item + ' ' + defaultClasses.active
                            : defaultClasses.item
                    }
                >
                    {' '}
                    <span className={defaultClasses.dashboard_links_images}>
                        <img
                            src="/cenia-static/images/information.png"
                            width="20"
                            height="20"
                            alt="information"
                        />
                    </span>
                    <Link to="/profile" onClick={onClose}>
                        <FormattedMessage
                            id={'sidebar. AccountInformation'}
                            defaultMessage={'Account Information'}
                        />
                    </Link>
                </li>
                <li
                    className={
                        path == '/reviews'
                            ? defaultClasses.item + ' ' + defaultClasses.active
                            : defaultClasses.item
                    }
                >
                    {' '}
                    <span className={defaultClasses.dashboard_links_images}>
                        <img
                            src="/cenia-static/images/like.png"
                            width="20"
                            height="20"
                            alt="like"
                        />
                    </span>
                    <Link to="/reviews" onClick={onClose}>
                        <FormattedMessage
                            id={'sidebar.Reviews'}
                            defaultMessage={'My Reviews & Ratings'}
                        />
                    </Link>
                </li>
                <li
                    className={
                        path == '/newsletter'
                            ? defaultClasses.item + ' ' + defaultClasses.active
                            : defaultClasses.item
                    }
                >
                    <span className={defaultClasses.dashboard_links_images}>
                        <img
                            src="/cenia-static/images/email.png"
                            width="20"
                            height="20"
                            alt="email"
                        />
                    </span>
                    <Link to="/newsletter" onClick={onClose}>
                        <FormattedMessage
                            id={'sidebar.NewsletterSubscriptions'}
                            defaultMessage={'Newsletter Subscriptions'}
                        />
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;

Sidebar.propTypes = {
    classes: shape({
        actions: string,
        root: string,
        subtitle: string,
        title: string,
        user: string
    })
};
